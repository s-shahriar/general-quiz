import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { fetchProgress } from '../lib/progressSync.js'
import { setQueueUser, enqueue, subscribeQueue } from '../lib/offlineQueue.js'
import LoginPrompt from '../components/auth/LoginPrompt.jsx'

// Progress = three Sets of stable question uids: `nailed`, `important` and
// `weak`. Weak is the part of Important you still can't answer, so last-minute
// revision can narrow down to just those.
// Cloud-only: you must be signed in to save. When logged out the sets are empty
// and any nail/important/weak tap opens a sign-in prompt instead of saving. When
// logged in, the DB is the source of truth (pulled on open) and every change is
// optimistic in the UI, then written to Supabase through the offline queue
// (src/lib/offlineQueue.js) — so a dropped connection queues the change locally
// and flushes it as a bulk update once the server is reachable again.

const ProgressContext = createContext(null)
const EMPTY = new Set()
const addTo = (uid) => (p) => new Set(p).add(uid)
const dropFrom = (uids) => (p) => { const n = new Set(p); uids.forEach(u => n.delete(u)); return n }

export function ProgressProvider({ children }) {
  const { user, signInWithGoogle } = useAuth()

  const [nailed, setNailed] = useState(() => new Set())
  const [important, setImportant] = useState(() => new Set())
  const [weak, setWeak] = useState(() => new Set())
  const [hydratedUserId, setHydratedUserId] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)
  const [promptLogin, setPromptLogin] = useState(false)

  // Point the write queue at the current user (loads any persisted backlog and
  // flushes it), and mirror queue flushes into `lastSaved`. Runs on login/logout.
  const userId = user?.id
  useEffect(() => {
    setQueueUser(userId || null)
    const unsub = subscribeQueue((_snap, signal) => {
      if (signal?.saved) setLastSaved(new Date())
    })
    return unsub
  }, [userId])

  // Cloud is the source of truth. On login/open, pull the user's progress and
  // replace state. When logged out we simply expose empty sets (below) — no need
  // to touch state, and the next login's fetch overwrites any stale in-memory set.
  useEffect(() => {
    if (!userId) return
    let active = true
    ;(async () => {
      try {
        const remote = await fetchProgress()
        if (!active) return
        setNailed(remote.nailed)
        setImportant(remote.important)
        setWeak(remote.weak)
        setLastSaved(remote.lastUpdated ? new Date(remote.lastUpdated) : null)
      } catch (e) {
        console.error('[progress] sync failed:', e.message)
      } finally {
        if (active) setHydratedUserId(userId)
      }
    })()
    return () => { active = false }
  }, [userId])

  // Every write requires a signed-in user. Returns false (and opens the prompt)
  // when logged out, so mutators can bail before touching state.
  const ensureAuthed = () => {
    if (user) return true
    setPromptLogin(true)
    return false
  }

  // Each action updates state optimistically and queues ONE patch holding every
  // column it changed; `lastSaved` updates when the queue actually lands the write.
  //
  // Weak lives inside Important and outside Nailed, and those rules are kept here
  // rather than in the screens: marking Weak also marks Important, while
  // un-marking Important or nailing a question clears its Weak in the same write.
  const nailApi = {
    value: user ? nailed : EMPTY,
    add: (uid) => {
      if (!uid || !ensureAuthed()) return
      const wasWeak = weak.has(uid)
      setNailed(addTo(uid))
      if (wasWeak) setWeak(dropFrom([uid]))
      enqueue(uid, wasWeak ? { nailed: true, weak: false } : { nailed: true })
    },
    remove: (uid) => { if (!ensureAuthed()) return; setNailed(dropFrom([uid])); enqueue(uid, { nailed: false }) },
    removeMany: (uids) => { if (!ensureAuthed()) return; setNailed(dropFrom(uids)); uids.forEach(u => enqueue(u, { nailed: false })) },
  }
  const importantApi = {
    value: user ? important : EMPTY,
    add: (uid) => { if (!uid || !ensureAuthed()) return; setImportant(addTo(uid)); enqueue(uid, { important: true }) },
    remove: (uid) => importantApi.removeMany([uid]),
    removeMany: (uids) => {
      if (!ensureAuthed()) return
      setImportant(dropFrom(uids))
      setWeak(dropFrom(uids))
      uids.forEach(u => enqueue(u, weak.has(u) ? { important: false, weak: false } : { important: false }))
    },
  }
  const weakApi = {
    value: user ? weak : EMPTY,
    add: (uid) => {
      if (!uid || !ensureAuthed()) return
      const wasImportant = important.has(uid)
      setWeak(addTo(uid))
      if (!wasImportant) setImportant(addTo(uid))
      enqueue(uid, wasImportant ? { weak: true } : { weak: true, important: true })
    },
    remove: (uid) => weakApi.removeMany([uid]),
    removeMany: (uids) => { if (!ensureAuthed()) return; setWeak(dropFrom(uids)); uids.forEach(u => enqueue(u, { weak: false })) },
  }

  // True while a logged-in user's cloud progress is still being pulled on open.
  const syncing = !!user && hydratedUserId !== user.id
  const meta = {
    nailedCount: user ? nailed.size : 0,
    importantCount: user ? important.size : 0,
    weakCount: user ? weak.size : 0,
    lastSaved: user ? lastSaved : null,
  }

  return (
    <ProgressContext.Provider value={{ nailApi, importantApi, weakApi, syncing, meta }}>
      {children}
      {promptLogin && <LoginPrompt onGoogle={signInWithGoogle} onClose={() => setPromptLogin(false)} />}
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
export const useWeakContext = () => useProgress().weakApi
export const useProgressSyncing = () => useProgress().syncing
export const useProgressMeta = () => useProgress().meta
