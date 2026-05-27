import { RotateCcw, BookOpen, Home, Trophy, Target, Dumbbell } from 'lucide-react'
import Header from './Header'

function getScoreInfo(pct) {
  if (pct >= 90) return { Icon: Trophy,   color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.28)',  label: 'অসাধারণ!' }
  if (pct >= 70) return { Icon: Target,   color: '#818cf8', bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.28)', label: 'ভালো করেছ!' }
  if (pct >= 50) return { Icon: BookOpen, color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.28)', label: 'আরো পড়তে হবে' }
  return         { Icon: Dumbbell,        color: '#f43f5e', bg: 'rgba(244,63,94,0.10)',   border: 'rgba(244,63,94,0.28)',   label: 'আরো প্র্যাকটিস করো' }
}

export default function Results({ topic, correct, wrong, total, onRetry, onRevise, onHome }) {
  const pct = Math.round((correct / total) * 100)
  const { Icon, color, bg, border, label } = getScoreInfo(pct)

  const r = 54
  const circumference = 2 * Math.PI * r
  const strokeOffset = circumference - (pct / 100) * circumference

  return (
    <div className="min-h-screen">
      <Header title="ফলাফল" onBack={onHome} />

      <div className="max-w-md mx-auto px-4 py-10">
        {/* Score ring */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-36 h-36 mb-4 score-pop">
            <svg width="144" height="144" viewBox="0 0 144 144" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="72" cy="72" r={r} fill="none" stroke="#141a3c" strokeWidth="10" />
              <circle
                cx="72" cy="72" r={r}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <Icon size={22} style={{ color }} />
              <span className="text-2xl font-bold" style={{ color }}>{pct}%</span>
            </div>
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#ecedf8' }}>{label}</h2>
          <p className="text-sm mt-1" style={{ color: '#7879c0' }}>{topic.title}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: correct, label: 'সঠিক', color: '#22c55e' },
            { value: wrong,   label: 'ভুল',  color: '#f43f5e' },
            { value: total,   label: 'মোট',  color: '#7879c0' },
          ].map(({ value, label, color: c }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center"
              style={{ background: '#0f1433', border: '1px solid rgba(99,102,241,0.18)' }}
            >
              <p className="text-2xl font-bold" style={{ color: c }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: '#7879c0' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: topic.accent, boxShadow: `0 4px 22px ${topic.accent}44` }}
          >
            <RotateCcw size={15} />
            আবার চেষ্টা করো
          </button>
          <button
            onClick={onRevise}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#141a3c', color: '#ecedf8', border: '1px solid rgba(99,102,241,0.22)' }}
          >
            <BookOpen size={15} />
            Revise Topic
          </button>
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-colors hover:text-[#ecedf8]"
            style={{ color: '#7879c0' }}
          >
            <Home size={15} />
            সব টপিক
          </button>
        </div>
      </div>
    </div>
  )
}
