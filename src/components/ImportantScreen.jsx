import { Bookmark } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import { GROUP_TOPICS } from '../data/groups.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'
import { useAllModulesReady } from '../data/contentLoader.js'

export default function ImportantScreen({ topics: topicsProp, important: importantProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const importantCtx = useImportantContext()
  const important = importantProp ?? importantCtx.value
  const onUnmarkMany = importantCtx.removeMany
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
      onRemoveMany={onUnmarkMany}
      onHome={onHome}
      config={{
        icon: Bookmark,
        color: '#ef4444',
        title: 'Important',
        emptyIcon: Bookmark,
        emptyText: 'No important questions yet',
        emptyHint: "Bookmark questions in quiz mode and they'll appear here",
        totalLabel: (n, t) => `${n} question${n !== 1 ? 's' : ''} in ${t} topic${t !== 1 ? 's' : ''}`,
        removeAllLabel: 'Remove all',
      }}
    />
  )
}
