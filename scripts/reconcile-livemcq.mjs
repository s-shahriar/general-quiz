// Reconcile LiveMCQ question OPTIONS / correct answer against the authoritative
// LiveMCQ API. An earlier sync corrupted some option values (a leading char was
// stripped: "at"→"t", "upon"→"pon", "a"→"", "0"→""). This rebuilds each question's
// options positionally from the API and fixes any that drifted.
//
//   LIVEMCQ_TOKEN=<token> node scripts/reconcile-livemcq.mjs         # dry run (report only)
//   LIVEMCQ_TOKEN=<token> node scripts/reconcile-livemcq.mjs --apply # write fixes
//
// Matches DB rows to API items by extra.favorite_id. Only options / correct_answer
// / correct_answer_text are touched — never the question text or uid, so stable
// identity and user_progress are unaffected. Whitespace-only diffs are ignored.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

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

const URL = process.env.VITE_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const TOKEN = process.env.LIVEMCQ_TOKEN
const APPLY = process.argv.includes('--apply')
if (!URL || !KEY) { console.error('✖ Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
if (!TOKEN) { console.error('✖ Need LIVEMCQ_TOKEN in env (the LiveMCQ API token)'); process.exit(1) }
const db = createClient(URL, KEY, { auth: { persistSession: false } })

const LETTERS = ['a', 'b', 'c', 'd', 'e']

// Pull every favourite from the API (newest-first, 20/page).
async function fetchApi() {
  const byId = new Map()
  let page = 1, totalPages = 1
  do {
    const res = await fetch(`https://livemcq.com/api/v1/central-favorite-list/?page=${page}`,
      { headers: { Authorization: `Token ${TOKEN}` } })
    if (!res.ok) throw new Error(`API page ${page}: HTTP ${res.status}`)
    const j = await res.json()
    totalPages = j.pagination?.total_pages ?? 1
    for (const q of j.question_list || []) byId.set(String(q.favorite_id), q)
    page++
  } while (page <= totalPages)
  return byId
}

// Canonical options/answer for one API item: positional a..e, whitespace-trimmed,
// empty slots omitted. answer is 1-based; 0 ⇒ no correct answer.
function canonical(item) {
  const options = {}
  for (let i = 0; i < 5; i++) {
    const v = (item[`option${i + 1}`] ?? '').trim()
    if (v !== '') options[LETTERS[i]] = v
  }
  const ans = parseInt(item.answer, 10)
  const correct_answer = ans >= 1 && ans <= 5 ? LETTERS[ans - 1] : null
  const correct_answer_text = correct_answer ? (options[correct_answer] ?? null) : null
  return { options, correct_answer, correct_answer_text }
}

const trim = (v) => (v == null ? '' : String(v).trim())

// Meaningful (non-whitespace) diff between DB and canonical API options.
function optionsDiffer(dbOpts, apiOpts) {
  const keys = new Set([...Object.keys(dbOpts || {}), ...Object.keys(apiOpts)])
  for (const k of keys) {
    if (trim(dbOpts?.[k]) !== trim(apiOpts[k])) return true
  }
  return false
}

async function fetchDbLivemcq() {
  const rows = []
  const page = 1000
  for (let from = 0; ; from += page) {
    const { data, error } = await db
      .from('questions')
      .select('id, uid, options, correct_answer, correct_answer_text, extra, categories!inner(module)')
      .eq('categories.module', 'livemcq')
      .order('id')
      .range(from, from + page - 1)
    if (error) throw new Error(error.message)
    rows.push(...data)
    if (data.length < page) break
  }
  return rows
}

async function main() {
  console.log('→ Fetching LiveMCQ API…')
  const api = await fetchApi()
  console.log(`  API items: ${api.size}`)

  console.log('→ Fetching DB livemcq questions…')
  const rows = await fetchDbLivemcq()
  console.log(`  DB rows: ${rows.length}`)

  const fixes = []
  let noFav = 0, noApi = 0
  for (const r of rows) {
    const fav = r.extra?.favorite_id != null ? String(r.extra.favorite_id) : null
    if (!fav) { noFav++; continue }
    const item = api.get(fav)
    if (!item) { noApi++; continue }
    const canon = canonical(item)
    const changed = []
    if (optionsDiffer(r.options, canon.options)) changed.push('options')
    if (trim(r.correct_answer) !== trim(canon.correct_answer)) changed.push('correct_answer')
    if (trim(r.correct_answer_text) !== trim(canon.correct_answer_text)) changed.push('correct_answer_text')
    if (changed.length) fixes.push({ id: r.id, uid: r.uid, fav, changed, before: r, after: canon })
  }

  console.log(`\n${fixes.length} question(s) differ from the API` +
    `${noFav ? ` · ${noFav} without favorite_id (skipped)` : ''}` +
    `${noApi ? ` · ${noApi} not found in API (skipped)` : ''}\n`)

  for (const f of fixes) {
    console.log(`• ${f.uid} (fav ${f.fav}) — ${f.changed.join(', ')}`)
    if (f.changed.includes('options'))
      console.log(`    options:  ${JSON.stringify(f.before.options)}  →  ${JSON.stringify(f.after.options)}`)
    if (f.changed.includes('correct_answer'))
      console.log(`    answer:   ${f.before.correct_answer}  →  ${f.after.correct_answer}`)
    if (f.changed.includes('correct_answer_text'))
      console.log(`    ans_text: ${JSON.stringify(f.before.correct_answer_text)}  →  ${JSON.stringify(f.after.correct_answer_text)}`)
  }

  if (!fixes.length) { console.log('✔ Nothing to fix — DB matches the API.'); return }
  if (!APPLY) { console.log(`\n(dry run — re-run with --apply to write these ${fixes.length} fixes)`); return }

  console.log(`\n→ Applying ${fixes.length} fixes…`)
  let ok = 0
  for (const f of fixes) {
    const { error } = await db.from('questions').update({
      options: f.after.options,
      correct_answer: f.after.correct_answer,
      correct_answer_text: f.after.correct_answer_text,
    }).eq('id', f.id)
    if (error) { console.error(`  ✖ ${f.uid}: ${error.message}`); continue }
    ok++
  }
  console.log(`✔ Applied ${ok}/${fixes.length} fixes.`)
}

main().catch(e => { console.error('\n✖ Reconcile failed:', e.message); process.exit(1) })
