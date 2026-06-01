import katex from 'katex'
import { AlertTriangle, Lightbulb } from 'lucide-react'

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

export function Card({ color = 'gold', children, style }) {
  return (
    <div className={`mf-card ${color}`} style={style}>
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
