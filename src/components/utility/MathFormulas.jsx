import 'katex/dist/katex.min.css'
import { ChevronLeft, LayoutGrid, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SECTIONS } from '../../data/utility/mathFormulasData'
import CategorySidebar from '../CategorySidebar'
import TriangleSection from './math-formulas/sections/TriangleSection'
import TrigSection from './math-formulas/sections/TrigSection'
import TriCenterSection from './math-formulas/sections/TriCenterSection'
import QuadSection from './math-formulas/sections/QuadSection'
import CircleSection from './math-formulas/sections/CircleSection'
import SolidSection from './math-formulas/sections/SolidSection'
import CurvedSection from './math-formulas/sections/CurvedSection'
import AlgebraSection from './math-formulas/sections/AlgebraSection'
import LineSection from './math-formulas/sections/LineSection'
import QuadraticSection from './math-formulas/sections/QuadraticSection'
import LogarithmSection from './math-formulas/sections/LogarithmSection'
import SeriesSection from './math-formulas/sections/SeriesSection'
import PncSection from './math-formulas/sections/PncSection'
import SetSection from './math-formulas/sections/SetSection'
import LcmSection from './math-formulas/sections/LcmSection'
import ProfitSection from './math-formulas/sections/ProfitSection'
import PercentageSection from './math-formulas/sections/PercentageSection'
import UnitarySection from './math-formulas/sections/UnitarySection'
import './MathFormulas.css'

export default function MathFormulas({ onBack, theme, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id)

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
    <div className="mf-root">
      <CategorySidebar
        topics={topics}
        currentTopicId={activeSectionId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(t) => scrollTo(t.id)}
      />

      <div className="mf-wrap">
        <div className="mf-topbar">
          <button className="back-btn" onClick={onBack}>
            <ChevronLeft size={15} /> হোম
          </button>
          <span className="mf-topbar-title">গণিত সূত্র সংকলন</span>
          <div className="topbar-right-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
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
        <ProfitSection />
        <PercentageSection />
        <UnitarySection />

        <div className="mf-footer">
          <p>গণিত সূত্র সংকলন · সব সূত্র একটি পৃষ্ঠায়</p>
          <p className="sub">জ্যামিতি · বীজগণিত · সেট তত্ত্ব · সম্ভাবনা · ধারা · বিন্যাস-সমাবেশ</p>
        </div>

      </div>
    </div>
  )
}
