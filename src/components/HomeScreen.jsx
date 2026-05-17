import { Zap, Star, BookOpenText, Languages, Bookmark, Globe } from 'lucide-react'

export default function HomeScreen({ banglaTopic, englishTopics, gkTopics, onSelectTopic, onExam, onNailed, onImportant, mastered, important, activeGroup, onGroupChange }) {
  const allTopics = activeGroup === 'bangla' ? banglaTopic : activeGroup === 'english' ? englishTopics : gkTopics
  const allTopicsFlat = [...banglaTopic, ...englishTopics, ...gkTopics]
  const totalNailed = allTopicsFlat.reduce((s, t) =>
    s + t.questions.filter((_, i) => mastered.has(`${t.id}__${i}`)).length
  , 0)
  const totalImportant = allTopicsFlat.reduce((s, t) =>
    s + t.questions.filter((_, i) => important?.has(`${t.id}__${i}`)).length
  , 0)

  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><BookOpenText size={22} /></div>
          <span className="logo-title">General Quiz</span>
        </div>
        <p className="home-sub">বাংলা, English ও সাধারণ জ্ঞান Practice</p>

        <div className="module-toggle">
          <button className={`module-btn${activeGroup === 'bangla' ? ' active' : ''}`} onClick={() => onGroupChange('bangla')}>
            <Languages size={15} /> বাংলা ব্যাকরণ
          </button>
          <button className={`module-btn${activeGroup === 'english' ? ' active' : ''}`} onClick={() => onGroupChange('english')}>
            <Languages size={15} /> English Grammar
          </button>
          <button className={`module-btn${activeGroup === 'gk' ? ' active' : ''}`} onClick={() => onGroupChange('gk')}>
            <Globe size={15} /> সাধারণ জ্ঞান
          </button>
        </div>
      </header>

      {/* Action row */}
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
          <div className="ac-footer ac-footer--exam">
            Start <span className="ac-arrow">→</span>
          </div>
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
          <div className="ac-footer ac-footer--nailed">
            View <span className="ac-arrow">→</span>
          </div>
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
          <div className="ac-footer ac-footer--important">
            View <span className="ac-arrow">→</span>
          </div>
        </button>
      </div>

      <p className="section-label">
        {activeGroup === 'bangla' ? 'বাংলা ব্যাকরণ — টপিক বেছে নাও' : activeGroup === 'english' ? 'English Grammar — Choose a Topic' : 'সাধারণ জ্ঞান — টপিক বেছে নাও'}
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
