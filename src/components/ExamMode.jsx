import { ArrowRight, Bookmark, Flame, Lightbulb, OctagonX, Star } from 'lucide-react'
import TopbarActions from './shared/TopbarActions.jsx'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { useWeakContext } from '../contexts/WeakContext.jsx'
import { uidOf } from '../lib/qid.js'
import QuizOptions from './shared/QuizOptions'
import ScoreRingScreen from './shared/ScoreRingScreen'
import DeleteButton from './shared/DeleteButton.jsx'
import MoreMenu from './shared/MoreMenu.jsx'
import NoteControl from './shared/NoteControl.jsx'
import NoteEditor from './shared/NoteEditor.jsx'
import { useNoteEditor } from './shared/useNoteEditor.js'
import Highlightable from './shared/Highlightable.jsx'
import { guardHighlightClick } from '../lib/textAnchor.js'
import { useHighlights } from '../contexts/HighlightContext.jsx'

export default function ExamMode({
  questions: questionsProp,
  label: labelProp,
  onHome: onHomeProp,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { value: mastered, add: onNail, remove: onUnnail } = useMasteredContext()
  const { value: important, add: onMarkImportant, remove: onUnmarkImportant } = useImportantContext()
  const { value: weak, add: onMarkWeak, remove: onUnmarkWeak } = useWeakContext()

  const routeState = location.state || {}
  const examList = questionsProp || routeState.questions
  const [removed, setRemoved] = useState(() => new Set())
  const questions = examList && (removed.size ? examList.filter(x => !removed.has(x._id)) : examList)
  const label = labelProp || routeState.label

  const [idx, setIdx]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)
  const [stopConfirm, setStopConfirm] = useState(false)

  const goHome = () => onHomeProp ? onHomeProp() : navigate('/')

  // Saved highlights and the note editor, read here with the rest of the
  // hooks — they must run before the early return below or the hook order
  // changes between renders. `q`/`qid` are computed early (null-safe) for the
  // same reason: useNoteEditor(qid) can't wait for the guard.
  const { getFor } = useHighlights()
  const q    = questions?.[idx]
  const qid  = q ? uidOf(q) : null
  const noteEditor = useNoteEditor(qid)

  if (!questions) return <Navigate to="/exam" replace />

  // Block key 'explanation' — an MCQ answer has one text block, no index.
  const hlExp = qid ? getFor(qid).filter(h => h.block === 'explanation') : undefined
  // The question is highlightable too, as its own block on the same uid.
  const hlQ = qid ? getFor(qid).filter(h => h.block === 'q') : undefined
  const isNailed = qid ? mastered?.has(qid) : false
  const isImportant = qid ? important?.has(qid) : false
  const isWeak = qid ? weak?.has(qid) : false

  const pick = (key) => {
    if (revealed) return
    setSelected(key); setRevealed(true)
    if (key === q.correct_answer) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= questions.length) { setDone(true); return }
    setIdx(i => i + 1); setSelected(null); setRevealed(false)
  }

  // Deleting a question mid-exam takes it out of the run: the total drops by
  // one, a point already scored on it is taken back, and the next question
  // slides into place — the exam carries on as if it had never been in it.
  const dropCurrent = () => {
    const rest = questions.length - 1
    if (revealed && selected === q.correct_answer) setScore(s => s - 1)
    setRemoved(r => new Set(r).add(q._id))
    setSelected(null); setRevealed(false)
    if (idx >= rest) { setIdx(Math.max(0, rest - 1)); setDone(true) }
  }

  const retry = () => { setIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false) }

  const handleStop = () => {
    if (stopConfirm) { goHome(); return }
    setStopConfirm(true)
    setTimeout(() => setStopConfirm(false), 3000)
  }

  if (!q || done) {
    return <ScoreRingScreen score={score} total={questions.length} title="Exam Complete!" label={`${label} · ${questions.length} Q`} onRetry={retry} onHome={goHome} />
  }

  const progress  = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
  const isCorrect = selected === q.correct_answer
  const accent = 'var(--accent)'

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
        <TopbarActions />
      </div>

      <div className="quiz-progress-wrap">
        <div className="quiz-progress-header">
          <span className="quiz-qnum">
            Question {idx + 1} of {questions.length}
          </span>
          <span className="quiz-pct">{Math.round(progress)}%</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ '--progress': progress / 100, background: accent }} />
        </div>
      </div>

      <div className="quiz-card anim-slide">
        {qid && (
          <div className="quiz-note-row">
            <NoteControl uid={qid} noteEditor={noteEditor} />
          </div>
        )}
        <div className="hl-q-root" data-hl-root={qid || undefined} onClick={qid ? guardHighlightClick : undefined}>
          <Highlightable as="div" className="quiz-question" block="q" html={q.question} highlights={hlQ} />
        </div>

        <QuizOptions options={q.options} correctAnswer={q.correct_answer} selected={selected} revealed={revealed} accentColor={accent} onPick={pick} />

        {revealed && (
          <div className="quiz-revealed-actions">
            <div className="quiz-mark-btns">
              <button
                className={`quiz-nail-btn${isNailed ? ' nailed' : ''}`}
                onClick={() => isNailed ? onUnnail(qid) : onNail(qid)}
              >
                <Star size={16} fill={isNailed ? 'currentColor' : 'none'} strokeWidth={1.8} />
                <span className="qmark-label">{isNailed ? 'Nailed!' : 'Nail It'}</span>
              </button>
              <button
                className={`quiz-important-btn${isImportant ? ' marked' : ''}`}
                onClick={() => isImportant ? onUnmarkImportant(qid) : onMarkImportant(qid)}
              >
                <Bookmark size={16} fill={isImportant ? 'currentColor' : 'none'} strokeWidth={1.8} />
                <span className="qmark-label">{isImportant ? 'Saved!' : 'Important'}</span>
              </button>
              {isImportant && !isNailed && (
                <button
                  className={`quiz-weak-btn${isWeak ? ' marked' : ''}`}
                  onClick={() => isWeak ? onUnmarkWeak(qid) : onMarkWeak(qid)}
                >
                  <Flame size={16} fill={isWeak ? 'currentColor' : 'none'} strokeWidth={1.8} />
                  <span className="qmark-label">{isWeak ? 'Weak!' : 'Weak'}</span>
                </button>
              )}
              {q._id && (
                <MoreMenu className="quiz-nail-btn">
                  <DeleteButton question={q} className="more-menu-item" size={14} onDeleted={dropCurrent} />
                </MoreMenu>
              )}
            </div>
            <button className="quiz-next-btn" onClick={next}>
              {idx + 1 >= questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {noteEditor.open && (
          <NoteEditor
            initial={noteEditor.note}
            onSave={noteEditor.save}
            onRemove={noteEditor.remove}
            onClose={noteEditor.closeEditor}
          />
        )}

        {revealed && q.explanation && (
          <div className="explanation-box anim-slide" data-hl-root={qid || undefined} style={{ '--c': accent }}>
            <div className="explanation-header">
              <Lightbulb size={14} style={{ color: accent, flexShrink: 0 }} />
              <span className="explanation-label" style={{ color: accent }}>ব্যাখ্যা</span>
              <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? '✓ সঠিক' : '✗ ভুল'}
              </span>
            </div>
            <Highlightable as="div" className="explanation-text"
              block="explanation" html={q.explanation} highlights={hlExp} />
          </div>
        )}
      </div>
    </div>
  )
}
