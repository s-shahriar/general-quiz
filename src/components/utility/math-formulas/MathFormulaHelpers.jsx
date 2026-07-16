import katex from 'katex'
import { AlertTriangle, Lightbulb, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useImportantContext } from '../../../contexts/ImportantContext.jsx'
import { mathUidOfText } from '../../../lib/qid.js'

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

export function Tex({ children }) {
  const html = katex.renderToString(String(children), { throwOnError: false, displayMode: false })
  return <span className="mf-tex" dangerouslySetInnerHTML={{ __html: html }} />
}

export function FBox({ label, val, tex, highlight }) {
  return (
    <div className={`mf-f-box${highlight ? ' highlight' : ''}`}>
      <span className="label">{label}</span>
      <span className="val">{tex ? <Tex>{tex}</Tex> : val}</span>
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

export function IdItem({ n, star, children }) {
  return (
    <div className="mf-id-item">
      <div className={`mf-id-num${star ? ' star' : ''}`}>{star ? '★' : n}</div>
      <div className="mf-id-text">{children}</div>
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
