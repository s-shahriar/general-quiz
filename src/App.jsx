import { useState, useEffect, lazy, Suspense } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, BANGLA_SAHITYA_TOPICS, ALL_TOPICS } from './data/index.js'

// General Quiz — eagerly loaded (always needed on first paint)
import HomeScreen      from './components/HomeScreen.jsx'
import ModeSelect      from './components/ModeSelect.jsx'
import QuizMode        from './components/QuizMode.jsx'
import StudyMode       from './components/StudyMode.jsx'
import ExamConfig      from './components/ExamConfig.jsx'
import ExamMode        from './components/ExamMode.jsx'
import NailedScreen    from './components/NailedScreen.jsx'
import ImportantScreen from './components/ImportantScreen.jsx'
import BackupModal     from './components/BackupModal.jsx'

// Utility Kit — FinancialTerms eager, MathFormulas lazy (pulls in KaTeX)
import UtilityHome         from './components/utility/HomeScreen.jsx'
import UtilityFinancialTerms from './components/utility/FinancialTerms.jsx'
const UtilityMathFormulas = lazy(() => import('./components/utility/MathFormulas.jsx'))

// Vocabulary — lazy: entire module + all 22 JSON files load on demand
const VocabApp = lazy(() => import('./components/vocab/VocabApp.jsx'))

// ── Persistence ───────────────────────────────────────
function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')) }
  catch { return new Set() }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]))
}

function ModuleLoader() {
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>Loading…</div>
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  // ── Module ──────────────────────────────────────────
  const [activeModule, setActiveModule] = useState(() => {
    const m = localStorage.getItem('gq-active-module')
    return m === 'eee' ? 'general' : (m || 'general')
  })

  // ── Theme ───────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('gq-theme') || 'light'
    // Apply immediately during initialization to prevent flash
    document.documentElement.dataset.theme = savedTheme
    return savedTheme
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gq-theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  useEffect(() => {
    localStorage.setItem('gq-active-module', activeModule)
  }, [activeModule])

  // ── Shared quiz state ────────────────────────────────
  const [mastered, setMastered] = useState(() => loadSet('gq-nailed'))
  const [important, setImportant] = useState(() => loadSet('gq-important'))

  const nail            = (qid) => setMastered(prev  => { const n = new Set(prev);  n.add(qid);    saveSet('gq-nailed',    n); return n })
  const unnail          = (qid) => setMastered(prev  => { const n = new Set(prev);  n.delete(qid); saveSet('gq-nailed',    n); return n })
  const markImportant   = (qid) => setImportant(prev => { const n = new Set(prev);  n.add(qid);    saveSet('gq-important', n); return n })
  const unmarkImportant = (qid) => setImportant(prev => { const n = new Set(prev);  n.delete(qid); saveSet('gq-important', n); return n })

  const handleRestore = (nailedArr, importantArr) => {
    setMastered(prev  => { const n = new Set([...prev,  ...nailedArr]);    saveSet('gq-nailed',    n); return n })
    setImportant(prev => { const n = new Set([...prev,  ...importantArr]); saveSet('gq-important', n); return n })
  }

  // ── Backup — vocab topics loaded async so they stay out of main bundle ──
  const [showBackup, setShowBackup]           = useState(false)
  const [vocabTopicsCache, setVocabTopicsCache] = useState([])

  const openBackup = async () => {
    if (vocabTopicsCache.length === 0) {
      const { VOCAB_TOPICS } = await import('./data/vocabTopics.js')
      setVocabTopicsCache(VOCAB_TOPICS)
    }
    setShowBackup(true)
  }

  // ── General Quiz state ───────────────────────────────
  const [screen, setScreen]               = useState('home')
  const [activeGroup, setActiveGroup]     = useState('bangla')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [examData, setExamData]           = useState(null)
  const goHome = () => { setScreen('home'); setSelectedTopic(null); setExamData(null); navigate('/') }

  function getTopicGroup(topic) {
    if (!topic) return []
    if (BANGLA_TOPICS.some(t => t.id === topic.id))       return BANGLA_TOPICS
    if (ENGLISH_TOPICS.some(t => t.id === topic.id))      return ENGLISH_TOPICS
    if (BANGLA_SAHITYA_TOPICS.some(t => t.id === topic.id)) return BANGLA_SAHITYA_TOPICS
    return GK_TOPICS
  }

  // ── Vocabulary module state ──────────────────────────
  const [vocabScreen, setVocabScreen]     = useState('home')
  const [vocabTopic, setVocabTopic]       = useState(null)
  const [vocabExamData, setVocabExamData] = useState(null)
  const goVocabHome = () => { setVocabScreen('home'); setVocabTopic(null); setVocabExamData(null); navigate('/') }

  // ── Utility Kit state ────────────────────────────────
  const [utilityScreen, setUtilityScreen]           = useState('home')
  const [utilityActiveToolId, setUtilityActiveToolId] = useState(null)
  const openUtilityTool = (id) => { setUtilityActiveToolId(id); setUtilityScreen('tool') }
  const goUtilityHome   = () => { setUtilityActiveToolId(null); setUtilityScreen('home'); navigate('/') }

  // ── URL routing sync ────────────────────────────────
  useEffect(() => {
    const path = location.pathname

    if (path === '/math') {
      setActiveModule('utility')
      setTimeout(() => {
        setUtilityScreen('tool')
        setUtilityActiveToolId('math_formulas')
      }, 0)
    } else if (path === '/financial') {
      setActiveModule('utility')
      setTimeout(() => {
        setUtilityScreen('tool')
        setUtilityActiveToolId('financial_terms')
      }, 0)
    } else if (path === '/vocabulary') {
      setActiveModule('vocab')
    } else if (path === '/english-grammer') {
      setActiveModule('general')
      setTimeout(() => {
        setScreen('home')
        setActiveGroup('english')
      }, 0)
    } else if (path === '/bangla-grammer') {
      setActiveModule('general')
      setTimeout(() => {
        setScreen('home')
        setActiveGroup('bangla')
      }, 0)
    } else if (path === '/sahitto') {
      setActiveModule('general')
      setTimeout(() => {
        setScreen('home')
        setActiveGroup('bangla_sahitya')
      }, 0)
    } else if (path === '/') {
      // Reset to default when on home
      if (activeModule === 'utility' && utilityScreen !== 'home') {
        goUtilityHome()
      } else if (activeModule === 'vocab' && vocabScreen !== 'home') {
        goVocabHome()
      }
    }
  }, [location.pathname])

  // ── Module nav visibility ────────────────────────────
  const isHomeActive =
    (activeModule === 'general' && screen === 'home') ||
    (activeModule === 'vocab'   && vocabScreen === 'home') ||
    (activeModule === 'utility' && utilityScreen === 'home')

  const backupTopics = [...ALL_TOPICS, ...vocabTopicsCache]

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
              { id: 'general',  label: 'General' },
              { id: 'vocab',    label: 'Vocabulary' },
              { id: 'utility',  label: 'Utility' },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={`module-nav-item ${activeModule === id ? 'active' : ''}`}
                onClick={() => { setActiveModule(id); navigate('/') }}
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
              sahityaTopics={BANGLA_SAHITYA_TOPICS}
              mastered={mastered}
              important={important}
              activeGroup={activeGroup}
              onGroupChange={setActiveGroup}
              onSelectTopic={(t) => { setSelectedTopic(t); setScreen('mode') }}
              onExam={() => setScreen('exam_config')}
              onNailed={() => setScreen('nailed')}
              onImportant={() => setScreen('important')}
              onBackup={openBackup}
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
              sahityaTopics={BANGLA_SAHITYA_TOPICS}
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
        </>
      )}

      {/* ================================================================= */}
      {/* 2. VOCABULARY MODULE — lazy loaded                                 */}
      {/* ================================================================= */}
      {activeModule === 'vocab' && (
        <Suspense fallback={<ModuleLoader />}>
          <VocabApp
            vocabScreen={vocabScreen}
            vocabTopic={vocabTopic}
            vocabExamData={vocabExamData}
            setVocabScreen={setVocabScreen}
            setVocabTopic={setVocabTopic}
            setVocabExamData={setVocabExamData}
            goVocabHome={goVocabHome}
            mastered={mastered}
            important={important}
            nail={nail}
            unnail={unnail}
            markImportant={markImportant}
            unmarkImportant={unmarkImportant}
            onOpenBackup={openBackup}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </Suspense>
      )}

      {/* ================================================================= */}
      {/* 3. UTILITY KIT MODULE                                              */}
      {/* ================================================================= */}
      {activeModule === 'utility' && (
        <>
          {utilityScreen === 'home' && <UtilityHome onOpen={openUtilityTool} />}
          {utilityScreen === 'tool' && utilityActiveToolId === 'math_formulas' && (
            <Suspense fallback={<ModuleLoader />}>
              <UtilityMathFormulas onBack={goUtilityHome} theme={theme} toggleTheme={toggleTheme} />
            </Suspense>
          )}
          {utilityScreen === 'tool' && utilityActiveToolId === 'financial_terms' && (
            <UtilityFinancialTerms onBack={goUtilityHome} theme={theme} toggleTheme={toggleTheme} />
          )}
        </>
      )}

      {/* ── Shared Backup Modal ───────────────────────── */}
      {showBackup && (
        <BackupModal
          mastered={mastered}
          important={important}
          topics={backupTopics}
          onRestore={handleRestore}
          onClose={() => setShowBackup(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/math" element={<AppContent />} />
      <Route path="/financial" element={<AppContent />} />
      <Route path="/vocabulary" element={<AppContent />} />
      <Route path="/english-grammer" element={<AppContent />} />
      <Route path="/bangla-grammer" element={<AppContent />} />
      <Route path="/sahitto" element={<AppContent />} />
      <Route path="*" element={<AppContent />} />
    </Routes>
  )
}
