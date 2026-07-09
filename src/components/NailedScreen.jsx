import { Star, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'
import RichText from './shared/RichText'
import { useLiveMcqReady } from '../hooks/useLiveMcq.js'

export default function NailedScreen({ topics: topicsProp, mastered: masteredProp, onUnnail: onUnnailProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const masteredCtx = useMasteredContext()
  const mastered = masteredProp ?? masteredCtx.value
  const onUnnail = onUnnailProp ?? masteredCtx.remove
  const onHome = onHomeProp ?? (() => navigate('/'))
  const topics = topicsProp ?? ALL_TOPICS

  // load LiveMCQ data if any saved item belongs to it (so they render here)
  let hasLm = false
  for (const k of (mastered || [])) { if (typeof k === 'string' && k.startsWith('lm_')) { hasLm = true; break } }
  const lmReady = useLiveMcqReady(hasLm)

  return (
    <SavedQuestionsScreen
      key={lmReady ? 'lm-ready' : 'lm-wait'}
      topics={topics}
      savedSet={mastered}
      onRemove={onUnnail}
      onHome={onHome}
      config={{
        icon: Star,
        color: '#f59e0b',
        title: 'Nailed It',
        emptyIcon: Star,
        emptyText: 'No nailed questions yet',
        emptyHint: "Star questions in quiz mode and they'll appear here",
        totalLabel: (n, t) => `${n} question${n !== 1 ? 's' : ''} in ${t} topic${t !== 1 ? 's' : ''}`,
        removeHint: 'to remove',
        renderItem: ({ q, qid, onRemove }) => (
          <div key={qid} className="nailed-row">
            <Star size={11} fill="currentColor" style={{ color: '#f59e0b', flexShrink: 0, marginTop: 3 }} />
            <div className="nailed-row-body">
              <RichText className="nailed-row-text" html={q.question} />
              {q.correct_answer && q.options?.[q.correct_answer] && (
                <div className="nailed-row-answer">
                  <span className="nailed-ans-key">{q.correct_answer.toUpperCase()}</span>
                  <RichText className="nailed-ans-text" html={q.options[q.correct_answer]} />
                </div>
              )}
            </div>
            <button className="nailed-unnail-btn" onClick={() => onRemove(qid)} title="Un-nail">
              <X size={13} />
            </button>
          </div>
        )
      }}
    />
  )
}
