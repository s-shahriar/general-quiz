import { ArrowRight, Bookmark, ChevronLeft, LayoutGrid, Lightbulb, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { ALL_TOPICS, BANGLA_SAHITYA_TOPICS, BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS } from '../data/index.js'
import { duplicateQidsOf } from '../lib/questionIndex.js'
import { shuffle } from '../lib/utils'
import CategorySidebar from './CategorySidebar.jsx'
import QuizOptions from './shared/QuizOptions'
import ScoreRingScreen from './shared/ScoreRingScreen'

export default function QuizMode({
  topic: topicProp,
  topics: topicGroupProp,
  onBack: onBackProp,
  onHome: onHomeProp,
  onChangeTopic: onChangeTopicProp,
}) {
  const params = useParams()
  const navigate = useNavigate()
  const topicId = topicProp?.id || params.topicId
  const topic = topicProp || ALL_TOPICS.find(t => t.id === topicId)
  const { value: mastered, add: nail, remove: unnail } = useMasteredContext()
  const { value: important, add: markImportant, removeMany: unmarkImportant } = useImportantContext()

  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const questions = useMemo(
    () => topic
      ? shuffle(
          topic.questions
            .map((q, i) => ({ ...q, _origIndex: i }))
            .filter(q => q.options && q.correct_answer)
        )
      : [],
    [topic]
  )

  const [idx, setIdx]           = useState(0)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)

  if (!topic) return <Navigate to="/" replace />

  const goBack   = () => onBackProp ? onBackProp() : navigate('/topic/' + topic.id)
  const goHome   = () => onHomeProp ? onHomeProp() : navigate('/')
  const goTopic  = (t) => onChangeTopicProp ? onChangeTopicProp(t) : navigate('/topic/' + t.id + '/quiz')

  const q    = questions[idx]
  const qid  = q ? `${topic.id}__${q._origIndex}` : null
  const dupeQids = qid ? duplicateQidsOf(qid) : []
  const isNailed = qid ? mastered?.has(qid) : false
  const isImportant = qid ? dupeQids.some(id => important?.has(id)) : false

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
    return <ScoreRingScreen score={score} total={questions.length} title="Quiz Complete!" accentColor={topic.color} onRetry={retry} onHome={goHome} />
  }

  const progress  = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
  const isCorrect = selected === q.correct_answer

  function getTopicGroup(t) {
    if (topicGroupProp) return topicGroupProp
    if (!t) return []
    if (BANGLA_TOPICS.some(x => x.id === t.id))       return BANGLA_TOPICS
    if (ENGLISH_TOPICS.some(x => x.id === t.id))      return ENGLISH_TOPICS
    if (BANGLA_SAHITYA_TOPICS.some(x => x.id === t.id)) return BANGLA_SAHITYA_TOPICS
    return GK_TOPICS
  }

  return (
    <div className="quiz-page anim-fade">
      <div className="quiz-topbar">
        <button className="back-btn" onClick={goBack}>
          <ChevronLeft size={15} /> Back
        </button>
        <span className="quiz-topic-pill" style={{ color: topic.color }}>{topic.shortName || topic.name}</span>
        <div className="topbar-right-actions">
          {getTopicGroup(topic).length > 1 && (
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse topics">
              <LayoutGrid size={16} />
            </button>
          )}
        </div>
      </div>

      <CategorySidebar
        topics={getTopicGroup(topic).map(t => ({
          id: t.id, name: t.name,
          icon: () => <span style={{ fontSize: 14 }}>{t.icon ? <t.icon size={14} /> : '●'}</span>,
          color: t.color
        }))}
        currentTopicId={topic.id}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(t) => goTopic(t)}
      />

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
              <span className="explanation-label" style={{ color: topic.color }}>ব্যাখ্যা</span>
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
                onClick={() => isNailed ? unnail(qid) : nail(qid)}
                title={isNailed ? 'Nailed — click to un-nail' : 'Mark as Nailed It'}
              >
                <Star size={16} fill={isNailed ? 'currentColor' : 'none'} strokeWidth={1.8} />
                {isNailed ? 'Nailed!' : 'Nail It'}
              </button>
              <button
                className={`quiz-important-btn${isImportant ? ' marked' : ''}`}
                onClick={() => isImportant ? unmarkImportant(dupeQids) : markImportant(qid)}
                title={isImportant ? 'Important — click to remove' : 'Mark as Important'}
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
