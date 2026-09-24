import { ArrowRight, Bookmark, ChevronLeft, Flame, LayoutGrid, Lightbulb, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useImportantContext } from '../contexts/ImportantContext.jsx'
import { useMasteredContext } from '../contexts/MasteredContext.jsx'
import { useWeakContext } from '../contexts/WeakContext.jsx'
import TopbarActions from './shared/TopbarActions.jsx'
import { ALL_TOPICS, BANGLA_SAHITYA_TOPICS, BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, LIVEMCQ_TOPICS } from '../data/index.js'
import { homePathForTopic } from '../data/groups.js'
import { uidOf } from '../lib/qid.js'
import { shuffle } from '../lib/utils'
import CategorySidebar from './CategorySidebar.jsx'
import QuizOptions from './shared/QuizOptions'
import ScoreRingScreen from './shared/ScoreRingScreen'
import DeleteButton from './shared/DeleteButton.jsx'
import QuestionEditButton from './shared/QuestionEditButton.jsx'
import { useModuleReady } from '../data/contentLoader.js'
import Highlightable from './shared/Highlightable.jsx'
import { guardHighlightClick } from '../lib/textAnchor.js'
import { useHighlights } from '../contexts/HighlightContext.jsx'

// `?set=important|weak|nailed` quizzes only the questions you've marked in this
// topic (chosen on ModeSelect). No param = the whole topic, as before.
const POOL_LABEL = { important: 'Important', weak: 'Weak', nailed: 'Nailed' }

export default function QuizMode({
  topic: topicProp,
  topics: topicGroupProp,
  onBack: onBackProp,
  onHome: onHomeProp,
  onChangeTopic: onChangeTopicProp,
}) {
  const params = useParams()
  const navigate = useNavigate()
  const topicId = topicProp?.id || params.topicId
  const topic = topicProp || ALL_TOPICS.find(t => t.id === topicId)
  const ready = useModuleReady(topic?.module)
  const { value: mastered, add: nail, remove: unnail } = useMasteredContext()
  const { value: important, add: markImportant, remove: unmarkImportant } = useImportantContext()
  const { value: weak, add: markWeak, remove: unmarkWeak } = useWeakContext()

  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const setParam = searchParams.get('set')
  const set = POOL_LABEL[setParam] ? setParam : null

  // lmReady dep forces recompute once lazy LiveMCQ questions are populated in place.
  // A marked-set quiz also tracks its set, so it fills in once cloud progress lands.
  const liveQuestions = useMemo(() => {
    if (!topic) return []
    const base = topic.questions.filter(q => q.options && q.correct_answer)
    const marked = set === 'important' ? important : set === 'weak' ? weak : set === 'nailed' ? mastered : null
    const pool = marked ? base.filter(q => marked?.has(uidOf(q))) : base
    return shuffle(pool)
  }, [topic, ready, set, set === 'important' ? important : null, set === 'weak' ? weak : null, set === 'nailed' ? mastered : null]) // eslint-disable-line react-hooks/exhaustive-deps

  // Frozen at the first answer: un-nailing or un-marking a question mid-quiz
  // must not reshuffle or shrink the quiz you're in the middle of.
  const [frozen, setFrozen] = useState(null)   // { key, list }
  const quizKey = `${topic?.id}|${set || 'all'}`
  const questions = frozen?.key === quizKey ? frozen.list : liveQuestions

  const [idx, setIdx]           = useState(0)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)

  // Saved highlights, read here with the rest of the hooks — it must run
  // before the early returns below or the hook order changes between renders.
  const { getFor } = useHighlights()

  if (!topic) return <Navigate to="/" replace />
  if (!ready) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-3)', fontSize: '0.85rem' }}>লোড হচ্ছে…</div>

  const goBack   = () => onBackProp ? onBackProp() : navigate('/topic/' + topic.id)
  const goHome   = () => onHomeProp ? onHomeProp() : navigate(homePathForTopic(topic))
  // Switching topic from the sidebar keeps the chosen set.
  const goTopic  = (t) => onChangeTopicProp ? onChangeTopicProp(t) : navigate('/topic/' + t.id + '/quiz' + (set ? '?set=' + set : ''))

  const q    = questions[idx]
  const qid  = q ? uidOf(q) : null
  // Block key 'explanation' — an MCQ answer has one text block, no index.
  const hlExp = qid ? getFor(qid).filter(h => h.block === 'explanation') : undefined
  // The question is highlightable too, as its own block on the same uid.
  const hlQ = qid ? getFor(qid).filter(h => h.block === 'q') : undefined
  const isNailed = qid ? mastered?.has(qid) : false
  const isImportant = qid ? important?.has(qid) : false
  const isWeak = qid ? weak?.has(qid) : false

  const pick = (key) => {
    if (revealed) return
    if (frozen?.key !== quizKey) setFrozen({ key: quizKey, list: questions })
    setSelected(key)
    setRevealed(true)
    if (key === q.correct_answer) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= questions.length) { setDone(true); return }
    setIdx(i => i + 1); setSelected(null); setRevealed(false)
  }

  const retry = () => { setIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false) }

  if (set && !questions.length) {
    const Icon = set === 'important' ? Bookmark : set === 'weak' ? Flame : Star
    return (
      <div className="quiz-page anim-fade">
        <div className="quiz-topbar">
          <button className="back-btn" onClick={goBack}><ChevronLeft size={15} /> Back</button>
          <span className="quiz-topic-pill" style={{ color: topic.color }}>{topic.shortName || topic.name}</span>
          <TopbarActions />
        </div>
        <div className="quiz-pool-empty">
          <Icon size={38} className={`quiz-pool-empty-icon ${set}`} fill="currentColor" />
          <p>{topic.name}-এ এখনো কোনো {POOL_LABEL[set]} প্রশ্ন নেই।</p>
          <button className="back-btn" onClick={goBack}><ChevronLeft size={15} /> ফিরে যাও</button>
        </div>
      </div>
    )
  }

  if (!q || done) {
    return <ScoreRingScreen score={score} total={questions.length} title={set ? `${POOL_LABEL[set]} Quiz Complete!` : 'Quiz Complete!'} onRetry={retry} onHome={goHome} />
  }

  const progress  = ((idx + (revealed ? 1 : 0)) / questions.length) * 100
  const isCorrect = selected === q.correct_answer

  function getTopicGroup(t) {
    if (topicGroupProp) return topicGroupProp
    if (!t) return []
    if (BANGLA_TOPICS.some(x => x.id === t.id))       return BANGLA_TOPICS
    if (ENGLISH_TOPICS.some(x => x.id === t.id))      return ENGLISH_TOPICS
    if (BANGLA_SAHITYA_TOPICS.some(x => x.id === t.id)) return BANGLA_SAHITYA_TOPICS
    if (LIVEMCQ_TOPICS.some(x => x.id === t.id))        return LIVEMCQ_TOPICS
    return GK_TOPICS
  }

  return (
    <div className="quiz-page anim-fade">
      <div className="quiz-topbar">
        <button className="back-btn" onClick={goBack}>
          <ChevronLeft size={15} /> Back
        </button>
        <span className="quiz-topic-pill" style={{ color: topic.color }}>{topic.shortName || topic.name}</span>
        <TopbarActions>
          {getTopicGroup(topic).length > 1 && (
            <button className="cat-browse-btn" onClick={() => setSidebarOpen(true)} title="Browse topics">
              <LayoutGrid size={16} />
            </button>
          )}
        </TopbarActions>
      </div>

      <CategorySidebar
        topics={getTopicGroup(topic).map(t => ({
          id: t.id, name: t.name,
          icon: () => <span style={{ fontSize: 14 }}>{t.icon ? <t.icon size={14} /> : '●'}</span>,
          color: t.color
        }))}
        currentTopicId={topic.id}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(t) => goTopic(t)}
      />

      <div className="quiz-progress-wrap">
        <div className="quiz-progress-header">
          <span className="quiz-qnum">
            Question {idx + 1} of {questions.length}
            {set && <span className={`quiz-pool-tag ${set}`}>{POOL_LABEL[set]}</span>}
          </span>
          <span className="quiz-pct">{Math.round(progress)}%</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ '--progress': progress / 100, background: topic.color }} />
        </div>
      </div>

      <div className="quiz-card anim-slide">
        <div className="hl-q-root" data-hl-root={qid || undefined} onClick={qid ? guardHighlightClick : undefined}>
          <Highlightable as="div" className="quiz-question" block="q" html={q.question} highlights={hlQ} />
        </div>

        <QuizOptions options={q.options} correctAnswer={q.correct_answer} selected={selected} revealed={revealed} accentColor={topic.color} onPick={pick} />

        {revealed && (
          <div className="quiz-revealed-actions">
            <div className="quiz-mark-btns">
              <button
                className={`quiz-nail-btn${isNailed ? ' nailed' : ''}`}
                onClick={() => isNailed ? unnail(qid) : nail(qid)}
                title={isNailed ? 'Nailed — click to un-nail' : 'Mark as Nailed It'}
              >
                <Star size={16} fill={isNailed ? 'currentColor' : 'none'} strokeWidth={1.8} />
                <span className="qmark-label">{isNailed ? 'Nailed!' : 'Nail It'}</span>
              </button>
              <button
                className={`quiz-important-btn${isImportant ? ' marked' : ''}`}
                onClick={() => isImportant ? unmarkImportant(qid) : markImportant(qid)}
                title={isImportant ? 'Important — click to remove' : 'Mark as Important'}
              >
                <Bookmark size={16} fill={isImportant ? 'currentColor' : 'none'} strokeWidth={1.8} />
                <span className="qmark-label">{isImportant ? 'Saved!' : 'Important'}</span>
              </button>
              {isImportant && !isNailed && (
                <button
                  className={`quiz-weak-btn${isWeak ? ' marked' : ''}`}
                  onClick={() => isWeak ? unmarkWeak(qid) : markWeak(qid)}
                  title={isWeak ? 'Weak — click to remove' : 'Mark as Weak — এখনো পারি না'}
                >
                  <Flame size={16} fill={isWeak ? 'currentColor' : 'none'} strokeWidth={1.8} />
                  <span className="qmark-label">{isWeak ? 'Weak!' : 'Weak'}</span>
                </button>
              )}
              <DeleteButton question={q} className="quiz-nail-btn" size={16} onDeleted={next} />
              <QuestionEditButton question={q} categorySlug={topic.id} className="quiz-nail-btn" size={16} />
            </div>
            <button className="quiz-next-btn" onClick={next}>
              {idx + 1 >= questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {revealed && q.explanation && (
          <div className="explanation-box anim-slide" data-hl-root={qid || undefined} style={{ '--c': topic.color }}>
            <div className="explanation-header">
              <Lightbulb size={14} style={{ color: topic.color, flexShrink: 0 }} />
              <span className="explanation-label" style={{ color: topic.color }}>ব্যাখ্যা</span>
              <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? '✓ সঠিক' : '✗ ভুল'}
              </span>
            </div>
            <Highlightable as="div" className="explanation-text"
              block="explanation" html={q.explanation} highlights={hlExp} />
          </div>
        )}
      </div>
    </div>
  )
}
