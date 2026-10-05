import Loader from './shared/Loader.jsx'

// Full-screen loader shown on open while the logged-in user's latest progress
// is pulled from the cloud — guarantees no stale nailed/important is shown.
export default function SyncOverlay({ label = 'আপনার সর্বশেষ প্রগ্রেস লোড হচ্ছে…' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <Loader label={label} size={64} />
    </div>
  )
}
