import { StickyNote } from 'lucide-react'
import Highlightable from './Highlightable.jsx'
import { useHighlights } from '../../contexts/HighlightContext.jsx'

// Shows the saved note above the question, so it's a standing reminder you see
// before you even attempt it — not gated behind "reveal answer" like the
// explanation is. Renders nothing when there's no note. The text is
// highlightable, block 'note', same mechanism as the question/explanation.
export default function NoteCallout({ uid, text, onEdit }) {
  const { getFor } = useHighlights()
  if (!text) return null
  const hl = uid ? getFor(uid).filter(h => h.block === 'note') : undefined

  return (
    <div className="note-callout shown" data-hl-root={uid || undefined}>
      <div className="note-callout-head">
        <StickyNote size={14} />
        <span>Your note</span>
        <button type="button" className="note-callout-edit" onClick={onEdit}>Edit</button>
      </div>
      <Highlightable as="p" className="note-callout-text" block="note" html={text} highlights={hl} />
    </div>
  )
}
