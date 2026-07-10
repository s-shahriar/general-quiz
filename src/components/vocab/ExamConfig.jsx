import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Zap, Minus, Plus } from 'lucide-react'
import { VOCAB_TOPICS } from '../../data/vocabTopics.js'
import { useImportantContext } from '../../contexts/ImportantContext.jsx'
import { useModuleReady } from '../../data/contentLoader.js'
import { uidOf } from '../../lib/qid.js'
import { shuffle, validQ } from '../../lib/utils'

export default function VocabExamConfig() {
  const navigate = useNavigate()
  const ready = useModuleReady('vocab')
  const { value: important } = useImportantContext()
  const topics = VOCAB_TOPICS

  const [topicId, setTopicId] = useState('all')
  const [count, setCount]     = useState(10)

  const importantCount = useMemo(() =>
    topics.reduce((s, t) =>
      s + t.questions.filter(q => validQ(q) && important.has(uidOf(q))).length
    , 0)
  , [important, topics, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const maxCount = useMemo(() => {
    if (topicId === 'important') return importantCount
    if (topicId === 'all') return topics.reduce((s, t) => s + t.questions.filter(validQ).length, 0)
    return topics.find(t => t.id === topicId)?.questions.filter(validQ).length ?? 0
  }, [topicId, topics, importantCount, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const safeCount = Math.max(1, Math.min(count, maxCount))
  const adjust    = (delta) => setCount(c => Math.max(1, Math.min(c + delta, maxCount)))

  const handleTopicChange = (val) => {
    setTopicId(val)
    setCount(val === 'important' ? 9999 : 10)
  }

  const handleStart = () => {
    let pool
    if (topicId === 'important') {
      pool = topics.flatMap(t =>
        t.questions
          .map((q) => ({ ...q, _color: t.color, _label: t.shortName }))
          .filter(q => validQ(q) && important.has(uidOf(q)))
      )
    } else {
      const selected = topicId === 'all' ? topics : topics.filter(t => t.id === topicId)
      pool = selected.flatMap(t =>
        t.questions
          .map((q, i) => ({ ...q, _color: t.color, _label: t.shortName, _topicId: t.id, _origIndex: i }))
          .filter(q => validQ(q))
      )
    }
    const questions = shuffle(pool).slice(0, safeCount)
    const label = topicId === 'important' ? 'Important Words'
      : topicId === 'all' ? 'All Vocabulary'
      : topics.find(t => t.id === topicId)?.name
    navigate('/vocabulary/exam/run', { state: { questions, label } })
  }

  return (
    <div className="exam-config-page anim-fade">
      <button className="back-btn" onClick={() => navigate('/vocabulary')}><ChevronLeft size={15} /> Back</button>

      <div className="exam-config-hero">
        <div className="exam-config-icon"><Zap size={30} /></div>
        <h1 className="exam-config-title">Vocab Exam</h1>
        <p className="exam-config-sub">Choose a letter group and number of questions</p>
      </div>

      <div className="exam-config-form">
        <div className="exam-field">
          <label className="exam-label">Letter Group</label>
          <select className="exam-select" value={topicId} onChange={e => handleTopicChange(e.target.value)}>
            <option value="all">All Letters (Random Mix)</option>
            <option value="important" disabled={importantCount === 0}>
              Important Words ({importantCount} Q)
            </option>
            <optgroup label="────────────────">
              {topics.map(t => (
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
