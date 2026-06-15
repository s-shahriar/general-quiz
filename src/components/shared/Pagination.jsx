import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  function getPageNums() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    // Show a sliding window of 5 consecutive pages around the current one,
    // plus the first/last pages with ellipses where there's a gap.
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, start + 4)
    start = Math.max(1, end - 4)
    const pages = []
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
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
