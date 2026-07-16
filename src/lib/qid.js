// ─────────────────────────────────────────────────────────────
//  Stable question identity.
//
//  A question's identity is a hash of its (normalized) text — NOT its
//  position in an array. This is the whole point: deleting or reordering
//  questions never changes any other question's uid, so saved progress
//  (nailed / important) can never "shift" onto the wrong question.
//
//  The same question text anywhere in the app resolves to the same uid,
//  so a flag set on one copy applies to every copy (the old
//  questionIndex.js dedup behaviour, now intrinsic to the identity).
//
//  This module is intentionally dependency-free and browser/Node safe:
//  the Vite app AND the Node seed script import it so the uid computed on
//  the client always matches the uid stored in the database.
// ─────────────────────────────────────────────────────────────

// Normalize question text: NFC, strip zero-width/BOM, lowercase, collapse
// whitespace. Mirrors the old norm() in questionIndex.js so identity is stable
// across the copy-paste noise present in the dataset.
export function normalizeQ(s) {
  return (s ?? '')
    .toString()
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// cyrb53 — a fast, synchronous, well-distributed 53-bit string hash.
// Chosen over SHA-1 because the browser's crypto.subtle.digest is async and
// this runs inside synchronous render code. Collision odds across ~5k questions
// are astronomically small (~53 bits).
function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

// Stable uid for a question's text. Prefixed 'q' + base36 → short, opaque,
// URL/localStorage/DB safe, e.g. "q1a2b3c4d5e".
export function uidOfText(text) {
  const norm = normalizeQ(text)
  if (!norm) return null
  return 'q' + cyrb53(norm).toString(36)
}

// Convenience: uid straight from a question object.
export function uidOf(q) {
  return uidOfText(q?.question)
}

// Stable uid for a non-question item (e.g. a math formula card), prefixed 'm'
// so it shares the same per-user `user_progress` table as questions without
// ever colliding with a question's 'q' uid. `key` should be a stable string
// identity for the item (we use "<sectionId>::<card title>"), so a card keeps
// its Important flag when its body is edited — only a retitle changes identity.
export function mathUidOfText(key) {
  const norm = normalizeQ(key)
  if (!norm) return null
  return 'm' + cyrb53(norm).toString(36)
}
