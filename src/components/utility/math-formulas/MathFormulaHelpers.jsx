import katex from 'katex'
import { AlertTriangle, Lightbulb, Star } from 'lucide-react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useImportantContext } from '../../../contexts/ImportantContext.jsx'
import { mathUidOfText } from '../../../lib/qid.js'

// Cover-and-recall study mode. When ON, every FBox hides its formula value
// (name stays visible) so you can try to recall it, then tap to reveal.
const CoverCtx = createContext(false)
export function CoverProvider({ value, children }) {
  return <CoverCtx.Provider value={value}>{children}</CoverCtx.Provider>
}
export const useCover = () => useContext(CoverCtx)

export function SectionHeader({ icon, title, sub }) {
  return (
    <div className="mf-sec-header">
      <div className="mf-sec-icon" style={{background:'var(--elevated)'}}>{icon}</div>
      <div>
        <div className="mf-sec-title">{title}</div>
        <div className="mf-sec-sub">{sub}</div>
      </div>
    </div>
  )
}

export function Card({ color = 'gold', children, style, markable = true }) {
  const ref = useRef(null)
  const [uid, setUid] = useState(null)
  const { value: important, add, remove } = useImportantContext()

  // Derive a stable identity once mounted: "<sectionId>::<card title>" (falls
  // back to full text for the rare title-less card). Body edits keep the flag.
  useEffect(() => {
    if (!markable || !ref.current) return
    const sectionId = ref.current.closest('.mf-section')?.id || ''
    const title = ref.current.querySelector('.mf-card-title')?.textContent
    setUid(mathUidOfText(`${sectionId}::${title || ref.current.textContent || ''}`))
  }, [markable])

  const isImportant = uid ? important.has(uid) : false
  const toggle = () => { if (uid) (isImportant ? remove : add)(uid) }

  return (
    <div ref={ref} className={`mf-card ${color}${isImportant ? ' is-important' : ''}`} style={style}>
      {markable && (
        <button
          type="button"
          className={`mf-imp-btn${isImportant ? ' on' : ''}`}
          onClick={toggle}
          aria-pressed={isImportant}
          title={isImportant ? 'Important — সরাতে ক্লিক করুন' : 'Important হিসেবে সেভ করুন'}
        >
          <Star size={15} fill={isImportant ? 'currentColor' : 'none'} />
        </button>
      )}
      {children}
    </div>
  )
}

export function CardTitle({ color, badge, badgeStyle, children }) {
  return (
    <div className="mf-card-title" style={color ? {color} : {}}>
      {children}
      {badge && <span className="mf-badge" style={badgeStyle}>{badge}</span>}
    </div>
  )
}

// `noCover` opts out of self-covering — used when a parent (e.g. FBox) owns the
// cover/reveal so the whole card is one tap target, label included.
export function Tex({ children, noCover }) {
  const ctxCovered = useCover()
  const covered = ctxCovered && !noCover
  const [revealed, setRevealed] = useState(false)
  // Re-hide on each (re)entry to cover mode for a fresh recall pass.
  useEffect(() => { if (covered) setRevealed(false) }, [covered])
  const html = katex.renderToString(String(children), { throwOnError: false, displayMode: false })
  const hide = covered && !revealed
  return (
    <span
      className={`mf-tex${hide ? ' mf-tex-covered' : ''}`}
      onClick={covered ? (e) => { e.stopPropagation(); setRevealed(r => !r) } : undefined}
      role={covered ? 'button' : undefined}
      title={covered ? (hide ? 'দেখতে ট্যাপ করুন' : 'আবার ঢাকতে ট্যাপ করুন') : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Renders "LHS = RHS" with the LHS (through the first '=') visible as the recall
// cue and only the RHS answer covered. The span itself is the tap target. Use for
// standalone equation boxes where the left side names what you're solving for.
export function CoverEq({ children }) {
  const covered = useCover()
  const [revealed, setRevealed] = useState(false)
  useEffect(() => { if (covered) setRevealed(false) }, [covered])
  const tex = String(children)
  const i = tex.indexOf('=')
  const lhs = i > -1 ? tex.slice(0, i + 1) : null
  const rhs = i > -1 ? tex.slice(i + 1).trim() : tex
  const hasCover = !!(covered && rhs)
  const hide = hasCover && !revealed
  return (
    <span
      className={`mf-eq${hide ? ' mf-covered' : ''}`}
      onClick={hasCover ? (e) => { e.stopPropagation(); setRevealed(r => !r) } : undefined}
      role={hasCover ? 'button' : undefined}
      title={hasCover ? (hide ? 'দেখতে ট্যাপ করুন' : 'আবার ঢাকতে ট্যাপ করুন') : undefined}
    >
      {lhs && <Tex noCover>{lhs}</Tex>}{lhs ? ' ' : ''}
      <span className="mf-eq-rhs"><Tex noCover>{rhs}</Tex></span>
    </span>
  )
}

// A probability/definition row: a visible condition (cue) plus a formula. Pass
// `lhs`+`rhs` to keep the formula's left side (e.g. "P(A∩B) =") visible and cover
// only the answer, or `form` to cover the whole formula. The row taps to reveal.
export function ProbForm({ cond, form, lhs, rhs }) {
  const covered = useCover()
  const [revealed, setRevealed] = useState(false)
  useEffect(() => { if (covered) setRevealed(false) }, [covered])
  const coverText = rhs != null ? rhs : form
  const hasCover = !!(covered && coverText)
  const hide = hasCover && !revealed
  return (
    <div className="mf-prob-item">
      <div className="cond">{cond}</div>
      <div
        className={`form${hide ? ' mf-covered' : ''}`}
        onClick={hasCover ? () => setRevealed(r => !r) : undefined}
        role={hasCover ? 'button' : undefined}
        title={hasCover ? (hide ? 'দেখতে ট্যাপ করুন' : 'আবার ঢাকতে ট্যাপ করুন') : undefined}
      >
        {lhs != null && <span className="mf-form-lhs">{lhs} </span>}
        <span className="mf-form-rhs">{coverText}</span>
      </div>
    </div>
  )
}

export function FBox({ label, val, tex, highlight }) {
  const covered = useCover()
  const [revealed, setRevealed] = useState(false)
  // Whenever cover mode is (re)enabled, start hidden again for a fresh pass.
  useEffect(() => { if (covered) setRevealed(false) }, [covered])
  // FBox owns the cover for its value (plain OR formula) so the *whole* card —
  // label included — is one tap target. The inner Tex opts out via `noCover` to
  // avoid double-blur / a competing click zone.
  const hide = covered && !revealed
  return (
    <div
      className={`mf-f-box${highlight ? ' highlight' : ''}${hide ? ' mf-covered' : ''}`}
      onClick={covered ? () => setRevealed(r => !r) : undefined}
      role={covered ? 'button' : undefined}
      title={covered ? (hide ? 'দেখতে ট্যাপ করুন' : 'আবার ঢাকতে ট্যাপ করুন') : undefined}
    >
      <span className="label">{label}</span>
      <span className="val">{tex ? <Tex noCover>{tex}</Tex> : val}</span>
    </div>
  )
}

export function Mem({ title, children, style }) {
  const label = title?.replace(/💡\s*/g, '')
  return (
    <div className="mf-mem" style={style}>
      <div className="mf-mem-title"><Lightbulb size={13} style={{ flexShrink: 0 }} />{label}</div>
      {children}
    </div>
  )
}

export function Warn({ title, children, style }) {
  const label = title?.replace(/⚠️\s*/g, '')
  return (
    <div className="mf-warn" style={style}>
      <div className="mf-warn-title"><AlertTriangle size={13} style={{ flexShrink: 0 }} />{label}</div>
      {children}
    </div>
  )
}

export function IdItem({ n, star, children, tex }) {
  const covered = useCover()
  const [revealed, setRevealed] = useState(false)
  useEffect(() => { if (covered) setRevealed(false) }, [covered])

  // With `tex`, split "LHS = RHS" at the first '=': the left side (through '=')
  // stays visible as the recall cue and only the answer (RHS) is covered. The
  // whole row is one tap target. Without `tex`, render children unchanged.
  let lhs = null, rhs = null
  if (tex) {
    const i = tex.indexOf('=')
    if (i > -1) { lhs = tex.slice(0, i + 1); rhs = tex.slice(i + 1).trim() }
    else { rhs = tex }
  }
  const hasCover = !!(tex && covered && rhs)
  const hide = hasCover && !revealed
  return (
    <div
      className={`mf-id-item${hide ? ' mf-covered' : ''}`}
      onClick={hasCover ? () => setRevealed(r => !r) : undefined}
      role={hasCover ? 'button' : undefined}
      title={hasCover ? (hide ? 'দেখতে ট্যাপ করুন' : 'আবার ঢাকতে ট্যাপ করুন') : undefined}
    >
      <div className={`mf-id-num${star ? ' star' : ''}`}>{star ? '★' : n}</div>
      <div className="mf-id-text">
        {tex ? (
          <>
            {lhs && <Tex noCover>{lhs}</Tex>}{' '}
            <span className="mf-id-rhs">{rhs && <Tex noCover>{rhs}</Tex>}</span>
          </>
        ) : children}
      </div>
    </div>
  )
}

export function StatBox({ val, label, color }) {
  return (
    <div style={{textAlign:'center',background:'var(--elevated)',borderRadius:8,padding:10}}>
      <div style={{fontSize:28,fontWeight:700,color}}>{val}</div>
      <div style={{fontSize:12,color:'var(--text-3)'}}>{label}</div>
    </div>
  )
}
