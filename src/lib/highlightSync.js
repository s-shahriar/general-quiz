// Supabase read/write for per-user text highlights, keyed by the stable
// question `uid` (uidOfText, see lib/qid.js) plus a block key inside that
// item. RLS-scoped to the user, same as user_progress.
//
// Nothing here is called as you highlight: every add / remove / recolour is
// optimistic in the context and flows through the offline write queue
// (lib/offlineQueue.js), which calls the three writers below.

import { supabase } from './supabase.js'

export const COLORS = ['mint', 'amber', 'rose', 'violet']
export const DEFAULT_COLOR = 'mint'

const COLS = 'id, uid, block, start_off, end_off, quote, color'
const PAGE_SIZE = 1000

const fromRow = (r) => ({
  id: r.id, uid: r.uid, block: r.block,
  start: r.start_off, end: r.end_off, quote: r.quote, color: r.color,
})

// Every highlight the user has, grouped by question uid, fetched at session
// start so expanding a card costs nothing.
//
// Paged on the unique `id` for the same reason as fetchProgress: PostgREST
// truncates a response at max-rows without erroring, so an unpaged read starts
// dropping highlights once the user has more than one page of them. Each uid's
// list is sorted by offset afterwards, since the page order is by id.
export async function fetchHighlights() {
  const rows = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('user_highlights').select(COLS).order('id').range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    rows.push(...data)
    if (data.length < PAGE_SIZE) break
  }
  const byUid = new Map()
  for (const r of rows) {
    const h = fromRow(r)
    if (!byUid.has(h.uid)) byUid.set(h.uid, [])
    byUid.get(h.uid).push(h)
  }
  return byUid
}

// The id is minted on the client when the highlight is made, so the write is an
// UPSERT on it: a retry after a lost response updates the same row instead of
// inserting a second one.
export async function upsertHighlight(userId, h) {
  const { error } = await supabase.from('user_highlights').upsert({
    id: h.id, user_id: userId, uid: h.uid, block: h.block,
    start_off: h.start, end_off: h.end, quote: h.quote, color: h.color || DEFAULT_COLOR,
  }, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteHighlights(ids) {
  if (!ids.length) return
  const { error } = await supabase.from('user_highlights').delete().in('id', ids)
  if (error) throw error
}

// Colour changes on already-saved rows, grouped so each colour is one request.
export async function recolorHighlights(edits) {
  const byColor = new Map()
  for (const [id, color] of edits) {
    if (!byColor.has(color)) byColor.set(color, [])
    byColor.get(color).push(id)
  }
  for (const [color, ids] of byColor) {
    const { error } = await supabase.from('user_highlights').update({ color }).in('id', ids)
    if (error) throw error
  }
}
