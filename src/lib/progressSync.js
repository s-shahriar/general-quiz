// Supabase read/write for per-user progress (nailed / important), keyed by the
// stable question `uid`. All calls are RLS-scoped to the logged-in user.
import { supabase } from './supabase.js'

// Load the user's full progress into two Sets of uids, plus the most recent
// updated_at (for a "last saved" indicator).
export async function fetchProgress() {
  const { data, error } = await supabase
    .from('user_progress')
    .select('uid, nailed, important, updated_at')
  if (error) throw error
  const nailed = new Set()
  const important = new Set()
  let lastUpdated = null
  for (const r of data) {
    if (r.nailed) nailed.add(r.uid)
    if (r.important) important.add(r.uid)
    if (r.updated_at && (!lastUpdated || r.updated_at > lastUpdated)) lastUpdated = r.updated_at
  }
  return { nailed, important, lastUpdated }
}

// Upsert a single flag change. `patch` is { nailed?, important? }; only the
// provided column is written, the other is left untouched on existing rows.
export async function upsertFlag(userId, uid, patch) {
  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, uid, ...patch }, { onConflict: 'user_id,uid' })
  if (error) console.error('[progress] upsert failed:', error.message)
}

// Bulk upsert — used to push local-only flags up on first login.
// rows: [{ uid, nailed?, important? }]
export async function upsertMany(userId, rows) {
  if (!rows.length) return
  const payload = rows.map(r => ({ user_id: userId, ...r }))
  for (let i = 0; i < payload.length; i += 500) {
    const { error } = await supabase
      .from('user_progress')
      .upsert(payload.slice(i, i + 500), { onConflict: 'user_id,uid' })
    if (error) console.error('[progress] bulk upsert failed:', error.message)
  }
}

// One-time legacy migration support: map every `${category.slug}__${sort_order}`
// (the old position-based qid) to the question's stable uid, straight from the
// DB — this covers ALL modules including lazy-loaded LiveMCQ. Public read.
export async function fetchLegacyQidMap() {
  const map = new Map()
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('questions')
      .select('uid, sort_order, categories(slug)')
      .range(from, from + pageSize - 1)
    if (error) throw error
    if (!data.length) break
    for (const r of data) {
      const slug = r.categories?.slug
      if (slug != null) map.set(`${slug}__${r.sort_order}`, r.uid)
    }
    if (data.length < pageSize) break
  }
  return map
}
