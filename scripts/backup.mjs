// Backup script — snapshots ALL content + the OWNER's cloud progress & highlights to
// /backups/*.json (committed to git as a safety net; never imported by the app,
// so it adds nothing to the bundle).
//
//   node scripts/backup.mjs
// Needs SUPABASE_SERVICE_ROLE_KEY (secret) + VITE_SUPABASE_URL in env
// (.env.local locally; a GitHub Actions secret in CI).

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'

const OWNER_EMAIL = 'ksnkkc@gmail.com'   // only this account's progress is backed up

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
if (!URL || !KEY) { console.error('✖ Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const db = createClient(URL, KEY, { auth: { persistSession: false } })

// Read the counts of the CURRENT published snapshot (the single commit on the
// `backups` branch), so we never overwrite a good backup with a smaller one. A
// silent partial delete / truncated read would otherwise still pass the
// complete+duplicate-free integrity check and clobber the only copy. Best-effort:
// returns null on the first run, a missing branch, or no git/remote (then the
// guard is skipped — nothing to compare against).
function previousCounts() {
  try {
    execSync('git fetch origin backups --depth=1', { cwd: ROOT, stdio: 'ignore' })
    // content.json is several MB — raise maxBuffer well past execSync's 1MB default
    // (ENOBUFS otherwise). We only need the small `counts` object at its head.
    const prev = execSync('git show FETCH_HEAD:backups/content.json',
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 })
    const j = JSON.parse(prev)
    return (j && j.counts) || null
  } catch {
    return null
  }
}

async function fetchAll(table, columns, order = 'id') {
  const rows = []
  const page = 1000
  for (let from = 0; ; from += page) {
    const { data, error } = await db.from(table).select(columns).order(order).range(from, from + page - 1)
    if (error) throw new Error(`${table}: ${error.message}`)
    rows.push(...data)
    if (data.length < page) break
  }
  return rows
}

// Every row of `table` belonging to one user. Paginated — a single select is
// capped at PostgREST's 1000-row limit and truncates silently — and checked
// against an exact count, so a short read fails the backup instead of shipping.
// `key` must be unique within the user's rows; it is also the page order.
async function fetchOwnerRows(table, userId, key) {
  const rows = []
  const page = 1000
  for (let from = 0; ; from += page) {
    const { data, error } = await db.from(table).select('*').eq('user_id', userId).order(key).range(from, from + page - 1)
    if (error) throw new Error(`${table}: ${error.message}`)
    rows.push(...data)
    if (data.length < page) break
  }
  const { count, error } = await db.from(table).select('*', { count: 'exact', head: true }).eq('user_id', userId)
  if (error) throw new Error(`${table}: ${error.message}`)
  const distinct = new Set(rows.map(r => r[key])).size
  if (rows.length !== count || distinct !== rows.length) {
    throw new Error(`integrity check failed — ${table} ${rows.length}/${distinct} distinct vs DB ${count}`)
  }
  return rows
}

async function main() {
  const dir = join(ROOT, 'backups')
  if (!existsSync(dir)) mkdirSync(dir)

  // ── ALL content ──
  const categories = await fetchAll('categories', '*', 'id')
  const questions = await fetchAll('questions', '*', 'id')
  const writtenCategories = await fetchAll('written_categories', '*', 'id')
  const writtenCards = await fetchAll('written_cards', '*', 'id')
  // LiveMCQ sub-topic lists (LIVEMCQ.md §8.C). A question's own sub-topic is in
  // questions.extra, so it is already covered by the questions dump.
  const subtopics = await fetchAll('subtopics', '*', 'id')

  // Integrity guard: the snapshot must be COMPLETE and DUPLICATE-FREE. A
  // pagination-on-non-unique-column bug once produced dupes + missing rows that
  // slipped through a weaker check, so fail loudly rather than publish garbage.
  const distinctQ = new Set(questions.map(q => q.id)).size
  const distinctC = new Set(categories.map(c => c.id)).size
  const distinctWC = new Set(writtenCategories.map(c => c.id)).size
  const distinctWCards = new Set(writtenCards.map(c => c.id)).size
  const { count: dbQ } = await db.from('questions').select('*', { count: 'exact', head: true })
  const { count: dbC } = await db.from('categories').select('*', { count: 'exact', head: true })
  const { count: dbWC } = await db.from('written_categories').select('*', { count: 'exact', head: true })
  const { count: dbWCards } = await db.from('written_cards').select('*', { count: 'exact', head: true })
  if (distinctQ !== questions.length || questions.length !== dbQ || distinctC !== categories.length || categories.length !== dbC) {
    throw new Error(`integrity check failed — questions ${questions.length}/${distinctQ} distinct vs DB ${dbQ}; categories ${categories.length}/${distinctC} vs DB ${dbC}`)
  }
  if (distinctWC !== writtenCategories.length || writtenCategories.length !== dbWC || distinctWCards !== writtenCards.length || writtenCards.length !== dbWCards) {
    throw new Error(`integrity check failed — written_cards ${writtenCards.length}/${distinctWCards} distinct vs DB ${dbWCards}; written_categories ${writtenCategories.length}/${distinctWC} vs DB ${dbWC}`)
  }
  const distinctSub = new Set(subtopics.map(s => s.id)).size
  const { count: dbSub } = await db.from('subtopics').select('*', { count: 'exact', head: true })
  if (distinctSub !== subtopics.length || subtopics.length !== dbSub) {
    throw new Error(`integrity check failed — subtopics ${subtopics.length}/${distinctSub} distinct vs DB ${dbSub}`)
  }

  // Shrink guard: refuse to replace the single snapshot with a SMALLER dataset,
  // so an accidental mass-delete can't silently wipe the only backup. Growth and
  // equality are fine. Set ALLOW_SHRINK=1 to override when a deletion is intended.
  const prev = previousCounts()
  if (prev && process.env.ALLOW_SHRINK !== '1') {
    if (questions.length < prev.questions || categories.length < prev.categories ||
        writtenCategories.length < (prev.writtenCategories ?? 0) || writtenCards.length < (prev.writtenCards ?? 0) ||
        subtopics.length < (prev.subtopics ?? 0)) {
      throw new Error(
        `shrink guard: current (${questions.length} questions / ${categories.length} categories / ` +
        `${writtenCategories.length} written categories / ${writtenCards.length} written cards / ` +
        `${subtopics.length} sub-topics) is smaller than the last snapshot (${prev.questions} questions / ` +
        `${prev.categories} categories / ${prev.writtenCategories ?? 0} written categories / ` +
        `${prev.writtenCards ?? 0} written cards / ${prev.subtopics ?? 0} sub-topics). Refusing to ` +
        `overwrite the backup. If this deletion is intentional, re-run with ALLOW_SHRINK=1.`)
    }
    console.log(`shrink guard OK — ${questions.length} ≥ ${prev.questions} questions, ${categories.length} ≥ ${prev.categories} categories, ` +
      `${writtenCategories.length} ≥ ${prev.writtenCategories ?? 0} written categories, ${writtenCards.length} ≥ ${prev.writtenCards ?? 0} written cards, ` +
      `${subtopics.length} ≥ ${prev.subtopics ?? 0} sub-topics`)
  } else if (!prev) {
    console.log('shrink guard skipped — no previous snapshot to compare against')
  }

  writeFileSync(join(dir, 'content.json'), JSON.stringify({
    counts: {
      categories: categories.length, questions: questions.length,
      writtenCategories: writtenCategories.length, writtenCards: writtenCards.length,
      subtopics: subtopics.length,
    },
    categories, questions, writtenCategories, writtenCards, subtopics,
  }, null, 2))
  console.log(`content.json → ${categories.length} categories, ${questions.length} questions, ` +
    `${writtenCategories.length} written categories, ${writtenCards.length} written cards, ${subtopics.length} sub-topics`)

  // ── OWNER's cloud progress only ──
  const { data: { users }, error: uErr } = await db.auth.admin.listUsers({ perPage: 1000 })
  if (uErr) throw uErr
  const owner = users.find(u => u.email === OWNER_EMAIL)
  // (user_id, uid) is unique, so uid pages one user's progress stably. Until
  // 2026-09-14 this was a single select, silently truncated to 1000 of 1666 rows.
  const progress = owner ? await fetchOwnerRows('user_progress', owner.id, 'uid') : []
  const highlights = owner ? await fetchOwnerRows('user_highlights', owner.id, 'id') : []
  writeFileSync(join(dir, 'progress.json'), JSON.stringify({
    owner: OWNER_EMAIL,
    count: progress.length,
    nailed: progress.filter(p => p.nailed).length,
    important: progress.filter(p => p.important).length,
    weak: progress.filter(p => p.weak).length,
    progress,
  }, null, 2))
  console.log(`progress.json → ${progress.length} rows for ${OWNER_EMAIL}${owner ? '' : ' (owner not found)'}`)

  // Saved highlights. No shrink guard: removing a highlight is ordinary use.
  writeFileSync(join(dir, 'highlights.json'), JSON.stringify({
    owner: OWNER_EMAIL,
    count: highlights.length,
    highlights,
  }, null, 2))
  console.log(`highlights.json → ${highlights.length} rows for ${OWNER_EMAIL}`)
}

main().catch(e => { console.error('✖ Backup failed:', e.message); process.exit(1) })
