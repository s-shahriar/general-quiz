// ─────────────────────────────────────────────────────────────
//  LiveMCQ admin — deterministic (no AI) client helpers.
//
//  Extraction happens on the phone via `livefav` (Termux, see LIVEMCQ.md §9),
//  which dumps the newest favourites to JSON. This module turns that JSON into
//  DB-ready rows, dedups against what's already stored, and calls the gated
//  admin RPCs. Category assignment is a manual human choice in the UI — nothing
//  here guesses a category.
//
//  The real security is server-side: `admin_livemcq_insert` / `_delete` are
//  SECURITY DEFINER and reject anyone whose auth.uid() ≠ OWNER_UID, and
//  questions/categories are read-only under RLS. OWNER_UID here only gates the
//  admin UI's visibility — it is not a secret.
// ─────────────────────────────────────────────────────────────
import { supabase } from './supabase.js'
import { uidOfText } from './qid.js'
import { LIVEMCQ_TOPICS } from '../data/index.js'

export const OWNER_UID = '803521e1-00c9-4b8a-ab13-f6e6d126da2b'
export const LETTERS = ['a', 'b', 'c', 'd', 'e']

// Category dropdown options: { slug, name }. slug === DB categories.slug.
export const CATEGORY_OPTIONS = LIVEMCQ_TOPICS.map((t) => ({ slug: t.id, name: t.name }))

export function isOwner(user) {
  return Boolean(user && user.id === OWNER_UID)
}

// Accepts whatever the file contains and returns a flat array of raw items:
// - a bare array of items
// - a raw central-favorite-list page: { question_list: [...] }
// - a single item object
export function extractRawItems(parsed) {
  if (Array.isArray(parsed)) return parsed
  if (parsed && Array.isArray(parsed.question_list)) return parsed.question_list
  if (parsed && typeof parsed === 'object') return [parsed]
  return []
}

// Normalize one raw item (livefav `options[]`+`answer`+`explanation`, OR the raw
// API `option1..5`+`answer`+`exp`) into a common shape. `gapWarning` flags an
// empty option sitting BEFORE a filled one — the exact misalignment the old
// hand-sync corruption produced, so the UI can surface it instead of silently
// shifting letters.
export function normalizeItem(raw) {
  const favorite_id = String(raw.favorite_id ?? raw.favoriteId ?? '').trim()
  const question = (raw.question ?? '').toString()
  const explanation = (raw.explanation ?? raw.exp ?? '').toString()
  const answer = Number(raw.answer ?? 0) || 0

  let options
  let gapWarning = false
  if (Array.isArray(raw.options)) {
    options = raw.options.map((o) => (o ?? '').toString())
  } else {
    options = [raw.option1, raw.option2, raw.option3, raw.option4, raw.option5].map((o) =>
      (o ?? '').toString(),
    )
  }
  // Trim trailing empties (legitimate — LiveMCQ pads to 5), then flag any
  // interior empty that remains.
  while (options.length && options[options.length - 1].trim() === '') options.pop()
  if (options.some((o) => o.trim() === '')) gapWarning = true

  const hasKey = answer > 0 && answer <= options.length
  return {
    favorite_id,
    question,
    explanation,
    answer,
    options,
    gapWarning,
    // answer points past the available options (e.g. into a dropped empty)
    answerOutOfRange: answer > 0 && answer > options.length,
    hasKey,
  }
}

// Build the DB insert row for a normalized item + the chosen category slug.
// uid is computed with the SAME qid.js the whole app uses, so it matches what
// the browser derives at render time (Important/Nailed flags stay aligned).
export function toInsertRow(item, slug) {
  const opts = {}
  item.options.forEach((o, i) => {
    if (i < LETTERS.length) opts[LETTERS[i]] = o
  })
  const correct_answer = item.hasKey ? LETTERS[item.answer - 1] : null
  const correct_answer_text = item.hasKey ? item.options[item.answer - 1] : null
  return {
    favorite_id: item.favorite_id,
    slug,
    uid: uidOfText(item.question),
    question: item.question,
    options: Object.keys(opts).length ? opts : null,
    correct_answer,
    correct_answer_text,
    explanation: item.explanation || null,
  }
}

// Every favorite_id already stored (INCLUDING soft-deleted rows), so a favourite
// that was recycle-binned is not re-inserted. Uses the public read policy.
export async function fetchExistingFavoriteIds() {
  const set = new Set()
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('questions')
      .select('extra, categories!inner(module)')
      .eq('categories.module', 'livemcq')
      .order('id')
      .range(from, from + pageSize - 1)
    if (error) throw error
    for (const r of data) {
      const f = r.extra?.favorite_id
      if (f != null) set.add(String(f))
    }
    if (data.length < pageSize) break
  }
  return set
}

// The suggester's training corpus is NOT fetched here — see livemcqKnowledge.js,
// which serves it from a validated local cache and, when it really must load,
// reuses the app's own `loadModule('livemcq')` rather than issuing a second
// query for rows the app already downloads.

// Load all livemcq rows for the Manage view (favorite_id + snippet + answer +
// cat), newest first.
export async function fetchLivemcqRows() {
  const rows = []
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('questions')
      .select('id,question,correct_answer,correct_answer_text,extra,sort_order,deleted_at,categories!inner(slug,name,module)')
      .eq('categories.module', 'livemcq')
      // Paginate on the UNIQUE id: `sort_order` is per-category and non-unique,
      // so ranging over it would skip/duplicate rows across page boundaries.
      // Display order is applied below, once every row is in hand.
      .order('id')
      .range(from, from + pageSize - 1)
    if (error) throw error
    for (const r of data) {
      rows.push({
        id: r.id,
        favorite_id: r.extra?.favorite_id != null ? String(r.extra.favorite_id) : null,
        question: r.question,
        correct_answer: r.correct_answer,
        correct_answer_text: r.correct_answer_text,
        sort_order: r.sort_order,
        deleted: r.deleted_at != null,
        slug: r.categories.slug,
        catName: r.categories.name,
      })
    }
    if (data.length < pageSize) break
  }
  // Newest first — see [[ordering-latest-first]]. `sort_order` can't be used
  // here: it is a per-category rank, so 0 means "oldest in ITS category", not
  // "oldest overall". favorite_id is the only globally comparable recency key,
  // and it is exactly what sort_order is derived from. Rows without one (there
  // should be none) sink to the bottom rather than jumping to the top.
  rows.sort((a, b) => {
    const fa = a.favorite_id == null ? -1 : Number(a.favorite_id)
    const fb = b.favorite_id == null ? -1 : Number(b.favorite_id)
    return fb - fa
  })
  return rows
}

export async function insertRows(rows) {
  const { data, error } = await supabase.rpc('admin_livemcq_insert', { rows })
  if (error) throw error
  return data // { inserted, skipped, skipped_fids }
}

export async function deleteFavoriteIds(fids) {
  const { data, error } = await supabase.rpc('admin_livemcq_delete', { fids })
  if (error) throw error
  return data // { deleted }
}

// Move questions to another livemcq category. The RPC writes ONLY
// questions.category_id and then renumbers the old + new categories; no other
// question column is touched, and user_progress is keyed by uid so Nailed /
// Important flags follow the question across the move.
export async function setCategoryForFavoriteIds(fids, slug) {
  const { data, error } = await supabase.rpc('admin_livemcq_set_category', {
    fids,
    new_slug: slug,
  })
  if (error) throw error
  return data // { moved }
}
