import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { fetchHighlights, DEFAULT_COLOR } from '../lib/highlightSync.js'
import {
  enqueueHighlightAdd, enqueueHighlightRemove, enqueueHighlightColor, pendingHighlightOps, highlightQueueReady,
} from '../lib/offlineQueue.js'

// PDF-style text highlights across the quiz, vocab and written-data content.
//
// EDITING IS LOCAL UNTIL YOU PRESS SAVE. Highlighting, removing and recolouring
// only change memory — no request is made, and nothing reaches the sync drawer,
// until Save. That keeps a reading session at zero network traffic, and Discard
// throws the unsaved work away.
//
// Three pending sets describe the unsaved work:
//   adds    — new highlights (each already has its final id: a UUID)
//   deletes — ids of saved rows to drop
//   edits   — id → new colour, for saved rows
// The rendered set is `saved − deletes + adds`, with `edits` applied on top.
// Pending work is mirrored to localStorage per user, so closing the tab with
// unsaved highlights does not lose them; they are still pending on return.
//
// SAVE does not call the database. It hands the pending work to the offline write
// queue (lib/offlineQueue.js) — the same one nail / important flags use — and
// folds it into `saved`, so the highlights stay on screen with no gap. From there
// the queue sends them in the background, retries when the connection returns,
// survives a reload, and lists each change in the sync drawer (where it can be
// undone). Because ids are minted here, a retried insert is an idempotent upsert.

const HighlightContext = createContext(null)
const EMPTY = []
const NONE = new Map()
const LS_KEY = (userId) => `ict_hl_pending_${userId}`

function newId() {
  const c = globalThis.crypto
  if (c?.randomUUID) return c.randomUUID()
  const b = c?.getRandomValues ? c.getRandomValues(new Uint8Array(16)) : Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

function cloneMap(m) {
  const n = new Map()
  for (const [uid, list] of m) n.set(uid, list)
  return n
}

const withRow = (m, row) => { m.set(row.uid, [...(m.get(row.uid) || []).filter(h => h.id !== row.id), row]); return m }
const withoutRow = (m, row) => {
  const kept = (m.get(row.uid) || []).filter(h => h.id !== row.id)
  if (kept.length) m.set(row.uid, kept); else m.delete(row.uid)
  return m
}

// Server rows with the queue's unsent highlight changes laid on top.
function replayPending(map) {
  const out = cloneMap(map)
  for (const op of pendingHighlightOps()) {
    if (op.kind === 'del') withoutRow(out, op.row)
    else withRow(out, op.row)         // add, or the recoloured row
  }
  return out
}

function loadPending(userId) {
  try {
    const raw = localStorage.getItem(LS_KEY(userId))
    if (!raw) return null
    const p = JSON.parse(raw)
    return {
      // Unsaved adds an older build kept under temporary ids get real ones now, since the queue needs the final id.
      adds: (Array.isArray(p.adds) ? p.adds : []).map(a => String(a.id).startsWith('tmp-') ? { ...a, id: newId() } : a),
      deletes: new Set(Array.isArray(p.deletes) ? p.deletes : []),
      edits: new Map(Array.isArray(p.edits) ? p.edits : []),
    }
  } catch { return null }
}

function savePending(userId, adds, deletes, edits) {
  try {
    if (!adds.length && !deletes.size && !edits.size) localStorage.removeItem(LS_KEY(userId))
    else localStorage.setItem(LS_KEY(userId), JSON.stringify({
      adds, deletes: [...deletes], edits: [...edits],
    }))
  } catch { /* private mode / quota — pending work simply is not mirrored */ }
}

export function HighlightProvider({ children }) {
  const { user } = useAuth()
  const [loaded, setSaved] = useState(() => new Map())
  // Signed out means nothing to show, whatever a previous session left in state.
  const saved = user ? loaded : NONE
  const [adds, setAdds] = useState([])
  const [deletes, setDeletes] = useState(() => new Set())
  const [edits, setEdits] = useState(() => new Map())
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [status, setStatus] = useState('idle')     // idle | saving | error
  const [error, setError] = useState(null)
  // Latest values for the callbacks below, which must not change identity on every edit.
  const savedRef = useRef(saved)
  const addsRef = useRef(adds)
  useEffect(() => { savedRef.current = saved }, [saved])
  useEffect(() => { addsRef.current = adds }, [adds])

  // Load saved highlights (with whatever the queue has not sent yet laid on top) + any pending work left from a previous visit.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on sign-out, restore the mirrored pending work on sign-in
    if (!user) { setAdds([]); setDeletes(new Set()); setEdits(new Map()); return }
    const p = loadPending(user.id)
    if (p) { setAdds(p.adds); setDeletes(p.deletes); setEdits(p.edits) }
    let cancelled = false
    fetchHighlights()
      .then(m => { if (!cancelled) setSaved(replayPending(m)) })
      .catch(e => { if (!cancelled) setError(e.message) })
    return () => { cancelled = true }
  }, [user])

  useEffect(() => { if (user) savePending(user.id, adds, deletes, edits) }, [user, adds, deletes, edits])

  // Warn before losing unsaved highlights on a tab close / refresh.
  const dirtyCount = adds.length + deletes.size + edits.size
  useEffect(() => {
    if (!dirtyCount) return
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirtyCount])

  // What the renderer sees: saved rows minus pending deletes, with pending
  // colour edits applied, plus pending adds.
  const byUid = useMemo(() => {
    const out = new Map()
    for (const [uid, list] of saved) {
      const kept = list
        .filter(h => !deletes.has(h.id))
        .map(h => edits.has(h.id) ? { ...h, color: edits.get(h.id) } : h)
      if (kept.length) out.set(uid, kept)
    }
    for (const a of adds) {
      if (!out.has(a.uid)) out.set(a.uid, [])
      out.set(a.uid, [...out.get(a.uid), a])
    }
    return out
  }, [saved, adds, deletes, edits])

  const getFor = useCallback((uid) => byUid.get(uid) || EMPTY, [byUid])

  const add = useCallback((uid, anchors, c) => {
    if (!uid || !anchors?.length) return
    const chosen = c || color
    setAdds(list => [...list, ...anchors.map(a => ({
      ...a, uid, color: chosen, id: newId(),
    }))])
  }, [color])

  const remove = useCallback((uid, ids) => {
    if (!ids?.length) return
    const gone = new Set(ids)
    const pendingIds = new Set(addsRef.current.map(a => a.id))
    setAdds(list => list.filter(a => !gone.has(a.id)))        // pending ones just vanish
    setDeletes(d => {
      const n = new Set(d)
      for (const id of ids) if (!pendingIds.has(id)) n.add(id)
      return n
    })
    setEdits(e => {                                            // an edit on a deleted row is moot
      if (!ids.some(id => e.has(id))) return e
      const n = new Map(e); for (const id of ids) n.delete(id); return n
    })
  }, [])

  const recolor = useCallback((uid, ids, c) => {
    if (!ids?.length || !c) return
    const set = new Set(ids)
    const pendingIds = new Set(addsRef.current.map(a => a.id))
    const onServer = new Map((savedRef.current.get(uid) || []).map(h => [h.id, h.color]))
    setAdds(list => list.map(a => set.has(a.id) ? { ...a, color: c } : a))
    setEdits(e => {
      const n = new Map(e)
      for (const id of ids) {
        if (pendingIds.has(id)) continue
        if (onServer.get(id) === c) n.delete(id)               // back to the saved colour: nothing to write
        else n.set(id, c)
      }
      return n
    })
  }, [])

  // Hand the pending work to the offline queue and keep it on screen as saved.
  const save = useCallback(async () => {
    if (!user || !dirtyCount || status === 'saving') return false
    // The queue is keyed to the signed-in user; if it is not ready the changes would be dropped, so keep them pending instead.
    if (!highlightQueueReady()) { setError('Not ready to save yet — try again in a moment'); setStatus('error'); return false }
    setError(null)
    const byId = new Map([...savedRef.current.values()].flat().map(h => [h.id, h]))
    const next = cloneMap(savedRef.current)
    for (const id of deletes) {
      const row = byId.get(id)
      if (row) { enqueueHighlightRemove(row); withoutRow(next, row) }
    }
    for (const [id, c] of edits) {
      const row = byId.get(id)
      if (!row || deletes.has(id) || row.color === c) continue
      enqueueHighlightColor({ ...row, color: c }, row.color)
      withRow(next, { ...row, color: c })
    }
    for (const a of adds) { enqueueHighlightAdd(a); withRow(next, a) }
    setSaved(next)
    setAdds([]); setDeletes(new Set()); setEdits(new Map())
    setStatus('idle')
    return true
  }, [user, adds, deletes, edits, dirtyCount, status])

  const discard = useCallback(() => {
    setAdds([]); setDeletes(new Set()); setEdits(new Map()); setError(null); setStatus('idle')
  }, [])

  // The sync drawer's Undo acts on highlights that are already saved (queued or sent), so it applies at once —
  // to the saved rows and the queue — instead of becoming a new unsaved edit.
  const undoAdd = useCallback((row) => {
    if (!row?.id) return
    setSaved(withoutRow(cloneMap(savedRef.current), row))
    enqueueHighlightRemove(row)
  }, [])
  const undoRemove = useCallback((row) => {
    if (!row?.id) return
    setSaved(withRow(cloneMap(savedRef.current), row))
    enqueueHighlightAdd(row)
  }, [])
  const undoColor = useCallback((row, from) => {
    if (!row?.id || !from) return
    setSaved(withRow(cloneMap(savedRef.current), { ...row, color: from }))
    enqueueHighlightColor({ ...row, color: from }, row.color)
  }, [])

  const value = {
    getFor, add, remove, recolor, save, discard,
    undoAdd, undoRemove, undoColor,
    color, setColor,
    dirtyCount, status, error,
    canHighlight: Boolean(user),
  }
  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>
}

export function useHighlights() {
  return useContext(HighlightContext) || {
    getFor: () => EMPTY, add: () => {}, remove: () => {}, recolor: () => {},
    save: async () => false, discard: () => {},
    undoAdd: () => {}, undoRemove: () => {}, undoColor: () => {},
    color: DEFAULT_COLOR, setColor: () => {},
    dirtyCount: 0, status: 'idle', error: null, canHighlight: false,
  }
}
