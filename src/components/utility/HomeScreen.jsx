import { Wrench } from 'lucide-react'

const TOOLS = [
  {
    id: 'math_formulas',
    icon: '📐',
    name: 'গণিত সূত্র',
    description: '১২টি বিষয় — সম্পূর্ণ সূত্র সংকলন',
    color: '#f0a500',
  },
  {
    id: 'financial_terms',
    icon: '🏦',
    name: 'ফিনান্সিয়াল টার্ম',
    description: '৫১টি টপিক + ৩৯টি কুইজ প্রশ্ন',
    color: '#22c55e',
  },
]

export default function HomeScreen({ onOpen }) {
  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><Wrench size={22} /></div>
          <span className="logo-title">Utility Kit</span>
        </div>
        <p className="home-sub">Interactive learning tools — pick a module and start</p>
      </header>

      <p className="section-label">Choose a Tool</p>
      <main className="topics-grid">
        {TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={() => onOpen(t.id)} />)}
      </main>
    </div>
  )
}

function ToolCard({ tool, onClick }) {
  return (
    <button className="topic-card" onClick={onClick} style={{ '--c': tool.color }}>
      <div className="tc-icon">{tool.icon}</div>
      <div className="tc-body">
        <span className="tc-name">{tool.name}</span>
        <span className="tc-count">{tool.description}</span>
      </div>
      <span className="tc-arrow">›</span>
    </button>
  )
}
