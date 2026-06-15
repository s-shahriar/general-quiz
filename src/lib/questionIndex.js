import { ALL_TOPICS } from '../data/index.js'

// The same question text can appear under several topics/indices (the dataset
// has ~160 such duplicates), so a single question maps to multiple qids
// (`${topicId}__${index}`). "Important"/"Nailed" are conceptually per-question,
// not per-copy, so we index text -> all its qids and vice-versa. This lets a
// toggle apply to every copy, so unticking reliably clears the question.

const norm = (s) =>
  (s ?? '').toString().normalize('NFC').replace(/[​-‍﻿]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()

let textToQids = null
let qidToText = null

function build() {
  textToQids = new Map()
  qidToText = new Map()
  for (const t of ALL_TOPICS) {
    t.questions.forEach((q, i) => {
      if (!q.options || !q.correct_answer) return
      const key = norm(q.question)
      if (!key) return
      const qid = `${t.id}__${i}`
      qidToText.set(qid, key)
      if (!textToQids.has(key)) textToQids.set(key, [])
      textToQids.get(key).push(qid)
    })
  }
}

function ensure() {
  if (!textToQids) build()
}

// All qids (incl. duplicates across topics) sharing this question's text.
export function qidsForText(text) {
  ensure()
  return textToQids.get(norm(text)) ?? []
}

// All qids that share the same question text as the given qid (incl. itself).
export function duplicateQidsOf(qid) {
  ensure()
  const key = qidToText.get(qid)
  if (!key) return [qid]
  return textToQids.get(key) ?? [qid]
}
