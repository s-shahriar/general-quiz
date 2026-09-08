// Apply highlight ranges to ALREADY-RENDERED content, by walking text nodes.
//
// ict-quiz can get away with splitting a plain string into segments, because
// every answer block there is plain text. Here it cannot: RichText renders real
// HTML for roughly half the explanations (tables, sup/sub, <strong>, figures),
// so rebuilding a block from a string would destroy the markup.
//
// Instead the block renders normally and this wraps the highlighted character
// ranges in <mark> afterwards, in place. Offsets are measured over the block's
// textContent, exactly what selectionToAnchors reads back, so the two agree
// regardless of how the markup nests.
//
// Inserting a <mark> never changes textContent, so offsets stay valid as more
// ranges are applied. Ranges are applied in DESCENDING order for the same
// reason: splitting a text node leaves everything BEFORE the split untouched,
// so the offsets an earlier range depends on survive.

import { DEFAULT_COLOR } from './highlightSync.js'

function textNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const out = []
  let pos = 0
  while (walker.nextNode()) {
    const n = walker.currentNode
    // Never highlight inside an existing mark; ranges are merged before they
    // get here, so an overlap would mean a bug, and nesting <mark> would make
    // the ids ambiguous on click.
    if (n.parentElement?.closest('.hl-mark')) { pos += n.length; continue }
    out.push({ node: n, start: pos, end: pos + n.length })
    pos += n.length
  }
  return out
}

// Remove marks this module added, restoring the block to its rendered form.
export function clearMarks(root) {
  for (const m of [...root.querySelectorAll('mark.hl-mark')]) {
    const parent = m.parentNode
    while (m.firstChild) parent.insertBefore(m.firstChild, m)
    parent.removeChild(m)
  }
  root.normalize()
}

export function applyRanges(root, ranges) {
  if (!root) return
  clearMarks(root)
  if (!ranges?.length) return

  for (const r of [...ranges].sort((a, b) => b.start - a.start)) {
    for (const nd of textNodes(root).reverse()) {
      const s = Math.max(r.start, nd.start)
      const e = Math.min(r.end, nd.end)
      if (e <= s) continue
      const range = document.createRange()
      range.setStart(nd.node, s - nd.start)
      range.setEnd(nd.node, e - nd.start)
      const mark = document.createElement('mark')
      mark.className = `hl-mark hl-c-${r.color || DEFAULT_COLOR}`
      mark.setAttribute('data-hl-ids', r.ids.join(','))
      mark.setAttribute('data-hl-color', r.color || DEFAULT_COLOR)
      // The range is clamped to a single text node, so this always succeeds;
      // guarded anyway so one odd node can never break the whole block.
      try { range.surroundContents(mark) } catch { /* leave that slice unmarked */ }
    }
  }
}
