import { useState } from 'react'
import { Bookmark, Flame } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useWeakContext } from '../contexts/WeakContext.jsx'
import { useTrash } from '../contexts/TrashContext.jsx'
import { ALL_TOPICS } from '../data/index.js'
import { GROUP_TOPICS } from '../data/groups.js'
import { uidOf } from '../lib/qid.js'
import SavedQuestionsScreen from './shared/SavedQuestionsScreen'
import { useAllModulesReady } from '../data/contentLoader.js'

const IMPORTANT_COLOR = '#ef4444'
const WEAK_COLOR = '#f97316'

export default function ImportantScreen({ topics: topicsProp, important: importantProp, onHome: onHomeProp }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const importantCtx = useImportantContext()
  const weakCtx = useWeakContext()
  const important = importantProp ?? importantCtx.value
  const onHome = onHomeProp ?? (() => navigate('/'))
  // Scope to the section that opened this screen (?g=bangla…), else all general.
  const topics = topicsProp ?? GROUP_TOPICS[searchParams.get('g')] ?? ALL_TOPICS
  // "শুধু Weak" narrows the list to the Important questions you still can't answer.
  const [weakOnly, setWeakOnly] = useState(false)
  const { trashedIds } = useTrash()

  // Saved uids can belong to any module — load all content to render them.
  const lmReady = useAllModulesReady()

  // Counted over the same questions SavedQuestionsScreen lists, so the switch
  // matches the list it opens.
  const countIn = (set) => topics.reduce((s, t) =>
    s + t.questions.filter(q => q.options && q.correct_answer && !trashedIds.has(q._id) && set.has(uidOf(q))).length
  , 0)
  const importantCt = countIn(important)
  const weakCt = countIn(weakCtx.value)

  const pill = (on, c) => (on ? { borderColor: c, color: c, background: `${c}1f` } : {})
  const weakSwitch = (importantCt > 0 || weakOnly) && (
    <div className="study-filter-bar saved-weak-switch">
      <button className={`study-filter-btn${!weakOnly ? ' active' : ''}`} onClick={() => setWeakOnly(false)} style={pill(!weakOnly, IMPORTANT_COLOR)}>
        <Bookmark size={11} fill={!weakOnly ? 'currentColor' : 'none'} />
        সব Important ({importantCt})
      </button>
      <button className={`study-filter-btn${weakOnly ? ' active' : ''}`} onClick={() => setWeakOnly(true)} style={pill(weakOnly, WEAK_COLOR)}>
        <Flame size={11} fill={weakOnly ? 'currentColor' : 'none'} />
        শুধু Weak ({weakCt})
      </button>
    </div>
  )

  const totalLabel = (n, t) => `${n} question${n !== 1 ? 's' : ''} in ${t} topic${t !== 1 ? 's' : ''}`

  return (
    <SavedQuestionsScreen
      key={lmReady ? 'lm-ready' : 'lm-wait'}
      topics={topics}
      savedSet={weakOnly ? weakCtx.value : important}
      // In the Weak view "Remove all" clears Weak only — the questions stay Important.
      onRemoveMany={weakOnly ? weakCtx.removeMany : importantCtx.removeMany}
      onHome={onHome}
      headerExtra={weakSwitch}
      config={weakOnly ? {
        icon: Flame,
        color: WEAK_COLOR,
        title: 'Weak',
        emptyIcon: Flame,
        emptyText: 'এখনো কোনো Weak প্রশ্ন নেই',
        emptyHint: 'Important প্রশ্নের মধ্যে যেগুলো এখনো পারো না, সেগুলোতে Weak চাপো',
        totalLabel,
        removeAllLabel: 'Remove all Weak',
      } : {
        icon: Bookmark,
        color: IMPORTANT_COLOR,
        title: 'Important',
        emptyIcon: Bookmark,
        emptyText: 'No important questions yet',
        emptyHint: "Bookmark questions in quiz mode and they'll appear here",
        totalLabel,
        removeAllLabel: 'Remove all',
      }}
    />
  )
}
