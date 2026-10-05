// Branded loader: an open book whose page lines write themselves, then the
// bookmark ribbon drops in. Colours come from the theme tokens (marigold in
// light, warm gold in dark), so it follows the theme with no extra work.
//
//   <Loader />                       centered block
//   <Loader label="লোড হচ্ছে…" />     with a caption
//   <Loader full />                  fills a screen-height area (route fallbacks)
//   <Loader inline />                small, sits in a line of text/buttons
//   <Loader bar />                   thin indeterminate bar (top of a panel)
export function LoaderMark({ size = 48 }) {
  return (
    <svg className="gq-loader-mark" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {/* the open book */}
      <path className="gq-ld-cover" pathLength="1" d="M24 13C18.5 10.2 11.5 10 6 12.4V36.6C11.5 34.4 18.5 34.8 24 38C29.5 34.8 36.5 34.4 42 36.6V12.4C36.5 10 29.5 10.2 24 13Z" />
      <path className="gq-ld-spine" pathLength="1" d="M24 13V38" />
      {/* text lines, written one after another */}
      <path className="gq-ld-line gq-ld-l1" pathLength="1" d="M10.5 19C14 18 17.5 18.1 20.5 19.2" />
      <path className="gq-ld-line gq-ld-l2" pathLength="1" d="M10.5 24.2C14 23.2 17.5 23.3 20.5 24.4" />
      <path className="gq-ld-line gq-ld-l3" pathLength="1" d="M10.5 29.4C13.5 28.6 16.5 28.7 19 29.5" />
      {/* bookmark on the right page */}
      <path className="gq-ld-mark" pathLength="1" d="M31 12.4V25L34.5 22.2L38 25V11.6" />
      <path className="gq-ld-line gq-ld-l4" pathLength="1" d="M27.5 30C31 29 35 29.1 38.5 30.2" />
    </svg>
  )
}

export default function Loader({ label, inline = false, bar = false, full = false, size, className = '' }) {
  if (bar) {
    return (
      <div className={`gq-loader-bar ${className}`} role="progressbar" aria-label={label || 'Loading'} aria-busy="true">
        <span />
      </div>
    )
  }
  if (inline) {
    return (
      <span className={`gq-loader gq-loader-inline ${className}`} role="status" aria-live="polite" aria-busy="true">
        <LoaderMark size={size || 18} />
        {label ? <span className="gq-loader-label">{label}</span> : <span className="sr-only-gq">Loading</span>}
      </span>
    )
  }
  return (
    <div className={`gq-loader${full ? ' gq-loader-full' : ''} ${className}`} role="status" aria-live="polite" aria-busy="true">
      <LoaderMark size={size || 52} />
      {label ? <p className="gq-loader-label">{label}</p> : <span className="sr-only-gq">Loading</span>}
    </div>
  )
}
