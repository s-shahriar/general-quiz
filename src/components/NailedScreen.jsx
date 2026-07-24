import { Star } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import { GROUP_TOPICS } from '../data/groups.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'
import { useAllModulesReady } from '../data/contentLoader.js'

export default function NailedScreen({ topics: topicsProp, mastered: masteredProp, onUnnail: onUnnailProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const masteredCtx = useMasteredContext()
  const mastered = masteredProp ?? masteredCtx.value
  const onUnnail = onUnnailProp ?? masteredCtx.remove
  const onUnnailMany = masteredCtx.removeMany
  const onHome = onHomeProp ?? (() => navigate('/'))
  // Scope to the section that opened this screen (?g=bangla…), else all general.
  const topics = topicsProp ?? GROUP_TOPICS[searchParams.get('g')] ?? ALL_TOPICS

  // Saved uids don't carry their module, so ensure all content is loaded to
  // resolve/render every saved question.
  const lmReady = useAllModulesReady()

  return (
    <SavedQuestionsScreen
      key={lmReady ? 'lm-ready' : 'lm-wait'}
      topics={topics}
      savedSet={mastered}
      onRemove={onUnnail}
      onRemoveMany={onUnnailMany}
      onHome={onHome}
      config={{
        icon: Star,
        color: '#f59e0b',
        title: 'Nailed It',
        emptyIcon: Star,
        emptyText: 'No nailed questions yet',
        emptyHint: "Star questions in quiz mode and they'll appear here",
        totalLabel: (n, t) => `${n} question${n !== 1 ? 's' : ''} in ${t} topic${t !== 1 ? 's' : ''}`,
        removeHint: 'to un-nail',
        removeAllLabel: 'Un-nail all',
        rowIcon: Star,
        rowIconColor: '#f59e0b',
        showExplanation: false,
      }}
    />
  )
}
