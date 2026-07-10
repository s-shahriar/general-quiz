import { BookMarked } from 'lucide-react'
import ActionCardsRow from '../shared/ActionCardsRow'

export default function VocabHomeScreen({ topics, mastered, important, onSelectTopic, onExam, onNailed, onImportant }) {
  const totalNailed    = mastered.size
  const totalImportant = important?.size ?? 0

  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><BookMarked size={22} /></div>
          <span className="logo-title">Vocabulary</span>
        </div>
        <p className="home-sub">English Word Meanings — A to Z</p>
      </header>

      <ActionCardsRow
        totalNailed={totalNailed}
        totalImportant={totalImportant}
        onExam={onExam}
        onNailed={onNailed}
        onImportant={onImportant}
      />

      <p className="section-label">Choose a letter to start studying</p>
      <main className="topics-grid">
        {topics.map(t => <LetterCard key={t.id} topic={t} onClick={() => onSelectTopic(t)} />)}
      </main>
    </div>
  )
}

function LetterCard({ topic, onClick }) {
  return (
    <button className="topic-card" onClick={onClick} style={{ '--c': topic.color }}>
      <div className="tc-icon vlc-badge">{topic.name}</div>
      <div className="tc-body">
        <span className="tc-name">{topic.name}</span>
        <span className="tc-count">{topic.questions.length} words</span>
      </div>
      <span className="tc-arrow">›</span>
    </button>
  )
}
