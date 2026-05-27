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

// EEE Quiz imports
import EEEHome from './components/eee/Home.jsx'
import EEEQuizMode from './components/eee/QuizMode.jsx'
import EEEReviseMode from './components/eee/ReviseMode.jsx'
import EEEResults from './components/eee/Results.jsx'
import { useBookmarks as useEEEBookmarks } from './hooks/eee/useBookmarks.js'
import { TOPICS as EEETOPICS } from './data/eee/topics.js'

// Utility Kit imports
import UtilityHome from './components/utility/HomeScreen.jsx'
import UtilityMathFormulas from './components/utility/MathFormulas.jsx'
import UtilityFinancialTerms from './components/utility/FinancialTerms.jsx'

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
  // Module Switching state
  const [activeModule, setActiveModule] = useState(() => localStorage.getItem('gq-active-module') || 'general')

  // General Quiz state
  const [screen, setScreen]               = useState('home')
  const [activeGroup, setActiveGroup]     = useState('bangla')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [examData, setExamData]           = useState(null)
  const [theme, setTheme]                 = useState(() => localStorage.getItem('gq-theme') || 'light')
  const [mastered, setMastered]           = useState(loadMastered)
  const [important, setImportant]         = useState(loadImportant)
  const [showBackup, setShowBackup]       = useState(false)

  // EEE Quiz state
  const [eeeScreen, setEeeScreen] = useState('home')
  const [eeeActiveTopic, setEeeActiveTopic] = useState(null)
  const [eeeQuizResult, setEeeQuizResult] = useState(null)
  const { bookmarks: eeeBookmarks, toggle: toggleEeeBookmark, isBookmarked: isEeeBookmarked } = useEEEBookmarks()
  const eeeBookmarkCount = Object.keys(eeeBookmarks).length

  // Utility Kit state
  const [utilityScreen, setUtilityScreen] = useState('home')
  const [utilityActiveToolId, setUtilityActiveToolId] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gq-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('gq-active-module', activeModule)
  }, [activeModule])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  
  // General Quiz Handlers
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

  // EEE Quiz Handlers
  function selectEeeTopic(topic, mode) {
    setEeeActiveTopic(topic)
    setEeeScreen(mode)
  }

  function handleEeeQuizFinish(result) {
    setEeeQuizResult(result)
    setEeeScreen('results')
  }

  function goEeeHome() {
    setEeeScreen('home')
    setEeeActiveTopic(null)
    setEeeQuizResult(null)
  }

  // Utility Kit Handlers
  const openUtilityTool = (id) => { setUtilityActiveToolId(id); setUtilityScreen('tool') }
  const goUtilityHome = () => { setUtilityActiveToolId(null); setUtilityScreen('home') }

  const isHomeActive = 
    (activeModule === 'general' && screen === 'home') ||
    (activeModule === 'eee' && eeeScreen === 'home') ||
    (activeModule === 'utility' && utilityScreen === 'home');

  return (
    <div className="app-root">
      <div className="bg-canvas" aria-hidden="true">
        {isHomeActive && <div className="bg-aurora" />}
        <div className="bg-grid" />
      </div>

      {isHomeActive && (
        <div className="module-nav-bar anim-fade">
          <div className="module-nav-links">
            <button
              className={`module-nav-item ${activeModule === 'general' ? 'active' : ''}`}
              onClick={() => setActiveModule('general')}
            >
              General Quiz
            </button>
            <button
              className={`module-nav-item ${activeModule === 'eee' ? 'active' : ''}`}
              onClick={() => setActiveModule('eee')}
            >
              EEE Quiz
            </button>
            <button
              className={`module-nav-item ${activeModule === 'utility' ? 'active' : ''}`}
              onClick={() => setActiveModule('utility')}
            >
              Utility Kit
            </button>
          </div>
          <button className="theme-toggle-nav" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GENERAL QUIZ MODULE                                                    */}
      {/* ========================================================================= */}
      {activeModule === 'general' && (
        <>
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
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. EEE QUIZ MODULE                                                        */}
      {/* ========================================================================= */}
      {activeModule === 'eee' && (
        <>
          {eeeScreen === 'home' && (
            <EEEHome
              onSelectTopic={selectEeeTopic}
              bookmarkCount={eeeBookmarkCount}
            />
          )}
          {eeeScreen === 'quiz' && eeeActiveTopic && (
            <EEEQuizMode
              key={eeeActiveTopic.id + '_quiz'}
              topic={eeeActiveTopic}
              onBack={goEeeHome}
              onFinish={handleEeeQuizFinish}
              isBookmarked={isEeeBookmarked}
              onToggleBookmark={toggleEeeBookmark}
            />
          )}
          {eeeScreen === 'revise' && eeeActiveTopic && (
            <EEEReviseMode
              key={eeeActiveTopic.id + '_revise'}
              topic={eeeActiveTopic}
              topics={EEETOPICS}
              onBack={goEeeHome}
              onChangeTopic={(t) => setEeeActiveTopic(t)}
              isBookmarked={isEeeBookmarked}
              onToggleBookmark={toggleEeeBookmark}
            />
          )}
          {eeeScreen === 'results' && eeeActiveTopic && eeeQuizResult && (
            <EEEResults
              topic={eeeActiveTopic}
              correct={eeeQuizResult.correct}
              wrong={eeeQuizResult.wrong}
              total={eeeQuizResult.total}
              onRetry={() => selectEeeTopic(eeeActiveTopic, 'quiz')}
              onRevise={() => selectEeeTopic(eeeActiveTopic, 'revise')}
              onHome={goEeeHome}
            />
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. UTILITY KIT MODULE                                                     */}
      {/* ========================================================================= */}
      {activeModule === 'utility' && (
        <>
          {utilityScreen === 'home' && (
            <UtilityHome onOpen={openUtilityTool} />
          )}
          {utilityScreen === 'tool' && utilityActiveToolId === 'math_formulas' && (
            <UtilityMathFormulas onBack={goUtilityHome} />
          )}
          {utilityScreen === 'tool' && utilityActiveToolId === 'financial_terms' && (
            <UtilityFinancialTerms onBack={goUtilityHome} />
          )}
        </>
      )}
    </div>
  )
}
