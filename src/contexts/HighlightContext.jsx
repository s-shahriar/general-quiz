import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { fetchHighlights, DEFAULT_COLOR } from '../lib/highlightSync.js'
import {
  enqueueHighlightAdd, enqueueHighlightRemove, enqueueHighlightColor, pendingHighlightOps,
} from '../lib/offlineQueue.js'

// PDF-style text highlights across the quiz, vocab and written-data content.
//
// EDITING SAVES ITSELF. Highlighting, removing and recolouring update the page at
// once and go through the same offline write queue as nail / important flags
// (lib/offlineQueue.js): coalesced, flushed in the background, retried when the
// connection returns, kept across a reload, and listed in the sync drawer — where
// each one can be undone. There is no Save button.
//
// Every highlight gets its final database id the moment it is made (a UUID), so
// there are no temporary ids to swap and a retried insert is an idempotent upsert.
//
// The rendered set is a single optimistic map (uid -> highlights). On load it is
// the server's rows with the still-pending queue entries replayed over them.

const HighlightContext = createContext(null)
const EMPTY = []
const NONE = new Map()
// Older builds kept unsaved work here until Save was pressed; it is migrated once.
const LEGACY_KEY = (userId) => `ict_hl_pending_${userId}`

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

// One-off: turn unsaved work an older build left in localStorage into queue entries.
function migrateLegacy(userId, fetched) {
  let raw
  try { raw = localStorage.getItem(LEGACY_KEY(userId)) } catch { return fetched }
  if (!raw) return fetched
  let p
  try { p = JSON.parse(raw) } catch { p = null }
  try { localStorage.removeItem(LEGACY_KEY(userId)) } catch { /* ignore */ }
  if (!p) return fetched
  const out = cloneMap(fetched)
  const byId = new Map([...out.values()].flat().map(h => [h.id, h]))
  for (const id of Array.isArray(p.deletes) ? p.deletes : []) {
    const row = byId.get(id)
    if (row) { enqueueHighlightRemove(row); withoutRow(out, row) }
  }
  for (const [id, color] of Array.isArray(p.edits) ? p.edits : []) {
    const row = byId.get(id)
    if (row && row.color !== color) { enqueueHighlightColor({ ...row, color }, row.color); withRow(out, { ...row, color }) }
  }
  for (const a of Array.isArray(p.adds) ? p.adds : []) {
    if (!a?.uid || !a.block) continue
    const row = { id: newId(), uid: a.uid, block: a.block, start: a.start, end: a.end, quote: a.quote, color: a.color || DEFAULT_COLOR }
    enqueueHighlightAdd(row); withRow(out, row)
  }
  return out
}

export function HighlightProvider({ children }) {
  const { user } = useAuth()
  const [loaded, setRows] = useState(() => new Map())
  // Signed out means nothing to show, whatever a previous session left in state.
  const rows = user ? loaded : NONE
  const rowsRef = useRef(rows)
  const [color, setColor] = useState(DEFAULT_COLOR)

  const commit = useCallback((next) => { rowsRef.current = next; setRows(next) }, [])

  // Load the user's saved highlights, then replay whatever the queue has not sent.
  useEffect(() => {
    if (!user) { rowsRef.current = NONE; return }
    let cancelled = false
    fetchHighlights()
      .then(m => { if (!cancelled) commit(replayPending(migrateLegacy(user.id, m))) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [user, commit])

  const getFor = useCallback((uid) => rows.get(uid) || EMPTY, [rows])

  const add = useCallback((uid, anchors, c) => {
    if (!uid || !anchors?.length) return
    const chosen = c || color
    const next = cloneMap(rowsRef.current)
    for (const a of anchors) {
      const row = { id: newId(), uid, block: a.block, start: a.start, end: a.end, quote: a.quote, color: chosen }
      withRow(next, row)
      enqueueHighlightAdd(row)
    }
    commit(next)
  }, [color, commit])

  const remove = useCallback((uid, ids) => {
    if (!ids?.length) return
    const next = cloneMap(rowsRef.current)
    for (const row of (next.get(uid) || []).filter(h => ids.includes(h.id))) {
      withoutRow(next, row)
      enqueueHighlightRemove(row)
    }
    commit(next)
  }, [commit])

  const recolor = useCallback((uid, ids, c) => {
    if (!ids?.length || !c) return
    const next = cloneMap(rowsRef.current)
    for (const row of (next.get(uid) || []).filter(h => ids.includes(h.id) && h.color !== c)) {
      withRow(next, { ...row, color: c })
      enqueueHighlightColor({ ...row, color: c }, row.color)
    }
    commit(next)
  }, [commit])

  // Put a removed highlight back under its own id (the sync drawer's Undo).
  const restore = useCallback((row) => {
    if (!row?.id) return
    commit(withRow(cloneMap(rowsRef.current), row))
    enqueueHighlightAdd(row)
  }, [commit])

  const value = useMemo(() => ({
    getFor, add, remove, recolor, restore,
    color, setColor,
    canHighlight: Boolean(user),
  }), [getFor, add, remove, recolor, restore, color, user])
  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>
}

export function useHighlights() {
  return useContext(HighlightContext) || {
    getFor: () => EMPTY, add: () => {}, remove: () => {}, recolor: () => {}, restore: () => {},
    color: DEFAULT_COLOR, setColor: () => {}, canHighlight: false,
  }
}
