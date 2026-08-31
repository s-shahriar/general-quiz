// ─────────────────────────────────────────────────────────────
//  Seed script — pushes the Written » Data cards into Supabase
//  (written_categories + written_cards, topic = 'data').
//
//  Run:  node scripts/seed-written-data.mjs
//  Needs (in .env.local):  SUPABASE_SERVICE_ROLE_KEY   (secret, bypasses RLS)
//        (in .env):        VITE_SUPABASE_URL
//
//  Idempotent: wipes topic='data' rows in both tables and re-inserts from
//  src/data/written/dataTopicData.js, so it is safe to re-run whenever the
//  source content changes.
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import {
  TrendingUp, TrendingDown, Users, Percent, HandCoins,
  Globe, ShoppingBag, PiggyBank, Wallet, ShieldAlert, Receipt, GraduationCap,
} from 'lucide-react'
import { DATA_CATEGORIES, DATA_CARDS } from '../src/data/written/dataTopicData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

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

const URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !SERVICE_KEY) {
  console.error('\n✖ Missing env. Need VITE_SUPABASE_URL (.env) and SUPABASE_SERVICE_ROLE_KEY (.env.local).')
  process.exit(1)
}
const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } })

// Bangla category name → a short latin slug (stable, readable in the DB).
const CATEGORY_SLUGS = {
  'সামষ্টিক অর্থনীতি': 'macro-economy',
  'জনসংখ্যা ও কর্মসংস্থান': 'population-employment',
  'বৈদেশিক খাত': 'external-sector',
  'রাজস্ব ও আর্থিক খাত': 'revenue-finance',
  'বাজেট': 'budget',
}

// Explicit plain-name map (matches src/data/written/dataTopicLoader.js's
// ICON_MAP exactly) — lucide-react also exports "Lucide"-prefixed aliases for
// the same components, and reverse-lookup against the full namespace can pick
// one of those instead, which the frontend map doesn't know.
const ICON_BY_REF = new Map(Object.entries({
  TrendingUp, TrendingDown, Users, Percent, HandCoins,
  Globe, ShoppingBag, PiggyBank, Wallet, ShieldAlert, Receipt, GraduationCap,
}))
function iconName(iconComponent) {
  for (const [name, comp] of ICON_BY_REF) if (comp === iconComponent) return name
  throw new Error('icon component not found in the known icon set')
}

async function main() {
  console.log('→ Wiping existing topic=data rows…')
  const { data: doomedCats, error: dcErr } = await db
    .from('written_categories').select('id').eq('topic', 'data')
  if (dcErr) throw new Error(`wipe read: ${dcErr.message}`)
  const doomedIds = doomedCats.map(c => c.id)
  if (doomedIds.length) {
    const { error: dCardsErr } = await db.from('written_cards').delete().in('category_id', doomedIds)
    if (dCardsErr) throw new Error(`wipe cards: ${dCardsErr.message}`)
    const { error: dCatsErr } = await db.from('written_categories').delete().in('id', doomedIds)
    if (dCatsErr) throw new Error(`wipe categories: ${dCatsErr.message}`)
  }
  console.log(`  removed ${doomedIds.length} categories and their cards`)

  console.log(`→ Seeding ${Object.keys(DATA_CATEGORIES).length} categories…`)
  const catIdByName = new Map()
  let order = 0
  for (const [name, color] of Object.entries(DATA_CATEGORIES)) {
    const slug = CATEGORY_SLUGS[name]
    if (!slug) throw new Error(`no slug mapped for category "${name}" — add it to CATEGORY_SLUGS`)
    const { data, error } = await db.from('written_categories')
      .insert({ topic: 'data', slug, name, color, sort_order: order++ })
      .select('id').single()
    if (error) throw new Error(`category ${name}: ${error.message}`)
    catIdByName.set(name, data.id)
    console.log(`  ✓ ${slug.padEnd(24)} "${name}"`)
  }

  console.log(`→ Seeding ${DATA_CARDS.length} cards…`)
  const rows = DATA_CARDS.map((c, i) => {
    const categoryId = catIdByName.get(c.cat)
    if (!categoryId) throw new Error(`card #${c.id} "${c.title}": unknown category "${c.cat}"`)
    return {
      topic: 'data',
      category_id: categoryId,
      serial: c.id,
      icon: iconName(c.icon),
      title: c.title,
      subtitle: c.subtitle || null,
      body: c.body,
      tip: c.tip || null,
      issues: c.issues || null,
      benefits: c.benefits || null,
      sort_order: i,
    }
  })
  const { error: insErr } = await db.from('written_cards').insert(rows)
  if (insErr) throw new Error(`cards insert: ${insErr.message}`)
  console.log(`  ✓ inserted ${rows.length} cards`)

  const { count: catCount } = await db.from('written_categories').select('*', { count: 'exact', head: true }).eq('topic', 'data')
  const { count: cardCount } = await db.from('written_cards').select('*', { count: 'exact', head: true }).eq('topic', 'data')
  console.log(`\n✔ Seed complete — ${catCount} categories, ${cardCount} cards (topic=data) in Supabase.`)
  if (catCount !== Object.keys(DATA_CATEGORIES).length || cardCount !== DATA_CARDS.length) {
    console.error(`✖ COUNT MISMATCH vs source — expected ${Object.keys(DATA_CATEGORIES).length} categories / ${DATA_CARDS.length} cards`)
    process.exit(1)
  }
}

main().catch(err => { console.error('\n✖ Seed failed:', err.message); process.exit(1) })
