import { Bookmark, Lightbulb, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import { duplicateQidsOf } from '../lib/questionIndex.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'
import RichText from './shared/RichText'
import { useLiveMcqReady } from '../hooks/useLiveMcq.js'

export default function ImportantScreen({ topics: topicsProp, important: importantProp, onUnmark: onUnmarkProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const importantCtx = useImportantContext()
  const important = importantProp ?? importantCtx.value
  // Remove every duplicate copy of the question so it fully clears.
  const onUnmark = onUnmarkProp ?? ((qid) => importantCtx.removeMany(duplicateQidsOf(qid)))
  const onHome = onHomeProp ?? (() => navigate('/'))
  const topics = topicsProp ?? ALL_TOPICS

  let hasLm = false
  for (const k of (important || [])) { if (typeof k === 'string' && k.startsWith('lm_')) { hasLm = true; break } }
  const lmReady = useLiveMcqReady(hasLm)

  return (
    <SavedQuestionsScreen
      key={lmReady ? 'lm-ready' : 'lm-wait'}
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
        renderItem: ({ q, qid, onRemove }) => (
          <div key={qid} className="nailed-row">
            <Bookmark size={11} fill="currentColor" style={{ color: '#ef4444', flexShrink: 0, marginTop: 3 }} />
            <div className="nailed-row-body">
              <RichText className="nailed-row-text" html={q.question} />
              {q.correct_answer && q.options?.[q.correct_answer] && (
                <div className="nailed-row-answer">
                  <span className="nailed-ans-key">{q.correct_answer.toUpperCase()}</span>
                  <RichText className="nailed-ans-text" html={q.options[q.correct_answer]} />
                </div>
              )}
              {q.explanation && (
                <div className="nailed-row-explanation">
                  <Lightbulb size={11} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <RichText as="span" html={q.explanation} />
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
