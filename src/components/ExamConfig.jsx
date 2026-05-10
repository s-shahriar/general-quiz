import { useState, useMemo } from 'react'
import { ChevronLeft, Zap, Minus, Plus } from 'lucide-react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ExamConfig({ banglaTopic, englishTopics, onStart, onBack }) {
  const [groupId, setGroupId] = useState('all')
  const [topicId, setTopicId] = useState('all')
  const [count, setCount]     = useState(10)

  const validQ = (q) => q.options && q.correct_answer

  const allTopics = [...banglaTopic, ...englishTopics]
  const filteredTopics = groupId === 'all' ? allTopics : groupId === 'bangla' ? banglaTopic : englishTopics

  const maxCount = useMemo(() => {
    if (topicId === 'all') return filteredTopics.reduce((s, t) => s + t.questions.filter(validQ).length, 0)
    return allTopics.find(t => t.id === topicId)?.questions.filter(validQ).length ?? 0
  }, [topicId, groupId, filteredTopics])

  const safeCount = Math.max(1, Math.min(count, maxCount))
  const adjust    = (delta) => setCount(c => Math.max(1, Math.min(c + delta, maxCount)))

  const handleGroupChange = (g) => { setGroupId(g); setTopicId('all'); setCount(10) }

  const handleStart = () => {
    let pool
    const topics = topicId === 'all' ? filteredTopics : allTopics.filter(t => t.id === topicId)
    pool = topics.flatMap(t =>
      t.questions.map((q, i) => ({ ...q, _color: t.color, _label: t.shortName, _topicId: t.id, _origIndex: i }))
        .filter(q => validQ(q))
    )
    const questions = shuffle(pool).slice(0, safeCount)
    const label = topicId === 'all'
      ? (groupId === 'all' ? 'All Topics' : groupId === 'bangla' ? 'বাংলা ব্যাকরণ' : 'English Grammar')
      : allTopics.find(t => t.id === topicId)?.name
    onStart({ questions, label })
  }

  return (
    <div className="exam-config-page anim-fade">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={15} /> Back</button>

      <div className="exam-config-hero">
        <div className="exam-config-icon"><Zap size={30} /></div>
        <h1 className="exam-config-title">Exam Mode</h1>
        <p className="exam-config-sub">Choose topic group and number of questions</p>
      </div>

      <div className="exam-config-form">
        <div className="exam-field">
          <label className="exam-label">Subject Group</label>
          <select className="exam-select" value={groupId} onChange={e => handleGroupChange(e.target.value)}>
            <option value="all">🌐 All Topics</option>
            <option value="bangla">🇧🇩 বাংলা ব্যাকরণ</option>
            <option value="english">🇬🇧 English Grammar</option>
          </select>
        </div>

        <div className="exam-field">
          <label className="exam-label">Topic</label>
          <select className="exam-select" value={topicId} onChange={e => { setTopicId(e.target.value); setCount(10) }}>
            <option value="all">🎲 All in Group (Random Mix)</option>
            <optgroup label="────────────────">
              {filteredTopics.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.questions.filter(validQ).length} Q)</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="exam-field">
          <label className="exam-label">
            Number of Questions
            <span className="exam-max-hint">max {maxCount}</span>
          </label>
          <div className="exam-count-row">
            <button className="exam-stepper" onClick={() => adjust(-5)} disabled={safeCount <= 1}>−5</button>
            <button className="exam-stepper" onClick={() => adjust(-1)} disabled={safeCount <= 1}><Minus size={14} /></button>
            <span className="exam-count-display">{safeCount}</span>
            <button className="exam-stepper" onClick={() => adjust(1)}  disabled={safeCount >= maxCount}><Plus size={14} /></button>
            <button className="exam-stepper" onClick={() => adjust(5)}  disabled={safeCount >= maxCount}>+5</button>
          </div>
        </div>

        <button className="exam-start-btn" onClick={handleStart} disabled={maxCount === 0}>
          <Zap size={16} />
          Start Exam — {safeCount} Questions
        </button>
      </div>
    </div>
  )
}
