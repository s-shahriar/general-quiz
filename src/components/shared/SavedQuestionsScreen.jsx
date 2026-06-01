import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

export default function SavedQuestionsScreen({ topics, savedSet, onRemove, onHome, config }) {
  const { icon: Icon, color, title, emptyIcon: EmptyIcon, emptyText, emptyHint, totalLabel, removeHint, renderItem } = config

  const groupedByTopic = topics.map(t => {
    const items = t.questions
      .map((q, i) => ({ q, qid: `${t.id}__${i}` }))
      .filter(({ q }) => q.options && q.correct_answer)
      .filter(({ qid }) => savedSet.has(qid))
    return { topic: t, items }
  }).filter(g => g.items.length > 0)

  const total = groupedByTopic.reduce((s, g) => s + g.items.length, 0)

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
            <span className="nailed-screen-total-label">{totalLabel(total, groupedByTopic.length)}</span>
          </div>
          <div className="nailed-screen-hint">
            Tap <X size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {removeHint}
          </div>
          <div className="nailed-screen-list">
            {groupedByTopic.map(({ topic: t, items }) => (
              <TopicGroup key={t.id} topic={t} items={items} onRemove={onRemove} renderItem={renderItem} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TopicGroup({ topic: t, items, onRemove, renderItem }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="nailed-group" style={{ '--c': t.color }}>
      <button className="nailed-group-header" onClick={() => setOpen(v => !v)}>
        <div className="nailed-group-label">
          <span className="nailed-group-dot" style={{ background: t.color }} />
          <span style={{ color: t.color }}>{t.name}</span>
          <span className="nailed-group-badge" style={{ background: `${t.color}20`, color: t.color }}>{items.length}</span>
        </div>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="nailed-group-body anim-slide">
          {items.map(({ q, qid }) => renderItem({ q, qid, t, onRemove }))}
        </div>
      )}
    </div>
  )
}
