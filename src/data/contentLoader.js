import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import {
  BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS,
  BANGLA_SAHITYA_TOPICS, LIVEMCQ_TOPICS,
} from './index.js'
import { VOCAB_TOPICS } from './vocabTopics.js'

// On-demand content: quiz questions live in Supabase and are fetched per module
// (a module = one route group) the first time that route needs them. Fetched
// arrays are cached in memory for the session and written into each topic's
// `questions` in place, so the existing components keep reading `topic.questions`.

const MODULE_TOPICS = {
  bangla: BANGLA_TOPICS,
  english: ENGLISH_TOPICS,
  gk: GK_TOPICS,
  sahitya: BANGLA_SAHITYA_TOPICS,
  livemcq: LIVEMCQ_TOPICS,
  vocab: VOCAB_TOPICS,
}
export const ALL_MODULES = Object.keys(MODULE_TOPICS)

const loaded = new Set()
const inflight = new Map()

function mapRow(r) {
  const { uid, question, options, correct_answer, correct_answer_text, explanation, extra } = r
  return { uid, question, options, correct_answer, correct_answer_text, explanation, ...(extra || {}) }
}

export function isModuleLoaded(moduleId) {
  return loaded.has(moduleId)
}

export function loadModule(moduleId) {
  if (!moduleId || loaded.has(moduleId)) return Promise.resolve()
  if (inflight.has(moduleId)) return inflight.get(moduleId)

  const topics = MODULE_TOPICS[moduleId]
  const p = (async () => {
    const bySlug = new Map()
    const pageSize = 1000
    // Paginate on the UNIQUE id — ordering by the non-unique sort_order would
    // skip/duplicate rows across page boundaries (>1000 rows). Per-category
    // newest-first order is applied in JS after grouping.
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from('questions')
        .select('id,uid,question,options,correct_answer,correct_answer_text,explanation,extra,sort_order,categories!inner(slug,module)')
        .eq('categories.module', moduleId)
        .order('id')
        .range(from, from + pageSize - 1)
      if (error) throw error
      for (const r of data) {
        const slug = r.categories.slug
        if (!bySlug.has(slug)) bySlug.set(slug, [])
        bySlug.get(slug).push({ ...mapRow(r), _sort: r.sort_order })
      }
      if (data.length < pageSize) break
    }
    for (const arr of bySlug.values()) arr.sort((a, b) => b._sort - a._sort)  // newest first
    for (const t of topics) t.questions = bySlug.get(t.id) || []
    loaded.add(moduleId)
  })()
  inflight.set(moduleId, p)
  p.finally(() => inflight.delete(moduleId))
  return p
}

export function loadAllModules() {
  return Promise.all(ALL_MODULES.map(loadModule))
}

// Fetch specific questions by uid — used by the Nailed / Important screens so
// they can render saved items without loading every module. Attaches the
// question's category id (== app topic id) for grouping.
export async function fetchQuestionsByUids(uids) {
  const list = [...new Set(uids)]
  if (!list.length) return []
  const out = []
  const chunk = 300
  for (let i = 0; i < list.length; i += chunk) {
    const { data, error } = await supabase
      .from('questions')
      .select('uid,question,options,correct_answer,correct_answer_text,explanation,extra,sort_order,categories!inner(slug,module,name)')
      .in('uid', list.slice(i, i + chunk))
      .order('sort_order', { ascending: false })
    if (error) throw error
    for (const r of data) out.push({ ...mapRow(r), _slug: r.categories.slug, _module: r.categories.module, _catName: r.categories.name })
  }
  return out
}

// React hook: ensure a module's questions are loaded; re-render when ready.
export function useModuleReady(moduleId) {
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!moduleId || isModuleLoaded(moduleId)) return
    let cancelled = false
    loadModule(moduleId).then(() => { if (!cancelled) setTick(t => t + 1) }).catch(() => {})
    return () => { cancelled = true }
  }, [moduleId])
  return moduleId ? isModuleLoaded(moduleId) : true
}

// React hook: ensure ALL modules are loaded (exam "all", saved screens).
export function useAllModulesReady() {
  const [ready, setReady] = useState(() => ALL_MODULES.every(isModuleLoaded))
  useEffect(() => {
    if (ready) return
    let cancelled = false
    loadAllModules().then(() => { if (!cancelled) setReady(true) }).catch(() => {})
    return () => { cancelled = true }
  }, [ready])
  return ready
}
