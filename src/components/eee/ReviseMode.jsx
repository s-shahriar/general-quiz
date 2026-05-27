import { useState, useMemo, useEffect } from 'react'
import { Search, Bookmark, BookmarkCheck, X, Lightbulb, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import Header from './Header'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const PAGE_SIZE = 20

function normalize(str) {
  return str.toLowerCase().trim()
}

export default function ReviseMode({ topic, topics, onBack, onChangeTopic, isBookmarked, onToggleBookmark }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!query.trim()) return topic.data
    const q = normalize(query)
    return topic.data.filter(item =>
      normalize(item.question).includes(q) ||
      item.options.some(o => normalize(o).includes(q)) ||
      normalize(item.explanation_bn).includes(q)
    )
  }, [query, topic.data])

  useEffect(() => { setPage(1) }, [query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const startNum = (page - 1) * PAGE_SIZE + 1

  function goTo(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Category sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Category sidebar panel */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 272,
          background: 'rgba(10,14,40,0.97)',
          borderLeft: '1px solid rgba(99,102,241,0.26)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(18px)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.34,1.10,0.64,1)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b shrink-0" style={{ borderColor: 'rgba(99,102,241,0.18)' }}>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#7879c0' }}>
            <LayoutGrid size={14} /> Categories
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-[#141a3c]"
            style={{ color: '#4a4e80', border: '1px solid rgba(99,102,241,0.18)' }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-1">
          {(topics || []).map(t => {
            const Icon = t.Icon
            const isCurrent = t.id === topic.id
            return (
              <button
                key={t.id}
                disabled={isCurrent}
                onClick={() => { if (!isCurrent) { onChangeTopic(t); setSidebarOpen(false) } }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all border"
                style={isCurrent
                  ? { background: topic.accent + '1a', borderColor: topic.accent + '55', color: topic.accent, cursor: 'default', fontWeight: 600 }
                  : { background: 'transparent', borderColor: 'transparent', color: '#7879c0' }
                }
                onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = t.accent + '14'; e.currentTarget.style.borderColor = t.accent + '40'; e.currentTarget.style.color = t.accent } }}
                onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#7879c0' } }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: t.accent + '22', border: `1px solid ${t.accent}33`, color: t.accent }}
                >
                  {Icon && <Icon size={14} />}
                </span>
                <span className="flex-1 truncate">{t.title}</span>
                {isCurrent && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: topic.accent + '22', color: topic.accent, fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                    NOW
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      <Header title={topic.title} onBack={onBack} extra={
        topics && onChangeTopic && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors hover:bg-[#141a3c]"
            style={{ color: '#7879c0' }}
            title="Browse categories"
          >
            <LayoutGrid size={18} />
          </button>
        )
      } />

      {/* Sticky toolbar */}
      <div
        className="sticky top-14 z-40 backdrop-blur-md border-b"
        style={{ background: 'rgba(10,14,40,0.92)', borderBottomColor: 'rgba(99,102,241,0.18)' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4a4e80' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="প্রশ্ন, অপশন বা ব্যাখ্যায় খুঁজুন..."
              className="search-input w-full rounded-xl pl-9 pr-9 py-2 text-sm"
              style={{
                background: '#0f1433',
                border: '1px solid rgba(99,102,241,0.18)',
                color: '#ecedf8',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#ecedf8] transition-colors"
                style={{ color: '#4a4e80' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onGoTo={goTo} accent={topic.accent} />
          )}
        </div>

        {/* Counter row */}
        <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center justify-between">
          <p className="text-xs font-mono" style={{ color: '#4a4e80' }}>
            {filtered.length} / {topic.data.length} questions
            {query && <span className="ml-1" style={{ color: '#22d3ee' }}>"{query}"</span>}
          </p>
          {totalPages > 1 && (
            <p className="text-xs font-mono" style={{ color: '#4a4e80' }}>Page {page} / {totalPages}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {pageItems.map((item, idx) => (
            <QuestionCard
              key={item.id}
              item={item}
              num={startNum + idx}
              accent={topic.accent}
              bookmarked={isBookmarked(item.id)}
              onBookmark={() => onToggleBookmark(item.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: '#4a4e80' }}>
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p>কোনো প্রশ্ন পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onGoTo, accent }) {
  function getPages() {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => onGoTo(page - 1)}
        disabled={page === 1}
        className="pag-btn p-1.5 rounded-lg"
      >
        <ChevronLeft size={14} />
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} className="w-6 text-center text-xs" style={{ color: '#4a4e80' }}>…</span>
          : <button
              key={p}
              onClick={() => onGoTo(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all border"
              style={
                p === page
                  ? { background: accent, borderColor: accent, color: '#fff', boxShadow: `0 2px 10px ${accent}44` }
                  : { background: '#0f1433', borderColor: 'rgba(99,102,241,0.18)', color: '#7879c0' }
              }
            >
              {p}
            </button>
      )}

      <button
        onClick={() => onGoTo(page + 1)}
        disabled={page === totalPages}
        className="pag-btn p-1.5 rounded-lg"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

function QuestionCard({ item, num, accent, bookmarked, onBookmark }) {
  return (
    <div
      className="rounded-2xl p-5 fade-in"
      style={{ background: '#0f1433', border: '1px solid rgba(99,102,241,0.16)', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
    >
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <span
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: accent + 'cc', boxShadow: `0 2px 8px ${accent}33` }}
        >
          {num}
        </span>
        <p className="text-sm leading-relaxed flex-1" style={{ color: '#ecedf8' }}>{item.question}</p>
        <button
          onClick={onBookmark}
          className="shrink-0 p-1.5 rounded-lg hover:bg-[#141a3c] transition-colors"
          title="Bookmark"
        >
          {bookmarked
            ? <BookmarkCheck size={16} style={{ color: '#f59e0b' }} />
            : <Bookmark size={16} style={{ color: '#4a4e80' }} />
          }
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-4">
        {item.options.map((opt, i) => {
          const isCorrect = opt === item.correct_answer
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border transition-colors"
              style={
                isCorrect
                  ? { background: 'rgba(34,197,94,0.10)', borderColor: 'rgba(34,197,94,0.40)', color: '#bbf7d0' }
                  : { background: '#141a3c', borderColor: 'rgba(99,102,241,0.12)', color: '#7879c0' }
              }
            >
              <span
                className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={
                  isCorrect
                    ? { background: '#22c55e', color: '#fff', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }
                    : { background: '#1e2450', color: '#7879c0' }
                }
              >
                {LETTERS[i]}
              </span>
              <span>{opt}</span>
              {isCorrect && (
                <span className="ml-auto text-xs font-semibold" style={{ color: '#22c55e' }}>✓ সঠিক</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      <div
        className="rounded-xl p-3"
        style={{ background: '#0a0e28', border: '1px solid rgba(99,102,241,0.16)' }}
      >
        <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: '#22d3ee' }}>
          <Lightbulb size={13} /> ব্যাখ্যা
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#7879c0' }}>{item.explanation_bn}</p>
      </div>
    </div>
  )
}
