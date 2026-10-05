// Upserts the non-question utility content (Financial Terms) into `content_blobs`
// so the web app and Slate read one copy.   node scripts/sync-static.mjs [--dry]
// Icons are stored as lucide names (the component is resolved client-side).
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'

function loadEnv(file) {
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (line.trimStart().startsWith('#')) continue
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    if (!(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(ROOT)
loadEnv('.env'); loadEnv('.env.local')
const DRY = process.argv.includes('--dry')

const FILE = 'src/data/utility/finTermsData.js'
const m = await import(pathToFileURL(join(ROOT, FILE)).href)
// Component -> name: read the identifiers from the source, in FIN_CARDS order.
const cardsSrc = readFileSync(FILE, 'utf8').split('export const FIN_CARDS')[1].split('export const FIN_QUIZ')[0]
const names = [...cardsSrc.matchAll(/\bicon:\s*(\w+)/g)].map(x => x[1])
if (names.length !== m.FIN_CARDS.length) throw new Error(`icon names ${names.length} != cards ${m.FIN_CARDS.length}`)

const finance = {
  categories: Object.entries(m.FIN_CATEGORIES).map(([name, color]) => ({ name, color })),
  cards: m.FIN_CARDS.map((c, i) => ({ id: c.id, cat: c.cat, title: c.title, subtitle: c.subtitle, icon: names[i], body: c.body })),
  quiz: m.FIN_QUIZ.map((q, i) => ({ ...q, cat: m.FIN_QUIZ_CATS[i] })),
}
const rows = [{ kind: 'utility', key: 'finance', sort_order: 0, payload: finance }]
for (const r of rows) console.log(`${r.kind}/${r.key}: ${finance.cards.length} cards, ${finance.categories.length} cats, ${finance.quiz.length} quiz, ${JSON.stringify(r.payload).length} bytes`)
if (DRY) { console.log('dry run, nothing written'); process.exit(0) }

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const { error } = await supabase.from('content_blobs')
  .upsert(rows.map(r => ({ ...r, updated_at: new Date().toISOString() })), { onConflict: 'kind,key' })
if (error) { console.error(error); process.exit(1) }
console.log(`upserted ${rows.length} rows`)
