import { ArrowUpRight, ChevronDown, ChevronUp, Lightbulb, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce.js'
import { uidOf } from '../lib/qid.js'
import Pagination from './shared/Pagination'
import RichText from './shared/RichText'

const PAGE_SIZE = 8

// Normalize for flexible matching, incl. Bangla:
//  - NFC so differently-encoded but identical text matches,
//  - drop zero-width joiners/non-joiners (common in Bangla conjuncts),
//  - strip punctuation (incl. Bangla dari/quotes), collapse whitespace.
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g
const PUNCT = /[?।!,.;:'"’‘“”()[\]{}<>—–\-_/\\|*•]+/g
const normalize = (s) =>
  (s ?? '').toString().normalize('NFC').replace(ZERO_WIDTH, '').toLowerCase()
    .replace(PUNCT, ' ').replace(/\s+/g, ' ').trim()

export default function GroupSearch({ topics, groupLabel, onActiveChange, initialQuery = '', homePath = '/' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [page, setPage]   = useState(1)
  const debounced = useDebounce(query, 250)
  const term = normalize(debounced)
  const tokens = term ? term.split(' ') : []

  const results = useMemo(() => {
    if (!tokens.length) return []
    const out = []
    const seen = new Set() // collapse duplicate questions that recur across topics
    for (const t of topics) {
      t.questions.forEach((q) => {
        if (!q.options || !q.correct_answer) return
        const key = normalize(q.question)
        if (seen.has(key)) return
        const haystack =
          key + ' ' +
          Object.values(q.options).map(normalize).join(' ') + ' ' +
          normalize(q.explanation)
        // flexible match: every word in the query must appear somewhere,
        // in any order (so "ধ্বনি পার্শ্বিক" finds "পার্শ্বিক ধ্বনি …").
        if (tokens.every(tok => haystack.includes(tok))) {
          seen.add(key)
          out.push({ q, topic: t, qid: uidOf(q) })
        }
      })
    }
    return out
  }, [term, topics]) // eslint-disable-line react-hooks/exhaustive-deps

  // Let the parent hide the rest of the home screen while a search is active.
  const active = tokens.length > 0
  useEffect(() => { onActiveChange?.(active) }, [active, onActiveChange])

  // Reset to page 1 whenever the (debounced) search term changes — adjust state
  // during render to avoid a setState-in-effect cascade.
  const [prevTerm, setPrevTerm] = useState(term)
  if (prevTerm !== term) {
    setPrevTerm(term)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems  = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="group-search">
      <div className="gs-input-wrap">
        <Search className="gs-icon" size={16} />
        <input
          className="gs-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search all ${groupLabel} questions…`}
          aria-label="Search questions"
        />
        {query && (
          <button className="gs-clear" onClick={() => setQuery('')} title="Clear">
            <X size={15} />
          </button>
        )}
      </div>

      {term && (
        <div className="gs-results anim-fade">
          <p className="gs-meta">
            {results.length} result{results.length !== 1 ? 's' : ''} for “{debounced.trim()}”
          </p>

          {results.length === 0 ? (
            <div className="gs-empty">
              <Search size={30} style={{ opacity: 0.35, marginBottom: 8 }} />
              <p>No questions match your search.</p>
            </div>
          ) : (
            <>
              <div className="gs-list">
                {pageItems.map(({ q, topic, qid }) => (
                  <ResultCard
                    key={`${topic.id}-${q.question}`}
                    q={q}
                    topic={topic}
                    onOpen={() => {
                      // Make the home entry carry the search so BOTH the in-app
                      // Back (via state) and the browser Back land on it.
                      const home = homePath + '?search=' + encodeURIComponent(query)
                      navigate(home, { replace: true })
                      navigate('/topic/' + topic.id + '/study?q=' + qid, { state: { backTo: home } })
                    }}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ResultCard({ q, topic, onOpen }) {
  const Icon = topic.icon
  // LiveMCQ explanations are long, so keep them folded by default in search.
  const isLm = topic.id?.startsWith('lm_')
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="gs-card" style={{ '--c': topic.color }}>
      <button className="gs-card-topic" onClick={onOpen} title={`Open ${topic.name} in study mode`}>
        {Icon && <Icon size={13} />}
        <span>{topic.name}</span>
        <ArrowUpRight size={13} className="gs-card-open" />
      </button>

      <RichText as="p" className="gs-card-q" html={q.question} />

      {q.correct_answer && q.options?.[q.correct_answer] && (
        <div className="gs-card-ans">
          <span className="gs-ans-key">{q.correct_answer.toUpperCase()}</span>
          <RichText className="gs-ans-text" html={q.options[q.correct_answer]} />
        </div>
      )}

      {q.explanation && (isLm ? (
        <>
          <button className="gs-exp-toggle" onClick={() => setExpanded(v => !v)} style={{ '--c': topic.color }}>
            <Lightbulb size={12} style={{ color: topic.color, flexShrink: 0 }} />
            ব্যাখ্যা
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {expanded && (
            <div className="gs-card-exp gs-card-exp-open">
              <RichText as="div" html={q.explanation} />
            </div>
          )}
        </>
      ) : (
        <div className="gs-card-exp">
          <Lightbulb size={12} style={{ color: topic.color, flexShrink: 0, marginTop: 1 }} />
          <RichText as="div" html={q.explanation} />
        </div>
      ))}
    </div>
  )
}
