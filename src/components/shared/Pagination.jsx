import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
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
    <div className="study-pagination">
      <button
        className="study-pag-btn"
        onClick={() => onPageChange(page - 1)}
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
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
      )}
      <button
        className="study-pag-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}
