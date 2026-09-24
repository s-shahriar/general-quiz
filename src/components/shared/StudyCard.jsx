import { useState } from 'react'
import { Bookmark, CheckCircle, Flame, Lightbulb, Star, XCircle } from 'lucide-react'
import RichText from './RichText'
import Highlightable from './Highlightable.jsx'
import { guardHighlightClick } from '../../lib/textAnchor.js'
import { useHighlights } from '../../contexts/HighlightContext.jsx'
import { uidOf } from '../../lib/qid.js'
import DeleteButton from './DeleteButton.jsx'
import QuestionEditButton from './QuestionEditButton.jsx'

// One study-mode question card: prompt, tappable options that reveal the answer,
// and the explanation. Shared by StudyMode (single topic) and the saved screens
// (Important / Nailed), where the saved set can span several topics — those pass
// `topicLabel` so each card still says which topic it came from.
export default function StudyCard({
  domId,
  question: q,
  index,
  color,
  topicLabel,
  categoryId,       // the topic this card is listed under — enables the Topic control on LiveMCQ
  nailed,
  isImportant,
  isWeak,
  onNail,
  onMarkImportant,
  onUnmarkImportant,
  onMarkWeak,
  onUnmarkWeak,
}) {
  // Explanations are highlightable, keyed by the question uid. Block key
  // 'explanation' — an MCQ answer has one text block, so it needs no index.
  // Questions here carry no _uid field — identity is derived from the text,
  // the same way StudyMode and QuizMode derive it for the nailed/important flags.
  const { getFor } = useHighlights()
  const qid = uidOf(q)
  const hlExp = qid ? getFor(qid).filter(h => h.block === 'explanation') : undefined
  // The question is highlightable too, as its own block on the same uid.
  const hlQ = qid ? getFor(qid).filter(h => h.block === 'q') : undefined

  const [shown, setShown]       = useState(false)
  const [selected, setSelected] = useState(null)
  // Questions may have 4 OR 5 options (LiveMCQ uses up to `e`); keep canonical order.
  const opts = ['a','b','c','d','e'].filter(k => q.options?.[k])

  const pick = (key) => {
    if (shown) return
    setSelected(key)
    setShown(true)
  }

  return (
    <div id={domId} className={`study-card${nailed ? ' study-card-nailed' : ''}`} style={{ '--c': color }}>
      <div className="study-card-top">
        <span className="study-card-lead">
          <span className="study-qnum" style={{ color }}>Q{index + 1}</span>
          {topicLabel && (
            <span className="study-topic-badge" style={{ color, borderColor: `color-mix(in srgb, ${color} 33%, transparent)`, background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
              {topicLabel}
            </span>
          )}
        </span>
        <div className="study-card-actions">
          <button
            className={`nail-btn${nailed ? ' nailed' : ''}`}
            onClick={onNail}
            title={nailed ? 'Nailed It — click to un-nail' : 'Mark as Nailed It'}
            style={nailed ? { color, borderColor: `color-mix(in srgb, ${color} 38%, transparent)`, background: `color-mix(in srgb, ${color} 8%, transparent)` } : {}}
          >
            <Star size={12} fill={nailed ? 'currentColor' : 'none'} />
            <span className="qmark-label">{nailed ? 'Nailed ✓' : 'Nail It'}</span>
          </button>
          <button
            className={`nail-btn important-study-btn${isImportant ? ' nailed' : ''}`}
            onClick={isImportant ? onUnmarkImportant : onMarkImportant}
            title={isImportant ? 'Important — click to remove' : 'Mark as Important'}
            style={isImportant ? { color: 'var(--imp)', borderColor: 'color-mix(in srgb, var(--imp) 40%, transparent)', background: 'color-mix(in srgb, var(--imp) 10%, transparent)' } : {}}
          >
            <Bookmark size={12} fill={isImportant ? 'currentColor' : 'none'} />
            <span className="qmark-label">{isImportant ? 'Important ✓' : 'Important'}</span>
          </button>
          {/* Weak = an Important question you still can't answer, so only those offer it. */}
          {isImportant && !nailed && onMarkWeak && (
            <button
              className={`nail-btn weak-study-btn${isWeak ? ' nailed' : ''}`}
              onClick={isWeak ? onUnmarkWeak : onMarkWeak}
              title={isWeak ? 'Weak — click to remove' : 'Mark as Weak — এখনো পারি না'}
              style={isWeak ? { color: 'var(--weak)', borderColor: 'color-mix(in srgb, var(--weak) 40%, transparent)', background: 'color-mix(in srgb, var(--weak) 10%, transparent)' } : {}}
            >
              <Flame size={12} fill={isWeak ? 'currentColor' : 'none'} />
              <span className="qmark-label">{isWeak ? 'Weak ✓' : 'Weak'}</span>
            </button>
          )}
          <DeleteButton question={q} className="nail-btn" size={12} />
          <QuestionEditButton question={q} categorySlug={categoryId || q._slug} className="nail-btn" size={12} />
          {shown && (
            <button className="study-toggle" onClick={() => { setShown(false); setSelected(null) }} style={{ color }}>
              Hide
            </button>
          )}
        </div>
      </div>

      <div className="hl-q-root" data-hl-root={qid || undefined} onClick={qid ? guardHighlightClick : undefined}>
        <Highlightable as="div" className="study-question" block="q" html={q.question} highlights={hlQ} />
      </div>

      <div className="study-options">
        {opts.map(key => {
          const isCorrect = key === q.correct_answer
          const isWrong   = shown && key === selected && !isCorrect
          let cls = 'study-opt study-opt-clickable'
          if (shown) {
            if (isCorrect)    cls += ' correct'
            else if (isWrong) cls += ' wrong'
            else              cls += ' dim'
          }
          return (
            <button key={key} className={cls} onClick={() => pick(key)}>
              <span className="study-opt-key">{key.toUpperCase()}</span>
              <RichText className="study-opt-text" html={q.options[key]} />
              {shown && isCorrect && <CheckCircle size={13} style={{ color: 'var(--ok)', marginLeft: 'auto', flexShrink: 0 }} />}
              {shown && isWrong   && <XCircle size={13} style={{ color: 'var(--bad)', marginLeft: 'auto', flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>

      {shown && q.explanation && (
        <div className="explanation-box anim-slide" style={{ '--c': color }} data-hl-root={qid || undefined}>
          <div className="explanation-header">
            <Lightbulb size={14} style={{ color, flexShrink: 0 }} />
            <span className="explanation-label" style={{ color }}>Explanation</span>
          </div>
          <Highlightable as="div" className="explanation-text"
            block="explanation" html={q.explanation} highlights={hlExp} />
        </div>
      )}
    </div>
  )
}
