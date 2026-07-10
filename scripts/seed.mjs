// ─────────────────────────────────────────────────────────────
//  Seed script — loads ALL quiz content into Supabase.
//
//  Run:  node scripts/seed.mjs
//  Needs (in .env.local):  SUPABASE_SERVICE_ROLE_KEY   (secret, bypasses RLS)
//        (in .env):        VITE_SUPABASE_URL
//
//  Idempotent: wipes categories+questions and re-inserts from JSON, so it is
//  safe to re-run any time content changes. user_progress is keyed by `uid`
//  (not a question row id), so re-seeding never disturbs anyone's progress.
//
//  The `uid` written here is computed with the SAME helper the browser uses
//  (src/lib/qid.js) — so a flag set in the app matches a row seeded here.
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { uidOfText } from '../src/lib/qid.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ---- tiny .env loader (Node doesn't read .env on its own) ----
function loadEnv(file) {
  const p = join(ROOT, file)
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (!m || line.trimStart().startsWith('#')) continue
    const key = m[1]
    let val = m[2].trim().replace(/^["']|["']$/g, '')
    if (!(key in process.env)) process.env[key] = val
  }
}
loadEnv('.env')
loadEnv('.env.local')

const DRY_RUN = process.argv.includes('--dry') || process.env.DRY_RUN

const URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!DRY_RUN && (!URL || !SERVICE_KEY)) {
  console.error('\n✖ Missing env. Need VITE_SUPABASE_URL (.env) and SUPABASE_SERVICE_ROLE_KEY (.env.local).')
  console.error('  Get service_role from: Supabase Dashboard → Settings → API → service_role\n')
  process.exit(1)
}

const db = DRY_RUN ? null : createClient(URL, SERVICE_KEY, { auth: { persistSession: false } })

// ---- content manifest: every category, in display order ----
// slug MUST match the app's existing topic.id so routes stay stable.
const lm = (slug, file, name) => ({ slug, file, name })
const MANIFEST = [
  { module: 'bangla', dir: 'src/data/bangla', key: 'questions', nameField: 'topic',
    files: ['dhwoni_o_borno','dhwoni_poriborton','notwo_bidhan','sondhi','uposhorgo',
            'prokiti_protoy','somas','karak','pod','shobdo','poribhasha','banan_bakko','somarthok_shobdo'] },

  { module: 'english', dir: 'src/data/english', key: 'questions', nameField: 'topic',
    files: ['parts_of_speech','tense','right_form_of_verbs','subject_verb','voice','narration',
            'transformation','tag_question','preposition','determiner','error_correct','pin_point','final_exam'] },

  { module: 'sahitya', dir: 'src/data/sahitya', key: 'questions', nameField: 'topic',
    files: ['prachin_jug','moddho_jug','muktijudho','potrika','rabindranath_nazrul','ukti_choritro','others'] },

  { module: 'vocab', dir: 'src/data/vocab', key: 'questions', slugPrefix: 'vocab_',
    files: ['a','b','c','d','e','f','gh','i','jk','l','m','n','o','p','q','r','s','t','u','v','w','xyz'],
    names: { a:'A',b:'B',c:'C',d:'D',e:'E',f:'F',gh:'G–H',i:'I',jk:'J–K',l:'L',m:'M',n:'N',
             o:'O',p:'P',q:'Q',r:'R',s:'S',t:'T',u:'U',v:'V',w:'W',xyz:'X–Y–Z' } },

  { module: 'gk', dir: 'src/data/gk', key: 'mcqs', nameField: 'name',
    files: ['intl_economic_orgs'] },

  { module: 'livemcq', dir: 'public/lmdata', key: 'questions',
    // livemcq slug = app topic.id; file basename differs for a few.
    entries: [
      lm('lm_bangla_sahitya','bangla_sahitya','বাংলা সাহিত্য'),
      lm('lm_bangla_byakoron','bangla_byakoron','বাংলা ব্যাকরণ'),
      lm('lm_english_lit','english_literature','English Literature'),
      lm('lm_english_grammar','english_grammar','English Grammar'),
      lm('lm_bd_affairs','bd_affairs','বাংলাদেশ বিষয়াবলি'),
      lm('lm_intl_affairs','intl_affairs','আন্তর্জাতিক বিষয়াবলি'),
      lm('lm_mental_ability','mental_ability','মানসিক দক্ষতা'),
      lm('lm_science','general_science','সাধারণ বিজ্ঞান'),
      lm('lm_ict','ict','কম্পিউটার ও তথ্য প্রযুক্তি'),
      lm('lm_geography','geography','ভূগোল'),
      lm('lm_ethics','ethics','নৈতিকতা, মূল্যবোধ ও সু-শাসন'),
      lm('lm_math','math','গণিত'),
      lm('lm_banking','banking','ব্যাংকিং'),
    ] },
]

// Live app total. NOTE: src/data/bangla/practice_exam.json (133 q) exists on
// disk but is imported nowhere, so it is intentionally excluded — we seed only
// what the app actually shows.
const EXPECTED_TOTAL = 4465
const KNOWN = new Set(['id','question','options','correct_answer','correct_answer_text','explanation'])

function readJson(dir, file) {
  return JSON.parse(readFileSync(join(ROOT, dir, `${file}.json`), 'utf8'))
}

// Flatten the manifest into a uniform list of category descriptors.
function categoryList() {
  const out = []
  let order = 0
  for (const m of MANIFEST) {
    const entries = m.entries
      ? m.entries.map(e => ({ file: e.file, slug: e.slug, name: e.name }))
      : m.files.map(f => ({
          file: f,
          slug: (m.slugPrefix || '') + f,
          name: m.names?.[f],  // may be undefined → read from JSON below
        }))
    for (const e of entries) {
      out.push({ module: m.module, dir: m.dir, key: m.key, nameField: m.nameField,
                 file: e.file, slug: e.slug, name: e.name, sort_order: order++ })
    }
  }
  return out
}

function buildQuestionRows(categoryId, rawQuestions) {
  return rawQuestions.map((q, i) => {
    const uid = uidOfText(q.question)
    const extra = {}
    for (const k of Object.keys(q)) if (!KNOWN.has(k)) extra[k] = q[k]
    return {
      uid,
      category_id: categoryId,
      source_ref: q.id != null ? String(q.id) : null,
      type: 'mcq',
      question: q.question,
      options: q.options ?? null,
      correct_answer: q.correct_answer ?? null,
      correct_answer_text: q.correct_answer_text ?? null,
      explanation: q.explanation ?? null,
      extra,
      sort_order: i,
    }
  })
}

async function insertInBatches(table, rows, size = 500) {
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size)
    const { error } = await db.from(table).insert(chunk)
    if (error) throw new Error(`${table} insert [${i}..${i + chunk.length}]: ${error.message}`)
  }
}

async function dryRun() {
  console.log('→ DRY RUN (no DB writes) — validating files, keys, counts, uids…\n')
  const cats = categoryList()
  const perModule = {}
  let grandTotal = 0, noUid = 0
  const uidSeen = new Map()
  for (const c of cats) {
    const json = readJson(c.dir, c.file)   // throws if a file is missing / misnamed
    const name = c.name || (c.nameField ? json[c.nameField] : null) || c.slug
    const raw = json[c.key] || []
    if (!raw.length) console.warn(`  ! ${c.slug}: 0 questions under key "${c.key}"`)
    const rows = buildQuestionRows('dry', raw)
    for (const r of rows) {
      if (!r.uid) noUid++
      else uidSeen.set(r.uid, (uidSeen.get(r.uid) || 0) + 1)
    }
    perModule[c.module] = (perModule[c.module] || 0) + rows.length
    grandTotal += rows.length
    console.log(`  ✓ ${c.slug.padEnd(24)} ${String(rows.length).padStart(4)}  “${name}”`)
  }
  console.log('\n── Per-module totals ──')
  for (const [mod, n] of Object.entries(perModule)) console.log(`  ${mod.padEnd(10)} ${n}`)
  console.log(`  ${'TOTAL'.padEnd(10)} ${grandTotal}`)
  const dupUids = [...uidSeen.values()].filter(n => n > 1).length
  console.log(`\nuid stats: ${uidSeen.size} distinct • ${dupUids} shared by >1 question (same text) • ${noUid} empty-text`)
  if (grandTotal !== EXPECTED_TOTAL) {
    console.error(`\n✖ COUNT MISMATCH — expected ${EXPECTED_TOTAL}, got ${grandTotal}`)
    process.exit(1)
  }
  console.log(`\n✔ Dry run OK — ${grandTotal} questions match expected ${EXPECTED_TOTAL}. Ready to seed for real.`)
}

async function main() {
  if (DRY_RUN) return dryRun()
  console.log('→ Wiping existing content…')
  // Delete questions first (FK), then categories. Non-empty WHERE required.
  await db.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await db.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const cats = categoryList()
  console.log(`→ Seeding ${cats.length} categories…`)

  const perModule = {}
  let grandTotal = 0

  for (const c of cats) {
    const json = readJson(c.dir, c.file)
    const name = c.name || (c.nameField ? json[c.nameField] : null) || c.slug
    const raw = json[c.key] || []

    const { data: catRow, error: catErr } = await db.from('categories')
      .insert({ slug: c.slug, module: c.module, name, short_name: name, sort_order: c.sort_order })
      .select('id').single()
    if (catErr) throw new Error(`category ${c.slug}: ${catErr.message}`)

    const rows = buildQuestionRows(catRow.id, raw)
    // guard: every question must yield a uid
    const bad = rows.filter(r => !r.uid).length
    if (bad) console.warn(`  ! ${c.slug}: ${bad} question(s) produced no uid (empty text)`)
    await insertInBatches('questions', rows)

    perModule[c.module] = (perModule[c.module] || 0) + rows.length
    grandTotal += rows.length
    console.log(`  ✓ ${c.slug.padEnd(24)} ${rows.length} questions`)
  }

  console.log('\n── Per-module totals ──')
  for (const [mod, n] of Object.entries(perModule)) console.log(`  ${mod.padEnd(10)} ${n}`)
  console.log(`  ${'TOTAL'.padEnd(10)} ${grandTotal}`)

  // Verify against DB and the expected count.
  const { count } = await db.from('questions').select('*', { count: 'exact', head: true })
  console.log(`\nDB row count: ${count}`)
  if (grandTotal !== EXPECTED_TOTAL || count !== EXPECTED_TOTAL) {
    console.error(`\n✖ COUNT MISMATCH — expected ${EXPECTED_TOTAL}, seeded ${grandTotal}, in DB ${count}`)
    process.exit(1)
  }
  console.log(`\n✔ Seed complete — ${count} questions match expected ${EXPECTED_TOTAL}.`)
}

main().catch(err => { console.error('\n✖ Seed failed:', err.message); process.exit(1) })
