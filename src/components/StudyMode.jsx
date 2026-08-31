import { ChevronLeft, LayoutGrid, Bookmark, Search, Star, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import TopbarActions from './shared/TopbarActions.jsx'
import { ALL_TOPICS, BANGLA_SAHITYA_TOPICS, BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, LIVEMCQ_TOPICS } from '../data/index.js'
import { homePathForTopic } from '../data/groups.js'
import { uidOf } from '../lib/qid.js'
import { focusScroll } from '../lib/focusScroll.js'
import CategorySidebar from './CategorySidebar.jsx'
import Pagination from './shared/Pagination'
import StudyCard from './shared/StudyCard.jsx'
import { useModuleReady } from '../data/contentLoader.js'
import { useTrash } from '../contexts/TrashContext.jsx'
import useDebounce from '../hooks/useDebounce.js'

const PAGE_SIZE = 20

function normalize(str) {
  return (str ?? '').toLowerCase().trim()
}

function getTopicGroup(t, groupProp) {
  if (groupProp) return groupProp
  if (!t) return []
  if (BANGLA_TOPICS.some(x => x.id === t.id))         return BANGLA_TOPICS
  if (ENGLISH_TOPICS.some(x => x.id === t.id))        return ENGLISH_TOPICS
  if (BANGLA_SAHITYA_TOPICS.some(x => x.id === t.id)) return BANGLA_SAHITYA_TOPICS
  if (LIVEMCQ_TOPICS.some(x => x.id === t.id))        return LIVEMCQ_TOPICS
  return GK_TOPICS
}

// Home-section key (matches GROUP_TOPICS / the `?g=` param) so the Nailed screen
// opens scoped to the section this topic belongs to — livemcq included.
function getGroupKey(t) {
  if (!t) return null
  if (BANGLA_TOPICS.some(x => x.id === t.id))         return 'bangla'
  if (ENGLISH_TOPICS.some(x => x.id === t.id))        return 'english'
  if (BANGLA_SAHITYA_TOPICS.some(x => x.id === t.id)) return 'sahitya'
  if (LIVEMCQ_TOPICS.some(x => x.id === t.id))        return 'livemcq'
  if (GK_TOPICS.some(x => x.id === t.id))             return 'gk'
  return null
}

export default function StudyMode({
  topic: topicProp,
  topics: topicGroupProp,
  onBack: onBackProp,
  onHome: onHomeProp,
  onNailed: onNailedProp,
  onChangeTopic: onChangeTopicProp,
}) {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const backTo = location.state?.backTo  // set when arriving from search — return there
  const topicId = topicProp?.id || params.topicId
  const topic = topicProp || ALL_TOPICS.find(t => t.id === topicId)
  const ready = useModuleReady(topic?.module)
  const { value: mastered, add: onNail } = useMasteredContext()
  const { value: important, add: onMarkImportant, remove: onUnmarkImportant } = useImportantContext()
  const { trashedIds } = useTrash()

  const [filterImportant, setFilterImportant] = useState(false)
  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const [query, setQuery]                     = useState('')
  const [page, setPage]                       = useState(1)
  const dQuery = useDebounce(query, 250)

  const topics = topic ? getTopicGroup(topic, topicGroupProp) : []

  // lmReady dep forces recompute once lazy LiveMCQ questions are populated in place
  const validQ = useMemo(() => {
    if (!topic) return []
    return topic.questions
      .map((q) => ({ q, qid: uidOf(q) }))
      .filter(({ q }) => q.options && q.correct_answer && !trashedIds.has(q._id))
  }, [topic, ready, trashedIds]) // eslint-disable-line react-hooks/exhaustive-deps

  const nonNailed      = validQ.filter(({ qid }) => !mastered.has(qid))
  const nailedCt       = validQ.length - nonNailed.length
  const importantCount = nonNailed.filter(({ qid }) => important?.has(qid)).length

  const afterFilter = filterImportant
    ? nonNailed.filter(({ qid }) => important?.has(qid))
    : nonNailed

  const visible = useMemo(() => {
    if (!dQuery.trim()) return afterFilter
    const q = normalize(dQuery)
    return afterFilter.filter(({ q: question }) =>
      normalize(question.question).includes(q) ||
      Object.values(question.options ?? {}).some(v => normalize(v).includes(q))
    )
  }, [dQuery, afterFilter])

  // Reset to page 1 when the filter/search/topic changes (adjust state during
  // render — avoids setState-in-effect cascading renders).
  const filterKey = `${dQuery}|${filterImportant}|${topic?.id}`
  const [prevKey, setPrevKey] = useState(filterKey)
  if (prevKey !== filterKey) {
    setPrevKey(filterKey)
    setPage(1)
  }

  // Deep-link: ?q=<index> focuses a specific question — jump to its page,
  // then scroll it into view and pulse it.
  const [searchParams] = useSearchParams()
  // ?q=<uid> — GroupSearch deep-links to a specific question by its stable uid.
  const focusQid = searchParams.get('q') || null

  const [focusApplied, setFocusApplied] = useState(false)
  if (focusQid && !focusApplied && visible.length) {
    setFocusApplied(true)
    const pos = visible.findIndex(it => it.qid === focusQid)
    if (pos >= 0) setPage(Math.floor(pos / PAGE_SIZE) + 1)
  }

  const totalPages = Math.ceil(visible.length / PAGE_SIZE)
  const pageItems  = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // The focus page is already applied during render, so run once per target.
  useEffect(() => {
    if (!focusQid) return
    return focusScroll(() => document.getElementById('study-q-' + focusQid))
  }, [focusQid])

  function goTo(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack  = () => onBackProp ? onBackProp() : navigate(backTo || '/topic/' + topic.id)
  const goHome  = () => onHomeProp ? onHomeProp() : navigate(homePathForTopic(topic))
  const goNailed = () => {
    if (onNailedProp) return onNailedProp()
    const key = getGroupKey(topic)
    navigate('/nailed' + (key ? '?g=' + key : ''))
  }
  const goTopic = (t) => onChangeTopicProp ? onChangeTopicProp(t) : navigate('/topic/' + t.id + '/study')

  if (!topic) return <Navigate to="/" replace />
  if (!ready) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>লোড হচ্ছে…</div>

  return (
    <div className="study-page anim-fade">
      <div className="study-topbar">
        <button className="back-btn" onClick={goBack}><ChevronLeft size={15} /> Back</button>
        <span className="study-title" style={{ color: topic.color }}>{topic.name}</span>
        <TopbarActions>
          {topics.length > 1 && (
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse categories">
              <LayoutGrid size={16} />
            </button>
          )}
        </TopbarActions>
      </div>

      {topics.length > 1 && (
        <CategorySidebar
          topics={topics}
          currentTopicId={topic.id}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={goTopic}
        />
      )}

      <div className="study-filter-bar">
        <button
          className={`study-filter-btn${!filterImportant ? ' active' : ''}`}
          onClick={() => setFilterImportant(false)}
          style={!filterImportant ? { borderColor: topic.color, color: topic.color, background: `${topic.color}15` } : {}}
        >
          All ({nonNailed.length})
        </button>
        <button
          className={`study-filter-btn${filterImportant ? ' active' : ''}`}
          onClick={() => setFilterImportant(true)}
          style={filterImportant ? { borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.12)' } : {}}
        >
          <Bookmark size={11} fill={filterImportant ? 'currentColor' : 'none'} />
          Important ({importantCount})
        </button>
      </div>

      {/* Search bar */}
      <div className="study-search-bar">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search questions..."
          className="study-search-input"
        />
        {query && (
          <button className="study-search-clear" onClick={() => setQuery('')}>
            <X size={13} />
          </button>
        )}
      </div>
      {query && (
        <p className="study-search-meta">
          {visible.length} / {afterFilter.length} matches for "{query}"
        </p>
      )}

      {nailedCt > 0 && !filterImportant && !query && (
        <div className="nailed-notice" style={{ borderColor: `${topic.color}40`, color: topic.color }}>
          <Star size={13} fill="currentColor" />
          <span>{nailedCt} question{nailedCt !== 1 ? 's' : ''} Nailed — view in <button onClick={goNailed} className="nailed-notice-link">Nailed It</button></span>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="study-all-nailed">
          {query
            ? <Search size={38} style={{ color: topic.color, opacity: 0.4, marginBottom: 12 }} />
            : filterImportant
              ? <Bookmark size={38} style={{ color: '#ef4444', opacity: 0.4, marginBottom: 12 }} fill="currentColor" />
              : <Star size={38} style={{ color: topic.color, opacity: 0.5, marginBottom: 12 }} fill="currentColor" />
          }
          <p>{query ? 'No questions match your search.' : filterImportant ? 'No Important questions yet.' : 'All questions nailed! 🎉'}</p>
          {query && <button className="back-btn" style={{ marginTop: 16 }} onClick={() => setQuery('')}>Clear search</button>}
          {!query && <button className="back-btn" style={{ marginTop: 16 }} onClick={goHome}>Go Home</button>}
        </div>
      ) : (
        <>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />}

          <div className="study-list">
            {pageItems.map(({ q, qid }, i) => (
              <StudyCard
                key={qid}
                domId={'study-q-' + qid}
                question={q}
                index={(page - 1) * PAGE_SIZE + i}
                color={topic.color}
                nailed={mastered.has(qid)}
                isImportant={important?.has(qid)}
                onNail={() => onNail(qid)}
                onMarkImportant={() => onMarkImportant?.(qid)}
                onUnmarkImportant={() => onUnmarkImportant?.(qid)}
              />
            ))}
          </div>

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />}
        </>
      )}
    </div>
  )
}
