import { useLayoutEffect, useRef } from 'react'
import RichText from './RichText'
import { rangesFor } from '../../lib/textAnchor.js'
import { applyRanges } from '../../lib/highlightDom.js'

// A block of study prose that can be highlighted.
//
// Content still goes through RichText, so HTML explanations keep their tables,
// sup/sub and figures exactly as before. Highlights are then painted onto the
// rendered DOM (see lib/highlightDom.js) rather than by rebuilding the block
// from a string — that is the whole reason this differs from the ict-quiz
// version, where every block is plain text.
//
// No wrapper element: the ref and data-hl-block go straight onto whatever
// element RichText renders, so nothing about the existing layout changes.
//
// The effect re-runs when the content or the highlight set changes. React owns
// the inner HTML and rewrites it wholesale when `html` changes, which wipes our
// marks; re-running here puts them straight back.
export default function Highlightable({ html, block, highlights, as = 'div', className }) {
  const ref = useRef(null)
  const key = highlights?.map(h => `${h.id}:${h.color}`).join('|') || ''

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    applyRanges(el, highlights?.length ? rangesFor(el.textContent, highlights) : [])
  }, [html, key])

  return <RichText ref={ref} as={as} className={className} html={html} data-hl-block={block} />
}
