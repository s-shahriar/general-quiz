import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Trash2, Check, ArrowLeft, AlertTriangle, Search, ShieldAlert, Loader2,
  ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import RichText from '../shared/RichText.jsx'
import { invalidateModule } from '../../data/contentLoader.js'
import {
  CATEGORY_OPTIONS, LETTERS, isOwner,
  extractRawItems, normalizeItem, toInsertRow,
  fetchExistingFavoriteIds, fetchLivemcqRows, insertRows, deleteFavoriteIds,
} from '../../lib/livemcqAdmin.js'

const stripTags = (s) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export default function AdminScreen() {
  const { configured, user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('import')

  if (loading) return <Shell><p style={muted}>Loading…</p></Shell>
  if (!configured) return <Shell><Gate icon={<ShieldAlert size={28} />} title="Cloud not configured" sub="Supabase env is missing." onBack={() => navigate('/')} /></Shell>
  if (!user) return <Shell><Gate icon={<ShieldAlert size={28} />} title="Sign in required" sub="Sign in with the owner account to manage LiveMCQ content." onBack={() => navigate('/')} /></Shell>
  if (!isOwner(user)) return <Shell><Gate icon={<ShieldAlert size={28} />} title="Not authorized" sub="This area is restricted to the owner account." onBack={() => navigate('/')} /></Shell>

  return (
    <Shell>
      <div style={headerRow}>
        <button style={backBtn} onClick={() => navigate('/')}><ArrowLeft size={16} /> Back</button>
        <h1 style={h1}>LiveMCQ Admin</h1>
      </div>
      <div style={tabsRow}>
        <button style={tabBtn(tab === 'import')} onClick={() => setTab('import')}>Import &amp; classify</button>
        <button style={tabBtn(tab === 'manage')} onClick={() => setTab('manage')}>Manage &amp; delete</button>
      </div>
      {tab === 'import' ? <ImportPanel /> : <ManagePanel />}
    </Shell>
  )
}

// ── Import ─────────────────────────────────────────────────────
function ImportPanel() {
  const [items, setItems] = useState([])      // { norm, slug }
  const [fileName, setFileName] = useState('')
  const [summary, setSummary] = useState(null) // { total, dupInDb, dupInFile, badFid }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  async function onFile(e) {
    setError(''); setResult(null); setSummary(null); setItems([])
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setBusy(true)
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
        next.push({ norm, slug: '' })
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

  const assigned = items.filter((it) => it.slug).length
  const allAssigned = items.length > 0 && assigned === items.length

  function setSlug(i, slug) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, slug } : it)))
  }

  async function onInsert() {
    setBusy(true); setError(''); setResult(null)
    try {
      const rows = items.map((it) => toInsertRow(it.norm, it.slug))
      const res = await insertRows(rows)
      invalidateModule('livemcq')
      setResult(res)
      setItems([]); setSummary(null); setFileName('')
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setBusy(false)
    }
  }

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
      {error && <p style={errorBox}>{error}</p>}
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

      {items.map((it, i) => (
        <QuestionCard key={it.norm.favorite_id} item={it.norm} slug={it.slug} onSlug={(s) => setSlug(i, s)} index={i + 1} />
      ))}

      {items.length > 0 && (
        <div style={stickyFooter}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
            {assigned}/{items.length} classified
          </span>
          <button style={insertBtn(allAssigned && !busy)} disabled={!allAssigned || busy} onClick={onInsert}>
            {busy ? <Loader2 size={15} style={spin} /> : <Check size={15} />} Insert {items.length}
          </button>
        </div>
      )}
    </div>
  )
}

function QuestionCard({ item, slug, onSlug, index }) {
  const [showExp, setShowExp] = useState(false)
  return (
    <div style={qCard}>
      <div style={qTop}>
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
              {correct && <Check size={13} style={{ color: '#22c55e', marginLeft: 'auto', flexShrink: 0 }} />}
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

      <StyledSelect
        value={slug}
        onChange={onSlug}
        empty={!slug}
        fullWidth
        style={{ marginTop: 8 }}
        placeholder="Select category…"
        placeholderDisabled
      />
    </div>
  )
}

// A native <select> restyled to look designed: no browser chrome, a custom
// chevron, theme-aware control + option colors. Keeps native a11y/keyboard.
function StyledSelect({ value, onChange, empty, fullWidth, style, placeholder, placeholderDisabled, includeAllLabel }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: fullWidth ? '100%' : 'auto', ...style }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectControl(empty, fullWidth)}
      >
        {placeholder != null && (
          <option value="" disabled={!!placeholderDisabled} style={optionStyle}>{placeholder}</option>
        )}
        {includeAllLabel != null && <option value="" style={optionStyle}>{includeAllLabel}</option>}
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c.slug} value={c.slug} style={optionStyle}>{c.name}</option>
        ))}
      </select>
      <ChevronDown size={15} style={selectChevron} />
    </div>
  )
}

// ── Manage / delete ────────────────────────────────────────────
const PAGE_SIZE = 50

function ManagePanel() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [deleting, setDeleting] = useState('')
  const [page, setPage] = useState(0)
  const [confirm, setConfirm] = useState(null)   // row pending delete-confirmation

  useEffect(() => {
    let cancelled = false
    fetchLivemcqRows()
      .then((r) => { if (!cancelled) setRows(r) })
      .catch((e) => { if (!cancelled) setError(e.message || String(e)) })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (!rows) return []
    const needle = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (cat && r.slug !== cat) return false
      if (!needle) return true
      return (r.favorite_id && r.favorite_id.includes(needle)) ||
        stripTags(r.question).toLowerCase().includes(needle)
    })
  }, [rows, q, cat])

  // Any change to the query/filter jumps back to the first page (reset in the
  // handlers rather than an effect to avoid a cascading render).
  const setQuery = (v) => { setQ(v); setPage(0) }
  const setCategory = (v) => { setCat(v); setPage(0) }

  async function doDelete() {
    const row = confirm
    if (!row?.favorite_id) return
    setDeleting(row.favorite_id)
    try {
      await deleteFavoriteIds([row.favorite_id])
      invalidateModule('livemcq')
      setRows((prev) => prev.filter((r) => r.id !== row.id))
      setConfirm(null)
    } catch (e) {
      setError(e.message || String(e))
      setConfirm(null)
    } finally {
      setDeleting('')
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
      </div>
      <p style={muted}>
        {filtered.length
          ? <>Showing <b style={{ color: 'var(--text-2)' }}>{start + 1}–{start + shown.length}</b> of {filtered.length}{filtered.length !== rows.length ? ` (filtered from ${rows.length})` : ''}</>
          : <>No matches of {rows.length}</>}
      </p>
      {shown.map((r) => (
        <div key={r.id} style={mRow}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={mMeta}>
              <span style={catChip}>{r.catName}</span>
              <span style={fidTag}>fav {r.favorite_id ?? '—'}</span>
              {r.correct_answer == null && <span style={warnTag}>no key</span>}
              {r.deleted && <span style={dangerTag}>recycle-binned</span>}
            </div>
            <div style={mSnippet}>{stripTags(r.question).slice(0, 160) || <em style={muted}>(image-only)</em>}</div>
          </div>
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
      <div style={{ color: '#f59e0b', marginBottom: 10 }}>{icon}</div>
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
  background: active ? 'var(--accent, #6366f1)' : 'transparent',
  color: active ? '#fff' : 'var(--text-2)',
})
const backBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }
const muted = { fontSize: '0.82rem', color: 'var(--text-3)' }
const code = { background: 'var(--card2)', padding: '1px 5px', borderRadius: 5, fontSize: '0.78rem' }
const uploadCard = { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: 12, borderRadius: 11, border: '1px dashed var(--border)', background: 'var(--card2)', marginBottom: 14 }
const uploadBtn = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }
const qCard = { border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginBottom: 12, background: 'var(--card)' }
const qTop = { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }
const qIndex = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-3)' }
const fidTag = { fontSize: '0.72rem', color: 'var(--text-3)', background: 'var(--card2)', padding: '2px 7px', borderRadius: 20 }
const warnTag = { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#b45309', background: 'rgba(245,158,11,0.14)', padding: '2px 7px', borderRadius: 20 }
const dangerTag = { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#b91c1c', background: 'rgba(239,68,68,0.14)', padding: '2px 7px', borderRadius: 20 }
const optRow = (correct) => ({ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 9px', borderRadius: 8, marginBottom: 4, background: correct ? 'rgba(34,197,94,0.10)' : 'var(--card2)', fontSize: '0.88rem', color: 'var(--text)' })
const optLetter = (correct) => ({ width: 20, height: 20, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, background: correct ? '#22c55e' : 'var(--border)', color: correct ? '#fff' : 'var(--text-2)' })
const expToggle = { background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', padding: '2px 0', marginBottom: 4 }
const selectControl = (empty, fullWidth) => ({
  width: fullWidth ? '100%' : 'auto', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  padding: '9px 34px 9px 12px', borderRadius: 9,
  border: `1px solid ${empty ? 'rgba(245,158,11,0.6)' : 'var(--border)'}`,
  background: 'var(--card2)', color: empty ? 'var(--text-3)' : 'var(--text)',
  fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.2, cursor: 'pointer', outline: 'none',
})
const selectChevron = { position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }
const optionStyle = { background: 'var(--card)', color: 'var(--text)' }
const pagerRow = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginTop: 16 }
const pagerBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: on ? 'var(--text-2)' : 'var(--text-3)', cursor: on ? 'pointer' : 'not-allowed', opacity: on ? 1 : 0.45 })
const pagerNum = (active) => ({ minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8, border: `1px solid ${active ? 'var(--accent, #6366f1)' : 'var(--border)'}`, background: active ? 'var(--accent, #6366f1)' : 'transparent', color: active ? '#fff' : 'var(--text-2)', fontSize: '0.82rem', fontWeight: active ? 700 : 500, cursor: 'pointer' })
const pagerGap = { color: 'var(--text-3)', padding: '0 2px', userSelect: 'none' }
const overlay = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }
const modalCard = { width: '100%', maxWidth: 420, boxSizing: 'border-box', padding: 20, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }
const modalIcon = { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', background: 'rgba(239,68,68,0.14)', marginBottom: 12 }
const modalTitle = { margin: '0 0 10px', fontSize: '1.02rem', fontWeight: 700, color: 'var(--text)' }
const modalMeta = { display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 8 }
const modalSnippet = { fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.4, padding: '8px 10px', borderRadius: 8, background: 'var(--card2)', border: '1px solid var(--border)', maxHeight: 96, overflow: 'auto' }
const modalWarn = { margin: '12px 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }
const modalActions = { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }
const modalCancelBtn = { padding: '9px 16px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }
const modalDeleteBtn = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }
const stickyFooter = { position: 'sticky', bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 -6px 20px rgba(0,0,0,0.12)', marginTop: 6 }
const insertBtn = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 9, border: 'none', background: on ? '#22c55e' : 'var(--border)', color: on ? '#fff' : 'var(--text-3)', fontSize: '0.88rem', fontWeight: 700, cursor: on ? 'pointer' : 'not-allowed' })
const errorBox = { fontSize: '0.83rem', color: '#b91c1c', background: 'rgba(239,68,68,0.10)', padding: '9px 12px', borderRadius: 9 }
const okBox = { display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: '#15803d', background: 'rgba(34,197,94,0.10)', padding: '9px 12px', borderRadius: 9 }
const searchRow = { display: 'flex', gap: 8, marginBottom: 8 }
const searchInput = { width: '100%', padding: '9px 11px 9px 32px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--card2)', color: 'var(--text)', fontSize: '0.85rem' }
const mRow = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', marginBottom: 8 }
const mMeta = { display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }
const catChip = { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-2)', background: 'var(--card2)', padding: '2px 8px', borderRadius: 20 }
const mSnippet = { fontSize: '0.84rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const delBtn = { flexShrink: 0, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }
const spin = { animation: 'spin 1s linear infinite' }
