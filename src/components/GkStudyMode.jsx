import { ChevronLeft, Home, Lightbulb, Info, AlertCircle, LayoutGrid, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { GK_TOPICS } from '../data/index.js'
import { useThemeContext } from '../contexts/ThemeContext.jsx'
import CategorySidebar from './CategorySidebar.jsx'

// Render inline **bold** spans as highlighted keywords (the "marked words").
function RichText({ text }) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <mark key={i} className="gk-key">{part.slice(2, -2)}</mark>
      : <span key={i}>{part}</span>
  )
}

const CALLOUT_META = {
  important: { Icon: AlertCircle, label: 'গুরুত্বপূর্ণ' },
  tip:       { Icon: Lightbulb,   label: 'টিপস' },
  note:      { Icon: Info,        label: 'টীকা' },
}

function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="gk-heading"><RichText text={block.text} /></h3>

    case 'fact':
      return <p className="gk-fact"><RichText text={block.text} /></p>

    case 'list':
      return (
        <div className="gk-block">
          {block.title && <div className="gk-block-title">{block.title}</div>}
          <ul className="gk-list">
            {block.items.map((it, i) => <li key={i}><RichText text={it} /></li>)}
          </ul>
        </div>
      )

    case 'table':
      return (
        <div className="gk-block">
          {block.title && <div className="gk-block-title">{block.title}</div>}
          <table className="gk-table">
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  <th><RichText text={row[0]} /></th>
                  <td><RichText text={row[1]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'compare':
      return (
        <div className="gk-block">
          {block.title && <div className="gk-block-title">{block.title}</div>}
          <div className="gk-table-scroll">
            <table className="gk-table gk-compare">
              <thead>
                <tr>
                  <th></th>
                  {block.columns.map((c, i) => <th key={i} className="gk-compare-head"><RichText text={c} /></th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      j === 0
                        ? <th key={j} className="gk-compare-row-label"><RichText text={cell} /></th>
                        : <td key={j}><RichText text={cell} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'callout': {
      const meta = CALLOUT_META[block.variant] || CALLOUT_META.note
      const { Icon, label } = meta
      return (
        <div className={`gk-callout gk-callout-${block.variant || 'note'}`}>
          <div className="gk-callout-head"><Icon size={14} /> {label}</div>
          <p><RichText text={block.text} /></p>
        </div>
      )
    }

    default:
      return null
  }
}

export default function GkStudyMode() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeContext()
  const topic = GK_TOPICS.find(t => t.id === topicId)
  const groups = topic?.study?.groups || []
  const [activeId, setActiveId] = useState(groups[0]?.id)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!topic) return <Navigate to="/" replace />

  const scrollToGroup = (id) => {
    setActiveId(id)
    const el = document.getElementById('gk-group-' + id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="gk-study-page anim-fade" style={{ '--c': topic.color }}>
      <div className="study-topbar">
        <button className="back-btn" onClick={() => navigate('/topic/' + topic.id)}>
          <ChevronLeft size={15} /> Back
        </button>
        <span className="study-title" style={{ color: topic.color }}>{topic.name}</span>
        <div className="topbar-right-actions">
          <button className="study-home-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="study-home-btn" onClick={() => navigate('/')} title="Home"><Home size={16} /></button>
          <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse categories">
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <CategorySidebar
        topics={GK_TOPICS}
        currentTopicId={topic.id}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(t) => navigate('/topic/' + t.id + '/notes')}
      />

      {groups.length > 1 && (
        <div className="gk-group-nav">
          {groups.map(g => (
            <button
              key={g.id}
              className={`gk-group-chip${activeId === g.id ? ' active' : ''}`}
              onClick={() => scrollToGroup(g.id)}
            >
              {g.title}
            </button>
          ))}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="gk-empty">এই ক্যাটাগরিতে এখনো কোনো নোট যোগ করা হয়নি।</div>
      ) : (
        <div className="gk-groups">
          {groups.map(g => (
            <section key={g.id} id={'gk-group-' + g.id} className="gk-group-card">
              <header className="gk-group-head">
                <h2 className="gk-group-title">{g.title}</h2>
                {g.subtitle && <p className="gk-group-sub">{g.subtitle}</p>}
              </header>
              <div className="gk-group-body">
                {g.blocks.map((b, i) => <Block key={i} block={b} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
