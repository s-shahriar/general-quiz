// ─────────────────────────────────────────────────────────────
//  On-the-go curation of LiveMCQ questions: move one to another topic, or
//  change its sub-topic, straight from a Study card or the quiz (owner only —
//  the RPCs behind it are owner-gated). See LIVEMCQ.md §8.C.
//
//  Same shape as delete: the change lands on the in-memory content at once, so
//  the card leaves its topic / relabels without a reload, and the server write
//  goes through the offline queue — it shows in the sync drawer, survives being
//  offline, and can be undone from there.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { LIVEMCQ_TOPICS } from '../data/index.js'
import { enqueueMove, enqueueSubtopic } from './offlineQueue.js'
import { getSubtopicListsSnapshot, subtopicName } from './subtopics.js'

let version = 0
const listeners = new Set()
function bump() {
  version++
  listeners.forEach((fn) => fn(version))
}

// Re-render hook for lists built from `topic.questions`. Those arrays are
// mutated in place, so a memo keyed only on the topic would miss a move.
export function useContentEditsVersion() {
  const [v, setV] = useState(version)
  useEffect(() => {
    listeners.add(setV)
    return () => { listeners.delete(setV) }
  }, [])
  return v
}

export const topicName = (slug) => LIVEMCQ_TOPICS.find((t) => t.id === slug)?.name || slug || ''
const subName = (cat, slug) => (slug ? subtopicName(getSubtopicListsSnapshot()[cat], slug) : '')

// The loaded copy of a question (by row id) and the topic holding it right now.
// Null when the livemcq module isn't loaded this session.
export function findLivemcq(id) {
  if (!id) return null
  for (const t of LIVEMCQ_TOPICS) {
    const q = t.questions.find((x) => x._id === id)
    if (q) return { q, topic: t }
  }
  return null
}

export function canEditLivemcq(q, categorySlug) {
  return Boolean(q?._id && q?.favorite_id && LIVEMCQ_TOPICS.some((t) => t.id === categorySlug))
}

// Apply to every copy we hold: the module's object and, on the saved screens,
// the separately fetched one.
function copiesOf(id, q) {
  return [...new Set([findLivemcq(id)?.q, q].filter(Boolean))]
}

function moveLocal(q, toSlug) {
  const found = findLivemcq(q._id)
  if (found && found.topic.id !== toSlug) {
    const from = found.topic.questions
    from.splice(from.indexOf(found.q), 1)
    const dest = LIVEMCQ_TOPICS.find((t) => t.id === toSlug)
    if (dest) {
      // Topic lists are newest-first by favorite_id (sort_order tracks it), so
      // slot it where the server's renumber will put it.
      const fid = Number(found.q.favorite_id)
      const at = dest.questions.findIndex((x) => Number(x.favorite_id) < fid)
      dest.questions.splice(at < 0 ? dest.questions.length : at, 0, found.q)
    }
  }
  for (const c of copiesOf(q._id, q)) {
    c.subtopic = undefined          // the server drops it too — lists are per topic
    c._slug = toSlug
    c._catName = topicName(toSlug)
  }
  bump()
}

function subtopicLocal(q, sub) {
  for (const c of copiesOf(q._id, q)) c.subtopic = sub || undefined
  bump()
}

/** Move a question to another LiveMCQ topic. Its sub-topic is dropped. */
export function moveQuestion(q, fromSlug, toSlug) {
  if (!q?._id || !q.favorite_id || !toSlug || fromSlug === toSlug) return
  const fromSub = q.subtopic || findLivemcq(q._id)?.q.subtopic || ''
  moveLocal(q, toSlug)
  enqueueMove(q, {
    fid: String(q.favorite_id),
    from: fromSlug, to: toSlug,
    fromName: topicName(fromSlug), toName: topicName(toSlug),
    // Kept so Undo can put the sub-topic back along with the topic.
    fromSub, fromSubName: subName(fromSlug, fromSub),
  })
}

/** Set (or clear, with '') a question's sub-topic within `categorySlug`. */
export function changeSubtopic(q, categorySlug, fromSub, toSub) {
  if (!q?._id || !q.favorite_id || (fromSub || '') === (toSub || '')) return
  subtopicLocal(q, toSub)
  enqueueSubtopic(q, {
    fid: String(q.favorite_id),
    cat: categorySlug, catName: topicName(categorySlug),
    from: fromSub || '', to: toSub || '',
    fromName: subName(categorySlug, fromSub), toName: subName(categorySlug, toSub),
  })
}
