import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, ALL_TOPICS } from './data/index.js'

// General Quiz
import HomeScreen      from './components/HomeScreen.jsx'
import ModeSelect      from './components/ModeSelect.jsx'
import QuizMode        from './components/QuizMode.jsx'
import StudyMode       from './components/StudyMode.jsx'
import ExamConfig      from './components/ExamConfig.jsx'
import ExamMode        from './components/ExamMode.jsx'
import NailedScreen    from './components/NailedScreen.jsx'
import ImportantScreen from './components/ImportantScreen.jsx'
import BackupModal     from './components/BackupModal.jsx'

// Utility Kit
import UtilityHome         from './components/utility/HomeScreen.jsx'
import UtilityMathFormulas from './components/utility/MathFormulas.jsx'
import UtilityFinancialTerms from './components/utility/FinancialTerms.jsx'

// ── Persistence ───────────────────────────────────────
function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')) }
  catch { return new Set() }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]))
}

export default function App() {
  // ── Module ──────────────────────────────────────────
  const [activeModule, setActiveModule] = useState(() => {
    const m = localStorage.getItem('gq-active-module')
    return m === 'eee' ? 'general' : (m || 'general')
  })

  // ── Theme ───────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('gq-theme') || 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gq-theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  useEffect(() => {
    localStorage.setItem('gq-active-module', activeModule)
  }, [activeModule])

  // ── General Quiz state ───────────────────────────────
  const [screen, setScreen]               = useState('home')
  const [activeGroup, setActiveGroup]     = useState('bangla')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [examData, setExamData]           = useState(null)
  const [mastered, setMastered]           = useState(() => loadSet('gq-nailed'))
  const [important, setImportant]         = useState(() => loadSet('gq-important'))
  const [showBackup, setShowBackup]       = useState(false)

  function getTopicGroup(topic) {
    if (!topic) return []
    if (BANGLA_TOPICS.some(t => t.id === topic.id)) return BANGLA_TOPICS
    if (ENGLISH_TOPICS.some(t => t.id === topic.id)) return ENGLISH_TOPICS
    return GK_TOPICS
  }

  const nail            = (qid) => setMastered(prev => { const n = new Set(prev); n.add(qid);    saveSet('gq-nailed',    n); return n })
  const unnail          = (qid) => setMastered(prev => { const n = new Set(prev); n.delete(qid); saveSet('gq-nailed',    n); return n })
  const markImportant   = (qid) => setImportant(prev => { const n = new Set(prev); n.add(qid);    saveSet('gq-important', n); return n })
  const unmarkImportant = (qid) => setImportant(prev => { const n = new Set(prev); n.delete(qid); saveSet('gq-important', n); return n })
  const goHome = () => { setScreen('home'); setSelectedTopic(null); setExamData(null) }

  const handleRestore = (nailedArr, importantArr) => {
    setMastered(prev => { const n = new Set([...prev, ...nailedArr]); saveSet('gq-nailed', n); return n })
    setImportant(prev => { const n = new Set([...prev, ...importantArr]); saveSet('gq-important', n); return n })
  }

  // ── Utility Kit state ────────────────────────────────
  const [utilityScreen, setUtilityScreen]       = useState('home')
  const [utilityActiveToolId, setUtilityActiveToolId] = useState(null)
  const openUtilityTool = (id) => { setUtilityActiveToolId(id); setUtilityScreen('tool') }
  const goUtilityHome   = () => { setUtilityActiveToolId(null); setUtilityScreen('home') }

  // ── Module nav visibility ────────────────────────────
  const isHomeActive =
    (activeModule === 'general' && screen === 'home') ||
    (activeModule === 'utility' && utilityScreen === 'home')

  return (
    <div className="app-root">
      <div className="bg-canvas" aria-hidden="true">
        {isHomeActive && <div className="bg-aurora" />}
        <div className="bg-grid" />
      </div>

      {isHomeActive && (
        <div className="module-nav-bar anim-fade">
          <div className="module-nav-links">
            {[
              { id: 'general', label: 'General' },
              { id: 'utility', label: 'Utility' },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={`module-nav-item ${activeModule === id ? 'active' : ''}`}
                onClick={() => setActiveModule(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="theme-toggle-nav" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 1. GENERAL QUIZ MODULE                                             */}
      {/* ================================================================= */}
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
            <ImportantScreen topics={ALL_TOPICS} important={important} onUnmark={unmarkImportant} onHome={goHome} />
          )}
          {screen === 'nailed' && (
            <NailedScreen topics={ALL_TOPICS} mastered={mastered} onUnnail={unnail} onHome={goHome} />
          )}
          {screen === 'mode' && (
            <ModeSelect topic={selectedTopic} onQuiz={() => setScreen('quiz')} onStudy={() => setScreen('study')} onBack={goHome} />
          )}
          {screen === 'quiz' && (
            <QuizMode
              key={selectedTopic.id + '-quiz'}
              topic={selectedTopic}
              topics={getTopicGroup(selectedTopic)}
              mastered={mastered}
              important={important}
              onNail={nail}
              onUnnail={unnail}
              onMarkImportant={markImportant}
              onUnmarkImportant={unmarkImportant}
              onBack={() => setScreen('mode')}
              onHome={goHome}
              onChangeTopic={(t) => setSelectedTopic(t)}
            />
          )}
          {screen === 'study' && (
            <StudyMode
              key={selectedTopic.id + '-study'}
              topic={selectedTopic}
              topics={getTopicGroup(selectedTopic)}
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

      {/* ================================================================= */}
      {/* 2. UTILITY KIT MODULE                                              */}
      {/* ================================================================= */}
      {activeModule === 'utility' && (
        <>
          {utilityScreen === 'home' && <UtilityHome onOpen={openUtilityTool} />}
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
