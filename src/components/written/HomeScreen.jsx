import { PenSquare, Database } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DATA_CARDS } from '../../data/written/dataTopicData.js'

const TOPICS = [
  {
    id: 'data',
    path: '/written/data',
    icon: Database,
    name: 'Data',
    description: `${DATA_CARDS.length}টি বিষয় — লিখিত পরীক্ষার তথ্য সংকলন`,
    color: '#0ea5e9',
  },
]

export default function WrittenHomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><PenSquare size={22} /></div>
          <span className="logo-title">Written</span>
        </div>
        <p className="home-sub">লিখিত পরীক্ষার জন্য সংগ্রহ করা তথ্য — টপিক ধরে সাজানো</p>
      </header>

      <p className="section-label">Choose a Topic</p>
      <main className="topics-grid">
        {TOPICS.map(t => <TopicCard key={t.id} topic={t} onClick={() => navigate(t.path)} />)}
      </main>
    </div>
  )
}

function TopicCard({ topic, onClick }) {
  const Icon = topic.icon
  return (
    <button className="topic-card" onClick={onClick} style={{ '--c': topic.color }}>
      <div className="tc-icon"><Icon size={20} /></div>
      <div className="tc-body">
        <span className="tc-name">{topic.name}</span>
        <span className="tc-count">{topic.description}</span>
      </div>
      <span className="tc-arrow">›</span>
    </button>
  )
}
