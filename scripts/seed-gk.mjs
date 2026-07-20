// ─────────────────────────────────────────────────────────────
//  GK-only seeder.
//
//  Run:  node scripts/seed-gk.mjs [--dry]
//
//  Why this exists instead of scripts/seed.mjs: the full seed wipes EVERY
//  module and re-inserts from local JSON. The livemcq content has drifted —
//  the DB holds rows that public/lmdata/ does not — so a full re-seed would
//  silently delete them. This script touches module='gk' and nothing else.
//
//  It replaces all GK questions, and replaces every GK category EXCEPT
//  intl_economic_orgs, which is kept as a study-notes-only topic.
//
//  `uid` uses the same helper as the browser (src/lib/qid.js), so a question
//  whose text is unchanged keeps its saved nailed/important flags.
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { uidOfText } from '../src/lib/qid.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

function loadEnv(file) {
  const p = join(ROOT, file)
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (!m || line.trimStart().startsWith('#')) continue
    if (!(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
loadEnv('.env')
loadEnv('.env.local')

const DRY = process.argv.includes('--dry')
const URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!DRY && (!URL || !KEY)) {
  console.error('\n✖ Missing VITE_SUPABASE_URL (.env) or SUPABASE_SERVICE_ROLE_KEY (.env.local)\n')
  process.exit(1)
}
const db = DRY ? null : createClient(URL, KEY, { auth: { persistSession: false } })

// Display order on the GK home screen. intl_economic_orgs is deliberately
// absent: it is study-notes only and its category row is left untouched.
const FILES = ['gk_bd_affairs', 'gk_intl_affairs', 'gk_science', 'gk_ict', 'gk_lang_misc']
const KEEP = ['intl_economic_orgs']

const die = (msg) => { console.error('\n✖ ' + msg + '\n'); process.exit(1) }

// ---- load + validate before touching the database ----
const topics = FILES.map((slug) => {
  const path = join(ROOT, 'src/data/gk', slug + '.json')
  const data = JSON.parse(readFileSync(path, 'utf8'))
  if (data.id !== slug) die(`${slug}.json: id "${data.id}" does not match filename`)
  if (!Array.isArray(data.mcqs) || !data.mcqs.length) die(`${slug}.json: no mcqs`)
  data.mcqs.forEach((q, i) => {
    const where = `${slug}[${i}] ${String(q.question).slice(0, 40)}`
    if (!q.question?.trim()) die(`${where}: empty question`)
    if (['a', 'b', 'c', 'd'].some((k) => !q.options?.[k]?.trim())) die(`${where}: missing an option`)
    if (!['a', 'b', 'c', 'd'].includes(q.correct_answer)) die(`${where}: bad correct_answer`)
    if (q.options[q.correct_answer] !== q.correct_answer_text) die(`${where}: answer/text mismatch`)
    if (new Set(Object.values(q.options)).size !== 4) die(`${where}: duplicate options`)
  })
  return { slug, data }
})

const seen = new Map()
for (const { slug, data } of topics) {
  for (const q of data.mcqs) {
    const uid = uidOfText(q.question)
    if (seen.has(uid)) die(`duplicate question across categories:\n    ${seen.get(uid)}\n    ${slug}: ${q.question}`)
    seen.set(uid, `${slug}: ${q.question}`)
  }
}

const total = topics.reduce((n, t) => n + t.data.mcqs.length, 0)
console.log(`\n${topics.length} categories, ${total} questions, ${seen.size} unique uids`)
for (const { slug, data } of topics) console.log(`  ${slug.padEnd(18)} ${String(data.mcqs.length).padStart(4)}  ${data.name}`)
if (DRY) { console.log('\n--dry: validated, nothing written.\n'); process.exit(0) }

// ---- replace ----
const { data: gkCats, error: e0 } = await db.from('categories').select('id,slug').eq('module', 'gk')
if (e0) die(e0.message)

const doomed = gkCats.map((c) => c.id)
if (doomed.length) {
  const { error } = await db.from('questions').delete().in('category_id', doomed)
  if (error) die(error.message)
  console.log(`\ndeleted all questions in ${doomed.length} existing GK categories`)
}

const drop = gkCats.filter((c) => !KEEP.includes(c.slug)).map((c) => c.id)
if (drop.length) {
  const { error } = await db.from('categories').delete().in('id', drop)
  if (error) die(error.message)
  console.log(`deleted ${drop.length} GK category rows (kept: ${KEEP.join(', ')})`)
}

for (const [i, { slug, data }] of topics.entries()) {
  const { data: cat, error: ec } = await db
    .from('categories')
    .upsert({ slug, module: 'gk', name: data.name, short_name: data.shortName, sort_order: i },
            { onConflict: 'slug' })
    .select('id')
    .single()
  if (ec) die(ec.message)

  const rows = data.mcqs.map((q, n) => ({
    uid: uidOfText(q.question),
    category_id: cat.id,
    source_ref: q.source_ref ?? null,
    type: 'mcq',
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    correct_answer_text: q.correct_answer_text,
    explanation: q.explanation || null,
    sort_order: n,
  }))

  for (let from = 0; from < rows.length; from += 200) {
    const { error } = await db.from('questions').insert(rows.slice(from, from + 200))
    if (error) die(`${slug}: ${error.message}`)
  }
  console.log(`inserted ${String(rows.length).padStart(4)}  ${slug}`)
}

const { data: check } = await db
  .from('categories')
  .select('slug,name,questions(count)')
  .eq('module', 'gk')
  .order('sort_order')
console.log('\nfinal state:')
for (const c of check) console.log(`  ${c.slug.padEnd(20)} ${String(c.questions[0]?.count ?? 0).padStart(4)}  ${c.name}`)
console.log()
