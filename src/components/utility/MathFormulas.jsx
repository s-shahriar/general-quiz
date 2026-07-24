import 'katex/dist/katex.min.css'
import { Bookmark, ChevronLeft, Eye, EyeOff, LayoutGrid, Moon, Star, Sun } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeContext } from '../../contexts/ThemeContext.jsx'
import { useImportantContext } from '../../contexts/ImportantContext.jsx'
import HandToggle from '../shared/HandToggle.jsx'
import { SECTIONS } from '../../data/utility/mathFormulasData'
import CategorySidebar from '../CategorySidebar'
import { CoverProvider } from './math-formulas/MathFormulaHelpers'
import AlgebraSection from './math-formulas/sections/AlgebraSection'
import CircleSection from './math-formulas/sections/CircleSection'
import CurvedSection from './math-formulas/sections/CurvedSection'
import LcmSection from './math-formulas/sections/LcmSection'
import LineSection from './math-formulas/sections/LineSection'
import LogarithmSection from './math-formulas/sections/LogarithmSection'
import PercentageSection from './math-formulas/sections/PercentageSection'
import PncSection from './math-formulas/sections/PncSection'
import ProfitSection from './math-formulas/sections/ProfitSection'
import QuadraticSection from './math-formulas/sections/QuadraticSection'
import QuadSection from './math-formulas/sections/QuadSection'
import RealNumberSection from './math-formulas/sections/RealNumberSection'
import SeriesSection from './math-formulas/sections/SeriesSection'
import SetSection from './math-formulas/sections/SetSection'
import SolidSection from './math-formulas/sections/SolidSection'
import TriangleSection from './math-formulas/sections/TriangleSection'
import TriCenterSection from './math-formulas/sections/TriCenterSection'
import TrigSection from './math-formulas/sections/TrigSection'
import UnitarySection from './math-formulas/sections/UnitarySection'
import './MathFormulas.css'

export default function MathFormulas() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeContext()
  const { value: important } = useImportantContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id)
  const [importantOnly, setImportantOnly] = useState(false)
  const [cover, setCover] = useState(() => {
    try { return localStorage.getItem('mf-cover') === '1' } catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem('mf-cover', cover ? '1' : '0') } catch { /* ignore */ }
  }, [cover])

  // Cover mode also blurs comparison-table cells (.hl) and inline formulas
  // (.mf-fi). Those are static JSX, not components, so we reveal them one at a
  // time via click delegation, and clear all reveals whenever the mode toggles.
  const wrapRef = useRef(null)
  useEffect(() => {
    wrapRef.current?.querySelectorAll('.mf-revealed')
      .forEach(el => el.classList.remove('mf-revealed'))
  }, [cover])
  const onCoverClick = (e) => {
    if (!cover) return
    const el = e.target.closest(
      '.mf-cmp-table:not(.mf-no-cover) td.hl, .mf-fi, .mf-set-box-val, .mf-cv'
    )
    if (el && wrapRef.current?.contains(el)) el.classList.toggle('mf-revealed')
  }

  // Math cards use 'm'-prefixed uids; count only those (the same Set also holds
  // question 'q' uids from the quiz routes).
  const importantCount = useMemo(() => {
    let n = 0
    important.forEach(u => { if (u && u[0] === 'm') n++ })
    return n
  }, [important])

  useEffect(() => {
    if (theme && document.documentElement.dataset.theme !== theme) {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  useEffect(() => {
    const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        setActiveSectionId(e.target.id)
      })
    }, { rootMargin: '-20% 0px -65% 0px' })

    sectionEls.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const topics = SECTIONS.map(s => ({
    id: s.id,
    name: s.label,
    icon: () => <span style={{ fontSize: 14, fontWeight: 'bold' }}>{s.icon}</span>,
    color: s.color
  }))

  return (
    <div className={`mf-root${importantOnly ? ' mf-important-only' : ''}`}>
      <CategorySidebar
        topics={topics}
        currentTopicId={activeSectionId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(t) => scrollTo(t.id)}
      />

      <div className={`mf-wrap${cover ? ' mf-cover-on' : ''}`} ref={wrapRef} onClick={onCoverClick}>
        <div className="mf-topbar">
          <button className="back-btn" onClick={() => navigate('/utility')}>
            <ChevronLeft size={15} /> হোম
          </button>
          <span className="mf-topbar-title">গণিত সূত্র সংকলন</span>
          <div className="topbar-right-actions mf-topbar-actions" style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`mf-cover-btn${cover ? ' on' : ''}`}
              onClick={() => setCover(v => !v)}
              title={cover ? 'সূত্র দেখান (cover mode বন্ধ)' : 'সূত্র ঢেকে নিজেকে যাচাই করুন'}
            >
              {cover ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button
              className={`mf-imp-filter-btn${importantOnly ? ' on' : ''}`}
              onClick={() => setImportantOnly(v => !v)}
              title={importantOnly ? 'সব কার্ড দেখান' : 'শুধু Important দেখান'}
            >
              <Bookmark size={15} fill={importantOnly ? 'currentColor' : 'none'} />
              {importantCount > 0 && <span className="mf-imp-count">{importantCount}</span>}
            </button>
            <HandToggle className="cat-browse-btn" />
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{
                background: 'var(--elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--elevated)'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse categories">
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        <div className="mf-sec-picker">
          {SECTIONS.map(s => (
            <button key={s.id} className="mf-sec-tile" onClick={() => scrollTo(s.id)}>
              <span className="mf-sec-tile-icon">{s.icon}</span>
              <span className="mf-sec-tile-label">{s.label}</span>
            </button>
          ))}
        </div>

        {importantOnly && importantCount === 0 && (
          <div className="mf-empty-important">
            <Star size={40} />
            <p>এখনো কোনো কার্ড Important হিসেবে সেভ করা হয়নি।</p>
            <p className="sub">যেকোনো কার্ডের কোণায় ⭐ বাটনে ক্লিক করে Important করুন।</p>
          </div>
        )}

        {cover && (
          <div className="mf-cover-banner">
            <EyeOff size={15} />
            <span>সূত্র ঢাকা আছে — মনে করার চেষ্টা করে, তারপর <strong>ট্যাপ করে</strong> মিলিয়ে নিন।</span>
          </div>
        )}

        <CoverProvider value={cover}>
        <TriangleSection />
        <TrigSection />
        <TriCenterSection />
        <QuadSection />
        <CircleSection />
        <SolidSection />
        <CurvedSection />
        <AlgebraSection />
        <LineSection />
        <QuadraticSection />
        <LogarithmSection />
        <SeriesSection />
        <PncSection />
        <SetSection />
        <LcmSection />
        <RealNumberSection />
        <ProfitSection />
        <PercentageSection />
        <UnitarySection />
        </CoverProvider>

      </div>
    </div>
  )
}
