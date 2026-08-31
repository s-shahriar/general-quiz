import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronDown, Search, Sun, Moon, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeContext } from '../../contexts/ThemeContext.jsx'
import HandToggle from '../shared/HandToggle.jsx'
import { useWrittenDataReady, getWrittenDataCategories, getWrittenDataCards } from '../../data/written/dataTopicLoader.js'
import './WrittenData.css'

export default function WrittenData() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeContext()
  const ready = useWrittenDataReady()

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

        {ready
          ? <RefSection />
          : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>লোড হচ্ছে…</div>}
      </div>
    </div>
  )
}

function RefSection() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('সব')
  const categories = getWrittenDataCategories()
  const cards = getWrittenDataCards()
  const allCats = useMemo(() => ['সব', ...Object.keys(categories)], [categories])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return cards.filter((c) => {
      const matchCat = activeCat === 'সব' || c.cat === activeCat
      if (!q) return matchCat
      return matchCat && (c.title + c.subtitle + c.body + c.cat + (c.tip || '')).toLowerCase().includes(q)
    })
  }, [cards, search, activeCat])

  return (
    <>
      <div className="wd-filter-wrap">
        {allCats.map((cat) => {
          const color = categories[cat]
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
  const color = getWrittenDataCategories()[card.cat] || 'var(--accent)'
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
      <ul className="wd-card-body">
        {card.body.split('<br>').map((line, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </ul>
      {card.issues && <EffectSection kind="issues" items={card.issues} />}
      {card.benefits && <EffectSection kind="benefits" items={card.benefits} />}
      {card.tip && (
        <div className="wd-card-tip">
          <Lightbulb size={13} className="wd-card-tip-label" />
          <span>{card.tip}</span>
        </div>
      )}
    </div>
  )
}

// Folded by default — a card can carry both an issues and a benefits list,
// each unfolds independently so reading one doesn't force-open the other.
function EffectSection({ kind, items }) {
  const [open, setOpen] = useState(false)
  const isIssue = kind === 'issues'
  const Icon = isIssue ? AlertTriangle : CheckCircle2
  const label = isIssue ? 'সমস্যা' : 'সুফল'
  return (
    <div className={`wd-card-effects wd-card-${kind}`}>
      <button
        type="button"
        className="wd-card-effects-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Icon size={12} />
        <span>{label}</span>
        <ChevronDown size={13} className={`wd-card-effects-chevron${open ? ' open' : ''}`} />
      </button>
      {open && <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
    </div>
  )
}
