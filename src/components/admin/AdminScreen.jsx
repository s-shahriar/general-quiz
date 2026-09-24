import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TopbarActions from '../shared/TopbarActions.jsx'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Trash2, Check, ArrowLeft, AlertTriangle, Search, ShieldAlert, Loader2,
  ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Wand2, FolderInput, X, CircleAlert, Tag, Plus,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import RichText from '../shared/RichText.jsx'
import { invalidateModule } from '../../data/contentLoader.js'
import {
  CATEGORY_OPTIONS, LETTERS, isOwner,
  extractRawItems, normalizeItem, toInsertRow,
  fetchExistingFavoriteIds, fetchLivemcqRows,
  insertRows, deleteFavoriteIds, setCategoryForFavoriteIds,
  setSubtopicForFavoriteIds, addSubtopic,
} from '../../lib/livemcqAdmin.js'
import { BULK_APPLY_MIN } from '../../lib/livemcqClassify.js'
import { getClassifier, clearKnowledgeCache } from '../../lib/livemcqKnowledge.js'
import { fetchSubtopics, useSubtopicLists, subtopicName } from '../../lib/subtopics.js'

const stripTags = (s) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const catName = (slug) => CATEGORY_OPTIONS.find((c) => c.slug === slug)?.name || slug

export default function AdminScreen() {
  const { configured, user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('import')
  // Panels are hidden, never unmounted: switching to Manage and back used to
  // throw away a loaded file along with every tick and category choice on it.
  // `visited` keeps a panel out of the tree until it is first opened, so
  // Manage still doesn't fetch its 2205 rows unless you actually go there.
  const [visited, setVisited] = useState({ import: true, manage: false })
  // Bumped when Import writes rows, so a mounted-but-hidden Manage refetches
  // instead of showing a list that predates the insert.
  const [dataVersion, setDataVersion] = useState(0)

  const go = (next) => {
    setTab(next)
    setVisited((v) => (v[next] ? v : { ...v, [next]: true }))
  }

  if (loading) return <Shell><p style={muted}>Loading…</p></Shell>
  if (!configured) return <Shell><Gate icon={<ShieldAlert size={28} />} title="Cloud not configured" sub="Supabase env is missing." onBack={() => navigate('/')} /></Shell>
  if (!user) return <Shell><Gate icon={<ShieldAlert size={28} />} title="Sign in required" sub="Sign in with the owner account to manage LiveMCQ content." onBack={() => navigate('/')} /></Shell>
  if (!isOwner(user)) return <Shell><Gate icon={<ShieldAlert size={28} />} title="Not authorized" sub="This area is restricted to the owner account." onBack={() => navigate('/')} /></Shell>

  return (
    <Shell>
      <div style={headerRow}>
        <button style={backBtn} onClick={() => navigate('/')}><ArrowLeft size={16} /> Back</button>
        <h1 style={h1}>LiveMCQ Admin</h1>
        <TopbarActions style={{ marginLeft: 'auto' }} />
      </div>
      <div style={tabsRow}>
        <button style={tabBtn(tab === 'import')} onClick={() => go('import')}>Import &amp; classify</button>
        <button style={tabBtn(tab === 'manage')} onClick={() => go('manage')}>Manage &amp; delete</button>
      </div>
      {visited.import && (
        <div style={{ display: tab === 'import' ? 'block' : 'none' }}>
          <ImportPanel onInserted={() => setDataVersion((v) => v + 1)} />
        </div>
      )}
      {visited.manage && (
        <div style={{ display: tab === 'manage' ? 'block' : 'none' }}>
          <ManagePanel dataVersion={dataVersion} />
        </div>
      )}
    </Shell>
  )
}

// ── Import ─────────────────────────────────────────────────────
// Selection is per-question: tick the ones you want and insert just those.
// Everything else stays in the list so a file can be worked through in
// several passes instead of all-or-nothing.
function ImportPanel({ onInserted }) {
  const [items, setItems] = useState([])       // { norm, slug, picked }
  const [fileName, setFileName] = useState('')
  const [summary, setSummary] = useState(null) // { total, dupInDb, dupInFile, badFid, fresh }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [missing, setMissing] = useState(() => new Set()) // fids flagged by a failed insert
  const [clf, setClf] = useState(null)         // { size, suggest } — local, no AI
  const [bulkSlug, setBulkSlug] = useState('')
  const lists = useSubtopicLists()             // { [categorySlug]: [{ slug, name }] }
  const fileRef = useRef(null)
  const clfRequested = useRef(false)

  // Ask for the classifier only when a file is actually opened — visiting the
  // tab to look around shouldn't cost anything. `getClassifier` decides for
  // itself whether it can answer from memory, from the persisted corpus, or
  // has to load it (see livemcqKnowledge.js). Deliberately not awaited: cards
  // render immediately and the chips appear when the index lands, because
  // `hints` below is derived rather than stored.
  function ensureClassifier() {
    if (clfRequested.current) return
    clfRequested.current = true
    getClassifier()
      .then(setClf)
      .catch(() => { /* suggestions are optional — manual selection still works */ })
  }

  async function onFile(e) {
    setError(''); setResult(null); setSummary(null); setItems([]); setMissing(new Set())
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setBusy(true)
    ensureClassifier()
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const raw = extractRawItems(parsed)
      if (!raw.length) throw new Error('No questions found in the file.')
      const existing = await fetchExistingFavoriteIds()
      const seen = new Set()
      const next = []
      let dupInDb = 0, dupInFile = 0, badFid = 0
      for (const r of raw) {
        const norm = normalizeItem(r)
        if (!norm.favorite_id) { badFid++; continue }
        if (existing.has(norm.favorite_id)) { dupInDb++; continue }
        if (seen.has(norm.favorite_id)) { dupInFile++; continue }
        seen.add(norm.favorite_id)
        next.push({ norm, slug: '', subtopic: '', picked: true })
      }
      setItems(next)
      setSummary({ total: raw.length, dupInDb, dupInFile, badFid, fresh: next.length })
    } catch (err) {
      setError(err.message || String(err))
      setFileName('')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // Suggestions are derived, never stored: whenever the index or the loaded
  // set changes they simply recompute, so a file opened before the index
  // finished loading picks them up on the next render with no extra state.
  const hints = useMemo(() => {
    const m = new Map()
    // The whole item, not just its text: the index scores question, options
    // and explanation together, and `normalizeItem` has already parsed all
    // three out of the import file.
    if (clf) for (const it of items) m.set(it.norm.favorite_id, clf.suggest(it.norm))
    return m
  }, [clf, items])

  // Sub-topic suggestions only exist for a category that has a sub-topic list —
  // the sub-topic index is per category. Before a category is picked we score
  // against the *suggested* one, so the Likely box can offer topic and sub-topic
  // as a single choice instead of making you apply the category and come back.
  const subHints = useMemo(() => {
    const m = new Map()
    if (clf?.suggestSubtopic) for (const it of items) {
      const slug = it.slug || hints.get(it.norm.favorite_id)?.slug
      const list = lists[slug]
      if (slug && list?.length) m.set(it.norm.favorite_id, clf.suggestSubtopic(it.norm, slug, list))
    }
    return m
  }, [clf, items, lists, hints])

  // Only বাংলা ব্যাকরণ, English Grammar and গণিত carry sub-topic lists. The other
  // ten categories have none, so there is nothing to choose and a question in one
  // of them is complete with a category alone — the sub-topic requirement below
  // follows the list, not the category count.
  const needsSub = useCallback((slug) => Boolean(lists[slug]?.length), [lists])
  const isReady = useCallback(
    (it) => Boolean(it.slug) && (!needsSub(it.slug) || Boolean(it.subtopic)),
    [needsSub],
  )

  const picked = useMemo(() => items.filter((it) => it.picked), [items])
  const pickedNoCat = useMemo(() => picked.filter((it) => !it.slug), [picked])
  const pickedNoSub = useMemo(
    () => picked.filter((it) => it.slug && needsSub(it.slug) && !it.subtopic),
    [picked, needsSub],
  )
  const pickedReady = useMemo(() => picked.filter(isReady), [picked, isReady])
  // A mixed selection gets both paths: insert the ready ones now, or insist on
  // all of them and be shown exactly which are still incomplete.
  const canPartial = pickedReady.length > 0 && pickedReady.length < picked.length

  // Flag every incomplete pick — no category, or no sub-topic where the category
  // has a list — and scroll to the first. Same treatment a refused insert gives,
  // reachable without having to trigger the error.
  function jumpToBlank() {
    const incomplete = picked.filter((it) => !isReady(it))
    if (!incomplete.length) return
    setMissing(new Set(incomplete.map((it) => it.norm.favorite_id)))
    const el = document.getElementById('qc-' + incomplete[0].norm.favorite_id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const patch = useCallback((fid, changes) => {
    setItems((prev) => prev.map((it) => (it.norm.favorite_id === fid ? { ...it, ...changes } : it)))
  }, [])

  const clearMissing = useCallback((fid) => setMissing((prev) => {
    if (!prev.has(fid)) return prev
    const next = new Set(prev); next.delete(fid); return next
  }), [])

  // Drop the flag from every card the bulk actions just completed. They can't
  // clear the lot any more: filling a category that has sub-topics leaves the
  // card incomplete, so what stays flagged has to be recomputed.
  const unflagReady = useCallback((next) => {
    const ready = new Set(next.filter(isReady).map((it) => it.norm.favorite_id))
    setMissing((cur) => (cur.size ? new Set([...cur].filter((fid) => !ready.has(fid))) : cur))
  }, [isReady])

  // Sub-topic lists are per category, so a category change drops the sub-topic.
  // That can leave the card incomplete again, so the flag is re-evaluated by
  // `isReady` rather than cleared here on the strength of the category alone.
  const setSlug = useCallback((fid, slug) => {
    patch(fid, { slug, subtopic: '' })
    if (slug && !needsSub(slug)) clearMissing(fid)
  }, [patch, clearMissing, needsSub])

  const setSubtopic = useCallback((fid, subtopic) => {
    patch(fid, { subtopic })
    if (subtopic) clearMissing(fid)
  }, [patch, clearMissing])

  // One suggestion, both fields: `setSlug` would drop the sub-topic that came
  // with it, since changing category always clears the sub-topic.
  const applyHint = useCallback((fid, slug, subtopic = '') => {
    patch(fid, { slug, subtopic })
    if (subtopic || !needsSub(slug)) clearMissing(fid)
  }, [patch, clearMissing, needsSub])

  const togglePick = useCallback((fid) => {
    setItems((prev) => prev.map((it) => (it.norm.favorite_id === fid ? { ...it, picked: !it.picked } : it)))
  }, [])

  function pickAll(on) {
    setItems((prev) => prev.map((it) => ({ ...it, picked: on })))
  }

  // Bulk-apply only touches suggestions confident enough to be right ~98% of
  // the time. Weak ones stay empty and must be accepted card by card. The
  // sub-topic guess rides along when it clears the same bar.
  function applyAllHints() {
    const next = items.map((it) => {
      const h = hints.get(it.norm.favorite_id)
      if (!h || it.slug || h.confidence < BULK_APPLY_MIN) return it
      const sh = subHints.get(it.norm.favorite_id)
      return { ...it, slug: h.slug, subtopic: sh && sh.confidence >= BULK_APPLY_MIN ? sh.slug : '' }
    })
    setItems(next)
    unflagReady(next)
  }

  // Same bar as categories. Only fills questions that already have a category
  // and no sub-topic yet; never overwrites a choice.
  function applyAllSubHints() {
    const next = items.map((it) => {
      const h = subHints.get(it.norm.favorite_id)
      return h && it.slug && !it.subtopic && h.confidence >= BULK_APPLY_MIN ? { ...it, subtopic: h.slug } : it
    })
    setItems(next)
    unflagReady(next)
  }

  function applyBulk(slug) {
    setBulkSlug('')
    if (!slug) return
    const next = items.map((it) => (
      it.picked ? { ...it, slug, subtopic: it.slug === slug ? it.subtopic : '' } : it
    ))
    setItems(next)
    unflagReady(next)
  }

  // Shared by the footer button and each card's own insert button. Refuses to
  // send anything when a target has no category, and points at the offenders.
  async function insertSubset(subset) {
    setError(''); setResult(null)
    if (!subset.length) { setError('Nothing selected — tick at least one question to insert.'); return }

    // A sub-topic is only demanded where the category actually has a list, so
    // the ten list-less categories insert on a category alone.
    const blanks = subset.filter((it) => !it.slug)
    const noSubs = subset.filter((it) => it.slug && needsSub(it.slug) && !it.subtopic)
    const bad = [...blanks, ...noSubs]
    if (bad.length) {
      setMissing(new Set(bad.map((it) => it.norm.favorite_id)))
      if (subset.length === 1) {
        setError(blanks.length
          ? 'Category is required — this question has no category selected.'
          : 'Sub-topic is required — this category has sub-topics, so one must be chosen.')
      } else {
        const parts = []
        if (blanks.length) parts.push(`${blanks.length} with no category`)
        if (noSubs.length) parts.push(`${noSubs.length} with no sub-topic`)
        setError(`Incomplete — ${parts.join(' and ')} of the ${subset.length} selected.`)
      }
      const el = document.getElementById('qc-' + bad[0].norm.favorite_id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setBusy(true)
    try {
      const sent = new Set(subset.map((it) => it.norm.favorite_id))
      // A deliberate "no sub-topic" is stored as a sentinel so it reads as a
      // choice on screen; the row itself gets a plain empty sub-topic.
      const res = await insertRows(subset.map((it) => (
        toInsertRow(it.norm, it.slug, it.subtopic === NO_SUB ? '' : it.subtopic)
      )))
      invalidateModule('livemcq')
      // The corpus just grew, so the cached knowledge is stale by definition.
      // Dropping it here means the next file in this same session is scored
      // against the questions we just classified, not against yesterday's set.
      clearKnowledgeCache()
      clfRequested.current = false
      onInserted?.()
      setResult(res)
      setMissing(new Set())
      // Drop what was just handled; anything skipped was already in the DB.
      const rest = items.filter((it) => !sent.has(it.norm.favorite_id))
      setItems(rest)
      // Only pay for a rebuild if there is still something left to classify;
      // finishing a file shouldn't trigger a fetch on the way out.
      if (rest.length) ensureClassifier()
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  const hintable = items.filter((it) => {
    const h = hints.get(it.norm.favorite_id)
    return !it.slug && h && h.confidence >= BULK_APPLY_MIN
  }).length
  const subHintable = items.filter((it) => {
    const h = subHints.get(it.norm.favorite_id)
    return it.slug && needsSub(it.slug) && !it.subtopic && h && h.confidence >= BULK_APPLY_MIN
  }).length

  return (
    <div>
      <div style={uploadCard}>
        <label style={uploadBtn}>
          <Upload size={16} /> Choose livefav JSON
          <input ref={fileRef} type="file" accept=".json,application/json" onChange={onFile} style={{ display: 'none' }} />
        </label>
        {fileName && <span style={muted}>{fileName}</span>}
        <span style={{ ...muted, marginLeft: 'auto' }}>
          Extract on the phone with <code style={code}>livefav</code> (see LIVEMCQ.md §9)
        </span>
      </div>

      {busy && !items.length && <p style={muted}><Loader2 size={14} style={spin} /> Reading…</p>}
      {error && <p style={errorBox}><CircleAlert size={15} style={{ flexShrink: 0 }} /> {error}</p>}
      {result && (
        <p style={okBox}>
          <Check size={15} /> Inserted {result.inserted} · skipped {result.skipped}
          {result.skipped_fids?.length ? ` (already present: ${result.skipped_fids.join(', ')})` : ''}
        </p>
      )}

      {summary && (
        <p style={muted}>
          {summary.total} in file · <b style={{ color: 'var(--text)' }}>{summary.fresh} new</b>
          {summary.dupInDb ? ` · ${summary.dupInDb} already in DB` : ''}
          {summary.dupInFile ? ` · ${summary.dupInFile} dup in file` : ''}
          {summary.badFid ? ` · ${summary.badFid} missing favorite_id` : ''}
        </p>
      )}

      {items.length > 0 && (
        <div style={toolbar}>
          <div style={toolbarGroup}>
            <button style={linkBtn} onClick={() => pickAll(true)}>Select all</button>
            <span style={toolbarSep}>·</span>
            <button style={linkBtn} onClick={() => pickAll(false)}>Clear</button>
          </div>
          <div style={{ ...toolbarGroup, marginLeft: 'auto', flexWrap: 'wrap' }}>
            {hintable > 0 && (
              <button style={ghostBtn} onClick={applyAllHints} title="Fill every empty category with its suggestion">
                <Wand2 size={14} /> Apply {hintable} suggestion{hintable === 1 ? '' : 's'}
              </button>
            )}
            {subHintable > 0 && (
              <button style={ghostBtn} onClick={applyAllSubHints} title="Fill every empty sub-topic with its suggestion">
                <Tag size={14} /> Apply {subHintable} sub-topic suggestion{subHintable === 1 ? '' : 's'}
              </button>
            )}
            <StyledSelect
              value={bulkSlug}
              onChange={applyBulk}
              empty={!bulkSlug}
              placeholder={picked.length ? `Set category for ${picked.length} selected…` : 'Select questions first…'}
              placeholderDisabled
              disabled={!picked.length}
            />
          </div>
        </div>
      )}

      {items.map((it, i) => {
        const h = hints.get(it.norm.favorite_id)
        const sh = subHints.get(it.norm.favorite_id)
        // Before a category is picked the sub-topic guess belongs to the
        // suggested category, so its name resolves against that list.
        const subOf = it.slug || h?.slug
        return (
          <QuestionCard
            key={it.norm.favorite_id}
            item={it.norm}
            slug={it.slug}
            hint={h}
            subtopic={it.subtopic}
            subList={lists[it.slug]}
            subHint={sh}
            subHintName={sh ? subtopicName(lists[subOf], sh.slug) : ''}
            subRequired={needsSub(it.slug)}
            picked={it.picked}
            flagged={missing.has(it.norm.favorite_id)}
            busy={busy}
            index={i + 1}
            onSlug={(s) => setSlug(it.norm.favorite_id, s)}
            onSubtopic={(s) => setSubtopic(it.norm.favorite_id, s)}
            onApplyHint={(s, sub) => applyHint(it.norm.favorite_id, s, sub)}
            onToggle={() => togglePick(it.norm.favorite_id)}
            onInsertOne={() => insertSubset([it])}
          />
        )
      })}

      {items.length > 0 && (
        <div style={stickyFooter}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              {picked.length} of {items.length} selected
            </div>
            {pickedNoCat.length || pickedNoSub.length ? (
              <button style={footerHint} onClick={jumpToBlank}>
                {[
                  pickedNoCat.length && `${pickedNoCat.length} need a category`,
                  pickedNoSub.length && `${pickedNoSub.length} need a sub-topic`,
                ].filter(Boolean).join(' · ')} — show me
              </button>
            ) : (
              <div style={{ fontSize: '0.76rem', color: 'var(--text-3)' }}>
                {picked.length ? 'all selected are ready' : 'nothing selected'}
              </div>
            )}
          </div>
          <div style={footerActions}>
            {canPartial && (
              <button style={ghostInsertBtn(!busy)} disabled={busy} onClick={() => insertSubset(picked)}>
                Insert all {picked.length}
              </button>
            )}
            <button
              style={insertBtn(picked.length > 0 && !busy)}
              disabled={!picked.length || busy}
              onClick={() => insertSubset(canPartial ? pickedReady : picked)}
            >
              {busy ? <Loader2 size={15} style={spin} /> : <Check size={15} />}
              {canPartial ? ` Insert ${pickedReady.length} ready` : ` Insert ${picked.length}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function QuestionCard({
  item, slug, hint, subtopic, subList, subHint, subHintName, subRequired,
  picked, flagged, busy, index,
  onSlug, onSubtopic, onApplyHint, onToggle, onInsertOne,
}) {
  const [showExp, setShowExp] = useState(false)
  const hintTaken = hint && slug === hint.slug
  // The sub-topic that rides along with the category suggestion — only while no
  // category is picked, since after that the sub-topic gets its own box below.
  const pairedSub = !slug && subHint ? subHint : null
  return (
    <div id={'qc-' + item.favorite_id} style={qCard(picked, flagged)}>
      <div style={qTop}>
        <button
          style={checkbox(picked)}
          onClick={onToggle}
          role="checkbox"
          aria-checked={picked}
          aria-label={picked ? 'Deselect this question' : 'Select this question'}
        >
          {picked && <Check size={12} strokeWidth={3} />}
        </button>
        <span style={qIndex}>#{index}</span>
        <span style={fidTag}>fav {item.favorite_id}</span>
        {!item.hasKey && <span style={warnTag}><AlertTriangle size={12} /> no correct answer → null</span>}
        {item.gapWarning && <span style={dangerTag}><AlertTriangle size={12} /> empty option before a filled one</span>}
        {item.answerOutOfRange && <span style={dangerTag}><AlertTriangle size={12} /> answer index out of range</span>}
      </div>

      <RichText html={item.question} as="div" className="admin-q" />

      <div style={{ margin: '8px 0' }}>
        {item.options.map((o, i) => {
          const correct = item.hasKey && i === item.answer - 1
          return (
            <div key={i} style={optRow(correct)}>
              <span style={optLetter(correct)}>{LETTERS[i]}</span>
              <RichText html={o} as="span" />
              {correct && <Check size={13} style={{ color: 'var(--ok)', marginLeft: 'auto', flexShrink: 0 }} />}
            </div>
          )
        })}
      </div>

      {item.explanation && (
        <div>
          <button style={expToggle} onClick={() => setShowExp((s) => !s)}>
            ব্যাখ্যা {showExp ? '▴' : '▾'}
          </button>
          {showExp && <RichText html={item.explanation} as="div" className="admin-exp" />}
        </div>
      )}

      {/* One box, both fields: the sub-topic guess is scored against the
          suggested category, so Apply can settle topic and sub-topic together. */}
      {hint && !hintTaken && (
        <Suggestion
          hint={hint}
          subSlug={pairedSub ? pairedSub.slug : ''}
          subName={subHintName}
          subWeak={!!pairedSub && pairedSub.confidence < BULK_APPLY_MIN}
          onApply={() => onApplyHint(hint.slug, pairedSub ? pairedSub.slug : '')}
        />
      )}

      <div style={cardActions}>
        <StyledSelect
          value={slug}
          onChange={onSlug}
          empty={!slug}
          invalid={flagged}
          fullWidth
          placeholder="Select category…"
          placeholderDisabled
        />
        <button
          style={cardInsertBtn(!busy)}
          disabled={busy}
          onClick={onInsertOne}
          title="Insert only this question"
        >
          <Check size={14} /> Insert
        </button>
      </div>
      {flagged && (
        <p style={cardError}>
          <CircleAlert size={13} style={{ flexShrink: 0 }} />
          {slug ? 'Sub-topic is required.' : 'Category is required.'}
        </p>
      )}

      {/* Appears once a category is picked. Required for the three categories
          that have sub-topic lists; the rest only offer the add link. */}
      {slug && subHint && subtopic !== subHint.slug && (
        <Suggestion
          hint={subHint}
          label="Sub-topic"
          nameOf={(s) => subtopicName(subList, s)}
          onApply={() => onSubtopic(subHint.slug)}
        />
      )}
      {slug && (
        <div style={subRow}>
          <SubtopicPicker
            categorySlug={slug}
            list={subList}
            value={subtopic}
            onChange={onSubtopic}
            required={subRequired}
            invalid={flagged && subRequired && !subtopic}
          />
        </div>
      )}
    </div>
  )
}

// A suggestion from the local tf-idf/kNN index — never auto-applied, and it
// shows the neighbouring question it matched so the guess can be judged
// rather than trusted. Weak suggestions say so.
const TIER_LABEL = { strong: 'Likely', likely: 'Probably', weak: 'Maybe' }
const TIER_COLOR = { strong: 'var(--ok)', likely: 'var(--accent)', weak: 'var(--warn)' }

function Suggestion({ hint, onApply, label, nameOf = catName, subSlug, subName, subWeak }) {
  const pct = Math.round(hint.confidence * 100)
  const color = TIER_COLOR[hint.tier]
  return (
    <div style={hintBox}>
      {label ? <Tag size={13} style={{ color, flexShrink: 0, marginTop: 2 }} /> : <Wand2 size={13} style={{ color, flexShrink: 0, marginTop: 2 }} />}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
          {label && <span style={hintLabel}>{label} · </span>}
          {TIER_LABEL[hint.tier]} <b style={{ color: 'var(--text)' }}>{nameOf(hint.slug)}</b>
          {subSlug && <><span style={subArrow}>›</span><b style={{ color: 'var(--text)' }}>{subName}</b></>}
          <span style={{ color: 'var(--text-3)' }}> · {pct}% agreement</span>
          {hint.tier === 'weak' && <span style={weakTag}>low confidence</span>}
          {/* The percentage above is the category's. Say so when the sub-topic
              that rides along is the shakier half of the pair. */}
          {subSlug && subWeak && <span style={weakTag}>sub-topic uncertain</span>}
        </div>
        <div style={hintNearest} title={stripTags(hint.nearest.question)}>
          closest stored question: “{stripTags(hint.nearest.question).slice(0, 90)}”
        </div>
        {hint.nearest.source !== 'livemcq' && (
          <div style={hintSource}>matched against the {hint.nearest.source} module, not LiveMCQ</div>
        )}
      </div>
      <button style={applyHintBtn(color)} onClick={onApply}>Apply</button>
    </div>
  )
}

// A native <select> restyled to look designed: no browser chrome, a custom
// chevron, theme-aware control + option colors. Keeps native a11y/keyboard.
// `options` defaults to the 13 categories; sub-topic pickers pass their own.
// `optional` drops the amber "needs a value" edge for fields that may stay empty.
function StyledSelect({
  value, onChange, empty, fullWidth, style, placeholder, placeholderDisabled, includeAllLabel,
  invalid, disabled, options = CATEGORY_OPTIONS, optional,
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: fullWidth ? '100%' : 'auto', ...style }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        style={selectControl(empty, fullWidth, invalid, disabled, optional)}
      >
        {placeholder != null && (
          <option value="" disabled={!!placeholderDisabled} style={optionStyle}>{placeholder}</option>
        )}
        {includeAllLabel != null && <option value="" style={optionStyle}>{includeAllLabel}</option>}
        {options.map((c) => (
          <option key={c.slug} value={c.slug} style={optionStyle}>{c.name}</option>
        ))}
      </select>
      <ChevronDown size={15} style={selectChevron} />
    </div>
  )
}

// ── Sub-topic picker ───────────────────────────────────────────
// Sub-topic for one question. Lists are per category and live in the DB, so
// "+ নতুন sub-topic…" creates one in place (owner-gated RPC), refreshes every
// mounted list and selects it. A category with no list yet shows just an add
// link, so a first sub-topic can be started from any category.
//
// `required` (Import) makes the choice deliberate rather than optional — which
// is why "কোনো sub-topic নয়" is a listed option and not just an empty select:
// a blank must mean "not answered yet", never "decided against one".
const NEW_SUB = '__new__'
const NO_SUB = '__none__'

function SubtopicPicker({ categorySlug, list, value, onChange, required, invalid }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const options = list || []

  async function create() {
    const nm = name.trim()
    if (!nm || busy) return
    setBusy(true); setErr('')
    try {
      const res = await addSubtopic(categorySlug, nm)
      await fetchSubtopics({ force: true })
      onChange(res.slug)
      setAdding(false); setName('')
    } catch (e) {
      setErr(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  if (adding) {
    return (
      <div style={{ width: '100%' }}>
        <div style={addRow}>
          <input
            autoFocus
            value={name}
            disabled={busy}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') create()
              if (e.key === 'Escape') { setAdding(false); setErr('') }
            }}
            placeholder={`নতুন sub-topic — ${catName(categorySlug)}`}
            style={addInput}
          />
          <button style={ghostBtn} onClick={create} disabled={busy || !name.trim()}>
            {busy ? <Loader2 size={14} style={spin} /> : <Plus size={14} />} Add
          </button>
          <button style={ghostBtn} onClick={() => { setAdding(false); setErr('') }} disabled={busy} aria-label="Cancel">
            <X size={14} />
          </button>
        </div>
        {err && <p style={cardError}><CircleAlert size={13} style={{ flexShrink: 0 }} /> {err}</p>}
      </div>
    )
  }

  // A real control on its own row rather than a bare text link: as an unstyled
  // inline button the icon and its label broke onto separate lines and ran past
  // the card edge.
  if (!options.length) {
    return (
      <button style={addSubBtn} onClick={() => setAdding(true)}>
        <Plus size={13} style={{ flexShrink: 0 }} /> sub-topic যোগ করুন
      </button>
    )
  }

  return (
    <StyledSelect
      value={value || ''}
      onChange={(v) => (v === NEW_SUB ? setAdding(true) : onChange(v))}
      empty={!value}
      optional={!required}
      invalid={invalid}
      fullWidth
      options={[...options, { slug: NO_SUB, name: 'কোনো sub-topic নয়' }, { slug: NEW_SUB, name: '+ নতুন sub-topic…' }]}
      placeholder={required ? 'Sub-topic বেছে নিন…' : 'Sub-topic (ঐচ্ছিক)…'}
      placeholderDisabled={required}
    />
  )
}

// Sub-topic change from Manage. Same explicit-modal reasoning as categories.
function SubtopicModal({ row, list, busy, onCancel, onConfirm }) {
  const [sub, setSub] = useState(row.subtopic || '')
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  // The picker's explicit "no sub-topic" is a UI sentinel; here it just means
  // empty, so it never reaches the RPC as a literal value.
  const chosen = sub === NO_SUB ? '' : sub
  const changed = (chosen || null) !== (row.subtopic || null)
  return (
    <div style={overlay} onClick={busy ? undefined : onCancel}>
      <div style={modalCard} role="dialog" aria-modal="true" aria-labelledby="sub-title" onClick={(e) => e.stopPropagation()}>
        <div style={modalIconInfo}><Tag size={20} /></div>
        <h3 id="sub-title" style={modalTitle}>Sub-topic</h3>
        <div style={modalMeta}>
          <span style={catChip}>{row.catName}</span>
          <span style={fidTag}>fav {row.favorite_id}</span>
        </div>
        <div style={modalSnippet}>{stripTags(row.question).slice(0, 160) || <em style={muted}>(image-only)</em>}</div>
        <div style={{ marginTop: 14 }}>
          <SubtopicPicker categorySlug={row.slug} list={list} value={sub} onChange={setSub} />
        </div>
        <p style={modalWarn}>
          Only the sub-topic changes (leave it empty to remove it). The question, answer,
          category and Nailed / Important flags are untouched.
        </p>
        <div style={modalActions}>
          <button style={modalCancelBtn} onClick={onCancel} disabled={busy}>Cancel</button>
          <button style={modalMoveBtn(changed && !busy)} onClick={() => onConfirm(chosen)} disabled={!changed || busy}>
            {busy ? <Loader2 size={15} style={spin} /> : <Check size={15} />} Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Manage / delete ────────────────────────────────────────────
const PAGE_SIZE = 50

function ManagePanel({ dataVersion }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [deleting, setDeleting] = useState('')
  const [page, setPage] = useState(0)
  const [confirm, setConfirm] = useState(null)   // row pending delete-confirmation
  const [moving, setMoving] = useState(null)     // row pending category change
  const [moveBusy, setMoveBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [subFilter, setSubFilter] = useState('')  // '' all · NO_SUB · a sub-topic slug
  const [subMoving, setSubMoving] = useState(null)
  const [subBusy, setSubBusy] = useState(false)
  const lists = useSubtopicLists()

  // Refetches when Import inserts rows. Existing rows stay on screen while the
  // new set loads, so a refresh doesn't blank the list.
  useEffect(() => {
    let cancelled = false
    fetchLivemcqRows()
      .then((r) => { if (!cancelled) setRows(r) })
      .catch((e) => { if (!cancelled) setError(e.message || String(e)) })
    return () => { cancelled = true }
  }, [dataVersion])

  const filtered = useMemo(() => {
    if (!rows) return []
    const needle = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (cat && r.slug !== cat) return false
      if (cat && subFilter && (subFilter === NO_SUB ? r.subtopic : r.subtopic !== subFilter)) return false
      if (!needle) return true
      return (r.favorite_id && r.favorite_id.includes(needle)) ||
        stripTags(r.question).toLowerCase().includes(needle)
    })
  }, [rows, q, cat, subFilter])

  // Any change to the query/filter jumps back to the first page (reset in the
  // handlers rather than an effect to avoid a cascading render).
  const setQuery = (v) => { setQ(v); setPage(0) }
  const setCategory = (v) => { setCat(v); setSubFilter(''); setPage(0) }
  const setSub = (v) => { setSubFilter(v); setPage(0) }

  async function doDelete() {
    const row = confirm
    if (!row?.favorite_id) return
    setDeleting(row.favorite_id)
    try {
      await deleteFavoriteIds([row.favorite_id])
      invalidateModule('livemcq')
      clearKnowledgeCache()
      setRows((prev) => prev.filter((r) => r.id !== row.id))
      setConfirm(null)
    } catch (e) {
      setError(e.message || String(e))
      setConfirm(null)
    } finally {
      setDeleting('')
    }
  }

  // Category change only — the RPC writes questions.category_id and renumbers
  // the two affected categories. No other question column is touched.
  async function doMove(slug) {
    const row = moving
    if (!row?.favorite_id || !slug || slug === row.slug) { setMoving(null); return }
    setMoveBusy(true); setError('')
    try {
      await setCategoryForFavoriteIds([row.favorite_id], slug)
      invalidateModule('livemcq')
      // A recategorise changes a training label, so the cached corpus is stale
      // even though its size didn't change.
      clearKnowledgeCache()
      setRows((prev) => prev.map((r) => (
        // The RPC also clears the sub-topic: lists are per category.
        r.id === row.id ? { ...r, slug, catName: catName(slug), subtopic: null } : r
      )))
      setNotice(`Moved fav ${row.favorite_id} → ${catName(slug)}`)
      setMoving(null)
    } catch (e) {
      setError(e.message || String(e))
      setMoving(null)
    } finally {
      setMoveBusy(false)
    }
  }

  // Sub-topic only — the RPC writes extra.subtopic and nothing else.
  async function doSetSubtopic(sub) {
    const row = subMoving
    if (!row?.favorite_id || (sub || null) === (row.subtopic || null)) { setSubMoving(null); return }
    setSubBusy(true); setError('')
    try {
      await setSubtopicForFavoriteIds([row.favorite_id], sub)
      invalidateModule('livemcq')
      // A sub-topic is a training label for the sub-topic suggester.
      clearKnowledgeCache()
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, subtopic: sub || null } : r)))
      setNotice(sub
        ? `fav ${row.favorite_id} → ${subtopicName(lists[row.slug], sub)}`
        : `fav ${row.favorite_id}: sub-topic removed`)
      setSubMoving(null)
    } catch (e) {
      setError(e.message || String(e))
      setSubMoving(null)
    } finally {
      setSubBusy(false)
    }
  }

  if (error) return <p style={errorBox}>{error}</p>
  if (!rows) return <p style={muted}><Loader2 size={14} style={spin} /> Loading rows…</p>

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, pageCount - 1)   // clamp (e.g. after deletes shrink the set)
  const start = curPage * PAGE_SIZE
  const shown = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <div style={searchRow}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-3)' }} />
          <input value={q} onChange={(e) => setQuery(e.target.value)} placeholder="Search text or favorite_id…" style={searchInput} />
        </div>
        <StyledSelect value={cat} onChange={setCategory} empty={false} includeAllLabel="All categories" />
        {cat && lists[cat]?.length > 0 && (
          <StyledSelect
            value={subFilter}
            onChange={setSub}
            empty={false}
            includeAllLabel="All sub-topics"
            options={[...lists[cat], { slug: NO_SUB, name: 'No sub-topic' }]}
          />
        )}
      </div>
      {notice && (
        <p style={okBox}>
          <Check size={15} /> {notice}
          <button style={noticeClose} onClick={() => setNotice('')} aria-label="Dismiss"><X size={13} /></button>
        </p>
      )}
      <p style={muted}>
        {filtered.length
          ? <>Showing <b style={{ color: 'var(--text-2)' }}>{start + 1}–{start + shown.length}</b> of {filtered.length}{filtered.length !== rows.length ? ` (filtered from ${rows.length})` : ''}</>
          : <>No matches of {rows.length}</>}
      </p>
      {shown.map((r) => (
        <div key={r.id} style={mRow}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={mMeta}>
              <button
                style={catChipBtn}
                disabled={!r.favorite_id}
                onClick={() => setMoving(r)}
                title="Change category"
              >
                {r.catName} <ChevronDown size={11} style={{ opacity: 0.7 }} />
              </button>
              {(r.subtopic || lists[r.slug]?.length > 0) && (
                <button
                  style={subChipBtn(!!r.subtopic)}
                  disabled={!r.favorite_id}
                  onClick={() => setSubMoving(r)}
                  title="Change sub-topic"
                >
                  <Tag size={10} /> {r.subtopic ? subtopicName(lists[r.slug], r.subtopic) : 'no sub-topic'}
                </button>
              )}
              <span style={fidTag}>fav {r.favorite_id ?? '—'}</span>
              {r.correct_answer == null && <span style={warnTag}>no key</span>}
              {r.deleted && <span style={dangerTag}>recycle-binned</span>}
            </div>
            <div style={mSnippet}>{stripTags(r.question).slice(0, 160) || <em style={muted}>(image-only)</em>}</div>
            {r.correct_answer && (
              <div style={mAnswer}>
                <span style={ansLetter}>{r.correct_answer}</span>
                <span style={ansText}>
                  {stripTags(r.correct_answer_text).slice(0, 120) || <em style={muted}>(no answer text)</em>}
                </span>
              </div>
            )}
          </div>
          <button style={moveBtn} disabled={!r.favorite_id} onClick={() => setMoving(r)} aria-label="Change category">
            <FolderInput size={14} />
          </button>
          <button style={delBtn} disabled={!r.favorite_id} onClick={() => setConfirm(r)} aria-label="Delete question">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <Pagination page={curPage} pageCount={pageCount} onPage={setPage} />
      {confirm && (
        <ConfirmDeleteModal
          row={confirm}
          busy={deleting === confirm.favorite_id}
          onCancel={() => setConfirm(null)}
          onConfirm={doDelete}
        />
      )}
      {subMoving && (
        <SubtopicModal
          row={subMoving}
          list={lists[subMoving.slug]}
          busy={subBusy}
          onCancel={() => setSubMoving(null)}
          onConfirm={doSetSubtopic}
        />
      )}
      {moving && (
        <MoveCategoryModal
          row={moving}
          busy={moveBusy}
          onCancel={() => setMoving(null)}
          onConfirm={doMove}
        />
      )}
    </div>
  )
}

// Category change. Explicit modal rather than an inline <select> on every row:
// a stray scroll over a listed dropdown must not silently rewrite a category.
function MoveCategoryModal({ row, busy, onCancel, onConfirm }) {
  const [slug, setSlug] = useState(row.slug || '')
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  const changed = slug && slug !== row.slug
  return (
    <div style={overlay} onClick={busy ? undefined : onCancel}>
      <div style={modalCard} role="dialog" aria-modal="true" aria-labelledby="mv-title" onClick={(e) => e.stopPropagation()}>
        <div style={modalIconInfo}><FolderInput size={20} /></div>
        <h3 id="mv-title" style={modalTitle}>Change category</h3>
        <div style={modalMeta}>
          <span style={catChip}>{row.catName}</span>
          <span style={fidTag}>fav {row.favorite_id}</span>
        </div>
        <div style={modalSnippet}>{stripTags(row.question).slice(0, 160) || <em style={muted}>(image-only)</em>}</div>
        <StyledSelect
          value={slug}
          onChange={setSlug}
          empty={!slug}
          fullWidth
          style={{ marginTop: 14 }}
          placeholder="Select category…"
          placeholderDisabled
        />
        <p style={modalWarn}>
          Only the category changes. The question, options, answer, explanation and
          favorite_id are untouched, and Nailed / Important flags follow the question.
          Its sub-topic is cleared, since sub-topic lists belong to a category.
        </p>
        <div style={modalActions}>
          <button style={modalCancelBtn} onClick={onCancel} disabled={busy}>Cancel</button>
          <button style={modalMoveBtn(changed && !busy)} onClick={() => onConfirm(slug)} disabled={!changed || busy}>
            {busy ? <Loader2 size={15} style={spin} /> : <FolderInput size={15} />} Move
          </button>
        </div>
      </div>
    </div>
  )
}

// In-app delete confirmation (replaces window.confirm). Backdrop click / Esc
// cancel; the primary action is destructive and shows progress while deleting.
function ConfirmDeleteModal({ row, busy, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  const snippet = stripTags(row.question).slice(0, 160)
  return (
    <div style={overlay} onClick={busy ? undefined : onCancel}>
      <div style={modalCard} role="dialog" aria-modal="true" aria-labelledby="del-title" onClick={(e) => e.stopPropagation()}>
        <div style={modalIcon}><AlertTriangle size={20} /></div>
        <h3 id="del-title" style={modalTitle}>Delete this question?</h3>
        <div style={modalMeta}>
          {row.catName && <span style={catChip}>{row.catName}</span>}
          <span style={fidTag}>fav {row.favorite_id}</span>
        </div>
        <div style={modalSnippet}>{snippet || <em style={muted}>(image-only)</em>}</div>
        <p style={modalWarn}>This permanently removes it from the database. This cannot be undone.</p>
        <div style={modalActions}>
          <button style={modalCancelBtn} onClick={onCancel} disabled={busy}>Cancel</button>
          <button style={modalDeleteBtn} onClick={onConfirm} disabled={busy}>
            {busy ? <Loader2 size={15} style={spin} /> : <Trash2 size={15} />} Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Windowed numeric pager: « ‹ 1 … 7 [8] 9 … 45 › »
function Pagination({ page, pageCount, onPage }) {
  if (pageCount <= 1) return null
  const go = (p) => onPage(Math.max(0, Math.min(pageCount - 1, p)))

  // page indices to render, with -1 marking an ellipsis gap
  const around = 1
  const set = new Set([0, pageCount - 1])
  for (let p = page - around; p <= page + around; p++) if (p >= 0 && p < pageCount) set.add(p)
  const nums = [...set].sort((a, b) => a - b)
  const items = []
  let prev = -1
  for (const n of nums) {
    if (n - prev > 1) items.push('gap-' + n)
    items.push(n)
    prev = n
  }

  return (
    <div style={pagerRow}>
      <button style={pagerBtn(page > 0)} disabled={page === 0} onClick={() => go(0)} aria-label="First page"><ChevronsLeft size={15} /></button>
      <button style={pagerBtn(page > 0)} disabled={page === 0} onClick={() => go(page - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
      {items.map((it) =>
        typeof it === 'number'
          ? <button key={it} style={pagerNum(it === page)} onClick={() => go(it)} aria-current={it === page ? 'page' : undefined}>{it + 1}</button>
          : <span key={it} style={pagerGap}>…</span>
      )}
      <button style={pagerBtn(page < pageCount - 1)} disabled={page === pageCount - 1} onClick={() => go(page + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
      <button style={pagerBtn(page < pageCount - 1)} disabled={page === pageCount - 1} onClick={() => go(pageCount - 1)} aria-label="Last page"><ChevronsRight size={15} /></button>
    </div>
  )
}

// ── shell + gate ───────────────────────────────────────────────
function Shell({ children }) {
  return <div style={wrap}>{children}</div>
}
function Gate({ icon, title, sub, onBack }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-3)' }}>
      <div style={{ color: 'var(--warn)', marginBottom: 10 }}>{icon}</div>
      <h2 style={{ margin: '0 0 6px', color: 'var(--text)', fontSize: '1.05rem' }}>{title}</h2>
      <p style={{ margin: '0 0 16px', fontSize: '0.85rem' }}>{sub}</p>
      <button style={backBtn} onClick={onBack}><ArrowLeft size={16} /> Back to app</button>
    </div>
  )
}

// ── styles (CSS vars → theme-aware, matches the rest of the app) ─
const wrap = { maxWidth: 760, margin: '0 auto', padding: '18px 14px 120px' }
const headerRow = { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }
const h1 = { fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', margin: 0 }
const tabsRow = { display: 'flex', gap: 8, marginBottom: 16 }
const tabBtn = (active) => ({
  padding: '8px 14px', borderRadius: 9, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
  border: '1px solid var(--border)',
  background: active ? 'var(--accent-2)' : 'transparent',
  color: active ? 'var(--on-accent)' : 'var(--text-2)',
})
const backBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }
const muted = { fontSize: '0.82rem', color: 'var(--text-3)' }
const code = { background: 'var(--card2)', padding: '1px 5px', borderRadius: 5, fontSize: '0.78rem' }
const uploadCard = { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: 12, borderRadius: 11, border: '1px dashed var(--border)', background: 'var(--card2)', marginBottom: 14 }
const uploadBtn = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }
// Selected cards carry an accent edge; a card flagged by a failed insert turns
// red so the offender is findable without reading every card.
const qCard = (picked, flagged) => ({
  border: `1px solid ${flagged ? 'var(--bad)' : picked ? 'var(--accent)' : 'var(--border)'}`,
  boxShadow: picked && !flagged ? '0 0 0 1px var(--accent)' : 'none',
  borderRadius: 12, padding: 14, marginBottom: 12,
  background: 'var(--card)', opacity: picked ? 1 : 0.72,
})
const qTop = { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }
const checkbox = (on) => ({
  width: 19, height: 19, flexShrink: 0, padding: 0, borderRadius: 5, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
  background: on ? 'var(--accent-2)' : 'transparent', color: 'var(--on-accent)',
})
const toolbar = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 12px', borderRadius: 11, border: '1px solid var(--border)', background: 'var(--card2)', marginBottom: 12 }
const toolbarGroup = { display: 'flex', alignItems: 'center', gap: 8 }
const toolbarSep = { color: 'var(--text-3)', fontSize: '0.8rem' }
const linkBtn = { background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }
const ghostBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }
const cardActions = { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }
const cardInsertBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '9px 13px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card2)', color: 'var(--text-2)', fontSize: '0.8rem', fontWeight: 600, cursor: on ? 'pointer' : 'not-allowed', opacity: on ? 1 : 0.5 })
const cardError = { display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--bad)' }
const hintBox = { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', borderRadius: 9, border: '1px dashed var(--border)', background: 'var(--card2)', marginTop: 8 }
const hintNearest = { fontSize: '0.74rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }
// A match can land on a relabelled row from another module (see
// livemcqTraining.js). Say so — a neighbour from a different syllabus is
// weaker evidence than a real LiveMCQ one, and only the reader can judge that.
const hintSource = { fontSize: '0.7rem', color: 'var(--text-3)', fontStyle: 'italic', marginTop: 1 }
const applyHintBtn = (color) => ({ flexShrink: 0, alignSelf: 'center', padding: '6px 11px', borderRadius: 8, border: 'none', background: color, color: 'var(--on-solid)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' })
const weakTag = { marginLeft: 6, fontSize: '0.68rem', fontWeight: 600, color: 'var(--warn)', background: 'color-mix(in srgb, var(--warn) 16%, transparent)', padding: '1px 6px', borderRadius: 20 }
const qIndex = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-3)' }
const fidTag = { fontSize: '0.72rem', color: 'var(--text-3)', background: 'var(--card2)', padding: '2px 7px', borderRadius: 20 }
const warnTag = { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--warn)', background: 'color-mix(in srgb, var(--warn) 14%, transparent)', padding: '2px 7px', borderRadius: 20 }
const dangerTag = { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--bad)', background: 'color-mix(in srgb, var(--bad) 14%, transparent)', padding: '2px 7px', borderRadius: 20 }
const optRow = (correct) => ({ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 9px', borderRadius: 8, marginBottom: 4, background: correct ? 'color-mix(in srgb, var(--ok) 10%, transparent)' : 'var(--card2)', fontSize: '0.88rem', color: 'var(--text)' })
const optLetter = (correct) => ({ width: 20, height: 20, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, background: correct ? 'var(--ok)' : 'var(--border)', color: correct ? 'var(--on-solid)' : 'var(--text-2)' })
const expToggle = { background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', padding: '2px 0', marginBottom: 4 }
const selectControl = (empty, fullWidth, invalid, disabled, optional) => ({
  width: fullWidth ? '100%' : 'auto', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  padding: '9px 34px 9px 12px', borderRadius: 9,
  border: `1px solid ${invalid ? 'var(--bad)' : empty && !optional ? 'color-mix(in srgb, var(--warn) 60%, transparent)' : 'var(--border)'}`,
  background: invalid ? 'color-mix(in srgb, var(--bad) 8%, transparent)' : 'var(--card2)',
  color: empty ? 'var(--text-3)' : 'var(--text)',
  fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2,
  cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, outline: 'none',
})
const selectChevron = { position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }
const optionStyle = { background: 'var(--card)', color: 'var(--text)' }
const pagerRow = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginTop: 16 }
const pagerBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: on ? 'var(--text-2)' : 'var(--text-3)', cursor: on ? 'pointer' : 'not-allowed', opacity: on ? 1 : 0.45 })
const pagerNum = (active) => ({ minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8, border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent-2)' : 'transparent', color: active ? 'var(--on-accent)' : 'var(--text-2)', fontSize: '0.82rem', fontWeight: active ? 700 : 500, cursor: 'pointer' })
const pagerGap = { color: 'var(--text-3)', padding: '0 2px', userSelect: 'none' }
const overlay = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }
const modalCard = { width: '100%', maxWidth: 420, boxSizing: 'border-box', padding: 20, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }
const modalIcon = { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bad)', background: 'color-mix(in srgb, var(--bad) 14%, transparent)', marginBottom: 12 }
const modalTitle = { margin: '0 0 10px', fontSize: '1.02rem', fontWeight: 700, color: 'var(--text)' }
const modalMeta = { display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 8 }
const modalSnippet = { fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.4, padding: '8px 10px', borderRadius: 8, background: 'var(--card2)', border: '1px solid var(--border)', maxHeight: 96, overflow: 'auto' }
const modalWarn = { margin: '12px 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }
const modalActions = { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }
const modalCancelBtn = { padding: '9px 16px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }
const modalDeleteBtn = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: 'none', background: 'var(--bad)', color: 'var(--on-solid)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }
const stickyFooter = { position: 'sticky', bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 -6px 20px rgba(0,0,0,0.12)', marginTop: 6 }
const insertBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 9, border: 'none', background: on ? 'var(--ok)' : 'var(--border)', color: on ? 'var(--on-solid)' : 'var(--text-3)', fontSize: '0.88rem', fontWeight: 700, cursor: on ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' })
const footerActions = { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }
const ghostInsertBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.83rem', fontWeight: 600, cursor: on ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' })
const footerHint = { display: 'block', padding: 0, marginTop: 1, background: 'none', border: 'none', color: 'var(--warn)', fontSize: '0.76rem', fontWeight: 600, textAlign: 'left', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }
const errorBox = { display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.83rem', color: 'var(--bad)', background: 'color-mix(in srgb, var(--bad) 10%, transparent)', padding: '9px 12px', borderRadius: 9 }
const okBox = { display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--ok)', background: 'color-mix(in srgb, var(--ok) 10%, transparent)', padding: '9px 12px', borderRadius: 9 }
const searchRow = { display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }
const searchInput = { width: '100%', padding: '9px 11px 9px 32px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card2)', color: 'var(--text)', fontSize: '0.85rem' }
const mRow = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', marginBottom: 8 }
const mMeta = { display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }
const catChip = { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-2)', background: 'var(--card2)', padding: '2px 8px', borderRadius: 20 }
const catChipBtn = { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-2)', background: 'var(--card2)', padding: '3px 8px', borderRadius: 20, border: '1px solid var(--border)', cursor: 'pointer' }
const mSnippet = { fontSize: '0.84rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const mAnswer = { display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, minWidth: 0 }
const ansLetter = { width: 17, height: 17, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.64rem', fontWeight: 700, background: 'var(--ok)', color: 'var(--on-accent)' }
const ansText = { fontSize: '0.79rem', color: 'var(--ok)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const delBtn = { flexShrink: 0, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--bad)', cursor: 'pointer' }
const moveBtn = { flexShrink: 0, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer' }
const modalIconInfo = { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 14%, transparent)', marginBottom: 12 }
const modalMoveBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: 'none', background: on ? 'var(--accent-2)' : 'var(--border)', color: on ? 'var(--on-accent)' : 'var(--text-3)', fontSize: '0.85rem', fontWeight: 700, cursor: on ? 'pointer' : 'not-allowed' })
const noticeClose = { marginLeft: 'auto', display: 'inline-flex', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 2 }
const spin = { animation: 'spin 1s linear infinite' }
const subRow = { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }
const addSubBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', cursor: 'pointer' }
const subArrow = { color: 'var(--text-3)', margin: '0 5px' }
const addRow = { display: 'flex', alignItems: 'center', gap: 6, width: '100%' }
const addInput = { flex: 1, minWidth: 0, padding: '8px 11px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card2)', color: 'var(--text)', fontSize: '0.85rem' }
const hintLabel = { fontWeight: 700, color: 'var(--text-3)' }
const subChipBtn = (set) => ({
  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 20, cursor: 'pointer',
  border: `1px ${set ? 'solid' : 'dashed'} var(--border)`,
  background: set ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
  color: set ? 'var(--accent)' : 'var(--text-3)',
})
