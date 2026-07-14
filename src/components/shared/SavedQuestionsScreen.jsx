import { useState } from 'react'
import { X, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import RichText from './RichText'
import DeleteButton from './DeleteButton.jsx'
import { uidOf } from '../../lib/qid.js'
import { useTrash } from '../../contexts/TrashContext.jsx'

// Below this many categories the chip grid collapses to ~2 rows with a toggle.
const COLLAPSE_AFTER = 6

// Saved (Nailed / Important) questions, grouped by topic and browsed via a
// horizontal category chip-bar (pick one topic at a time — far easier to filter
// than a long vertical list). Explanations are folded by default and expand on
// demand, so long LiveMCQ explanations don't bury the list.
export default function SavedQuestionsScreen({ topics, savedSet, onRemove, onHome, config }) {
  const { icon: Icon, color, title, emptyIcon: EmptyIcon, emptyText, emptyHint,
          totalLabel, removeHint, rowIcon, rowIconColor, showExplanation } = config
  const [activeId, setActiveId] = useState(null)
  const [chipsOpen, setChipsOpen] = useState(false)
  const { trashedIds } = useTrash()

  const grouped = topics.map(t => {
    const items = t.questions
      .map((q) => ({ q, qid: uidOf(q) }))
      .filter(({ q }) => q.options && q.correct_answer && !trashedIds.has(q._id))
      .filter(({ qid }) => savedSet.has(qid))
    return { topic: t, items }
  }).filter(g => g.items.length > 0)

  const total = grouped.reduce((s, g) => s + g.items.length, 0)
  const active = grouped.find(g => g.topic.id === activeId) || grouped[0]

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
        <button className="study-home-btn" onClick={onHome} title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        </button>
      </div>

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
            Tap <X size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {removeHint}
          </div>

          {(() => {
            const collapsible = grouped.length > COLLAPSE_AFTER
            return (
              <>
                <div className={`nailed-cat-bar${collapsible && !chipsOpen ? ' collapsed' : ''}`}>
                  {grouped.map(({ topic: t, items }) => {
                    const TIcon = t.icon
                    const on = active?.topic.id === t.id
                    return (
                      <button
                        key={t.id}
                        className={`nailed-cat-chip${on ? ' active' : ''}`}
                        style={{ '--c': t.color }}
                        onClick={() => setActiveId(t.id)}
                      >
                        {TIcon && <span className="nailed-cat-chip-ic"><TIcon size={16} /></span>}
                        <span className="nailed-cat-chip-name">{t.shortName || t.name}</span>
                        <span className="nailed-cat-chip-count">{items.length}</span>
                      </button>
                    )
                  })}
                </div>
                {collapsible && (
                  <button className="nailed-cat-toggle" onClick={() => setChipsOpen(v => !v)}>
                    {chipsOpen ? <>Show less <ChevronUp size={13} /></> : <>Show all {grouped.length} categories <ChevronDown size={13} /></>}
                  </button>
                )}
              </>
            )
          })()}

          {active && (
            <div className="nailed-screen-list anim-fade" style={{ '--c': active.topic.color }}>
              {active.items.map(({ q, qid }) => (
                <SavedRow
                  key={qid}
                  q={q}
                  qid={qid}
                  rowIcon={rowIcon}
                  rowIconColor={rowIconColor}
                  showExplanation={showExplanation}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SavedRow({ q, qid, rowIcon: RowIcon, rowIconColor, showExplanation, onRemove }) {
  const [open, setOpen] = useState(false)   // explanation folded by default
  return (
    <div className="nailed-row">
      <RowIcon size={11} fill="currentColor" style={{ color: rowIconColor, flexShrink: 0, marginTop: 3 }} />
      <div className="nailed-row-body">
        <RichText className="nailed-row-text" html={q.question} />
        {q.correct_answer && q.options?.[q.correct_answer] && (
          <div className="nailed-row-answer">
            <span className="nailed-ans-key">{q.correct_answer.toUpperCase()}</span>
            <RichText className="nailed-ans-text" html={q.options[q.correct_answer]} />
          </div>
        )}
        {showExplanation && q.explanation && (
          <>
            <button className="nailed-exp-toggle" onClick={() => setOpen(v => !v)}>
              <Lightbulb size={11} />
              {open ? 'Hide explanation' : 'Show explanation'}
            </button>
            {open && <RichText as="div" className="nailed-row-explanation" html={q.explanation} />}
          </>
        )}
      </div>
      <div className="nailed-row-btns">
        <button className="nailed-unnail-btn" onClick={() => onRemove(qid)} title="Remove from this list">
          <X size={13} />
        </button>
        <DeleteButton question={q} className="nailed-unnail-btn" iconOnly size={13} />
      </div>
    </div>
  )
}
