// ─────────────────────────────────────────────────────────────
//  What the LiveMCQ category suggester is allowed to learn from.
//
//  The suggester's own corpus is the ~2.3k already-classified LiveMCQ rows.
//  This module decides whether the app's OTHER quiz modules (বাংলা ব্যাকরণ,
//  English, সাহিত্য, GK, Vocabulary) also get to vote, and under what label.
//
//  ── The hard rule ───────────────────────────────────────────
//  A LiveMCQ question can only ever be filed under a LiveMCQ category. The
//  other modules were built around a different syllabus, so their categories
//  do NOT line up with LiveMCQ's thirteen: `somas`, `karak` and `sondhi` are
//  three separate topics in the বাংলা module but all one topic (বাংলা ব্যাকরণ)
//  in LiveMCQ, and `vocab_p` has no LiveMCQ counterpart at all.
//
//  So a cross-module row is never carried over with its own category. It is
//  RELABELLED to the LiveMCQ category it belongs to, or it is left out. The
//  map below is the only way a foreign row enters the index, its values are
//  checked against LIVEMCQ_TOPICS at module load, and the classifier's output
//  is therefore closed over the LiveMCQ set by construction — there is no path
//  by which `somas` or `vocab_p` can be suggested for a LiveMCQ import.
//
//  ── Does it actually help? ──────────────────────────────────
//  Honestly: not much, at today's corpus size. Measured 5-fold over the live
//  data, folding these 1663 rows in at weight 0.25 moved top-1 accuracy
//  94.63% -> 94.32% and Apply-all from 90.1% coverage @ 97.90% precision to
//  90.7% @ 98.01%. A wash.
//
//  The reason is worth writing down: the categories these rows reinforce
//  (ব্যাকরণ, সাহিত্য, English Grammar) already score 99%, while the ones that
//  actually miss — মানসিক দক্ষতা 68%, বাংলাদেশ vs আন্তর্জাতিক ~88% — have no
//  counterpart module to learn from. Extra data helps where it is not needed.
//
//  It is kept anyway because the picture inverts when a category is thin. With
//  the LiveMCQ corpus sampled down to simulate an early or newly-split
//  category, the same rows are worth +1.5 to +3pp:
//
//    livemcq rows in index   accuracy on mapped categories
//      10%                     86.5%  ->  89.6%
//      20%                     90.7%  ->  92.1%
//      33%                     90.6%  ->  92.6%
//      50%                     95.3%  ->  95.8%
//
//  That is the case this exists for: a new LiveMCQ category, or a lopsided
//  import week, where its own history is too thin to vote well. The weight is
//  set low (0.25) precisely so these rows stay a fallback and never outvote
//  real LiveMCQ neighbours.
// ─────────────────────────────────────────────────────────────
import { LIVEMCQ_TOPICS } from '../data/index.js'

// How much a cross-module row counts against a real LiveMCQ row when the
// neighbourhood votes. Swept over 0.1–0.8; everything below ~0.35 scores the
// same, above it the foreign rows start pulling accuracy down.
export const CROSS_MODULE_WEIGHT = 0.25

// Whole modules that collapse into exactly one LiveMCQ category. Every topic
// in the বাংলা module (ধ্বনি, সন্ধি, সমাস, কারক, পরিভাষা, সমার্থক শব্দ …) is
// grammar; every topic in সাহিত্য is Bangla literature; every topic in the
// English module (tense, preposition, narration, error correction …) is
// English grammar — LiveMCQ files all of its synonym/antonym and find-the-error
// items there too, so the fit is exact.
const MODULE_TO_LIVEMCQ = {
  bangla: 'lm_bangla_byakoron',
  sahitya: 'lm_bangla_sahitya',
  english: 'lm_english_grammar',
}

// GK splits across several LiveMCQ categories, so it maps per topic.
const CATEGORY_TO_LIVEMCQ = {
  gk_bd_affairs: 'lm_bd_affairs',
  gk_intl_affairs: 'lm_intl_affairs',
  gk_science: 'lm_science',
  gk_ict: 'lm_ict',
}

// Deliberately NOT mapped — each would have to be forced into a category it
// does not belong in, and the classifier is better off not seeing them:
//
//   gk_lang_misc  'ভাষা, সাহিত্য ও বিবিধ' is three subjects in one bucket —
//                 it holds English noun questions, Bangla বাক্য শুদ্ধি and
//                 loanword trivia side by side. No single LiveMCQ target.
//   vocab_*       'Pellucid এর অর্থ কি?' — an English headword with Bengali
//                 glosses. LiveMCQ's English Grammar carries synonym/antonym
//                 items but nothing in this shape, and the Bengali options make
//                 these look like বাংলা ব্যাকরণ to a bag-of-words index.
//                 Measured: folding all 1025 in dropped Apply-all precision
//                 97.95% -> 97.66% for no accuracy gain.
const UNMAPPED_NOTE = 'gk_lang_misc and vocab_* are intentionally excluded'

// Modules the index reads from. `livemcq` is the real corpus; the rest are the
// relabelled fallback above.
export const TRAINING_MODULES = ['livemcq', ...Object.keys(MODULE_TO_LIVEMCQ), 'gk']

/**
 * The LiveMCQ category a foreign row should train as, or null to skip it.
 * @param {string} moduleId  the source module ('bangla', 'gk', …)
 * @param {string} slug      the source category slug
 * @returns {string|null}    a LIVEMCQ_TOPICS id, never anything else
 */
export function livemcqLabelFor(moduleId, slug) {
  if (moduleId === 'livemcq') return slug
  return MODULE_TO_LIVEMCQ[moduleId] || CATEGORY_TO_LIVEMCQ[slug] || null
}

// The closure guarantee, checked rather than asserted in a comment: every
// target above must be a live LiveMCQ topic id. If a topic is ever renamed in
// data/index.js this fails loudly at load instead of silently suggesting a
// category that no longer exists.
const LIVEMCQ_IDS = new Set(LIVEMCQ_TOPICS.map((t) => t.id))
for (const target of [...Object.values(MODULE_TO_LIVEMCQ), ...Object.values(CATEGORY_TO_LIVEMCQ)]) {
  if (!LIVEMCQ_IDS.has(target)) {
    throw new Error(
      `livemcqTraining: '${target}' is not a LiveMCQ category id. Cross-module ` +
      `training may only relabel into LIVEMCQ_TOPICS (${UNMAPPED_NOTE}).`,
    )
  }
}
