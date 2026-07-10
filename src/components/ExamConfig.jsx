import { ChevronLeft, Minus, Plus, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { BANGLA_SAHITYA_TOPICS, BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, LIVEMCQ_TOPICS } from '../data/index.js'
import { useAllModulesReady } from '../data/contentLoader.js'
import { uidOf } from '../lib/qid.js'
import { shuffle, validQ } from '../lib/utils'

export default function ExamConfig() {
  const navigate = useNavigate()
  const { value: important } = useImportantContext()
  // Exam pools can span every module, so load all content when this screen opens.
  const ready = useAllModulesReady()

  const [groupId, setGroupId] = useState('all')
  const [topicId, setTopicId] = useState('all')
  const [count, setCount]     = useState(10)

  const allTopics = [...BANGLA_TOPICS, ...ENGLISH_TOPICS, ...GK_TOPICS, ...BANGLA_SAHITYA_TOPICS, ...LIVEMCQ_TOPICS]
  const filteredTopics = groupId === 'all' ? allTopics
    : groupId === 'bangla' ? BANGLA_TOPICS
    : groupId === 'english' ? ENGLISH_TOPICS
    : groupId === 'sahitya' ? BANGLA_SAHITYA_TOPICS
    : groupId === 'livemcq' ? LIVEMCQ_TOPICS
    : GK_TOPICS

  const importantCount = useMemo(() =>
    allTopics.reduce((s, t) =>
      s + t.questions.filter(q => validQ(q) && important.has(uidOf(q))).length
    , 0)
  , [important, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const maxCount = useMemo(() => {
    if (topicId === 'important') return importantCount
    if (topicId === 'all') return filteredTopics.reduce((s, t) => s + t.questions.filter(validQ).length, 0)
    return allTopics.find(t => t.id === topicId)?.questions.filter(validQ).length ?? 0
  }, [topicId, groupId, filteredTopics, importantCount, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const safeCount = Math.max(1, Math.min(count, maxCount))
  const adjust    = (delta) => setCount(c => Math.max(1, Math.min(c + delta, maxCount)))

  const handleGroupChange = (g) => { setGroupId(g); setTopicId('all'); setCount(10) }

  const handleTopicChange = (val) => {
    setTopicId(val)
    setCount(val === 'important' ? 9999 : 10)
  }

  const handleStart = () => {
    let pool
    if (topicId === 'important') {
      pool = allTopics.flatMap(t =>
        t.questions
          .map((q) => ({ ...q, _color: t.color, _label: t.shortName }))
          .filter(q => validQ(q) && important.has(uidOf(q)))
      )
    } else {
      const topics = topicId === 'all' ? filteredTopics : allTopics.filter(t => t.id === topicId)
      pool = topics.flatMap(t =>
        t.questions.map((q, i) => ({ ...q, _color: t.color, _label: t.shortName, _topicId: t.id, _origIndex: i }))
          .filter(q => validQ(q))
      )
    }
    const questions = shuffle(pool).slice(0, safeCount)
    const label = topicId === 'important' ? 'Important Questions'
      : topicId === 'all'
        ? (groupId === 'all' ? 'All Topics' : groupId === 'bangla' ? 'বাংলা ব্যাকরণ' : groupId === 'english' ? 'English Grammar' : groupId === 'sahitya' ? 'বাংলা সাহিত্য' : groupId === 'livemcq' ? 'LiveMCQ' : 'সাধারণ জ্ঞান')
        : allTopics.find(t => t.id === topicId)?.name
    navigate('/exam/run', { state: { questions, label } })
  }

  return (
    <div className="exam-config-page anim-fade">
      <button className="back-btn" onClick={() => navigate('/')}><ChevronLeft size={15} /> Back</button>

      <div className="exam-config-hero">
        <div className="exam-config-icon"><Zap size={30} /></div>
        <h1 className="exam-config-title">Exam Mode</h1>
        <p className="exam-config-sub">Choose topic group and number of questions</p>
      </div>

      <div className="exam-config-form">
        <div className="exam-field">
          <label className="exam-label">Subject Group</label>
          <select className="exam-select" value={groupId} onChange={e => handleGroupChange(e.target.value)}>
            <option value="all">All Topics</option>
            <option value="bangla">বাংলা ব্যাকরণ</option>
            <option value="english">English Grammar</option>
            <option value="gk">সাধারণ জ্ঞান</option>
            <option value="sahitya">বাংলা সাহিত্য</option>
            <option value="livemcq">LiveMCQ</option>
          </select>
        </div>

        <div className="exam-field">
          <label className="exam-label">Topic</label>
          <select className="exam-select" value={topicId} onChange={e => handleTopicChange(e.target.value)}>
            <option value="all">All in Group (Random Mix)</option>
            <option value="important" disabled={importantCount === 0}>
              Important Questions ({importantCount} Q)
            </option>
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

        <button className="exam-start-btn" onClick={handleStart} disabled={maxCount === 0 || !ready}>
          <Zap size={16} />
          {ready ? `Start Exam — ${safeCount} Questions` : 'লোড হচ্ছে…'}
        </button>
      </div>
    </div>
  )
}
