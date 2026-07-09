// Renders quiz content that may carry HTML (sup/sub for math, <img> figures,
// tables, <strong>/<em>/<u>) OR just HTML entities (e.g. &gt; &lt; &amp; &#39;).
// - real tags  -> render the (pre-sanitized) HTML
// - entities only, no tags -> decode entities to plain text (safe; tags NOT parsed)
// - plain text -> as-is
// Older topics are plain text and render unchanged.
const TAG_RE = /<[a-z!/][\s\S]*?>/i
const ENT_RE = /&(#\d+|#x[0-9a-f]+|[a-z]+);/i

let _ta = null
function decodeEntities(s) {
  if (typeof document === 'undefined') return s
  if (!_ta) _ta = document.createElement('textarea')
  _ta.innerHTML = s          // textarea decodes entities but does NOT parse tags
  return _ta.value
}

export default function RichText({ html, as: Tag = 'span', className }) {
  const s = html == null ? '' : String(html)
  if (TAG_RE.test(s)) {
    const cls = className ? `${className} rich` : 'rich'
    return <Tag className={cls} dangerouslySetInnerHTML={{ __html: s }} />
  }
  const text = ENT_RE.test(s) ? decodeEntities(s) : s
  return <Tag className={className}>{text}</Tag>
}
