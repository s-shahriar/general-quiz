import { Moon, Sun } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AccountButton from './components/auth/AccountButton.jsx'
import HandToggle from './components/shared/HandToggle.jsx'
import SyncOverlay from './components/SyncOverlay.jsx'
import SyncStatus from './components/SyncStatus.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { ProgressProvider, useProgressSyncing } from './contexts/ProgressContext.jsx'
import { TrashProvider } from './contexts/TrashContext.jsx'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext.jsx'
import { HandProvider } from './contexts/HandContext.jsx'

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
const WrittenHome      = lazy(() => import('./components/written/HomeScreen.jsx'))
const WrittenData      = lazy(() => import('./components/written/WrittenData.jsx'))
const VocabApp         = lazy(() => import('./components/vocab/VocabApp.jsx'))
const RecycleBinScreen = lazy(() => import('./components/RecycleBinScreen.jsx'))
const AdminScreen      = lazy(() => import('./components/admin/AdminScreen.jsx'))

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HandProvider>
          <ProgressProvider>
            <TrashProvider>
              <AppRoutes />
            </TrashProvider>
          </ProgressProvider>
        </HandProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

function AppRoutes() {
  const { theme, toggleTheme } = useThemeContext()
  const { loading: authLoading } = useAuth()
  const syncing = useProgressSyncing()
  const location = useLocation()

  const isGeneralHome = location.pathname === '/' ||
    location.pathname === '/bangla-grammer' ||
    location.pathname === '/english-grammer' ||
    location.pathname === '/sahitto' ||
    location.pathname === '/gk' ||
    location.pathname === '/livemcq'

  const showNav = isGeneralHome ||
    location.pathname === '/vocabulary' ||
    location.pathname === '/utility' ||
    location.pathname === '/written' ||
    location.pathname === '/written/data'

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
              { path: '/',              label: 'General',    short: 'General' },
              { path: '/vocabulary',    label: 'Vocabulary', short: 'Vocab' },
              { path: '/utility',       label: 'Utility',    short: 'Utility' },
            ].map(({ path, label, short }) => {
              const isActive = location.pathname === path ||
                (path === '/' && (location.pathname === '/bangla-grammer' || location.pathname === '/english-grammer' || location.pathname === '/sahitto' || location.pathname === '/gk' || location.pathname === '/livemcq' || location.pathname.startsWith('/topic') || location.pathname === '/exam' || location.pathname.startsWith('/exam/') || location.pathname === '/nailed' || location.pathname === '/important' || location.pathname.startsWith('/written'))) ||
                (path === '/vocabulary' && location.pathname.startsWith('/vocabulary')) ||
                (path === '/utility' && (location.pathname === '/math' || location.pathname === '/financial'))
              return (
                <a
                  key={path}
                  className={`module-nav-item ${isActive ? 'active' : ''}`}
                  href={path}
                  onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }}
                >
                  <span className="nav-label-full">{label}</span>
                  <span className="nav-label-short">{short}</span>
                </a>
              )
            })}
          </div>
          <div className="topbar-right-actions">
            <AccountButton />
            <HandToggle className="theme-toggle-nav" size={17} />
            <button className="theme-toggle-nav" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomeScreen activeGroup="bangla" />} />
          <Route path="/bangla-grammer" element={<HomeScreen activeGroup="bangla" />} />
          <Route path="/english-grammer" element={<HomeScreen activeGroup="english" />} />
          <Route path="/sahitto" element={<HomeScreen activeGroup="sahitya" />} />
          <Route path="/gk" element={<HomeScreen activeGroup="gk" />} />
          <Route path="/livemcq" element={<HomeScreen activeGroup="livemcq" />} />
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
          <Route path="/written" element={<WrittenHome />} />
          <Route path="/written/data" element={<WrittenData />} />
          <Route path="/vocabulary" element={<VocabApp />} />
          <Route path="/vocabulary/*" element={<VocabApp />} />
          <Route path="/recycle-bin" element={<RecycleBinScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {(authLoading || syncing) && <SyncOverlay />}
      <SyncStatus />
    </div>
  )
}
