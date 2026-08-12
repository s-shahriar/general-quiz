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
// ─────────────────────────────────────────────────────────────

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

// Bengali is suffix-inflecting (শব্দ → শব্দের → শব্দগুলো), so a leading-edge
// stem collapses those to one feature. Emitted ALONGSIDE the full token, not
// instead of it, so an exact match still outweighs a stem match.
const STEM_LEN = 4

export function tokenize(text) {
  const s = stripTags(text).normalize('NFC').toLowerCase()
  const out = []
  const m = s.match(TOKEN_RE)
  if (!m) return out
  for (const t of m) {
    if (STOP.has(t)) continue
    out.push(t)
    if (BENGALI_RE.test(t) && t.length >= STEM_LEN + 1) out.push(t.slice(0, STEM_LEN) + '~')
  }
  return out
}

// Sublinear term frequency, keyed by token.
function termFreq(tokens) {
  const tf = new Map()
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1)
  for (const [t, n] of tf) tf.set(t, 1 + Math.log(n))
  return tf
}

// Confidence tiers, cut where measured accuracy actually falls off. Against
// the live 2205-row set (train on 4/5, test on the held-out 1/5) this scored:
//
//   confidence   n     correct
//   90-100%     125     98.4%     -> 'strong'
//   75-90%       93     95.7%     -> 'strong'
//   60-75%       69     76.8%     -> 'likely'
//   34-60%      123     58.5%     -> 'weak'   (never bulk-applied)
//
// Only 'strong' and 'likely' are eligible for Apply-all; 'weak' still shows,
// because a visible bad guess next to the real question is easy to reject,
// but it has to be accepted one at a time.
export const BULK_APPLY_MIN = 0.6

export function tierOf(confidence) {
  if (confidence >= 0.75) return 'strong'
  if (confidence >= BULK_APPLY_MIN) return 'likely'
  return 'weak'
}

/**
 * Build an index over already-classified questions.
 * @param {Array<{question: string, slug: string}>} labeled
 * @returns {{ size: number, suggest: (text: string) => Suggestion|null }}
 *
 * Suggestion = { slug, confidence, tier, nearest: { question, slug, sim }, runnerUp }
 */
export function buildClassifier(labeled) {
  const docs = []          // { slug, question, norm: Map<token, weight> }
  const df = new Map()
  const K = 15             // neighbours polled per suggestion
  const MIN_SIM = 0.08     // below this the nearest match is noise
  const MIN_CONF = 0.34    // below this the neighbours disagree too much

  for (const row of labeled || []) {
    if (!row || !row.slug) continue
    const tokens = tokenize(row.question)
    if (!tokens.length) continue
    const tf = termFreq(tokens)
    docs.push({ slug: row.slug, question: row.question, tf })
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1)
  }

  const N = docs.length
  const idf = new Map()
  for (const [t, n] of df) idf.set(t, Math.log(1 + N / n))

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
      vec.set(t, nw)
      let postings = inverted.get(t)
      if (!postings) inverted.set(t, (postings = []))
      postings.push([i, nw])
    }
    d.norm = vec
    d.tf = null
  })

  function suggest(text) {
    if (!N) return null
    const tokens = tokenize(text)
    if (!tokens.length) return null

    const qtf = termFreq(tokens)
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

    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, K)
    const [bestIdx, bestSim] = ranked[0]
    if (bestSim < MIN_SIM) return null

    // Neighbours vote, weighted by sim² so a close match outweighs a vague one.
    const byCat = new Map()
    let total = 0
    for (const [i, sim] of ranked) {
      const w = sim * sim
      byCat.set(docs[i].slug, (byCat.get(docs[i].slug) || 0) + w)
      total += w
    }
    const order = [...byCat.entries()].sort((a, b) => b[1] - a[1])
    const [slug, top] = order[0]
    const confidence = total > 0 ? top / total : 0
    if (confidence < MIN_CONF) return null

    return {
      slug,
      confidence,
      tier: tierOf(confidence),
      nearest: { question: docs[bestIdx].question, slug: docs[bestIdx].slug, sim: bestSim },
      runnerUp: order[1] ? { slug: order[1][0], share: order[1][1] / total } : null,
    }
  }

  return { size: N, suggest }
}
