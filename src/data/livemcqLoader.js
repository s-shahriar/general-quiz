// Lazy-loads the LiveMCQ question data (kept out of the JS bundle) from static
// JSON in /lmdata/*.json, filling each topic's `questions` in place. One shared
// promise, so it runs at most once no matter how many components request it.
import { LIVEMCQ_TOPICS } from './index.js'

let _promise = null
let _loaded = false

export function isLiveMcqLoaded() {
  return _loaded
}

export function loadLiveMcq() {
  if (_promise) return _promise
  const base = import.meta.env.BASE_URL || '/'
  _promise = Promise.all(
    LIVEMCQ_TOPICS.map(async (t) => {
      try {
        const res = await fetch(`${base}lmdata/${t.file}.json`)
        const data = await res.json()
        t.questions = data.questions || []
      } catch {
        t.questions = []
      }
    })
  ).then(() => { _loaded = true })
  return _promise
}
