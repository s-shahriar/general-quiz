import { Moon, Sun } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BackupModal from './components/BackupModal.jsx'
import { ImportantProvider, useImportantContext } from './contexts/ImportantContext.jsx'
import { MasteredProvider, useMasteredContext } from './contexts/MasteredContext.jsx'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext.jsx'
import { ALL_TOPICS } from './data/index.js'

const HomeScreen       = lazy(() => import('./components/HomeScreen.jsx'))
const ModeSelect       = lazy(() => import('./components/ModeSelect.jsx'))
const QuizMode         = lazy(() => import('./components/QuizMode.jsx'))
const StudyMode        = lazy(() => import('./components/StudyMode.jsx'))
const GkStudyMode      = lazy(() => import('./components/GkStudyMode.jsx'))
const ExamConfig       = lazy(() => import('./components/ExamConfig.jsx'))
const ExamMode         = lazy(() => import('./components/ExamMode.jsx'))
const NailedScreen     = lazy(() => import('./components/NailedScreen.jsx'))
const ImportantScreen  = lazy(() => import('./components/ImportantScreen.jsx'))
const UtilityHome      = lazy(() => import('./components/utility/HomeScreen.jsx'))
const UtilityMathFormulas = lazy(() => import('./components/utility/MathFormulas.jsx'))
const UtilityFinancialTerms = lazy(() => import('./components/utility/FinancialTerms.jsx'))
const VocabApp         = lazy(() => import('./components/vocab/VocabApp.jsx'))

export default function App() {
  return (
    <ThemeProvider>
      <MasteredProvider>
        <ImportantProvider>
          <AppRoutes />
        </ImportantProvider>
      </MasteredProvider>
    </ThemeProvider>
  )
}

function AppRoutes() {
  const { theme, toggleTheme } = useThemeContext()
  const { value: mastered, restore: restoreMastered } = useMasteredContext()
  const { value: important, restore: restoreImportant } = useImportantContext()
  const location = useLocation()
  const [showBackup, setShowBackup] = useState(false)

  const isGeneralHome = location.pathname === '/' ||
    location.pathname === '/bangla-grammer' ||
    location.pathname === '/english-grammer' ||
    location.pathname === '/sahitto' ||
    location.pathname === '/gk'

  const showNav = isGeneralHome ||
    location.pathname === '/vocabulary' ||
    location.pathname === '/utility'

  const handleRestore = (nailedArr, importantArr) => {
    restoreMastered(nailedArr)
    restoreImportant(importantArr)
  }

  return (
    <div className="app-root">
      <div className="bg-canvas" aria-hidden="true">
        {isGeneralHome && <div className="bg-aurora" />}
        <div className="bg-grid" />
      </div>

      {showNav && (
        <div className="module-nav-bar anim-fade">
          <div className="module-nav-links">
            {[
              { path: '/',              label: 'General' },
              { path: '/vocabulary',    label: 'Vocabulary' },
              { path: '/utility',       label: 'Utility' },
            ].map(({ path, label }) => {
              const isActive = location.pathname === path ||
                (path === '/' && (location.pathname === '/bangla-grammer' || location.pathname === '/english-grammer' || location.pathname === '/sahitto' || location.pathname === '/gk' || location.pathname.startsWith('/topic') || location.pathname === '/exam' || location.pathname.startsWith('/exam/') || location.pathname === '/nailed' || location.pathname === '/important')) ||
                (path === '/vocabulary' && location.pathname.startsWith('/vocabulary')) ||
                (path === '/utility' && (location.pathname === '/math' || location.pathname === '/financial'))
              return (
                <a
                  key={path}
                  className={`module-nav-item ${isActive ? 'active' : ''}`}
                  href={path}
                  onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }}
                >
                  {label}
                </a>
              )
            })}
          </div>
          <button className="theme-toggle-nav" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      )}

      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomeScreen activeGroup="bangla" onBackup={() => setShowBackup(true)} />} />
          <Route path="/bangla-grammer" element={<HomeScreen activeGroup="bangla" onBackup={() => setShowBackup(true)} />} />
          <Route path="/english-grammer" element={<HomeScreen activeGroup="english" onBackup={() => setShowBackup(true)} />} />
          <Route path="/sahitto" element={<HomeScreen activeGroup="sahitya" onBackup={() => setShowBackup(true)} />} />
          <Route path="/gk" element={<HomeScreen activeGroup="gk" onBackup={() => setShowBackup(true)} />} />
          <Route path="/topic/:topicId" element={<ModeSelect />} />
          <Route path="/topic/:topicId/quiz" element={<QuizMode />} />
          <Route path="/topic/:topicId/study" element={<StudyMode />} />
          <Route path="/topic/:topicId/notes" element={<GkStudyMode />} />
          <Route path="/exam" element={<ExamConfig />} />
          <Route path="/exam/run" element={<ExamMode />} />
          <Route path="/nailed" element={<NailedScreen />} />
          <Route path="/important" element={<ImportantScreen />} />
          <Route path="/utility" element={<UtilityHome />} />
          <Route path="/math" element={<UtilityMathFormulas />} />
          <Route path="/financial" element={<UtilityFinancialTerms />} />
          <Route path="/vocabulary" element={<VocabApp />} />
          <Route path="/vocabulary/*" element={<VocabApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

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
