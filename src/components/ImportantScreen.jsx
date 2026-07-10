import { Bookmark, Lightbulb, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import { GROUP_TOPICS } from '../data/groups.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'
import RichText from './shared/RichText'
import { useAllModulesReady } from '../data/contentLoader.js'

export default function ImportantScreen({ topics: topicsProp, important: importantProp, onUnmark: onUnmarkProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const importantCtx = useImportantContext()
  const important = importantProp ?? importantCtx.value
  const onUnmark = onUnmarkProp ?? importantCtx.remove
  const onHome = onHomeProp ?? (() => navigate('/'))
  // Scope to the section that opened this screen (?g=bangla…), else all general.
  const topics = topicsProp ?? GROUP_TOPICS[searchParams.get('g')] ?? ALL_TOPICS

  // Saved uids can belong to any module — load all content to render them.
  const lmReady = useAllModulesReady()

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
