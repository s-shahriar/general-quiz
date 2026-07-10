import { BookOpen, BookOpenText, Globe, Languages, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { BANGLA_SAHITYA_TOPICS, BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, LIVEMCQ_TOPICS } from '../data/index.js'
import { uidOf } from '../lib/qid.js'
import GroupSearch from './GroupSearch.jsx'
import ActionCardsRow from './shared/ActionCardsRow'
import { useModuleReady } from '../data/contentLoader.js'

const GROUP_LABELS = { bangla: 'বাংলা ব্যাকরণ', english: 'English Grammar', sahitya: 'বাংলা সাহিত্য', gk: 'সাধারণ জ্ঞান', livemcq: 'LiveMCQ' }
const GROUP_PATHS  = { bangla: '/bangla-grammer', english: '/english-grammer', sahitya: '/sahitto', gk: '/gk', livemcq: '/livemcq' }

export default function HomeScreen({ activeGroup = 'bangla' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { value: mastered } = useMasteredContext()
  const { value: important } = useImportantContext()
  const [searching, setSearching] = useState(false)
  const urlSearch = searchParams.get('search') || ''
  // activeGroup id matches the DB module name (bangla/english/sahitya/gk/livemcq).
  const ready = useModuleReady(activeGroup)

  const allTopics = activeGroup === 'bangla' ? BANGLA_TOPICS : activeGroup === 'english' ? ENGLISH_TOPICS : activeGroup === 'sahitya' ? BANGLA_SAHITYA_TOPICS : activeGroup === 'livemcq' ? LIVEMCQ_TOPICS : GK_TOPICS

  // Totals are scoped to THIS section's topics (not global) — a flag set in one
  // module must not inflate another module's card. Needs the module loaded.
  const totalNailed = allTopics.reduce((s, t) => s + t.questions.filter(q => mastered.has(uidOf(q))).length, 0)
  const totalImportant = allTopics.reduce((s, t) => s + t.questions.filter(q => important?.has(uidOf(q))).length, 0)

  return (
    <div className="home anim-fade">
      <header className="home-header">
        <div className="logo-row">
          <div className="logo-icon-wrap"><BookOpenText size={22} /></div>
          <span className="logo-title">General Quiz</span>
        </div>
        <p className="home-sub">বাংলা, English ও সাধারণ জ্ঞান Practice</p>

        <div className="module-toggle">
          <button className={`module-btn${activeGroup === 'bangla' ? ' active' : ''}`} onClick={() => navigate('/bangla-grammer')}>
            <Languages size={15} /> বাংলা ব্যাকরণ
          </button>
          <button className={`module-btn${activeGroup === 'english' ? ' active' : ''}`} onClick={() => navigate('/english-grammer')}>
            <Languages size={15} /> English Grammar
          </button>
          <button className={`module-btn${activeGroup === 'gk' ? ' active' : ''}`} onClick={() => navigate('/gk')}>
            <Globe size={15} /> সাধারণ জ্ঞান
          </button>
          <button className={`module-btn${activeGroup === 'sahitya' ? ' active' : ''}`} onClick={() => navigate('/sahitto')}>
            <BookOpen size={15} /> বাংলা সাহিত্য
          </button>
          <button className={`module-btn${activeGroup === 'livemcq' ? ' active' : ''}`} onClick={() => navigate('/livemcq')}>
            <Sparkles size={15} /> LiveMCQ
          </button>
        </div>
      </header>

      <GroupSearch
        key={activeGroup}
        topics={allTopics}
        groupLabel={GROUP_LABELS[activeGroup] ?? ''}
        homePath={GROUP_PATHS[activeGroup] ?? '/'}
        initialQuery={urlSearch}
        onActiveChange={setSearching}
      />

      {!searching && (
        <>
          <ActionCardsRow
            totalNailed={totalNailed}
            totalImportant={totalImportant}
            onExam={() => navigate('/exam')}
            onNailed={() => navigate('/nailed?g=' + activeGroup)}
            onImportant={() => navigate('/important?g=' + activeGroup)}
          />

          <p className="section-label">
            {activeGroup === 'bangla' ? 'বাংলা ব্যাকরণ — টপিক বেছে নাও' : activeGroup === 'english' ? 'English Grammar — Choose a Topic' : activeGroup === 'sahitya' ? 'বাংলা সাহিত্য — টপিক বেছে নাও' : activeGroup === 'livemcq' ? 'LiveMCQ — বিষয় বেছে নাও' : 'সাধারণ জ্ঞান — টপিক বেছে নাও'}
          </p>
          {!ready ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem', color: 'var(--text-3)', fontSize: '0.85rem' }}>
              লোড হচ্ছে…
            </div>
          ) : (
            <main className="topics-grid">
              {allTopics.map(t => <TopicCard key={t.id} topic={t} onClick={() => navigate('/topic/' + t.id)} />)}
            </main>
          )}
        </>
      )}
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
        <span className="tc-count">
          {topic.study
            ? `${topic.study.groups.length} টপিক${topic.questions.length ? ` · ${topic.questions.length} MCQ` : ''}`
            : `${topic.questions.length} questions`}
        </span>
      </div>
      <span className="tc-arrow">›</span>
    </button>
  )
}
