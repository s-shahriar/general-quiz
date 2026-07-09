import { useEffect, useState } from 'react'
import { isLiveMcqLoaded, loadLiveMcq } from '../data/livemcqLoader.js'

// Returns whether the lazy LiveMCQ data is loaded. Pass enabled=true only where
// the data is actually needed (LiveMCQ home / lm_* topics / exam), so other
// modules never trigger the fetch. Re-renders the caller once data arrives.
export function useLiveMcqReady(enabled = true) {
  const [ready, setReady] = useState(isLiveMcqLoaded())
  useEffect(() => {
    if (!enabled || ready) return
    let alive = true
    loadLiveMcq().then(() => { if (alive) setReady(true) })
    return () => { alive = false }
  }, [enabled, ready])
  return ready
}
