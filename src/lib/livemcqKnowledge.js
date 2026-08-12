// ─────────────────────────────────────────────────────────────
//  Persisted "knowledge" for the no-AI category suggester.
//
//  The suggester needs every already-classified question's text + category.
//  Fetching those 2205 rows on each import is wasteful, because that corpus
//  only changes when THIS admin panel writes to it. So the corpus is cached in
//  localStorage and validated against a one-row server fingerprint.
//
//  Three tiers, cheapest first:
//    1. in-memory  — repeat imports in one session cost nothing at all
//    2. localStorage + fingerprint — one tiny request, no corpus download
//    3. the app's OWN module cache — `loadModule('livemcq')` already loads
//       exactly these rows for the quiz screens, so when the corpus really must
//       be fetched it is shared with the rest of the app rather than duplicated
//
//  Staleness is decided by the server, never guessed: `livemcq_fingerprint()`
//  hashes (id, category_id) over every live livemcq row, so an insert, a delete
//  OR a recategorise all invalidate the cache — including ones made from a
//  different browser or device. A stale suggestion is not dangerous (every
//  category is still confirmed by hand), but it is cheap to be exactly right.
// ─────────────────────────────────────────────────────────────
import { supabase } from './supabase.js'
import { LIVEMCQ_TOPICS } from '../data/index.js'
import { isModuleLoaded, loadModule } from '../data/contentLoader.js'
import { buildClassifier } from './livemcqClassify.js'

const CACHE_KEY = 'livemcq.knowledge.v1'
// Bump when the corpus shape or the tokenizer changes, so old caches are
// rejected instead of silently scoring under stale rules.
const FORMAT = 1

let memo = null          // { sig, clf } for this session
let inflight = null

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    if (!c || c.format !== FORMAT || !Array.isArray(c.rows) || !c.sig) return null
    return c
  } catch {
    return null            // corrupt or unreadable — treat as a cold cache
  }
}

function writeCache(sig, rows) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ format: FORMAT, sig, rows }))
  } catch {
    // Quota exceeded / private mode. The suggester still works, it just pays
    // the corpus fetch each session.
  }
}

export function clearKnowledgeCache() {
  memo = null
  try { localStorage.removeItem(CACHE_KEY) } catch { /* nothing to clear */ }
}

async function fetchFingerprint() {
  const { data, error } = await supabase.rpc('livemcq_fingerprint')
  if (error) throw error
  return data // { n, sig }
}

// Pull the corpus from the app's own module cache, loading it if needed. The
// topics carry `questions` in place once loaded, and a topic's id IS the
// category slug, so no extra query is required.
async function corpusFromModule() {
  if (!isModuleLoaded('livemcq')) await loadModule('livemcq')
  const rows = []
  for (const t of LIVEMCQ_TOPICS) {
    for (const q of t.questions || []) {
      if (q?.question) rows.push({ q: q.question, s: t.id })
    }
  }
  return rows
}

/**
 * Get a ready classifier, doing the least work that is still correct.
 * @returns {Promise<{ size: number, suggest: Function }>}
 */
export function getClassifier() {
  if (inflight) return inflight
  inflight = (async () => {
    const fp = await fetchFingerprint()

    if (memo && memo.sig === fp.sig) return memo.clf          // tier 1

    const cached = readCache()
    if (cached && cached.sig === fp.sig) {                    // tier 2
      const clf = buildClassifier(cached.rows.map((r) => ({ question: r.q, slug: r.s })))
      memo = { sig: fp.sig, clf }
      return clf
    }

    const rows = await corpusFromModule()                     // tier 3
    // Re-read the fingerprint AFTER the corpus lands: if a write slipped in
    // between the two, storing the pre-fetch sig would pin a stale corpus as
    // valid forever. On a race, use the corpus but don't persist it.
    let sig
    try {
      const after = await fetchFingerprint()
      sig = after.sig === fp.sig ? fp.sig : null
    } catch {
      sig = null
    }
    const clf = buildClassifier(rows.map((r) => ({ question: r.q, slug: r.s })))
    if (sig) { writeCache(sig, rows); memo = { sig, clf } }
    return clf
  })()
  inflight.finally(() => { inflight = null })
  return inflight
}
