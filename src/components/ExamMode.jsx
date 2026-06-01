import { useState } from 'react'
import { ArrowRight, Lightbulb, OctagonX, Star, Bookmark } from 'lucide-react'
import ScoreRingScreen from './shared/ScoreRingScreen'
import QuizOptions from './shared/QuizOptions'

export default function ExamMode({ questions, label, mastered, important, onNail, onUnnail, onMarkImportant, onUnmarkImportant, onHome }) {
  const [idx, setIdx]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)
  const [stopConfirm, setStopConfirm] = useState(false)

  const handleStop = () => {
    if (stopConfirm) { onHome(); return }
    setStopConfirm(true)
    setTimeout(() => setStopConfirm(false), 3000)
  }

  const q    = questions[idx]
  const opts = q ? ['a','b','c','d'].filter(k => q.options?.[k]) : []
  const qid  = q?._topicId != null ? `${q._topicId}__${q._origIndex}` : null
  const isNailed = qid ? mastered?.has(qid) : false
  const isImportant = qid ? important?.has(qid) : false

  const pick = (key) => {
    if (revealed) return
    setSelected(key); setRevealed(true)
    if (key === q.correct_answer) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= questions.length) { setDone(true); return }
    setIdx(i => i + 1); setSelected(null); setRevealed(false)
  }

  const retry = () => { setIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false) }

  if (!q || done) {
    return <ScoreRingScreen score={score} total={questions.length} title="Exam Complete!" label={`${label} · ${questions.length} Q`} accentColor="#6366f1" onRetry={retry} onHome={onHome} />
  }

  const progress  = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
  const isCorrect = selected === q.correct_answer
  const accent    = q._color ?? '#6366f1'

  return (
    <div className="quiz-page anim-fade">
      <div className="quiz-topbar">
        <div className="exam-mode-pill">
          <span style={{ color: accent }}>Exam</span>
          <span className="exam-topic-tag">{q._label ?? label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="quiz-score-pill">{score} / {idx + (revealed ? 1 : 0)}</span>
          <button className={`exam-stop-btn${stopConfirm ? ' confirm' : ''}`} onClick={handleStop} title="Stop exam">
            <OctagonX size={14} />
            {stopConfirm ? 'Sure?' : 'Stop'}
          </button>
        </div>
      </div>

      <div className="quiz-progress-wrap">
        <div className="quiz-progress-header">
          <span className="quiz-qnum">Question {idx + 1} of {questions.length}</span>
          <span className="quiz-pct">{Math.round(progress)}%</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ '--progress': progress / 100, background: accent }} />
        </div>
      </div>

      <div className="quiz-card anim-slide">
        <p className="quiz-question">{q.question}</p>

        <QuizOptions options={q.options} correctAnswer={q.correct_answer} selected={selected} revealed={revealed} accentColor={accent} onPick={pick} />

        {revealed && q.explanation && (
          <div className="explanation-box anim-slide" style={{ '--c': accent }}>
            <div className="explanation-header">
              <Lightbulb size={14} style={{ color: accent, flexShrink: 0 }} />
              <span className="explanation-label" style={{ color: accent }}>Explanation</span>
              <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? '✓ Correct' : '✗ Wrong'}
              </span>
            </div>
            <p className="explanation-text">{q.explanation}</p>
          </div>
        )}

        {revealed && (
          <div className="quiz-revealed-actions" style={{ flexDirection: 'column' }}>
            {qid && (
              <div className="quiz-mark-btns">
                <button
                  className={`quiz-nail-btn${isNailed ? ' nailed' : ''}`}
                  onClick={() => isNailed ? onUnnail?.(qid) : onNail?.(qid)}
                  title={isNailed ? 'Nailed — click to un-nail' : 'Mark as Nailed It'}
                >
                  <Star size={16} fill={isNailed ? 'currentColor' : 'none'} strokeWidth={1.8} />
                  {isNailed ? 'Nailed!' : 'Nail It'}
                </button>
                <button
                  className={`quiz-important-btn${isImportant ? ' marked' : ''}`}
                  onClick={() => isImportant ? onUnmarkImportant?.(qid) : onMarkImportant?.(qid)}
                  title={isImportant ? 'Important — click to remove' : 'Mark as Important'}
                >
                  <Bookmark size={16} fill={isImportant ? 'currentColor' : 'none'} strokeWidth={1.8} />
                  {isImportant ? 'Saved!' : 'Important'}
                </button>
              </div>
            )}
            <button className="quiz-next-btn" onClick={next} style={{ background: accent, marginTop: 0 }}>
              {idx + 1 >= questions.length ? 'See Results' : 'Next Question'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
