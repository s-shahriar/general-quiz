import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, ALL_TOPICS } from './data/index.js'
import HomeScreen      from './components/HomeScreen.jsx'
import ModeSelect      from './components/ModeSelect.jsx'
import QuizMode        from './components/QuizMode.jsx'
import StudyMode       from './components/StudyMode.jsx'
import ExamConfig      from './components/ExamConfig.jsx'
import ExamMode        from './components/ExamMode.jsx'
import NailedScreen    from './components/NailedScreen.jsx'
import ImportantScreen from './components/ImportantScreen.jsx'
import BackupModal     from './components/BackupModal.jsx'

function loadMastered() {
  try { return new Set(JSON.parse(localStorage.getItem('gq-nailed') ?? '[]')) }
  catch { return new Set() }
}
function saveMastered(set) {
  localStorage.setItem('gq-nailed', JSON.stringify([...set]))
}

function loadImportant() {
  try { return new Set(JSON.parse(localStorage.getItem('gq-important') ?? '[]')) }
  catch { return new Set() }
}
function saveImportant(set) {
  localStorage.setItem('gq-important', JSON.stringify([...set]))
}

export default function App() {
  const [screen, setScreen]               = useState('home')
  const [activeGroup, setActiveGroup]     = useState('bangla')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [examData, setExamData]           = useState(null)
  const [theme, setTheme]                 = useState(() => localStorage.getItem('gq-theme') || 'light')
  const [mastered, setMastered]           = useState(loadMastered)
  const [important, setImportant]         = useState(loadImportant)
  const [showBackup, setShowBackup]       = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gq-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const goHome = () => { setScreen('home'); setSelectedTopic(null); setExamData(null) }

  const nail = (qid) => setMastered(prev => {
    const next = new Set(prev); next.add(qid); saveMastered(next)
    return next
  })
  const unnail = (qid) => setMastered(prev => {
    const next = new Set(prev); next.delete(qid); saveMastered(next)
    return next
  })

  const markImportant = (qid) => setImportant(prev => {
    const next = new Set(prev); next.add(qid); saveImportant(next)
    return next
  })
  const unmarkImportant = (qid) => setImportant(prev => {
    const next = new Set(prev); next.delete(qid); saveImportant(next)
    return next
  })

  const handleRestore = (nailedArr, importantArr) => {
    setMastered(prev => {
      const next = new Set([...prev, ...nailedArr]); saveMastered(next); return next
    })
    setImportant(prev => {
      const next = new Set([...prev, ...importantArr]); saveImportant(next); return next
    })
  }

  return (
    <div className="app-root">
      <div className="bg-canvas" aria-hidden="true">
        {screen === 'home' && <div className="bg-aurora" />}
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
          gkTopics={GK_TOPICS}
          mastered={mastered}
          important={important}
          activeGroup={activeGroup}
          onGroupChange={setActiveGroup}
          onSelectTopic={(t) => { setSelectedTopic(t); setScreen('mode') }}
          onExam={() => setScreen('exam_config')}
          onNailed={() => setScreen('nailed')}
          onImportant={() => setScreen('important')}
          onBackup={() => setShowBackup(true)}
          onUnnail={unnail}
        />
      )}
      {screen === 'important' && (
        <ImportantScreen
          topics={ALL_TOPICS}
          important={important}
          onUnmark={unmarkImportant}
          onHome={goHome}
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
          important={important}
          onNail={nail}
          onUnnail={unnail}
          onMarkImportant={markImportant}
          onUnmarkImportant={unmarkImportant}
          onBack={() => setScreen('mode')}
          onHome={goHome}
        />
      )}
      {screen === 'study' && (
        <StudyMode
          key={selectedTopic.id + '-study'}
          topic={selectedTopic}
          topics={ALL_TOPICS}
          mastered={mastered}
          important={important}
          onNail={nail}
          onMarkImportant={markImportant}
          onUnmarkImportant={unmarkImportant}
          onBack={() => setScreen('mode')}
          onHome={goHome}
          onChangeTopic={(t) => setSelectedTopic(t)}
        />
      )}
      {screen === 'exam_config' && (
        <ExamConfig
          banglaTopic={BANGLA_TOPICS}
          englishTopics={ENGLISH_TOPICS}
          gkTopics={GK_TOPICS}
          important={important}
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
          important={important}
          onNail={nail}
          onUnnail={unnail}
          onMarkImportant={markImportant}
          onUnmarkImportant={unmarkImportant}
          onHome={goHome}
        />
      )}
      {showBackup && (
        <BackupModal
          mastered={mastered}
          important={important}
          topics={ALL_TOPICS}
          onRestore={handleRestore}
          onClose={() => setShowBackup(false)}
        />
      )}
    </div>
  )
}
