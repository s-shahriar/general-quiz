import { Home, Trophy } from 'lucide-react'

export default function ScoreRingScreen({ score, total, title, label, accentColor = '#6366f1', messages, onRetry, onHome }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const msg =
    pct >= 80 ? (messages?.excellent ?? 'Excellent!') :
    pct >= 60 ? (messages?.good ?? 'Good job!') :
    pct >= 40 ? (messages?.ok ?? 'Keep practicing.') :
                (messages?.low ?? "Don't give up!")

  const r = 54, circumference = 2 * Math.PI * r
  const strokeOffset = circumference - (pct / 100) * circumference

  return (
    <div className="score-page anim-fade">
      <div className="score-card">
        <Trophy size={44} className="score-trophy" style={{ color: accentColor }} />
        <div className="score-title">{title}</div>
        {label && <div className="exam-score-label">{label}</div>}

        <div className="score-ring-wrap">
          <svg className="score-ring-svg" width="138" height="138" viewBox="0 0 138 138">
            <circle className="score-ring-bg" cx="69" cy="69" r={r} />
            <circle className="score-ring-fill" cx="69" cy="69" r={r}
              stroke={accentColor} strokeDasharray={circumference} strokeDashoffset={strokeOffset}
              style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }} />
          </svg>
          <div className="score-ring-text">
            <div className="score-fraction" style={{ color: accentColor }}>
              {score}<span className="score-total">/{total}</span>
            </div>
            <div className="score-pct">{pct}%</div>
          </div>
        </div>

        <div className="score-msg">{msg}</div>
        <div className="score-actions">
          <button className="score-retry" onClick={onRetry}>Try Again</button>
          <button className="score-home" style={{ background: accentColor }} onClick={onHome}>
            <Home size={15} /> Home
          </button>
        </div>
      </div>
    </div>
  )
}
