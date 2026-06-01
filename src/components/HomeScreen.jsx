import { BookOpenText, Languages, Globe, ShieldCheck, BookOpen } from 'lucide-react'
import ActionCardsRow from './shared/ActionCardsRow'

export default function HomeScreen({ banglaTopic, englishTopics, gkTopics, sahityaTopics, onSelectTopic, onExam, onNailed, onImportant, onBackup, mastered, important, activeGroup, onGroupChange }) {
  const allTopics = activeGroup === 'bangla' ? banglaTopic : activeGroup === 'english' ? englishTopics : activeGroup === 'sahitya' ? sahityaTopics : gkTopics
  const allTopicsFlat = [...banglaTopic, ...englishTopics, ...gkTopics, ...sahityaTopics]
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
          <button className={`module-btn${activeGroup === 'sahitya' ? ' active' : ''}`} onClick={() => onGroupChange('sahitya')}>
            <BookOpen size={15} /> বাংলা সাহিত্য
          </button>
        </div>
      </header>

      <ActionCardsRow
        totalNailed={totalNailed}
        totalImportant={totalImportant}
        onExam={onExam}
        onNailed={onNailed}
        onImportant={onImportant}
      />

      <div className="backup-trigger-row">
        <button className="backup-trigger-btn" onClick={onBackup}>
          <ShieldCheck size={13} /> Backup & Restore
        </button>
      </div>

      <p className="section-label">
        {activeGroup === 'bangla' ? 'বাংলা ব্যাকরণ — টপিক বেছে নাও' : activeGroup === 'english' ? 'English Grammar — Choose a Topic' : activeGroup === 'sahitya' ? 'বাংলা সাহিত্য — টপিক বেছে নাও' : 'সাধারণ জ্ঞান — টপিক বেছে নাও'}
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
