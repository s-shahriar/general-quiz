// Measure — and optionally re-tune — the LiveMCQ Admin panel's no-AI
// suggesters (category + sub-topic) against the live database.
//
//   node scripts/eval-livemcq-classifier.mjs          # score the shipped settings
//   node scripts/eval-livemcq-classifier.mjs --grid   # also grid-search the tuning
//
// 5-fold cross-validation over the labelled LiveMCQ rows. Each fold is scored by
// an index built from the other four folds PLUS the relabelled cross-module
// rows, which is exactly how livemcqKnowledge.js builds it in the browser.
// Read-only; uses the public anon key. Re-run after a big sync and copy the
// numbers into LIVEMCQ.md §8.A.1 / §8.C.

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildClassifier, BULK_APPLY_MIN, DEFAULTS } from '../src/lib/livemcqClassify.js'
import {
  TRAINING_MODULES, CROSS_MODULE_WEIGHT, SUBTOPIC_CROSS_WEIGHT, livemcqLabelFor, subtopicLabelFor,
} from '../src/lib/livemcqTraining.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
function loadEnv(file) {
  const p = join(ROOT, file)
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    if (line.trimStart().startsWith('#')) continue
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
loadEnv('.env'); loadEnv('.env.local')
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const GRID = process.argv.includes('--grid')
const FOLDS = 5

// ── data ─────────────────────────────────────────────────────
async function loadRows() {
  const rows = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from('questions')
      .select('id,question,options,explanation,extra,categories!inner(slug,module)')
      .in('categories.module', TRAINING_MODULES)
      .is('deleted_at', null)
      .order('id')
      .range(from, from + 999)
    if (error) throw error
    for (const r of data) {
      const module = r.categories.module
      const cat = livemcqLabelFor(module, r.categories.slug)
      if (!cat || !r.question) continue
      rows.push({
        id: r.id, module, cat,
        sub: subtopicLabelFor(module, r.categories.slug, r.extra || {}),
        native: module === 'livemcq',
        fold: parseInt(createHash('md5').update(r.id).digest('hex').slice(0, 8), 16) % FOLDS,
        question: r.question, options: r.options, explanation: r.explanation,
      })
    }
    if (data.length < 1000) break
  }
  return rows
}

// ── scoring ──────────────────────────────────────────────────
const doc = (r, slug, weight) => ({
  question: r.question, options: r.options, explanation: r.explanation, slug, weight, source: r.module,
})

function crossValidate(native, foreign, labelOf, opts, foreignWeight) {
  const out = []
  for (let f = 0; f < FOLDS; f++) {
    const train = native.filter((r) => r.fold !== f).map((r) => doc(r, labelOf(r), 1))
    if (foreignWeight > 0) for (const r of foreign) train.push(doc(r, labelOf(r), foreignWeight))
    const clf = buildClassifier(train, opts)
    for (const r of native) if (r.fold === f) out.push({ gold: labelOf(r), s: clf.suggest(r) })
  }
  return summarize(out)
}

function summarize(res) {
  const n = res.length
  const hit = (x) => x.s?.slug === x.gold
  const tiers = {}
  for (const t of ['strong', 'likely', 'weak']) {
    const g = res.filter((x) => x.s?.tier === t)
    tiers[t] = { n: g.length, acc: g.length ? g.filter(hit).length / g.length : 0 }
  }
  const bulk = res.filter((x) => x.s && x.s.confidence >= BULK_APPLY_MIN)
  const per = {}
  for (const x of res) { per[x.gold] ||= [0, 0]; per[x.gold][1]++; if (hit(x)) per[x.gold][0]++ }
  const macro = Object.values(per).reduce((a, [c, t]) => a + c / t, 0) / Object.keys(per).length
  return {
    n, acc: res.filter(hit).length / n, macro, abstain: res.filter((x) => !x.s).length, tiers,
    bulkCoverage: bulk.length / n, bulkPrecision: bulk.length ? bulk.filter(hit).length / bulk.length : 0, per,
  }
}

const pct = (v) => (v * 100).toFixed(1) + '%'
function report(title, s) {
  console.log(`\n${title}: n=${s.n}  top-1 ${pct(s.acc)}  macro ${pct(s.macro)}  abstain ${s.abstain}`)
  for (const [t, v] of Object.entries(s.tiers)) console.log(`  ${t.padEnd(7)} n=${String(v.n).padStart(5)}  correct ${pct(v.acc)}`)
  console.log(`  apply-all (≥${BULK_APPLY_MIN}): covers ${pct(s.bulkCoverage)} at ${pct(s.bulkPrecision)} precision`)
}
const perLine = (s) => Object.entries(s.per).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])
  .map(([k, [c, t]]) => `${k} ${c}/${t}`).join(' · ')

// ── main ─────────────────────────────────────────────────────
const rows = await loadRows()
const native = rows.filter((r) => r.native)
const foreign = rows.filter((r) => !r.native)
console.log(`rows: ${native.length} livemcq + ${foreign.length} cross-module`)

// Category
const cat = crossValidate(native, foreign, (r) => r.cat, {}, CROSS_MODULE_WEIGHT)
report('CATEGORY (shipped settings)', cat)
console.log('  weakest:', perLine(cat).split(' · ').slice(0, 5).join(' · '))

// Sub-topics — one index per split category, like assemble() in livemcqKnowledge.js
const splitCats = [...new Set(native.filter((r) => r.sub).map((r) => r.cat))]
function subtopicScore(opts, weight) {
  const all = []
  const byCat = {}
  for (const c of splitCats) {
    const nat = native.filter((r) => r.cat === c && r.sub)
    const frn = foreign.filter((r) => r.cat === c && r.sub)
    const out = []
    for (let f = 0; f < FOLDS; f++) {
      const train = nat.filter((r) => r.fold !== f).map((r) => doc(r, r.sub, 1))
      if (weight > 0) for (const r of frn) train.push(doc(r, r.sub, weight))
      const clf = buildClassifier(train, opts)
      for (const r of nat) if (r.fold === f) out.push({ gold: r.sub, s: clf.suggest(r) })
    }
    byCat[c] = summarize(out)
    all.push(...out)
  }
  return { total: summarize(all), byCat }
}
const sub = subtopicScore({}, SUBTOPIC_CROSS_WEIGHT)
report(`SUB-TOPIC (shipped settings, cross weight ${SUBTOPIC_CROSS_WEIGHT})`, sub.total)
for (const [c, s] of Object.entries(sub.byCat)) {
  report(`  ${c}`, s)
  console.log('  per sub-topic:', perLine(s))
}

if (GRID) {
  console.log('\n── grid: category ──')
  const catGrid = []
  for (const k of [10, 15, 20]) for (const wExplanation of [0.4, 0.55, 0.7]) for (const priorAlpha of [0.2, 0.3, 0.4]) {
    const opts = { k, wExplanation, priorAlpha }
    catGrid.push({ opts, s: crossValidate(native, foreign, (r) => r.cat, opts, CROSS_MODULE_WEIGHT) })
  }
  catGrid.sort((a, b) => b.s.acc - a.s.acc)
  for (const { opts, s } of catGrid.slice(0, 6)) console.log(JSON.stringify(opts), `top-1 ${pct(s.acc)} macro ${pct(s.macro)} apply-all ${pct(s.bulkCoverage)}@${pct(s.bulkPrecision)}`)

  console.log('\n── grid: sub-topic ──')
  const subGrid = []
  for (const k of [5, 10, 15]) for (const wExplanation of [0.3, 0.55, 0.8]) for (const priorAlpha of [0, 0.3]) for (const weight of [0, 0.25, 0.5]) {
    const opts = { k, wExplanation, priorAlpha }
    subGrid.push({ opts, weight, s: subtopicScore(opts, weight).total })
  }
  subGrid.sort((a, b) => b.s.acc - a.s.acc)
  for (const { opts, weight, s } of subGrid.slice(0, 8)) console.log(JSON.stringify(opts), `cross ${weight}`, `top-1 ${pct(s.acc)} macro ${pct(s.macro)} apply-all ${pct(s.bulkCoverage)}@${pct(s.bulkPrecision)}`)
  console.log('defaults:', JSON.stringify(DEFAULTS))
}
