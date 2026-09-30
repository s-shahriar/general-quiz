// ─────────────────────────────────────────────────────────────
//  Deterministic category suggestion — NO AI, no network, no model.
//
//  This is a plain tf-idf / k-nearest-neighbour text ranker, the same class of
//  thing as a search box. It learns nothing at runtime and calls nothing: it
//  builds an in-memory index over the questions you have ALREADY classified,
//  then scores a new question against them and reports which category its
//  nearest neighbours sit in.
//
//  A suggestion is only ever a hint. Nothing here writes to the DB and nothing
//  auto-assigns — the UI pre-fills a chip that stays inert until clicked, so
//  every category that reaches the database is still an explicit human choice.
//
//  Why kNN and not a per-category centroid: these categories are internally
//  heterogeneous (গণিত holds both arithmetic and geometry wording), so a single
//  averaged vector per category smears them together. Nearest-neighbour also
//  gives us something a centroid can't — the actual matched question, which we
//  show so a suggestion can be judged instead of trusted.
//
//  ── What a document is ──────────────────────────────────────
//  A question is indexed from THREE fields, not just its text:
//
//    question     weight 1     the ask itself
//    explanation  weight 0.55  by far the biggest single win (see below)
//    options      weight 0.25  the answer set, a weak but real topical signal
//
//  The explanation is the surprise. LiveMCQ ships a worked, subject-specific
//  writeup with every question — a গণিত one walks through a সমাধান, a ব্যাংকিং
//  one names instruments and circulars, a grammar one dissects the sentence —
//  so it carries far more topical vocabulary than the one-line question does.
//  It is NOT a leak: `normalizeItem` already pulls `explanation`/`exp` out of
//  the import file, so every field indexed here is in hand before a category is
//  chosen. Measured over the live corpus (5-fold CV, 2271 rows), adding it took
//  top-1 accuracy from 76.3% to 94.6%.
//
//  Fields are kept in separate feature spaces ('o:' / 'e:' prefixes) rather
//  than concatenated, so a word in the question is not treated as evidence
//  interchangeable with the same word buried in a 2000-character explanation.
// ─────────────────────────────────────────────────────────────

// ── Tuning ───────────────────────────────────────────────────
// Every constant below was picked by grid search against the live corpus, not
// by taste. The surface is flat around these values — neighbouring settings
// score within ~0.3pp — so they are chosen mid-plateau rather than at a peak.
//
// `buildClassifier(rows, overrides)` accepts any of these by name. The app never
// passes overrides; scripts/eval-livemcq-classifier.mjs does, to re-run the
// grid search whenever the corpus has grown.
//
// Re-tuned 2026-09-30 (5-fold, 2202 LiveMCQ rows + 1663 cross-module):
//
//                    before (k 15, wE 0.55, wO 0.25, pa 0.3, stem 4)   after
//   top-1            93.7%                                            94.6%
//   macro            92.8%                                            93.7%
//   Apply-all        89.4% @ 97.8%                                    88.5% @ 98.2%
//   বাংলাদেশ         204/245                                          210/245
//   আন্তর্জাতিক      201/224                                          205/224
//
// The largest single step was the Bengali stem (see STEM_LEN): stems of 3 AND 5
// letters beat 4 alone, because 5 separates words that 4 merges (বাংলাদেশ /
// বাংলা…) while 3 still joins short inflected roots. Then more neighbours, a
// heavier explanation and option weight, and slightly stronger size damping.
// Plateau: k 20, wE 0.7, priorAlpha 0.4–0.5 and wOptions 0.4–0.55 all score
// 94.5–94.6%; wE past 0.7 falls off (0.85: 94.3–94.5, 1.0: 93.9–94.3).
//
// Tried and dropped, each measured alone: years as features with Bengali and
// Latin digits unified (flat, 93.7), an invented-operator puzzle feature
// ("8 Ω 5 = 3048" — fires on 3 rows, flat), and maths notation (93.6 at 0.6).
export const DEFAULTS = Object.freeze({
  wQuestion: 1,
  wExplanation: 0.7,
  wOptions: 0.4,
  k: 20,            // neighbours polled per suggestion
  simPower: 2,      // vote weight = sim^simPower; a close match outvotes a vague one
  priorAlpha: 0.4,  // see `prior` below — damps large categories
  minDf: 2,         // drop tokens seen in only one document
  minSim: 0.08,     // below this the nearest match is noise
  minConf: 0.34,    // below this the neighbours disagree too much
  wSymbol: 0,       // maths notation as features — see SYMBOL_RE
  stemLen: [3, 5],  // Bengali leading-edge stem length(s); 0 turns stems off
})

// The sub-topic indexes (one per split category, built in livemcqKnowledge.js)
// run on their own settings. They are a different problem from categories:
// eight to sixteen small classes inside one subject, where the category
// defaults were tuned for thirteen large ones across subjects.
//
//   wSymbol 0.75  maths notation (SYMBOL_RE). A trig item whose working is
//                 mostly surd algebra — "tanθ = √2 − 1, rationalise" — had only
//                 words that pointed at algebra; θ and tan now point back.
//   priorAlpha 0  no damping of big sub-topics. Across categories the damping
//                 stopped গণিত winning ties on sheer mass; inside one category
//                 the big sub-topics are big because they are common, and
//                 damping them only pushed guesses into rare ones.
//   minConf 0.25  answer at lower agreement. The extra answers are 'weak'
//                 (shown, never bulk-applied), and a visible guess beside the
//                 question beats a blank dropdown.
//   stemLen 4     the category's [3, 5] does not carry over: within one
//                 category it scored 85.2–85.3 against 4's 85.9.
//   k 20, wE 0.55, wO 0.4   by grid, as for categories.
//
// Measured 5-fold over the live corpus (870 labelled rows, 2026-09-30),
// against running the sub-topic indexes on the old shared DEFAULTS:
//
//                     before    after
//   all sub-topics    81.4%     85.9%
//   গণিত              81.4%     85.0%   (জ্যামিতি ও ত্রিকোণমিতি 10/19 -> 13/19)
//   English Grammar   65.2%     76.3%
//   বাংলা ব্যাকরণ     92.6%     93.1%
//   Apply-all         67.7% @ 95.8%  ->  64.8% @ 97.0%
//
// Plateau: wSymbol 0.5–1 and minConf 0.2–0.25 land within 0.4pp; k 15 trades
// 0.7pp of accuracy for +4pp Apply-all coverage. Keeping question-shape words
// ("choose the correct sentence") and a fill-in-blank feature were tried for
// English Grammar and moved it 0.1–0.4pp — noise, so not kept.
export const SUBTOPIC_DEFAULTS = Object.freeze({
  ...DEFAULTS,
  wExplanation: 0.55,
  wOptions: 0.4,
  k: 20,
  priorAlpha: 0,
  stemLen: 4,
  wSymbol: 0.75,
  minConf: 0.25,
})

// Bengali block + latin words. Single characters are dropped as noise.
const TOKEN_RE = /[ঀ-৿]{2,}|[a-z][a-z0-9]+/g
const BENGALI_RE = /[ঀ-৿]/

// Structural words only — nothing that carries subject signal. (e.g. 'অর্থ' is
// deliberately absent: it is a strong marker for বাংলা ব্যাকরণ.)
const STOP = new Set([
  // bengali
  'কি', 'কী', 'কোন', 'কোনটি', 'কোনটির', 'এর', 'এবং', 'এই', 'সেই', 'যে', 'তার',
  'জন্য', 'মধ্যে', 'থেকে', 'দিয়ে', 'সাথে', 'একটি', 'কত', 'কার', 'নিচের',
  'নিম্নের', 'নিম্নে', 'হয়', 'নয়', 'করা', 'হলো', 'হল', 'কোনটিই', 'নিচে',
  'উক্ত', 'দেওয়া', 'আছে', 'ছিল', 'কোনো', 'কোনটা', 'সঠিক', 'বাক্যটি',
  // latin
  'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'the', 'and', 'for',
  'from', 'with', 'that', 'this', 'these', 'those', 'are', 'was', 'were', 'is',
  'be', 'been', 'has', 'have', 'had', 'does', 'do', 'did', 'not', 'following',
  'correct', 'choose', 'select', 'option', 'answer', 'question', 'none', 'above',
  'sentence', 'word', 'words', 'meaning', 'best', 'most', 'can', 'will', 'would',
])

const stripTags = (s) => (s || '').replace(/<[^>]+>/g, ' ')

// The one hand-written feature in here, and it earns its place: an analogy
// item ("TROUPE : ACTORS :: CAVALCADE : ?", "FRIVOLOUS : SERIOUSNESS ::") is
// মানসিক দক্ষতা in this syllabus, never গণিত — but stripped of punctuation it
// is two bare nouns, so a bag of words has nothing to go on and the item lands
// in গণিত with the rest of the reasoning puzzles. Keeping the colons as a
// feature moved মানসিক দক্ষতা, the weakest category by a wide margin, from
// 67.6% to 71.6% while leaving all twelve others bit-identical.
//
// Caveat worth knowing before trusting it: only 9 questions in the corpus
// carry the pattern (8 of them মানসিক দক্ষতা). It is a narrow, literal rule
// about notation rather than a tuned parameter, which is why it generalises at
// all at that sample size — but it is not evidence of anything broader.
const ANALOGY_RE = /::|\b[A-Z]{3,}\s*:\s*[A-Z]{3,}/
const W_ANALOGY = 1.5

// Maths notation, kept as features instead of being thrown away with the
// punctuation. `TOKEN_RE` only sees letters and digits, so "tanθ", "√2",
// "30°" and "∠ABC" reduce to "tan", "2", "30" and "abc" — and the one thing
// that says "trigonometry" or "surd" or "geometry" is gone. Each symbol
// becomes its own token ('#θ', '#√'), counted like a word and subject to the
// same idf, so a symbol that is everywhere carries nothing and one that is
// rare carries a lot. Trig function names get the same treatment when they
// stand glued to an argument ("tanθ", "sin²A"), which the word regex splits
// unpredictably.
const SYMBOL_RE = /[θπ√∠△°%∞≤≥≠±×÷²³∴∵∑∫αβ!]|\b(?:sin|cos|tan|cot|sec|cosec|log|ln)(?=[θαβ²(\s\d]|$)/gi
const TRIG_SYMBOLS = new Set(['θ', 'sin', 'cos', 'tan', 'cot', 'sec', 'cosec'])

// Bengali is suffix-inflecting (শব্দ → শব্দের → শব্দগুলো), so a leading-edge
// stem collapses those to one feature. Emitted ALONGSIDE the full token, not
// instead of it, so an exact match still outweighs a stem match. A dictionary
// of real suffixes was tried instead and scored slightly WORSE (94.6 -> 93.6):
// the blind prefix also merges compounds that a suffix list cannot see.
const STEM_LEN = 4

export function tokenize(text, stemLen = STEM_LEN) {
  const s = stripTags(text).normalize('NFC').toLowerCase()
  const out = []
  const m = s.match(TOKEN_RE)
  if (!m) return out
  for (const t of m) {
    if (STOP.has(t)) continue
    out.push(t)
    if (!BENGALI_RE.test(t)) continue
    // One stem length, or several: each emits its own feature ('শব্দ~', 'শব্দে~5').
    for (const n of Array.isArray(stemLen) ? stemLen : [stemLen]) {
      if (n > 0 && t.length >= n + 1) out.push(t.slice(0, n) + (n === STEM_LEN ? '~' : '~' + n))
    }
  }
  return out
}

// LiveMCQ options arrive as an array from the import file and as an {a,b,c,d}
// object from the database. Same content either way.
function optionValues(options) {
  if (!options) return []
  const vals = Array.isArray(options) ? options : Object.values(options)
  return vals.filter(Boolean).map(String)
}

// Weighted term frequency across all three fields. Option and explanation
// tokens are namespaced so they never merge with question tokens.
function featureFreq(item, cfg) {
  const tf = new Map()
  const field = (text, prefix, weight) => {
    if (!text) return
    for (const t of tokenize(text, cfg.stemLen ?? STEM_LEN)) {
      const key = prefix + t
      const cur = tf.get(key)
      if (cur) cur.n++
      else tf.set(key, { n: 1, w: weight })
    }
  }
  field(item.question, '', cfg.wQuestion)
  field(item.explanation, 'e:', cfg.wExplanation)
  const opts = optionValues(item.options)
  if (opts.length) field(opts.join('   '), 'o:', cfg.wOptions)
  if (cfg.wSymbol > 0) {
    // One notation space across all three fields: a θ in the working is the
    // same evidence as a θ in the question.
    const text = [item.question, item.explanation, opts.join(' ')].map(stripTags).join(' ')
    const bump = (key) => {
      const cur = tf.get(key)
      if (cur) cur.n++
      else tf.set(key, { n: 1, w: cfg.wSymbol })
    }
    for (const m of text.normalize('NFC').matchAll(SYMBOL_RE)) {
      const sym = m[0].toLowerCase()
      bump('#' + sym)
      // "tan" in one question and "sin" in another are, to a bag of words,
      // unrelated; to a reader they are the same subject. Trig items are
      // few (5 of 253 গণিত rows), so they share one extra feature.
      if (TRIG_SYMBOLS.has(sym)) bump('#trig')
    }
  }
  // Case- and punctuation-sensitive, so it is matched on the raw question
  // rather than on anything `tokenize` has already flattened.
  if (ANALOGY_RE.test(stripTags(item.question))) tf.set('$analogy', { n: 1, w: W_ANALOGY })

  // Sublinear term frequency, then scale by the field the token came from.
  const out = new Map()
  for (const [t, { n, w }] of tf) out.set(t, (1 + Math.log(n)) * w)
  return out
}

// Confidence tiers, cut where measured accuracy actually falls off. Against
// the live corpus (5-fold CV, 2202 livemcq rows, 2026-09-30 settings) the
// category index scored:
//
//   confidence    n     correct
//   85-100%     1475      99.5%   -> 'strong'
//   60-85%       474      93.9%   -> 'likely'
//   34-60%       242      70.7%   -> 'weak'   (never bulk-applied)
//
// and the sub-topic indexes strong 100.0% · likely 94.2% · weak 67.6%.
//
// Only 'strong' and 'likely' are eligible for Apply-all; 'weak' still shows,
// because a visible bad guess next to the real question is easy to reject,
// but it has to be accepted one at a time. At the 0.6 cut, Apply-all covers
// 88.5% of a fresh batch at 98.2% precision.
export const BULK_APPLY_MIN = 0.6

export function tierOf(confidence) {
  if (confidence >= 0.85) return 'strong'
  if (confidence >= BULK_APPLY_MIN) return 'likely'
  return 'weak'
}

/**
 * Build an index over already-classified questions.
 *
 * @param {Array<{question: string, options?: object|string[], explanation?: string,
 *                slug: string, weight?: number, source?: string}>} labeled
 *   `weight` scales how much a document counts when its neighbourhood votes —
 *   cross-module training rows come in below 1 (see livemcqTraining.js).
 *   `source` is carried through to the suggestion untouched, so the UI can say
 *   where a matched neighbour came from.
 * @param {Partial<typeof DEFAULTS>} [overrides]  tuning, for evaluation only
 * @returns {{ size: number, suggest: (item: object) => Suggestion|null }}
 *
 * Suggestion = { slug, confidence, tier, nearest: { question, slug, source, sim }, runnerUp }
 */
export function buildClassifier(labeled, overrides) {
  const cfg = { ...DEFAULTS, ...overrides }
  const docs = []          // { slug, question, source, w, tf }
  const df = new Map()

  for (const row of labeled || []) {
    if (!row || !row.slug) continue
    const tf = featureFreq(row, cfg)
    if (!tf.size) continue
    docs.push({ slug: row.slug, question: row.question, source: row.source, w: row.weight ?? 1, tf })
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1)
  }

  const N = docs.length
  // A token seen in exactly one document can only ever match that one document,
  // and at these corpus sizes those are overwhelmingly proper nouns, digits and
  // typos. Dropping them costs nothing measurable and cuts the index by ~55%.
  const idf = new Map()
  for (const [t, n] of df) if (n >= cfg.minDf) idf.set(t, Math.log(1 + N / n))

  // L2-normalized tf-idf vectors + an inverted index so scoring touches only
  // the documents that share a token with the query.
  const inverted = new Map()
  docs.forEach((d, i) => {
    let sq = 0
    const vec = new Map()
    for (const [t, f] of d.tf) {
      const w = f * (idf.get(t) || 0)
      if (w <= 0) continue
      vec.set(t, w)
      sq += w * w
    }
    const norm = Math.sqrt(sq) || 1
    for (const [t, w] of vec) {
      const nw = w / norm
      let postings = inverted.get(t)
      if (!postings) inverted.set(t, (postings = []))
      postings.push([i, nw])
    }
    d.tf = null
  })

  // Weighted document count per category. Big categories (গণিত holds 384 rows,
  // English Literature 30) otherwise win ties on sheer mass: they simply have
  // more chances to land a mediocre neighbour in the top K. Dividing each vote
  // by size^0.3 corrects most of that without inverting it — it lifted
  // per-category (macro) accuracy by ~2.5pp while leaving overall accuracy flat.
  const prior = new Map()
  for (const d of docs) prior.set(d.slug, (prior.get(d.slug) || 0) + d.w)

  function suggest(item) {
    if (!N || !item) return null
    const qtf = featureFreq(item, cfg)
    if (!qtf.size) return null

    let sq = 0
    const q = new Map()
    for (const [t, f] of qtf) {
      const w = f * (idf.get(t) || 0)
      if (w <= 0) continue
      q.set(t, w)
      sq += w * w
    }
    if (!q.size) return null
    const qnorm = Math.sqrt(sq) || 1

    const scores = new Map()   // docIdx -> cosine
    for (const [t, w] of q) {
      const postings = inverted.get(t)
      if (!postings) continue
      const qw = w / qnorm
      for (const [i, dw] of postings) scores.set(i, (scores.get(i) || 0) + qw * dw)
    }
    if (!scores.size) return null

    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, cfg.k)
    const [bestIdx, bestSim] = ranked[0]
    if (bestSim < cfg.minSim) return null

    // Neighbours vote, weighted by sim² so a close match outweighs a vague one,
    // by the document's own weight, and against its category's size.
    const byCat = new Map()
    let total = 0
    for (const [i, sim] of ranked) {
      const d = docs[i]
      const w = Math.pow(sim, cfg.simPower) * d.w / Math.pow(prior.get(d.slug) || 1, cfg.priorAlpha)
      byCat.set(d.slug, (byCat.get(d.slug) || 0) + w)
      total += w
    }
    const order = [...byCat.entries()].sort((a, b) => b[1] - a[1])
    const [slug, top] = order[0]
    const confidence = total > 0 ? top / total : 0
    if (confidence < cfg.minConf) return null

    const near = docs[bestIdx]
    return {
      slug,
      confidence,
      tier: tierOf(confidence),
      nearest: { question: near.question, slug: near.slug, source: near.source, sim: bestSim },
      runnerUp: order[1] ? { slug: order[1][0], share: order[1][1] / total } : null,
    }
  }

  return { size: N, suggest }
}
