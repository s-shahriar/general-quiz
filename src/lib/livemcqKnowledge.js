// ─────────────────────────────────────────────────────────────
//  Persisted "knowledge" for the no-AI category suggester.
//
//  The suggester needs every already-classified question's text + category.
//  Re-fetching those rows on each import is wasteful, because that corpus only
//  changes when the app itself writes to it. So it is cached locally and
//  validated against a one-row server fingerprint.
//
//  Three tiers, cheapest first:
//    1. in-memory  — repeat imports in one session cost nothing at all
//    2. IndexedDB + fingerprint — one tiny request, no corpus download
//    3. the app's OWN module cache — `loadModule(m)` already loads exactly
//       these rows for the quiz screens, so when the corpus really must be
//       fetched it is shared with the rest of the app rather than duplicated
//
//  Staleness is decided by the server, never guessed: `classifier_fingerprint()`
//  hashes (id, category_id) over every live row in the trained modules, so an
//  insert, a delete OR a recategorise all invalidate the cache — including ones
//  made from a different browser or device. A stale suggestion is not dangerous
//  (every category is still confirmed by hand), but it is cheap to be right.
//
//  ── Why IndexedDB and not localStorage ──────────────────────
//  The corpus used to be question text alone: 2205 rows, ~330 KB, a comfortable
//  fit for localStorage. The classifier now indexes each question's options and
//  explanation too (that one change is worth +18pp of accuracy — see
//  livemcqClassify.js), and LiveMCQ explanations are long. The same corpus is
//  now ~5.5 MB, which does not fit in localStorage's ~5 MB budget on any
//  browser and would throw QuotaExceededError on write for all of them.
//
//  Packing the corpus down (hashed token ids, pruned vocabulary) got it to
//  ~3.4 MB — still most of the budget, for a store the whole app shares, and at
//  the cost of no longer holding the neighbour text the UI shows. IndexedDB has
//  no such ceiling and takes structured values without a JSON round-trip, so
//  the corpus is simply stored as-is. Where IndexedDB is unavailable (private
//  mode in some browsers), the cache tier is skipped and the corpus is rebuilt
//  from the module cache each session — slower, never wrong.
// ─────────────────────────────────────────────────────────────
import { supabase } from './supabase.js'
import { isModuleLoaded, loadModule, topicsOfModule } from '../data/contentLoader.js'
import { buildClassifier } from './livemcqClassify.js'
import { TRAINING_MODULES, CROSS_MODULE_WEIGHT, livemcqLabelFor } from './livemcqTraining.js'

const DB_NAME = 'livemcq-knowledge'
const STORE = 'corpus'
const RECORD_KEY = 'current'
// Bump when the corpus shape or the tokenizer changes, so old caches are
// rejected instead of silently scoring under stale rules.
const FORMAT = 2
// The pre-IndexedDB cache. Removed on first run so it stops occupying quota.
const LEGACY_LOCALSTORAGE_KEY = 'livemcq.knowledge.v1'

let memo = null          // { sig, clf } for this session
let inflight = null

// ── IndexedDB, promise-wrapped ───────────────────────────────
function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexedDB'))
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
    req.onblocked = () => reject(new Error('indexedDB blocked'))
  })
}

function tx(db, mode, run) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const req = run(t.objectStore(STORE))
    t.oncomplete = () => resolve(req ? req.result : undefined)
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error)
  })
}

async function readCache() {
  try {
    const db = await openDb()
    const c = await tx(db, 'readonly', (s) => s.get(RECORD_KEY))
    db.close()
    if (!c || c.format !== FORMAT || !Array.isArray(c.rows) || !c.sig) return null
    return c
  } catch {
    return null            // unavailable, corrupt or unreadable — treat as cold
  }
}

async function writeCache(sig, rows) {
  try {
    const db = await openDb()
    await tx(db, 'readwrite', (s) => s.put({ format: FORMAT, sig, rows }, RECORD_KEY))
    db.close()
  } catch {
    // Private mode / disabled storage. The suggester still works, it just pays
    // the corpus rebuild each session.
  }
}

export function clearKnowledgeCache() {
  memo = null
  try { localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY) } catch { /* nothing to clear */ }
  openDb()
    .then((db) => tx(db, 'readwrite', (s) => s.delete(RECORD_KEY)).finally(() => db.close()))
    .catch(() => { /* nothing to clear */ })
}

async function fetchFingerprint() {
  const { data, error } = await supabase.rpc('classifier_fingerprint')
  if (error) throw error
  return data // { n, sig }
}

// Pull the corpus from the app's own module cache, loading each module if
// needed. A topic's id IS its category slug, so no extra query is required.
//
// Foreign rows are relabelled into a LiveMCQ category on the way in and enter
// at a reduced weight; anything livemcqTraining.js declines to map is dropped,
// which is what keeps the suggester's output closed over the LiveMCQ set.
async function corpusFromModules() {
  await Promise.all(TRAINING_MODULES.map((m) => (isModuleLoaded(m) ? null : loadModule(m))))
  const rows = []
  for (const moduleId of TRAINING_MODULES) {
    const native = moduleId === 'livemcq'
    for (const t of topicsOfModule(moduleId)) {
      const slug = livemcqLabelFor(moduleId, t.id)
      if (!slug) continue
      for (const q of t.questions || []) {
        if (!q?.question) continue
        rows.push({
          q: q.question,
          o: q.options || null,
          e: q.explanation || null,
          s: slug,
          m: native ? undefined : moduleId,   // absent means "a real LiveMCQ row"
        })
      }
    }
  }
  return rows
}

const toDoc = (r) => ({
  question: r.q,
  options: r.o,
  explanation: r.e,
  slug: r.s,
  source: r.m || 'livemcq',
  weight: r.m ? CROSS_MODULE_WEIGHT : 1,
})

/**
 * Get a ready classifier, doing the least work that is still correct.
 * @returns {Promise<{ size: number, suggest: Function }>}
 */
export function getClassifier() {
  if (inflight) return inflight
  inflight = (async () => {
    const fp = await fetchFingerprint()

    if (memo && memo.sig === fp.sig) return memo.clf          // tier 1

    const cached = await readCache()
    if (cached && cached.sig === fp.sig) {                    // tier 2
      const clf = buildClassifier(cached.rows.map(toDoc))
      memo = { sig: fp.sig, clf }
      return clf
    }

    const rows = await corpusFromModules()                    // tier 3
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
    const clf = buildClassifier(rows.map(toDoc))
    if (sig) { writeCache(sig, rows); memo = { sig, clf } }
    return clf
  })()
  inflight.finally(() => { inflight = null })
  return inflight
}
