import { Zap, Star, Bookmark } from 'lucide-react'

export default function ActionCardsRow({ totalNailed, totalImportant, onExam, onNailed, onImportant }) {
  return (
    <div className="home-action-row home-action-row--3">
      <button className="action-card exam-card" onClick={onExam}>
        <div className="ac-shine" aria-hidden="true" />
        <div className="ac-body">
          <div className="ac-icon-wrap ac-icon-wrap--exam">
            <Zap size={22} className="ac-icon" />
          </div>
          <div className="ac-label">Exam Mode</div>
          <div className="ac-sub">Test yourself</div>
        </div>
        <div className="ac-footer ac-footer--exam">
          Start <span className="ac-arrow">→</span>
        </div>
      </button>

      <button className="action-card nailed-card" onClick={onNailed}>
        <div className="ac-shine" aria-hidden="true" />
        <div className="ac-body">
          <div className="ac-icon-wrap ac-icon-wrap--nailed">
            <Star size={20} fill="currentColor" className="ac-icon" />
          </div>
          <div className="ac-label">Nailed It</div>
          <div className="ac-sub">{totalNailed} saved</div>
        </div>
        <div className="ac-footer ac-footer--nailed">
          View <span className="ac-arrow">→</span>
        </div>
      </button>

      <button className="action-card important-card" onClick={onImportant}>
        <div className="ac-shine" aria-hidden="true" />
        <div className="ac-body">
          <div className="ac-icon-wrap ac-icon-wrap--important">
            <Bookmark size={20} fill="currentColor" className="ac-icon" />
          </div>
          <div className="ac-label">Important</div>
          <div className="ac-sub">{totalImportant} saved</div>
        </div>
        <div className="ac-footer ac-footer--important">
          View <span className="ac-arrow">→</span>
        </div>
      </button>
    </div>
  )
}
