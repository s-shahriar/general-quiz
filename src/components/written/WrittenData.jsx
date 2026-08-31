import { useState, useMemo } from 'react'
import { ChevronLeft, Search, Sun, Moon, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeContext } from '../../contexts/ThemeContext.jsx'
import HandToggle from '../shared/HandToggle.jsx'
import { DATA_CATEGORIES, DATA_CARDS } from '../../data/written/dataTopicData.js'
import './WrittenData.css'

const ALL_CATS = ['সব', ...Object.keys(DATA_CATEGORIES)]

export default function WrittenData() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeContext()

  return (
    <div className="wd-root">
      <div className="wd-wrap">
        <div className="wd-topbar">
          <button className="back-btn" onClick={() => navigate('/written')}>
            <ChevronLeft size={15} /> হোম
          </button>
          <span className="wd-topbar-title">Data</span>
          <div className="topbar-right-actions wd-topbar-actions">
            <HandToggle className="wd-theme-toggle" />
            <button
              className="wd-theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        <RefSection />
      </div>
    </div>
  )
}

function RefSection() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('সব')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return DATA_CARDS.filter((c) => {
      const matchCat = activeCat === 'সব' || c.cat === activeCat
      if (!q) return matchCat
      return matchCat && (c.title + c.subtitle + c.body + c.cat + (c.tip || '')).toLowerCase().includes(q)
    })
  }, [search, activeCat])

  return (
    <>
      <div className="wd-filter-wrap">
        {ALL_CATS.map((cat) => {
          const color = DATA_CATEGORIES[cat]
          const isActive = activeCat === cat
          return (
            <button
              key={cat}
              className={`wd-filter-btn${isActive ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
              style={isActive ? { background: color || 'var(--accent)', borderColor: color || 'var(--accent)' } : {}}
            >
              {cat}
            </button>
          )
        })}
      </div>
      <div className="wd-search-wrap">
        <Search className="wd-search-icon" size={15} />
        <input
          className="wd-search-input"
          type="text"
          placeholder="যেকোনো টপিক খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="wd-grid">
        {filtered.length === 0
          ? <div className="wd-no-results"><Search size={16} style={{ opacity: 0.4, marginRight: 6 }} />কোনো ফলাফল পাওয়া যায়নি</div>
          : filtered.map((card) => <DataCard key={card.id} card={card} />)}
      </div>
    </>
  )
}

function DataCard({ card }) {
  const color = DATA_CATEGORIES[card.cat] || 'var(--accent)'
  return (
    <div className="wd-card" style={{ '--card-color': color }}>
      <div className="wd-card-header">
        <div className="wd-card-icon"><card.icon size={18} /></div>
        <div>
          <div className="wd-card-title-row">
            <span className="wd-card-title">{card.title}</span>
            <span className="wd-card-serial">#{card.id}</span>
          </div>
          <div className="wd-card-subtitle">{card.subtitle}</div>
        </div>
      </div>
      <div className="wd-card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
      {card.tip && (
        <div className="wd-card-tip">
          <Lightbulb size={13} className="wd-card-tip-label" />
          <span>{card.tip}</span>
        </div>
      )}
    </div>
  )
}
