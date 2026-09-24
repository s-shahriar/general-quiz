import { useState } from 'react'
import { X } from 'lucide-react'
import Pagination from './Pagination'
import TopbarActions from './TopbarActions.jsx'
import StudyCard from './StudyCard.jsx'
import TopicSwitcher from './TopicSwitcher.jsx'
import { uidOf } from '../../lib/qid.js'
import { useTrash } from '../../contexts/TrashContext.jsx'
import { useMasteredContext } from '../../contexts/MasteredContext.jsx'
import { useImportantContext } from '../../contexts/ImportantContext.jsx'
import { useWeakContext } from '../../contexts/WeakContext.jsx'

const PAGE_SIZE = 20
// Pseudo-topic id for the "All topics" chip — a saved list spans many topics,
// so reading straight through all of them is the common case here.
const ALL_ID = '__all__'

// Saved (Nailed / Important) questions, grouped by topic and browsed via a
// topic dropdown (pick one topic at a time — far easier to filter than a long
// vertical list), plus an "All topics" entry that reads straight through the
// whole saved set. Read as study cards — the same ones Study Mode
// uses: tap an option, get the answer and the explanation. Study Mode only ever
// covers one topic, so cards rendered here carry a topic badge whenever the
// view spans more than one. `headerExtra` renders under the top bar (the
// Important screen's Weak switch).
export default function SavedQuestionsScreen({ topics, savedSet, onRemoveMany, onHome, config, headerExtra }) {
  const { icon: Icon, color, title, emptyIcon: EmptyIcon, emptyText, emptyHint,
          totalLabel, removeAllLabel } = config
  const [activeId, setActiveId] = useState(null)
  const [page, setPage] = useState(1)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { trashedIds } = useTrash()
  const nailApi = useMasteredContext()
  const importantApi = useImportantContext()
  const weakApi = useWeakContext()

  const grouped = topics.map(t => {
    const items = t.questions
      .map((q) => ({ q, qid: uidOf(q) }))
      .filter(({ q }) => q.options && q.correct_answer && !trashedIds.has(q._id))
      .filter(({ qid }) => savedSet.has(qid))
    return { topic: t, items }
  }).filter(g => g.items.length > 0)

  const total = grouped.reduce((s, g) => s + g.items.length, 0)
  const multiTopic = grouped.length > 1
  const isAll = multiTopic && activeId === ALL_ID
  const active = isAll ? null : (grouped.find(g => g.topic.id === activeId) || grouped[0])

  // Items always carry their own topic, so an "All topics" run can colour each
  // card and label it with where it came from.
  const activeItems = isAll
    ? grouped.flatMap(g => g.items.map(it => ({ ...it, topic: g.topic })))
    : (active?.items ?? []).map(it => ({ ...it, topic: active.topic }))

  const activeName  = isAll ? 'All topics' : active?.topic.name
  const activeColor = isAll ? color : active?.topic.color

  // Bulk-remove every saved question in the *active* category (confirm-guarded via
  // a styled modal — big, but reversible). Scoped per-category, not global — so
  // it's hidden while "All topics" is selected.
  const activeCount = activeItems.length
  const doRemoveActive = () => {
    const ids = (active?.items ?? []).map(({ qid }) => qid)
    if (ids.length) onRemoveMany(ids)
    setConfirmOpen(false)
  }

  // Paginate the active selection (long lists — e.g. 190 nailed — shouldn't
  // render as one endless scroll).
  // Back to page 1 whenever the selected chip changes (adjust state during
  // render — avoids setState-in-effect cascading renders).
  const selectionKey = isAll ? ALL_ID : active?.topic.id
  const [prevSelection, setPrevSelection] = useState(selectionKey)
  if (prevSelection !== selectionKey) {
    setPrevSelection(selectionKey)
    setPage(1)
  }
  const totalPages = Math.max(1, Math.ceil(activeItems.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const pageItems = activeItems.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)

  const goToPage = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Study cards mutate progress directly (the row leaves the list when its own
  // flag is cleared — un-nail on the Nailed screen, un-bookmark on Important).
  const toggleNail = (qid) => nailApi.value.has(qid) ? nailApi.remove(qid) : nailApi.add(qid)

  return (
    <div className="nailed-screen anim-fade">
      <div className="nailed-screen-topbar">
        <button className="back-btn" onClick={onHome}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {' '}Back
        </button>
        <div className="nailed-screen-title">
          <Icon size={16} fill="currentColor" style={{ color }} />
          {title}
        </div>
        <TopbarActions />
      </div>

      {headerExtra}

      {total === 0 ? (
        <div className="nailed-screen-empty">
          <EmptyIcon size={48} style={{ color, opacity: 0.3 }} />
          <p>{emptyText}</p>
          <span>{emptyHint}</span>
        </div>
      ) : (
        <>
          <div className="nailed-screen-summary">
            <span className="nailed-screen-total">{total}</span>
            <span className="nailed-screen-total-label">{totalLabel(total, grouped.length)}</span>
          </div>
          <div className="nailed-screen-hint">
            Tap an option to reveal the answer
          </div>

          <TopicSwitcher
            groups={grouped.map(g => ({ ...g, topic: { ...g.topic, name: g.topic.shortName || g.topic.name } }))}
            activeId={isAll ? ALL_ID : active?.topic.id}
            onSelect={id => { setActiveId(id); setPage(1) }}
            allId={ALL_ID}
            allColor={color}
          />

          {activeItems.length > 0 && (
            <div className="nailed-screen-list anim-fade" style={{ '--c': activeColor }}>
              <div className="nailed-cat-actions">
                <span className="nailed-cat-actions-label" style={{ color: activeColor }}>
                  {activeName} · {activeItems.length}
                </span>
                {onRemoveMany && !isAll && activeCount > 0 && (
                  <button className="nailed-clear-all-btn" onClick={() => setConfirmOpen(true)}>
                    <X size={12} /> {removeAllLabel || 'Remove all'}
                  </button>
                )}
              </div>
              {totalPages > 1 && (
                <div className="nailed-page-info">Page {curPage} of {totalPages} · {activeItems.length} questions</div>
              )}

              <div className="study-list">
                {pageItems.map(({ q, qid, topic: t }, i) => (
                  <StudyCard
                    key={qid}
                    domId={'saved-q-' + qid}
                    question={q}
                    index={(curPage - 1) * PAGE_SIZE + i}
                    color={t.color}
                    topicLabel={isAll ? (t.shortName || t.name) : null}
                    categoryId={t.id}
                    nailed={nailApi.value.has(qid)}
                    isImportant={importantApi.value.has(qid)}
                    onNail={() => toggleNail(qid)}
                    onMarkImportant={() => importantApi.add(qid)}
                    onUnmarkImportant={() => importantApi.remove(qid)}
                    isWeak={weakApi.value.has(qid)}
                    onMarkWeak={() => weakApi.add(qid)}
                    onUnmarkWeak={() => weakApi.remove(qid)}
                  />
                ))}
              </div>

              {totalPages > 1 && <Pagination page={curPage} totalPages={totalPages} onPageChange={goToPage} />}
            </div>
          )}
        </>
      )}

      {confirmOpen && active && (
        <div className="trash-modal-backdrop" onClick={() => setConfirmOpen(false)}>
          <div className="trash-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="trash-modal-icon" style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
              <Icon size={22} />
            </div>
            <h3 className="trash-modal-title">{removeAllLabel || 'Remove all'} — {active.topic.name}?</h3>
            <p className="trash-modal-sub">
              {activeCount} question{activeCount !== 1 ? 's' : ''} will be removed from this list. You can add them back anytime.
            </p>
            <div className="trash-modal-actions">
              <button className="trash-btn-cancel" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="trash-btn-confirm" onClick={doRemoveActive}>
                <X size={14} /> {removeAllLabel || 'Remove all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
