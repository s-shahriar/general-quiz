import { ArrowRight, Bookmark, Lightbulb, OctagonX, Star } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import QuizOptions from './shared/QuizOptions'
import ScoreRingScreen from './shared/ScoreRingScreen'

export default function ExamMode({
  questions: questionsProp,
  label: labelProp,
  onHome: onHomeProp,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { value: mastered, add: onNail, remove: onUnnail } = useMasteredContext()
  const { value: important, add: onMarkImportant, remove: onUnmarkImportant } = useImportantContext()

  const routeState = location.state || {}
  const questions = questionsProp || routeState.questions
  const label = labelProp || routeState.label

  const [idx, setIdx]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)
  const [stopConfirm, setStopConfirm] = useState(false)

  const goHome = () => onHomeProp ? onHomeProp() : navigate('/')

  if (!questions) return <Navigate to="/exam" replace />

  const q    = questions[idx]
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

  const handleStop = () => {
    if (stopConfirm) { goHome(); return }
    setStopConfirm(true)
    setTimeout(() => setStopConfirm(false), 3000)
  }

  if (!q || done) {
    return <ScoreRingScreen score={score} total={questions.length} title="Exam Complete!" label={`${label} · ${questions.length} Q`} accentColor="#6366f1" onRetry={retry} onHome={goHome} />
  }

  const progress  = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
  const isCorrect = selected === q.correct_answer
  const accent = '#6366f1'

  return (
    <div className="quiz-page anim-fade exam-page">
      <div className="exam-stop-row">
        <button
          className={`exam-stop-btn${stopConfirm ? ' confirm' : ''}`}
          onClick={handleStop}
        >
          <OctagonX size={15} />
          {stopConfirm ? 'Tap again to stop' : 'Stop Exam'}
        </button>
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
              <span className="explanation-label" style={{ color: accent }}>ব্যাখ্যা</span>
              <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? '✓ সঠিক' : '✗ ভুল'}
              </span>
            </div>
            <p className="explanation-text">{q.explanation}</p>
          </div>
        )}

        {revealed && (
          <div className="quiz-revealed-actions">
            <div className="quiz-mark-btns">
              <button
                className={`quiz-nail-btn${isNailed ? ' nailed' : ''}`}
                onClick={() => isNailed ? onUnnail(qid) : onNail(qid)}
              >
                <Star size={16} fill={isNailed ? 'currentColor' : 'none'} strokeWidth={1.8} />
                {isNailed ? 'Nailed!' : 'Nail It'}
              </button>
              <button
                className={`quiz-important-btn${isImportant ? ' marked' : ''}`}
                onClick={() => isImportant ? onUnmarkImportant(qid) : onMarkImportant(qid)}
              >
                <Bookmark size={16} fill={isImportant ? 'currentColor' : 'none'} strokeWidth={1.8} />
                {isImportant ? 'Saved!' : 'Important'}
              </button>
            </div>
            <button className="quiz-next-btn" onClick={next}>
              {idx + 1 >= questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
