import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronRight, Bookmark, BookmarkCheck, AlertCircle, CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import Header from './Header'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function CountdownRing() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r="16" fill="none" stroke="#141a3c" strokeWidth="3" />
      <circle
        cx="18" cy="18" r="16"
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        strokeDasharray="100.5"
        strokeDashoffset="100.5"
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
        style={{ animation: 'fillRing 2s linear forwards' }}
      />
    </svg>
  )
}

export default function QuizMode({ topic, onBack, onFinish, isBookmarked, onToggleBookmark }) {
  const [questions] = useState(() => shuffle(topic.data))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [cardKey, setCardKey] = useState(0)
  const timerRef = useRef(null)

  const current = questions[currentIdx]
  const total = questions.length

  const advance = useCallback(() => {
    clearTimeout(timerRef.current)
    if (currentIdx + 1 >= total) {
      onFinish({ correct, wrong: answered && selected !== current.correct_answer ? wrong : wrong, total })
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setAnswered(false)
      setCardKey(k => k + 1)
    }
  }, [currentIdx, total, correct, wrong, answered, selected, current, onFinish])

  const pick = useCallback((opt) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    const isCorrect = opt === current.correct_answer
    if (isCorrect) {
      setCorrect(c => c + 1)
      timerRef.current = setTimeout(() => {
        setCurrentIdx(i => {
          const next = i + 1
          if (next >= total) {
            onFinish({ correct: correct + 1, wrong, total })
            return i
          }
          return next
        })
        setSelected(null)
        setAnswered(false)
        setCardKey(k => k + 1)
      }, 2000)
    } else {
      setWrong(w => w + 1)
    }
  }, [answered, current, correct, wrong, total, onFinish])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const isCorrectAnswer = answered && selected === current.correct_answer

  if (!current) return null

  return (
    <div className="min-h-screen">
      <Header
        title={topic.title}
        onBack={onBack}
        progress
        current={currentIdx + (answered ? 1 : 0)}
        total={total}
        correct={correct}
        wrong={wrong}
      />

      <style>{`
        @keyframes fillRing {
          from { stroke-dashoffset: 100.5; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div key={cardKey} className="card-enter">
          {/* Question card */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: '#0f1433', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-start gap-3 flex-1">
                <span
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: topic.accent + 'cc', boxShadow: `0 2px 8px ${topic.accent}44` }}
                >
                  {currentIdx + 1}
                </span>
                <p className="text-base leading-relaxed" style={{ color: '#ecedf8' }}>{current.question}</p>
              </div>
              <button
                onClick={() => onToggleBookmark(current.id)}
                className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-[#141a3c]"
              >
                {isBookmarked(current.id)
                  ? <BookmarkCheck size={16} style={{ color: '#f59e0b' }} />
                  : <Bookmark size={16} style={{ color: '#4a4e80' }} />
                }
              </button>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {current.options.map((opt, i) => {
                const isCorrect = opt === current.correct_answer
                const isPicked = opt === selected

                let style = {}
                let cls = 'opt-btn flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm border transition-all text-left w-full'

                if (!answered) {
                  style = { background: '#141a3c', borderColor: 'rgba(99,102,241,0.18)', color: '#ecedf8' }
                } else if (isCorrect) {
                  style = { background: 'rgba(34,197,94,0.12)', borderColor: '#22c55e', color: '#bbf7d0', cursor: 'default' }
                  cls = cls.replace('opt-btn', '') + ' cursor-default'
                } else if (isPicked) {
                  style = { background: 'rgba(244,63,94,0.12)', borderColor: '#f43f5e', color: '#fecdd3', cursor: 'default' }
                  cls = cls.replace('opt-btn', '') + ' cursor-default'
                } else {
                  style = { background: 'rgba(20,26,60,0.4)', borderColor: 'rgba(99,102,241,0.08)', color: '#4a4e80', cursor: 'default' }
                  cls = cls.replace('opt-btn', '') + ' cursor-default'
                }

                return (
                  <button
                    key={i}
                    onClick={() => pick(opt)}
                    disabled={answered}
                    className={cls}
                    style={style}
                  >
                    <span
                      className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                      style={
                        answered && isCorrect ? { background: '#22c55e', color: '#fff', boxShadow: '0 0 10px rgba(34,197,94,0.5)' }
                        : answered && isPicked  ? { background: '#f43f5e', color: '#fff', boxShadow: '0 0 10px rgba(244,63,94,0.4)' }
                        : { background: '#1e2450', color: '#7879c0' }
                      }
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {answered && isCorrect && <CheckCircle2 size={16} style={{ color: '#22c55e' }} className="shrink-0" />}
                    {answered && isPicked && !isCorrect && <AlertCircle size={16} style={{ color: '#f43f5e' }} className="shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation + Next */}
          {answered && (
            <div className="slide-in flex flex-col gap-3">
              {/* Explanation */}
              <div
                className="rounded-2xl p-4"
                style={{ background: '#0a0e28', border: '1px solid rgba(99,102,241,0.18)' }}
              >
                <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#22d3ee' }}>
                  <Lightbulb size={13} /> ব্যাখ্যা
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#7879c0' }}>{current.explanation_bn}</p>
              </div>

              {/* Why others are wrong */}
              <div
                className="rounded-2xl p-4"
                style={{ background: '#0a0e28', border: '1px solid rgba(99,102,241,0.18)' }}
              >
                <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#f43f5e' }}>
                  <XCircle size={13} /> কেন অন্য উত্তরগুলো ভুল
                </p>
                <div className="flex flex-col gap-2">
                  {current.options
                    .filter(opt => opt !== current.correct_answer)
                    .map((opt, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <XCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#f43f5e55' }} />
                        <span style={{ color: '#4a4e80' }}>{opt}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Next / auto-advance */}
              {isCorrectAnswer ? (
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <CountdownRing />
                  <span className="text-sm font-medium" style={{ color: '#22c55e' }}>সঠিক! পরের প্রশ্নে যাচ্ছি...</span>
                </div>
              ) : (
                <button
                  onClick={advance}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: topic.accent, boxShadow: `0 4px 20px ${topic.accent}44` }}
                >
                  পরবর্তী প্রশ্ন <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
