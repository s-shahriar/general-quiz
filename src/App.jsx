import { Moon, Sun, Trash2 } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AccountButton from './components/auth/AccountButton.jsx'
import SyncOverlay from './components/SyncOverlay.jsx'
import SyncStatus from './components/SyncStatus.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { ProgressProvider, useProgressSyncing } from './contexts/ProgressContext.jsx'
import { TrashProvider } from './contexts/TrashContext.jsx'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext.jsx'

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
const RecycleBinScreen = lazy(() => import('./components/RecycleBinScreen.jsx'))

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ProgressProvider>
          <TrashProvider>
            <AppRoutes />
          </TrashProvider>
        </ProgressProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

function AppRoutes() {
  const navigate = useNavigate()
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
    location.pathname === '/utility'

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
                (path === '/' && (location.pathname === '/bangla-grammer' || location.pathname === '/english-grammer' || location.pathname === '/sahitto' || location.pathname === '/gk' || location.pathname === '/livemcq' || location.pathname.startsWith('/topic') || location.pathname === '/exam' || location.pathname.startsWith('/exam/') || location.pathname === '/nailed' || location.pathname === '/important')) ||
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="theme-toggle-nav" onClick={() => navigate('/recycle-bin')} title="Recycle Bin">
              <Trash2 size={17} />
            </button>
            <AccountButton />
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
          <Route path="/vocabulary" element={<VocabApp />} />
          <Route path="/vocabulary/*" element={<VocabApp />} />
          <Route path="/recycle-bin" element={<RecycleBinScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {(authLoading || syncing) && <SyncOverlay />}
      <SyncStatus />
    </div>
  )
}
