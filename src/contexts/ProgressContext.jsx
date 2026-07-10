import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { uidOf } from '../lib/qid.js'
import { fetchProgress, upsertFlag, upsertMany, fetchLegacyQidMap } from '../lib/progressSync.js'
import { ALL_TOPICS } from '../data/index.js'
import { VOCAB_TOPICS } from '../data/vocabTopics.js'

// Progress = two Sets of stable question uids: `nailed` and `important`.
// Source of truth per device is localStorage (offline-first); when the user is
// logged in it also mirrors to Supabase so flags follow them across devices.

const NAILED_KEY = 'gq-nailed-v2'
const IMPORTANT_KEY = 'gq-important-v2'
const V1_NAILED = 'gq-nailed'
const V1_IMPORTANT = 'gq-important'

const ALL = [...ALL_TOPICS, ...VOCAB_TOPICS]

function loadV2(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')) }
  catch { return new Set() }
}
function saveV2(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])) } catch { /* quota */ }
}

// Fast, offline legacy migration from bundled topic data (covers everything
// except lazy LiveMCQ, which the async DB pass fills in). Maps old
// `${topicId}__${index}` keys to stable uids.
function migrateFromBundled(v1Key) {
  const out = new Set()
  let raw
  try { raw = JSON.parse(localStorage.getItem(v1Key) ?? '[]') } catch { raw = [] }
  if (!raw.length) return out
  const byId = new Map(ALL.map(t => [t.id, t]))
  for (const key of raw) {
    const cut = key.lastIndexOf('__')
    if (cut < 0) { out.add(key); continue }
    const t = byId.get(key.slice(0, cut))
    const q = t?.questions?.[Number(key.slice(cut + 2))]
    const uid = q && uidOf(q)
    if (uid) out.add(uid)
  }
  return out
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const { user } = useAuth()

  // Initial state: v2 if present, else a fast bundled migration of v1.
  const hadV2 = localStorage.getItem(NAILED_KEY) != null || localStorage.getItem(IMPORTANT_KEY) != null
  const [nailed, setNailed] = useState(() => hadV2 ? loadV2(NAILED_KEY) : migrateFromBundled(V1_NAILED))
  const [important, setImportant] = useState(() => hadV2 ? loadV2(IMPORTANT_KEY) : migrateFromBundled(V1_IMPORTANT))

  // Which user's cloud progress we've hydrated (for the on-open loader gate).
  const [hydratedUserId, setHydratedUserId] = useState(null)
  // Timestamp of the last progress change saved to the cloud (for the popup).
  const [lastSaved, setLastSaved] = useState(null)

  // Keep refs so async effects read the latest sets without re-subscribing.
  const nailedRef = useRef(nailed)
  const importantRef = useRef(important)

  // Persist v2 on every change, and mirror the latest value into the refs.
  useEffect(() => { nailedRef.current = nailed; saveV2(NAILED_KEY, nailed) }, [nailed])
  useEffect(() => { importantRef.current = important; saveV2(IMPORTANT_KEY, important) }, [important])

  // Complete legacy migration from the DB (covers LiveMCQ) — once, if v2 absent.
  useEffect(() => {
    if (hadV2) return
    let cancelled = false
    fetchLegacyQidMap().then(map => {
      if (cancelled) return
      const conv = (v1Key, setState) => {
        let raw
        try { raw = JSON.parse(localStorage.getItem(v1Key) ?? '[]') } catch { return }
        if (!raw.length) return
        setState(prev => {
          const next = new Set(prev)
          for (const k of raw) { const uid = map.get(k); if (uid) next.add(uid) }
          return next
        })
      }
      conv(V1_NAILED, setNailed)
      conv(V1_IMPORTANT, setImportant)
    }).catch(() => { /* offline — bundled fast-path already applied */ })
    return () => { cancelled = true }
  }, [hadV2])

  // On login / app open while logged in: the CLOUD IS THE SOURCE OF TRUTH.
  // We pull remote and replace local, so a change made on another device (incl.
  // an un-nail) is reflected here — no stale data. The one exception is the very
  // first login on a device that has pre-account local flags: we upload those
  // once so nothing is lost, then treat the cloud as truth from then on.
  // Keyed on user?.id (not the user object) so it runs once per login, not on
  // every token refresh. Each run owns its own `active` flag, so StrictMode's
  // double-invoke resolves correctly: the live run always sets hydratedUserId.
  const userId = user?.id
  useEffect(() => {
    if (!userId) return
    let active = true
    ;(async () => {
      try {
        const remote = await fetchProgress()
        if (!active) return
        const migratedKey = `gq-synced-${userId}`
        if (!localStorage.getItem(migratedKey)) {
          // first login on this device — preserve any local-only flags upward
          const localN = nailedRef.current, localI = importantRef.current
          const rowByUid = new Map()
          const mark = (u, col) => { const r = rowByUid.get(u) || { uid: u }; r[col] = true; rowByUid.set(u, r) }
          for (const u of localN) if (!remote.nailed.has(u)) mark(u, 'nailed')
          for (const u of localI) if (!remote.important.has(u)) mark(u, 'important')
          if (rowByUid.size) await upsertMany(userId, [...rowByUid.values()])
          localStorage.setItem(migratedKey, '1')
          if (!active) return
          setNailed(new Set([...localN, ...remote.nailed]))
          setImportant(new Set([...localI, ...remote.important]))
        } else {
          // cloud wins — replace local wholesale
          setNailed(remote.nailed)
          setImportant(remote.important)
        }
        if (active && remote.lastUpdated) setLastSaved(new Date(remote.lastUpdated))
      } catch (e) {
        console.error('[progress] sync failed:', e.message)
      } finally {
        if (active) setHydratedUserId(userId)
      }
    })()
    return () => { active = false }
  }, [userId])

  // Mutators: update state, and mirror to the cloud when logged in.
  const write = (uid, column, value) => {
    if (user && uid) { upsertFlag(user.id, uid, { [column]: value }); setLastSaved(new Date()) }
  }

  const nailApi = {
    value: nailed,
    add: (uid) => { if (!uid) return; setNailed(p => new Set(p).add(uid)); write(uid, 'nailed', true) },
    remove: (uid) => { setNailed(p => { const n = new Set(p); n.delete(uid); return n }); write(uid, 'nailed', false) },
    restore: (uids) => { setNailed(p => new Set([...p, ...uids])); uids.forEach(u => write(u, 'nailed', true)) },
  }
  const importantApi = {
    value: important,
    add: (uid) => { if (!uid) return; setImportant(p => new Set(p).add(uid)); write(uid, 'important', true) },
    remove: (uid) => { setImportant(p => { const n = new Set(p); n.delete(uid); return n }); write(uid, 'important', false) },
    removeMany: (uids) => { setImportant(p => { const n = new Set(p); uids.forEach(u => n.delete(u)); return n }); uids.forEach(u => write(u, 'important', false)) },
    restore: (uids) => { setImportant(p => new Set([...p, ...uids])); uids.forEach(u => write(u, 'important', true)) },
  }

  // True while a logged-in user's cloud progress is still being pulled on open.
  const syncing = !!user && hydratedUserId !== user.id
  const meta = { nailedCount: nailed.size, importantCount: important.size, lastSaved }

  return (
    <ProgressContext.Provider value={{ nailApi, importantApi, syncing, meta }}>
      {children}
    </ProgressContext.Provider>
  )
}

function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('Progress hooks must be used within ProgressProvider')
  return ctx
}

export const useMasteredContext = () => useProgress().nailApi
export const useImportantContext = () => useProgress().importantApi
export const useProgressSyncing = () => useProgress().syncing
export const useProgressMeta = () => useProgress().meta
