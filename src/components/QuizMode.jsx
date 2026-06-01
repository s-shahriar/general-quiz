import { useState, useMemo } from 'react'
import { ChevronLeft, ArrowRight, Lightbulb, Star, Bookmark, LayoutGrid } from 'lucide-react'
import CategorySidebar from './CategorySidebar.jsx'
import ScoreRingScreen from './shared/ScoreRingScreen'
import QuizOptions from './shared/QuizOptions'
import { shuffle } from '../lib/utils'

export default function QuizMode({ topic, topics, mastered, important, onNail, onUnnail, onMarkImportant, onUnmarkImportant, onBack, onHome, onChangeTopic }) {
  const questions = useMemo(
    () => shuffle(
      topic.questions
        .map((q, i) => ({ ...q, _origIndex: i }))
        .filter(q => q.options && q.correct_answer)
    ),
    [topic]
  )
  const [idx, setIdx]           = useState(0)
  const [selected, setSelected]   = useState(null)
  const [revealed, setRevealed]   = useState(false)
  const [score, setScore]         = useState(0)
  const [done, setDone]           = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const q    = questions[idx]
  const options = q ? ['a','b','c','d'].filter(k => q.options?.[k]) : []
  const qid  = q ? `${topic.id}__${q._origIndex}` : null
  const isNailed = qid ? mastered?.has(qid) : false
  const isImportant = qid ? important?.has(qid) : false

  const pick = (key) => {
    if (revealed) return
    setSelected(key)
    setRevealed(true)
    if (key === q.correct_answer) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= questions.length) { setDone(true); return }
    setIdx(i => i + 1); setSelected(null); setRevealed(false)
  }

  const retry = () => { setIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false) }

  if (!q || done) {
    return <ScoreRingScreen score={score} total={questions.length} title="Quiz Complete!" accentColor={topic.color} onRetry={retry} onHome={onHome} />
  }

  const progress  = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
  const isCorrect = selected === q.correct_answer

  return (
    <div className="quiz-page anim-fade">
      {topics && onChangeTopic && (
        <CategorySidebar
          topics={topics}
          currentTopicId={topic.id}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={onChangeTopic}
        />
      )}

      <div className="quiz-topbar">
        <button className="back-btn" onClick={onBack}><ChevronLeft size={15} /> Back</button>
        <span className="quiz-topic-pill" style={{ color: topic.color }}>{topic.shortName}</span>
        <div className="topbar-right-actions">
          {topics && onChangeTopic && (
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse categories">
              <LayoutGrid size={16} />
            </button>
          )}
          <span className="quiz-score-pill">{score} pts</span>
        </div>
      </div>

      <div className="quiz-progress-wrap">
        <div className="quiz-progress-header">
          <span className="quiz-qnum">Question {idx + 1} of {questions.length}</span>
          <span className="quiz-pct">{Math.round(progress)}%</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ '--progress': progress / 100, background: topic.color }} />
        </div>
      </div>

      <div className="quiz-card anim-slide">
        <p className="quiz-question">{q.question}</p>

        <QuizOptions options={q.options} correctAnswer={q.correct_answer} selected={selected} revealed={revealed} accentColor={topic.color} onPick={pick} />

        {revealed && q.explanation && (
          <div className="explanation-box anim-slide" style={{ '--c': topic.color }}>
            <div className="explanation-header">
              <Lightbulb size={14} style={{ color: topic.color, flexShrink: 0 }} />
              <span className="explanation-label" style={{ color: topic.color }}>Explanation</span>
              <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? '✓ Correct' : '✗ Wrong'}
              </span>
            </div>
            <p className="explanation-text">{q.explanation}</p>
          </div>
        )}

        {revealed && (
          <div className="quiz-revealed-actions" style={{ flexDirection: 'column' }}>
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
            <button className="quiz-next-btn" onClick={next} style={{ marginTop: 0 }}>
              {idx + 1 >= questions.length ? 'See Results' : 'Next Question'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
