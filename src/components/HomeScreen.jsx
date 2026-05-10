import { Zap, Star, BookOpenText, Languages } from 'lucide-react'

export default function HomeScreen({ banglaTopic, englishTopics, onSelectTopic, onExam, onNailed, mastered, activeGroup, onGroupChange }) {
  const allTopics = activeGroup === 'bangla' ? banglaTopic : englishTopics
  const totalNailed = [...banglaTopic, ...englishTopics].reduce((s, t) =>
    s + t.questions.filter((_, i) => mastered.has(`${t.id}__${i}`)).length
  , 0)

  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><BookOpenText size={22} /></div>
          <span className="logo-title">General Quiz</span>
        </div>
        <p className="home-sub">বাংলা ও English Grammar Practice</p>

        <div className="module-toggle">
          <button className={`module-btn${activeGroup === 'bangla' ? ' active' : ''}`} onClick={() => onGroupChange('bangla')}>
            <Languages size={15} /> বাংলা ব্যাকরণ
          </button>
          <button className={`module-btn${activeGroup === 'english' ? ' active' : ''}`} onClick={() => onGroupChange('english')}>
            <Languages size={15} /> English Grammar
          </button>
        </div>
      </header>

      {/* Action row */}
      <div className="home-action-row">
        <button className="exam-mode-card" onClick={onExam}>
          <div className="emc-glow" aria-hidden="true" />
          <div className="emc-icon-wrap"><Zap size={22} className="emc-icon" /></div>
          <div className="emc-body">
            <div className="emc-title">Exam Mode</div>
          </div>
          <div className="emc-cta">Start<span className="emc-arrow">→</span></div>
        </button>

        <button className="nailed-mode-card" onClick={onNailed}>
          <div className="nmc-glow" aria-hidden="true" />
          <div className="nmc-icon-wrap">
            <Star size={20} fill="currentColor" className="nmc-icon" />
          </div>
          <div className="nmc-body">
            <div className="nmc-title">Nailed It</div>
            <div className="nmc-count">{totalNailed} question{totalNailed !== 1 ? 's' : ''}</div>
          </div>
          <div className="nmc-cta">View<span className="nmc-arrow">→</span></div>
        </button>
      </div>

      <p className="section-label">
        {activeGroup === 'bangla' ? 'বাংলা ব্যাকরণ — টপিক বেছে নাও' : 'English Grammar — Choose a Topic'}
      </p>
      <main className="topics-grid">
        {allTopics.map(t => <TopicCard key={t.id} topic={t} onClick={() => onSelectTopic(t)} />)}
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
        <span className="tc-count">{topic.questions.length} questions</span>
      </div>
      <span className="tc-arrow">›</span>
    </button>
  )
}
