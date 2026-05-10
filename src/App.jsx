import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { BANGLA_TOPICS, ENGLISH_TOPICS, ALL_TOPICS } from './data/index.js'
import HomeScreen   from './components/HomeScreen.jsx'
import ModeSelect   from './components/ModeSelect.jsx'
import QuizMode     from './components/QuizMode.jsx'
import StudyMode    from './components/StudyMode.jsx'
import ExamConfig   from './components/ExamConfig.jsx'
import ExamMode     from './components/ExamMode.jsx'
import NailedScreen from './components/NailedScreen.jsx'

function loadMastered() {
  try { return new Set(JSON.parse(localStorage.getItem('gq-nailed') ?? '[]')) }
  catch { return new Set() }
}
function saveMastered(set) {
  localStorage.setItem('gq-nailed', JSON.stringify([...set]))
}

export default function App() {
  const [screen, setScreen]               = useState('home')
  const [activeGroup, setActiveGroup]     = useState('bangla')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [examData, setExamData]           = useState(null)
  const [theme, setTheme]                 = useState(() => localStorage.getItem('gq-theme') || 'light')
  const [mastered, setMastered]           = useState(loadMastered)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gq-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const goHome = () => { setScreen('home'); setSelectedTopic(null); setExamData(null) }

  const nail   = (qid) => setMastered(prev => { const n = new Set(prev); n.add(qid);    saveMastered(n); return n })
  const unnail = (qid) => setMastered(prev => { const n = new Set(prev); n.delete(qid); saveMastered(n); return n })

  return (
    <div className="app-root">
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-aurora" />
        <div className="bg-grid" />
      </div>

      {screen === 'home' && (
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      )}

      {screen === 'home' && (
        <HomeScreen
          banglaTopic={BANGLA_TOPICS}
          englishTopics={ENGLISH_TOPICS}
          mastered={mastered}
          activeGroup={activeGroup}
          onGroupChange={setActiveGroup}
          onSelectTopic={(t) => { setSelectedTopic(t); setScreen('mode') }}
          onExam={() => setScreen('exam_config')}
          onNailed={() => setScreen('nailed')}
          onUnnail={unnail}
        />
      )}
      {screen === 'nailed' && (
        <NailedScreen
          topics={ALL_TOPICS}
          mastered={mastered}
          onUnnail={unnail}
          onHome={goHome}
        />
      )}
      {screen === 'mode' && (
        <ModeSelect
          topic={selectedTopic}
          onQuiz={() => setScreen('quiz')}
          onStudy={() => setScreen('study')}
          onBack={goHome}
        />
      )}
      {screen === 'quiz' && (
        <QuizMode
          key={selectedTopic.id + '-quiz'}
          topic={selectedTopic}
          mastered={mastered}
          onNail={nail}
          onUnnail={unnail}
          onBack={() => setScreen('mode')}
          onHome={goHome}
        />
      )}
      {screen === 'study' && (
        <StudyMode
          key={selectedTopic.id + '-study'}
          topic={selectedTopic}
          mastered={mastered}
          onNail={nail}
          onBack={() => setScreen('mode')}
          onHome={goHome}
        />
      )}
      {screen === 'exam_config' && (
        <ExamConfig
          banglaTopic={BANGLA_TOPICS}
          englishTopics={ENGLISH_TOPICS}
          onStart={(data) => { setExamData(data); setScreen('exam') }}
          onBack={goHome}
        />
      )}
      {screen === 'exam' && examData && (
        <ExamMode
          key={examData.label + examData.questions.length}
          questions={examData.questions}
          label={examData.label}
          mastered={mastered}
          onNail={nail}
          onUnnail={unnail}
          onHome={goHome}
        />
      )}
    </div>
  )
}
