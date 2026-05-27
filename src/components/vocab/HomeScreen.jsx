import { BookMarked, Star, Bookmark, ShieldCheck, Zap } from 'lucide-react'

export default function VocabHomeScreen({ topics, mastered, important, onSelectTopic, onExam, onNailed, onImportant, onBackup }) {
  const totalNailed    = topics.reduce((s, t) => s + t.questions.filter((_, i) => mastered.has(`${t.id}__${i}`)).length, 0)
  const totalImportant = topics.reduce((s, t) => s + t.questions.filter((_, i) => important?.has(`${t.id}__${i}`)).length, 0)

  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><BookMarked size={22} /></div>
          <span className="logo-title">Vocabulary</span>
        </div>
        <p className="home-sub">English Word Meanings — A to Z</p>
      </header>

      <div className="home-action-row home-action-row--3">
        <button className="action-card exam-card" onClick={onExam}>
          <div className="ac-shine" aria-hidden="true" />
          <div className="ac-body">
            <div className="ac-icon-wrap ac-icon-wrap--exam">
              <Zap size={22} className="ac-icon" />
            </div>
            <div className="ac-label">Exam Mode</div>
            <div className="ac-sub">Test yourself</div>
          </div>
          <div className="ac-footer ac-footer--exam">Start <span className="ac-arrow">→</span></div>
        </button>

        <button className="action-card nailed-card" onClick={onNailed}>
          <div className="ac-shine" aria-hidden="true" />
          <div className="ac-body">
            <div className="ac-icon-wrap ac-icon-wrap--nailed">
              <Star size={20} fill="currentColor" className="ac-icon" />
            </div>
            <div className="ac-label">Nailed It</div>
            <div className="ac-sub">{totalNailed} saved</div>
          </div>
          <div className="ac-footer ac-footer--nailed">View <span className="ac-arrow">→</span></div>
        </button>

        <button className="action-card important-card" onClick={onImportant}>
          <div className="ac-shine" aria-hidden="true" />
          <div className="ac-body">
            <div className="ac-icon-wrap ac-icon-wrap--important">
              <Bookmark size={20} fill="currentColor" className="ac-icon" />
            </div>
            <div className="ac-label">Important</div>
            <div className="ac-sub">{totalImportant} saved</div>
          </div>
          <div className="ac-footer ac-footer--important">View <span className="ac-arrow">→</span></div>
        </button>
      </div>

      <div className="backup-trigger-row">
        <button className="backup-trigger-btn" onClick={onBackup}>
          <ShieldCheck size={13} /> Backup & Restore
        </button>
      </div>

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
