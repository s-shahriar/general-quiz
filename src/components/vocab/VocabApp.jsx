import { BookOpen, Brain, ChevronLeft } from 'lucide-react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useImportantContext } from '../../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../../contexts/MasteredContext.jsx'
import { VOCAB_TOPICS } from '../../data/vocabTopics.js'
import { useModuleReady } from '../../data/contentLoader.js'
import ExamMode from '../ExamMode.jsx'
import ImportantScreen from '../ImportantScreen.jsx'
import NailedScreen from '../NailedScreen.jsx'
import QuizMode from '../QuizMode.jsx'
import StudyMode from '../StudyMode.jsx'
import VocabExamConfig from './ExamConfig.jsx'
import VocabHomeScreen from './HomeScreen.jsx'

export default function VocabApp() {
  return (
    <Routes>
      <Route index element={<VocabHomeWrapper />} />
      <Route path=":letterId/*" element={<VocabTopicRoutes />} />
      <Route path="exam" element={<VocabExamConfig />} />
      <Route path="exam/run" element={<VocabExamRun />} />
      <Route path="nailed" element={<VocabNailed />} />
      <Route path="important" element={<VocabImportant />} />
      <Route path="*" element={<Navigate to="/vocabulary" replace />} />
    </Routes>
  )
}

function VocabHomeWrapper() {
  const navigate = useNavigate()
  useModuleReady('vocab') // fetch vocab questions so topic counts / search work
  const { value: mastered } = useMasteredContext()
  const { value: important } = useImportantContext()

  return (
    <VocabHomeScreen
      topics={VOCAB_TOPICS}
      mastered={mastered}
      important={important}
      onSelectTopic={(t) => navigate('/vocabulary/' + t.id)}
      onExam={() => navigate('/vocabulary/exam')}
      onNailed={() => navigate('/vocabulary/nailed')}
      onImportant={() => navigate('/vocabulary/important')}
    />
  )
}

function VocabTopicRoutes() {
  const { letterId } = useParams()
  const navigate = useNavigate()
  const topic = VOCAB_TOPICS.find(t => t.id === letterId)

  if (!topic) return <Navigate to="/vocabulary" replace />

  return (
    <Routes>
      <Route index element={<VocabModeSelect topic={topic} navigate={navigate} />} />
      <Route path="quiz" element={<VocabQuizModeWrapper topic={topic} />} />
      <Route path="study" element={<VocabStudyModeWrapper topic={topic} />} />
    </Routes>
  )
}

function VocabModeSelect({ topic, navigate }) {
  const Icon = topic.icon
  return (
    <div className="mode-page anim-fade">
      <button className="back-btn" onClick={() => navigate('/vocabulary')}>
        <ChevronLeft size={15} /> Back
      </button>
      <div className="mode-topic-hero">
        <div className="mode-icon-circle" style={{ background: `${topic.color}1a`, color: topic.color, boxShadow: `0 8px 40px ${topic.color}30, 0 0 0 1px ${topic.color}20` }}>
          <Icon size={38} />
        </div>
        <div className="mode-topic-name" style={{ color: topic.color }}>{topic.name}</div>
        <div className="mode-topic-meta">{topic.questions.length} questions</div>
      </div>
      <div className="mode-cards">
        <button className="mode-card" onClick={() => navigate('quiz')}>
          <div className="mode-card-icon" style={{ background: `${topic.color}1a`, color: topic.color }}><Brain size={26} /></div>
          <h3>Quiz Mode</h3>
          <p>Answer questions one by one with instant feedback.</p>
          <span className="mode-card-cta" style={{ color: topic.color }}>Start Quiz →</span>
        </button>
        <button className="mode-card" onClick={() => navigate('study')}>
          <div className="mode-card-icon" style={{ background: `${topic.color}1a`, color: topic.color }}><BookOpen size={26} /></div>
          <h3>Study Mode</h3>
          <p>Browse all Q&amp;As at your own pace.</p>
          <span className="mode-card-cta" style={{ color: topic.color }}>Start Reading →</span>
        </button>
      </div>
    </div>
  )
}

function VocabQuizModeWrapper({ topic }) {
  const navigate = useNavigate()
  return (
    <QuizMode
      topic={topic}
      topics={VOCAB_TOPICS}
      onBack={() => navigate('/vocabulary/' + topic.id)}
      onHome={() => navigate('/vocabulary')}
      onChangeTopic={(t) => navigate('/vocabulary/' + t.id + '/quiz')}
    />
  )
}

function VocabStudyModeWrapper({ topic }) {
  const navigate = useNavigate()
  return (
    <StudyMode
      topic={topic}
      topics={VOCAB_TOPICS}
      onBack={() => navigate('/vocabulary/' + topic.id)}
      onHome={() => navigate('/vocabulary')}
      onNailed={() => navigate('/vocabulary/nailed')}
      onChangeTopic={(t) => navigate('/vocabulary/' + t.id + '/study')}
    />
  )
}

function VocabNailed() {
  const navigate = useNavigate()
  const { value: mastered, remove: onUnnail } = useMasteredContext()
  return <NailedScreen topics={VOCAB_TOPICS} mastered={mastered} onUnnail={onUnnail} onHome={() => navigate('/vocabulary')} />
}

function VocabImportant() {
  const navigate = useNavigate()
  const { value: important, remove: onUnmark } = useImportantContext()
  return <ImportantScreen topics={VOCAB_TOPICS} important={important} onUnmark={onUnmark} onHome={() => navigate('/vocabulary')} />
}

function VocabExamRun() {
  const location = useLocation()
  const navigate = useNavigate()
  const { questions, label } = location.state || {}
  if (!questions) return <Navigate to="/vocabulary/exam" replace />
  return (
    <ExamMode
      questions={questions}
      label={label}
      onHome={() => navigate('/vocabulary')}
    />
  )
}
