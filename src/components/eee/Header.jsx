import { ArrowLeft, Zap } from 'lucide-react'

export default function Header({ title, onBack, progress, current, total, correct, wrong, extra }) {
  const pct = total ? Math.round((current / total) * 100) : 0

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{ background: 'rgba(10,14,40,0.92)', borderBottomColor: 'rgba(99,102,241,0.20)' }}
    >
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg transition-colors hover:bg-[#141a3c] text-[#7879c0] hover:text-[#ecedf8]"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {!onBack && (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 10px rgba(99,102,241,0.4)' }}
            >
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: '#ecedf8' }}>EEE Quiz</span>
          </div>
        )}

        <span className="flex-1 text-sm font-medium truncate" style={{ color: '#ecedf8' }}>{title}</span>

        {extra && extra}

        {total > 0 && (
          <span className="text-xs font-mono shrink-0" style={{ color: '#7879c0' }}>
            {current} / {total}
          </span>
        )}

        {correct !== undefined && (
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="font-semibold" style={{ color: '#22c55e' }}>{correct} ✓</span>
            <span className="font-semibold" style={{ color: '#f43f5e' }}>{wrong} ✗</span>
            <span style={{ color: '#7879c0' }}>{total - current} left</span>
          </div>
        )}
      </div>

      {progress && (
        <div className="h-1" style={{ background: '#141a3c' }}>
          <div className="h-full progress-fill rounded-r-full" style={{ '--progress': pct / 100 }} />
        </div>
      )}
    </header>
  )
}
