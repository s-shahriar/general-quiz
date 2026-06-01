import { CheckCircle, XCircle } from 'lucide-react'

export default function QuizOptions({ options, correctAnswer, selected, revealed, accentColor, onPick }) {
  const keys = Object.keys(options)
  return (
    <div className="quiz-options">
      {keys.map(key => {
        let cls = 'opt-btn'
        if (revealed) {
          if (key === correctAnswer) cls += ' correct revealed'
          else if (key === selected)    cls += ' wrong revealed'
          else                          cls += ' dim revealed'
        }
        return (
          <button key={key} className={cls} style={{ '--c': accentColor }} onClick={() => onPick(key)}>
            <span className="opt-key">{key.toUpperCase()}</span>
            <span className="opt-text">{options[key]}</span>
            {revealed && key === correctAnswer && <CheckCircle size={15} className="opt-icon" style={{ color: '#10b981' }} />}
            {revealed && key === selected && key !== correctAnswer && <XCircle size={15} className="opt-icon" style={{ color: '#ef4444' }} />}
          </button>
        )
      })}
    </div>
  )
}
