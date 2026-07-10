import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, Brain, BookOpen } from 'lucide-react'
import { ALL_TOPICS } from '../data/index.js'
import { useModuleReady } from '../data/contentLoader.js'

export default function ModeSelect() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const topic = ALL_TOPICS.find(t => t.id === topicId)
  const ready = useModuleReady(topic?.module)

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
  return (
    <div className="mode-page anim-fade">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={15} /> All Topics
      </button>

      <div className="mode-topic-hero">
        <div
          className="mode-icon-circle"
          style={{ background: `${topic.color}1a`, color: topic.color, boxShadow: `0 8px 40px ${topic.color}30, 0 0 0 1px ${topic.color}20` }}
        >
          <Icon size={38} />
        </div>
        <div className="mode-topic-name" style={{ color: topic.color }}>{topic.name}</div>
        <div className="mode-topic-meta">{meta}</div>
      </div>

      <div className="mode-cards">
        <button
          className={`mode-card${noMcq ? ' mode-card-disabled' : ''}`}
          onClick={() => !noMcq ? navigate('quiz') : null}
          disabled={noMcq}
        >
          <div className="mode-card-icon" style={{ background: `${topic.color}1a`, color: topic.color }}>
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
          <div className="mode-card-icon" style={{ background: `${topic.color}1a`, color: topic.color }}>
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
    </div>
  )
}
