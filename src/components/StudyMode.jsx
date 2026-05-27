import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, Home, CheckCircle, XCircle, Lightbulb, Star, Bookmark, LayoutGrid, Search, X, ChevronRight } from 'lucide-react'
import CategorySidebar from './CategorySidebar.jsx'

const PAGE_SIZE = 20

function normalize(str) {
  return (str ?? '').toLowerCase().trim()
}

export default function StudyMode({ topic, topics, mastered, important, onNail, onMarkImportant, onUnmarkImportant, onBack, onHome, onChangeTopic }) {
  const [filterImportant, setFilterImportant] = useState(false)
  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const [query, setQuery]                     = useState('')
  const [page, setPage]                       = useState(1)

  const allQ = topic.questions
    .map((q, i) => ({ q, qid: `${topic.id}__${i}` }))
    .filter(({ q }) => q.options && q.correct_answer)

  const nonNailed      = allQ.filter(({ qid }) => !mastered.has(qid))
  const nailedCt       = allQ.length - nonNailed.length
  const importantCount = nonNailed.filter(({ qid }) => important?.has(qid)).length

  const afterFilter = filterImportant
    ? nonNailed.filter(({ qid }) => important?.has(qid))
    : nonNailed

  const visible = useMemo(() => {
    if (!query.trim()) return afterFilter
    const q = normalize(query)
    return afterFilter.filter(({ q: question }) =>
      normalize(question.question).includes(q) ||
      Object.values(question.options ?? {}).some(v => normalize(v).includes(q))
    )
  }, [query, afterFilter])

  useEffect(() => { setPage(1) }, [query, filterImportant, topic.id])

  const totalPages = Math.ceil(visible.length / PAGE_SIZE)
  const pageItems  = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function getPageNums() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="study-page anim-fade">
      <div className="study-topbar">
        <button className="back-btn" onClick={onBack}><ChevronLeft size={15} /> Back</button>
        <span className="study-title" style={{ color: topic.color }}>{topic.name}</span>
        <div className="topbar-right-actions">
          {topics && onChangeTopic && (
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse categories">
              <LayoutGrid size={16} />
            </button>
          )}
          <button className="study-home-btn" onClick={onHome} title="Home"><Home size={16} /></button>
        </div>
      </div>

      {topics && onChangeTopic && (
        <CategorySidebar
          topics={topics}
          currentTopicId={topic.id}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={onChangeTopic}
        />
      )}

      <div className="study-filter-bar">
        <button
          className={`study-filter-btn${!filterImportant ? ' active' : ''}`}
          onClick={() => setFilterImportant(false)}
          style={!filterImportant ? { borderColor: topic.color, color: topic.color, background: `${topic.color}15` } : {}}
        >
          All ({nonNailed.length})
        </button>
        <button
          className={`study-filter-btn${filterImportant ? ' active' : ''}`}
          onClick={() => setFilterImportant(true)}
          style={filterImportant ? { borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.12)' } : {}}
        >
          <Bookmark size={11} fill={filterImportant ? 'currentColor' : 'none'} />
          Important ({importantCount})
        </button>
      </div>

      {/* Search bar */}
      <div className="study-search-bar">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search questions..."
          className="study-search-input"
        />
        {query && (
          <button className="study-search-clear" onClick={() => setQuery('')}>
            <X size={13} />
          </button>
        )}
      </div>
      {query && (
        <p className="study-search-meta">
          {visible.length} / {afterFilter.length} matches for "{query}"
        </p>
      )}

      {nailedCt > 0 && !filterImportant && !query && (
        <div className="nailed-notice" style={{ borderColor: `${topic.color}40`, color: topic.color }}>
          <Star size={13} fill="currentColor" />
          <span>{nailedCt} question{nailedCt !== 1 ? 's' : ''} Nailed — view in <button onClick={onHome} className="nailed-notice-link">Nailed It</button></span>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="study-all-nailed">
          {query
            ? <Search size={38} style={{ color: topic.color, opacity: 0.4, marginBottom: 12 }} />
            : filterImportant
              ? <Bookmark size={38} style={{ color: '#ef4444', opacity: 0.4, marginBottom: 12 }} fill="currentColor" />
              : <Star size={38} style={{ color: topic.color, opacity: 0.5, marginBottom: 12 }} fill="currentColor" />
          }
          <p>{query ? 'No questions match your search.' : filterImportant ? 'No Important questions yet.' : 'All questions nailed! 🎉'}</p>
          {query && <button className="back-btn" style={{ marginTop: 16 }} onClick={() => setQuery('')}>Clear search</button>}
          {!query && <button className="back-btn" style={{ marginTop: 16 }} onClick={onHome}>Go Home</button>}
        </div>
      ) : (
        <>
          {totalPages > 1 && (
            <div className="study-pagination">
              <button
                className="study-pag-btn"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
              </button>
              {getPageNums().map((p, i) =>
                p === '...'
                  ? <span key={`e${i}`} style={{ width: 24, textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>…</span>
                  : <button
                      key={p}
                      className={`study-pag-btn${p === page ? ' active' : ''}`}
                      onClick={() => goTo(p)}
                    >
                      {p}
                    </button>
              )}
              <button
                className="study-pag-btn"
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          <div className="study-list">
            {pageItems.map(({ q, qid }, i) => (
              <StudyCard
                key={qid}
                question={q}
                index={(page - 1) * PAGE_SIZE + i}
                color={topic.color}
                nailed={mastered.has(qid)}
                isImportant={important?.has(qid) ?? false}
                onNail={() => onNail(qid)}
                onMarkImportant={() => onMarkImportant?.(qid)}
                onUnmarkImportant={() => onUnmarkImportant?.(qid)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="study-pagination">
              <button
                className="study-pag-btn"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
              </button>
              {getPageNums().map((p, i) =>
                p === '...'
                  ? <span key={`e${i}`} style={{ width: 24, textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>…</span>
                  : <button
                      key={p}
                      className={`study-pag-btn${p === page ? ' active' : ''}`}
                      onClick={() => goTo(p)}
                    >
                      {p}
                    </button>
              )}
              <button
                className="study-pag-btn"
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StudyCard({ question: q, index, color, nailed, isImportant, onNail, onMarkImportant, onUnmarkImportant }) {
  const [shown, setShown]       = useState(false)
  const [selected, setSelected] = useState(null)
  const opts = ['a','b','c','d'].filter(k => q.options?.[k])

  const pick = (key) => {
    if (shown) return
    setSelected(key)
    setShown(true)
  }

  return (
    <div className={`study-card${nailed ? ' study-card-nailed' : ''}`} style={{ '--c': color }}>
      <div className="study-card-top">
        <span className="study-qnum" style={{ color }}>Q{index + 1}</span>
        <div className="study-card-actions">
          <button
            className={`nail-btn${nailed ? ' nailed' : ''}`}
            onClick={onNail}
            style={nailed ? { color, borderColor: `${color}60`, background: `${color}15` } : {}}
          >
            <Star size={12} fill={nailed ? 'currentColor' : 'none'} />
            {nailed ? 'Nailed ✓' : 'Nail It'}
          </button>
          <button
            className={`nail-btn important-study-btn${isImportant ? ' nailed' : ''}`}
            onClick={isImportant ? onUnmarkImportant : onMarkImportant}
            title={isImportant ? 'Important — click to remove' : 'Mark as Important'}
            style={isImportant ? { color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)' } : {}}
          >
            <Bookmark size={12} fill={isImportant ? 'currentColor' : 'none'} />
            {isImportant ? 'Important ✓' : 'Important'}
          </button>
          {shown && (
            <button className="study-toggle" onClick={() => { setShown(false); setSelected(null) }} style={{ color }}>
              Hide
            </button>
          )}
        </div>
      </div>

      <p className="study-question">{q.question}</p>

      <div className="study-options">
        {opts.map(key => {
          const isCorrect = key === q.correct_answer
          const isWrong   = shown && key === selected && !isCorrect
          let cls = 'study-opt study-opt-clickable'
          if (shown) {
            if (isCorrect)    cls += ' correct'
            else if (isWrong) cls += ' wrong'
            else              cls += ' dim'
          }
          return (
            <button key={key} className={cls} style={isCorrect && shown ? { '--c': color } : {}} onClick={() => pick(key)}>
              <span className="study-opt-key">{key.toUpperCase()}</span>
              <span className="study-opt-text">{q.options[key]}</span>
              {shown && isCorrect && <CheckCircle size={13} style={{ color, marginLeft: 'auto', flexShrink: 0 }} />}
              {shown && isWrong   && <XCircle size={13} style={{ color: '#ef4444', marginLeft: 'auto', flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>

      {shown && q.explanation && (
        <div className="explanation-box anim-slide" style={{ '--c': color }}>
          <div className="explanation-header">
            <Lightbulb size={14} style={{ color, flexShrink: 0 }} />
            <span className="explanation-label" style={{ color }}>Explanation</span>
          </div>
          <p className="explanation-text">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}
