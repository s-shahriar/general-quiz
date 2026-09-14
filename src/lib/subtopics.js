// ─────────────────────────────────────────────────────────────
//  LiveMCQ sub-topics (বাংলা ব্যাকরণ → সন্ধি, সমাস …) — see LIVEMCQ.md §8.C.
//
//  The lists live in the `subtopics` table (public read) and are created from
//  the Admin panel, so they are fetched rather than bundled. A question's
//  sub-topic is `questions.extra.subtopic`, which contentLoader spreads onto the
//  question object — `q.subtopic` needs no extra query.
//
//  One fetch per session, shared by the Study view and the Admin panel. The
//  Admin panel forces a refetch after it creates a sub-topic, and every mounted
//  `useSubtopicLists` re-renders with the new list.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

let cache = null            // { [categorySlug]: [{ slug, name }] }
let inflight = null
const listeners = new Set()
const EMPTY = Object.freeze({})

export function fetchSubtopics({ force = false } = {}) {
  if (cache && !force) return Promise.resolve(cache)
  if (inflight && !force) return inflight
  const p = (async () => {
    const { data, error } = await supabase
      .from('subtopics')
      .select('slug,name,sort_order,categories!inner(slug,module)')
      .eq('categories.module', 'livemcq')
      .order('sort_order')
    if (error) throw error
    const bySlug = {}
    for (const r of data) (bySlug[r.categories.slug] ||= []).push({ slug: r.slug, name: r.name })
    cache = bySlug
    listeners.forEach((fn) => fn(bySlug))
    return bySlug
  })()
  inflight = p
  p.finally(() => { if (inflight === p) inflight = null }).catch(() => {})
  return p
}

// React hook: every category's sub-topic list, `{}` until loaded.
export function useSubtopicLists() {
  const [lists, setLists] = useState(cache || EMPTY)
  useEffect(() => {
    let alive = true
    const onChange = (next) => { if (alive) setLists(next) }
    listeners.add(onChange)
    if (cache) onChange(cache)
    else fetchSubtopics().then(onChange).catch(() => { /* optional feature — views fall back to "all" */ })
    return () => { alive = false; listeners.delete(onChange) }
  }, [])
  return lists
}

// Synchronous read of whatever has loaded (`{}` before the first fetch), for
// labels built outside React — the sync queue's rows.
export function getSubtopicListsSnapshot() {
  return cache || EMPTY
}

export function subtopicName(list, slug) {
  return list?.find((s) => s.slug === slug)?.name || slug
}
