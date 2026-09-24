import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import TopbarActions from './shared/TopbarActions.jsx'
import { ChevronLeft, Brain, BookOpen, Bookmark, Flame, Star, ListChecks, X } from 'lucide-react'
import { ALL_TOPICS } from '../data/index.js'
import { homePathForTopic } from '../data/groups.js'
import { useModuleReady } from '../data/contentLoader.js'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { useWeakContext } from '../contexts/WeakContext.jsx'
import { uidOf } from '../lib/qid.js'

export default function ModeSelect() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = ALL_TOPICS.find(t => t.id === topicId)
  const ready = useModuleReady(topic?.module)
  const { value: important } = useImportantContext()
  const { value: mastered } = useMasteredContext()
  const { value: weak } = useWeakContext()
  const [chooser, setChooser] = useState(false)

  if (!topic) return <Navigate to="/" replace />

  const Icon = topic.icon
  const isStudyNotes = !!topic.study           // GK categories carry study notes
  const groupCount = topic.study?.groups?.length || 0
  const qCount = topic.questions.length
  // Only treat a study-notes topic as "no MCQ yet" once its module has loaded.
  const noMcq = isStudyNotes && ready && !qCount
  const meta = isStudyNotes
    ? `${groupCount} টপিক${qCount ? ` · ${qCount} MCQ` : ''}`
    : ready ? `${qCount} questions available` : 'লোড হচ্ছে…'

  // Same pool QuizMode draws from, so the counts shown are what you'll get.
  const quizzable = topic.questions.filter(q => q.options && q.correct_answer)
  let importantCt = 0
  let weakCt = 0
  let nailedCt = 0
  for (const q of quizzable) {
    const id = uidOf(q)
    if (important?.has(id)) importantCt++
    if (weak?.has(id)) weakCt++
    if (mastered?.has(id)) nailedCt++
  }

  // Nothing marked in this topic → nothing to choose between; start straight away.
  const startQuiz = () => {
    if (noMcq) return
    if (ready && (importantCt || nailedCt)) setChooser(true)
    else navigate('quiz')
  }

  return (
    <div className="mode-page anim-fade">
      <div className="study-topbar">
        <button className="back-btn" onClick={() => navigate(homePathForTopic(topic))}>
          <ChevronLeft size={15} /> All Topics
        </button>
        <TopbarActions />
      </div>

      <div className="mode-topic-hero">
        <div
          className="mode-icon-circle"
          style={{ background: `color-mix(in srgb, ${topic.color} 10%, transparent)`, color: topic.color, boxShadow: `0 0 0 1px color-mix(in srgb, ${topic.color} 12%, transparent)` }}
        >
          <Icon size={38} />
        </div>
        <div className="mode-topic-name" style={{ color: topic.color }}>{topic.name}</div>
        <div className="mode-topic-meta">{meta}</div>
      </div>

      <div className="mode-cards">
        <button
          className={`mode-card${noMcq ? ' mode-card-disabled' : ''}`}
          onClick={startQuiz}
          disabled={noMcq}
        >
          <div className="mode-card-icon" style={{ background: `color-mix(in srgb, ${topic.color} 10%, transparent)`, color: topic.color }}>
            <Brain size={26} />
          </div>
          <h3>MCQ Mode</h3>
          <p>{noMcq
            ? 'এই ক্যাটাগরিতে এখনো কোনো MCQ যোগ করা হয়নি।'
            : 'প্রশ্ন একটি একটি করে উত্তর দাও। তাৎক্ষণিক ঠিক/ভুল ফিডব্যাক ও স্কোর।'}</p>
          <span className="mode-card-cta" style={{ color: topic.color }}>
            {noMcq ? 'শীঘ্রই আসছে' : 'Start Quiz →'}
          </span>
        </button>

        <button className="mode-card" onClick={() => navigate(isStudyNotes ? 'notes' : 'study')}>
          <div className="mode-card-icon" style={{ background: `color-mix(in srgb, ${topic.color} 10%, transparent)`, color: topic.color }}>
            <BookOpen size={26} />
          </div>
          <h3>Study Mode</h3>
          <p>{isStudyNotes
            ? 'গুরুত্বপূর্ণ তথ্য নোট আকারে — বোল্ড, টেবিল ও তুলনা দিয়ে রিভিশন-বান্ধব।'
            : 'Browse all Q&As at your own pace. Reveal answers when ready. Great for revision.'}</p>
          <span className="mode-card-cta" style={{ color: topic.color }}>
            {isStudyNotes ? 'নোট পড়ো →' : 'Start Reading →'}
          </span>
        </button>
      </div>

      {chooser && (
        <QuizPoolChooser
          color={topic.color}
          counts={{ all: quizzable.length, important: importantCt, weak: weakCt, nailed: nailedCt }}
          onClose={() => setChooser(false)}
          onPick={(set) => navigate(set === 'all' ? 'quiz' : `quiz?set=${set}`)}
        />
      )}
    </div>
  )
}

const POOLS = [
  { key: 'all', icon: ListChecks, title: 'সব প্রশ্ন', sub: 'পুরো টপিক থেকে' },
  { key: 'important', icon: Bookmark, title: 'শুধু Important', sub: 'যেগুলো Important করে রেখেছো' },
  { key: 'weak', icon: Flame, title: 'শুধু Weak', sub: 'Important-এর মধ্যে যেগুলো এখনো পারো না' },
  { key: 'nailed', icon: Star, title: 'শুধু Nailed It', sub: 'যেগুলো আয়ত্তে এসেছে — ঝালিয়ে নাও' },
]

// Which questions the MCQ quiz draws from. A centred card on desktop, a bottom
// sheet on phones (CSS). Backdrop tap or Esc closes it.
function QuizPoolChooser({ color, counts, onClose, onPick }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="trash-modal-backdrop quiz-pool-backdrop" onClick={onClose}>
      <div
        className="trash-modal quiz-pool-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-pool-title"
        style={{ '--pc': color }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quiz-pool-head">
          <h3 id="quiz-pool-title" className="trash-modal-title">কোন প্রশ্নগুলো থেকে পরীক্ষা দেবে?</h3>
          <button className="cat-sidebar-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="quiz-pool-list">
          {POOLS.map(({ key, icon: PoolIcon, title, sub }) => {
            const n = counts[key]
            return (
              <button key={key} className={`quiz-pool-option pool-${key}`} disabled={!n} onClick={() => onPick(key)}>
                <span className="quiz-pool-icon">
                  <PoolIcon size={17} fill={key === 'all' ? 'none' : 'currentColor'} />
                </span>
                <span className="quiz-pool-text">
                  <span className="quiz-pool-title">{title}</span>
                  <span className="quiz-pool-sub">{n ? sub : 'এখনো কোনো প্রশ্ন নেই'}</span>
                </span>
                <span className="quiz-pool-count">{n}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
