import { useState, useMemo } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { FIN_CATEGORIES, FIN_CARDS } from '../../data/utility/finTermsData'
import './FinancialTerms.css'

const ALL_CATS = ['সব', ...Object.keys(FIN_CATEGORIES)]

export default function FinancialTerms({ onBack }) {
  return (
    <div className="ft-root">
      <div className="ft-wrap">
        <div className="ft-topbar">
          <button className="back-btn" onClick={onBack}>
            <ChevronLeft size={15} /> হোম
          </button>
          <span className="ft-topbar-title">ফিনান্সিয়াল টার্ম</span>
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
    return FIN_CARDS.filter((c) => {
      const matchCat = activeCat === 'সব' || c.cat === activeCat
      if (!q) return matchCat
      return matchCat && (c.title + c.subtitle + c.body + c.cat).toLowerCase().includes(q)
    })
  }, [search, activeCat])

  return (
    <>
      <div className="ft-filter-wrap">
        {ALL_CATS.map((cat) => {
          const color = FIN_CATEGORIES[cat]
          const isActive = activeCat === cat
          return (
            <button
              key={cat}
              className={`ft-filter-btn${isActive ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
              style={isActive ? { background: color || 'var(--accent)', borderColor: color || 'var(--accent)' } : {}}
            >
              {cat}
            </button>
          )
        })}
      </div>
      <div className="ft-search-wrap">
        <Search className="ft-search-icon" size={15} />
        <input
          className="ft-search-input"
          type="text"
          placeholder="যেকোনো টপিক খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="ft-grid">
        {filtered.length === 0
          ? <div className="ft-no-results"><Search size={16} style={{ opacity: 0.4, marginRight: 6 }} />কোনো ফলাফল পাওয়া যায়নি</div>
          : filtered.map((card) => <TermCard key={card.id} card={card} />)}
      </div>
    </>
  )
}

function TermCard({ card }) {
  const color = FIN_CATEGORIES[card.cat] || 'var(--accent)'
  return (
    <div className="ft-card" style={{ '--card-color': color }}>
      <div className="ft-card-header">
        <div className="ft-card-icon"><card.icon size={18} /></div>
        <div>
          <div className="ft-card-title">{card.title}</div>
          <div className="ft-card-subtitle">{card.subtitle}</div>
        </div>
      </div>
      <div className="ft-card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
    </div>
  )
}
