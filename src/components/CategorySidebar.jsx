import { X, LayoutGrid } from 'lucide-react'
import { useEffect, useRef } from 'react'

// `subtopics` (optional) nests the current category's sub-topics under it for
// quick movement between them — LiveMCQ Study passes { slug, name, n }[].
// `currentSubtopic`: undefined = not in sub-topic view, null = the sub-topic
// grid, a slug = that sub-topic. `onSelectSubtopic(null)` means "the grid".
export default function CategorySidebar({
  topics, currentTopicId, open, onClose, onSelect,
  subtopics, currentSubtopic, onSelectSubtopic,
}) {
  const listRef = useRef(null)

  // On a phone the current category can sit below the fold (গণিত is 12th), so
  // each time the drawer opens, park the current category at the top of the
  // list — its sub-topics are then on screen — or, when a sub-topic is active
  // and would still be hidden, centre that row. Scrolls the list itself rather
  // than scrollIntoView, which can also nudge the page behind the drawer.
  useEffect(() => {
    const list = listRef.current
    if (!open || !list) return
    const item = list.querySelector('.cat-sidebar-item.current')
    if (!item) return
    const topOf = (el) => el.offsetTop - list.offsetTop
    let target = topOf(item) - 8
    const sub = list.querySelector('.cat-sidebar-sub.current')
    if (sub && topOf(sub) + sub.offsetHeight > target + list.clientHeight) {
      target = topOf(sub) - list.clientHeight / 2
    }
    list.scrollTop = Math.max(0, target)
  }, [open, currentTopicId, currentSubtopic])

  return (
    <>
      {open && (
        <div className="cat-sidebar-overlay" onClick={onClose} />
      )}
      <aside className={`cat-sidebar${open ? ' open' : ''}`}>
        <div className="cat-sidebar-header">
          <span className="cat-sidebar-title">
            <LayoutGrid size={15} />
            Categories
          </span>
          <button className="cat-sidebar-close" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
        <div className="cat-sidebar-list" ref={listRef}>
          {topics.map(t => {
            const Icon = t.icon
            const isCurrent = t.id === currentTopicId
            const subs = isCurrent && subtopics?.length && onSelectSubtopic ? subtopics : null
            return (
              <div key={t.id} style={{ display: 'contents' }}>
                <button
                  className={`cat-sidebar-item${isCurrent ? ' current' : ''}`}
                  style={{ '--tc': t.color }}
                  onClick={() => { if (!isCurrent) { onSelect(t); onClose() } }}
                  disabled={isCurrent}
                >
                  <span className="cat-sidebar-icon">
                    <Icon size={14} />
                  </span>
                  <span className="cat-sidebar-name">{t.name}</span>
                  {isCurrent && <span className="cat-sidebar-badge">current</span>}
                </button>
                {subs && (
                  <div className="cat-sidebar-subs" style={{ '--tc': t.color }} role="group" aria-label={`${t.name} sub-topics`}>
                    <SubItem
                      name="সব sub-topic"
                      current={currentSubtopic === null}
                      onClick={() => { onSelectSubtopic(null); onClose() }}
                    />
                    {subs.map(s => (
                      <SubItem
                        key={s.slug}
                        name={s.name}
                        count={s.n}
                        current={currentSubtopic === s.slug}
                        onClick={() => { onSelectSubtopic(s.slug); onClose() }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>
    </>
  )
}

function SubItem({ name, count, current, onClick }) {
  return (
    <button
      className={`cat-sidebar-sub${current ? ' current' : ''}`}
      onClick={() => { if (!current) onClick() }}
      aria-current={current ? 'true' : undefined}
    >
      <span className="cat-sidebar-sub-name">{name}</span>
      {count != null && <span className="cat-sidebar-sub-count">{count}</span>}
    </button>
  )
}
