import { Star, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'

export default function NailedScreen({ topics: topicsProp, mastered: masteredProp, onUnnail: onUnnailProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const masteredCtx = useMasteredContext()
  const mastered = masteredProp ?? masteredCtx.value
  const onUnnail = onUnnailProp ?? masteredCtx.remove
  const onHome = onHomeProp ?? (() => navigate('/'))
  const topics = topicsProp ?? ALL_TOPICS

  return (
    <SavedQuestionsScreen
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
        renderItem: ({ q, qid, t, onRemove }) => (
          <div key={qid} className="nailed-row">
            <Star size={11} fill="currentColor" style={{ color: '#f59e0b', flexShrink: 0, marginTop: 3 }} />
            <div className="nailed-row-body">
              <span className="nailed-row-text">{q.question}</span>
              {q.correct_answer && q.options?.[q.correct_answer] && (
                <div className="nailed-row-answer">
                  <span className="nailed-ans-key">{q.correct_answer.toUpperCase()}</span>
                  <span className="nailed-ans-text">{q.options[q.correct_answer]}</span>
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
