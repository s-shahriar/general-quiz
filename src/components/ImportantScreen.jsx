import { Bookmark, Lightbulb, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'

export default function ImportantScreen({ topics: topicsProp, important: importantProp, onUnmark: onUnmarkProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const importantCtx = useImportantContext()
  const important = importantProp ?? importantCtx.value
  const onUnmark = onUnmarkProp ?? importantCtx.remove
  const onHome = onHomeProp ?? (() => navigate('/'))
  const topics = topicsProp ?? ALL_TOPICS

  return (
    <SavedQuestionsScreen
      topics={topics}
      savedSet={important}
      onRemove={onUnmark}
      onHome={onHome}
      config={{
        icon: Bookmark,
        color: '#ef4444',
        title: 'Important',
        emptyIcon: Bookmark,
        emptyText: 'No important questions yet',
        emptyHint: "Bookmark questions in quiz mode and they'll appear here",
        totalLabel: (n, t) => `${n} question${n !== 1 ? 's' : ''} in ${t} topic${t !== 1 ? 's' : ''}`,
        removeHint: 'to remove',
        renderItem: ({ q, qid, t, onRemove }) => (
          <div key={qid} className="nailed-row">
            <Bookmark size={11} fill="currentColor" style={{ color: '#ef4444', flexShrink: 0, marginTop: 3 }} />
            <div className="nailed-row-body">
              <span className="nailed-row-text">{q.question}</span>
              {q.correct_answer && q.options?.[q.correct_answer] && (
                <div className="nailed-row-answer">
                  <span className="nailed-ans-key">{q.correct_answer.toUpperCase()}</span>
                  <span className="nailed-ans-text">{q.options[q.correct_answer]}</span>
                </div>
              )}
              {q.explanation && (
                <div className="nailed-row-explanation">
                  <Lightbulb size={11} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
            <button className="nailed-unnail-btn" onClick={() => onRemove(qid)} title="Remove">
              <X size={13} />
            </button>
          </div>
        )
      }}
    />
  )
}
