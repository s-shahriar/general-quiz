# Written » Data — Content Pipeline, Storage & Rendering

> How the **Written** module's reference data (BCS/bank written-exam statistics)
> is stored, seeded, loaded and drawn on screen. **Read this before adding or
> changing anything in the Written module** — the same recipe applies to every
> future card, category, and topic.
>
> This is the *reference-card* content type (a figure + its meaning), **not** the
> MCQ type. For MCQ modules see `LIVEMCQ.md`; for GK study-notes see
> `GK_PATTERN.md`.

---

## ⚠️ 0. SOURCE OF TRUTH — read this first

| What | Where |
|---|---|
| **What the app shows** | Supabase tables `written_categories` + `written_cards` (project `dancporuhvfwieyyzhdd`) |
| **What you edit by hand** | `src/data/written/dataTopicData.js` |
| **What syncs one to the other** | `node scripts/seed-written-data.mjs` |

`dataTopicData.js` is the **authoring file / seed source**, exactly like
`src/data/bangla/*.json` is for quiz questions. **No React component imports it** —
if one ever does, the whole card corpus lands back in the JS bundle and the point
of this pipeline is lost. Editing it alone changes nothing in the app; you must
re-run the seed script.

The browser reads the DB at runtime through `src/data/written/dataTopicLoader.js`.

---

## 1. Pipeline at a glance

```
  dataTopicData.js            scripts/seed-written-data.mjs        Supabase
  (author here, Bangla   ──▶  wipe topic='data' rows,        ──▶  written_categories
   content + icons)           re-insert from the file             written_cards
                                                                       │
                                                                       │ anon key,
                                                                       │ public-read RLS
                                                                       ▼
  WrittenData.jsx        ◀──  dataTopicLoader.js  ◀────────────  select … where topic='data'
  (renders cards)             (fetch once, cache in module scope,
                               map icon name → lucide component)
```

Backup: `scripts/backup.mjs` snapshots both tables into `backups/content.json`,
force-pushed to the `backups` branch by `.github/workflows/backup.yml`.

---

## 2. Schema

Created by migration `20260831095401_written_data_schema`. RLS is **on**, with a
single public `SELECT` policy on each table (`content_public_read_written_*`) —
same posture as `categories`/`questions`. There is **no** public write policy;
the seed script writes with the service-role key.

### `written_categories`

| column | type | notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `topic` | text | `'data'` — the Written topic this belongs to |
| `slug` | text | short latin id, e.g. `macro-economy` |
| `name` | text | Bangla display name, e.g. `সামষ্টিক অর্থনীতি` — also the join key used by the frontend |
| `color` | text | hex, drives the card accent + filter pill |
| `sort_order` | int | filter-bar order |

Unique on `(topic, slug)`.

### `written_cards`

| column | type | notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `topic` | text | `'data'` |
| `category_id` | uuid FK | → `written_categories.id`, `on delete cascade` |
| `serial` | int | the visible `#N` badge — the memory anchor, keep it stable |
| `icon` | text | lucide icon **name string**, e.g. `TrendingUp` (see §6 gotcha) |
| `title` | text | Bangla title |
| `subtitle` | text | English/short gloss, nullable |
| `body` | text | HTML, lines separated by `<br>` (see §5) |
| `tip` | text | mnemonic strip, nullable |
| `issues` | jsonb | array of Bangla strings, nullable — "সমস্যা" |
| `benefits` | jsonb | array of Bangla strings, nullable — "সুফল" |
| `sort_order` | int | grid order |

Unique on `(topic, serial)` — two cards can't share a serial.

---

## 3. Files

| File | Role |
|---|---|
| `src/data/written/dataTopicData.js` | **Authoring source.** `DATA_CATEGORIES` (name → color) + `DATA_CARDS` (array). Not bundled. |
| `scripts/seed-written-data.mjs` | Pushes that file into Supabase. Idempotent: wipes `topic='data'` then re-inserts. Needs `SUPABASE_SERVICE_ROLE_KEY` (`.env.local`) + `VITE_SUPABASE_URL` (`.env`). |
| `src/data/written/dataTopicLoader.js` | Runtime fetch + in-memory cache + `useWrittenDataReady()` hook + `ICON_MAP`. Mirrors `src/data/contentLoader.js`. |
| `src/components/written/WrittenData.jsx` | The Data page: filter pills, search, card grid, fold-out sections. |
| `src/components/written/WrittenData.css` | All `wd-` prefixed styling. |
| `src/components/written/HomeScreen.jsx` | Written module home; lists topics. Must **not** import card data. |
| `scripts/backup.mjs` | Includes both tables in the snapshot. |

---

## 4. Card shape (what you author)

```js
{
  id: 5,                                   // → DB `serial`, the #5 badge
  cat: 'জনসংখ্যা ও কর্মসংস্থান',            // must match a DATA_CATEGORIES key
  title: 'দারিদ্র্যের হার',
  subtitle: 'Poverty Rate',
  icon: Percent,                           // a lucide component, imported at top of file
  body: `১৯৭৩ — <strong>৮৯%</strong><br>২০২৬ — <strong>২৭.৯৩%</strong> [BBS/PPRC]`,
  tip: `৮৯% থেকে ধারাবাহিক পতন, কিন্তু ২০২৬-এ আবার ঊর্ধ্বমুখী`,
  issues: [                                // optional — bad-trending data
    'ক্রয়ক্ষমতা কমে যাওয়ায় নিম্ন আয়ের মানুষ সবচেয়ে বেশি ক্ষতিগ্রস্ত হয়',
  ],
  benefits: [ /* optional — good-trending data */ ],
}
```

Rules that keep the corpus consistent:

- **`body` = one fact per line**, lines joined with `<br>`. Each line becomes a
  bullet. Inline HTML allowed: `<strong>` (renders in the card's accent colour),
  `<em>` (amber), `<em class="warning">` (red).
- **Never duplicate a figure across cards.** If two source notes overlap, merge
  them into one card — that was the original rule when the 16 screenshots became
  13 cards.
- **`tip` is the memory hook**, not a restatement — a chain, a ratio, an
  exception ("শেষ সংখ্যাটাই ব্যতিক্রম").
- **`issues` / `benefits` are consequences, not more numbers** — 3 short points,
  what this figure *does* to the country. A card may carry one, both, or neither
  (ডেমোগ্রাফিক ডিভিডেন্ড carries both: an opportunity and a risk).
- Approximate figures are acceptable (these are transcribed handwritten notes),
  but cite the source in brackets when the note has one: `[BBS]`, `[BB]`, `[EPB]`.

---

## 5. Adding or changing data — the recipe

1. **Edit `src/data/written/dataTopicData.js`.**
   - New card → append with the next free `id` (serial). Keep serials stable;
     they are how the content is memorised.
   - New category → add to `DATA_CATEGORIES` **and** add its latin slug to
     `CATEGORY_SLUGS` in `scripts/seed-written-data.mjs` (the script throws if a
     category has no slug mapped).
   - New icon → it must be added in **three** places with the same plain name:
     imported in `dataTopicData.js`, added to `ICON_MAP` in
     `dataTopicLoader.js`, and added to `ICON_BY_REF` in
     `seed-written-data.mjs`. Miss the loader and it silently falls back to
     `Database`; miss the seed script and seeding throws.
2. **Seed:** `node scripts/seed-written-data.mjs`
   It wipes and reinserts `topic='data'`, then verifies the row counts against
   the source file and exits non-zero on mismatch.
3. **Verify locally:** `npm run dev` → `/written/data`. The page fetches from the
   DB, so a stale build is never the cause of "my edit isn't showing" — a
   forgotten step 2 is.
4. **Commit** the source file (+ any loader/script change). The DB already has
   the data; the commit is what keeps the seed source and the backup script in
   sync for the next run.

---

## 6. Gotchas (learned the hard way)

- **lucide icon aliases.** `lucide-react` exports every icon twice —
  `TrendingUp` *and* `LucideTrendingUp`. Reverse-looking-up a component against
  the whole namespace can store the aliased name, which `ICON_MAP` doesn't know,
  and every card silently renders the fallback `Database` icon. The seed script
  therefore reverse-maps against **an explicit list of the plain names only** —
  keep that list and `ICON_MAP` identical.
- **Bundle bloat.** The reason this content lives in the DB at all. After the
  move the `WrittenData` chunk is ~7 kB; `FinancialTerms`, which still bundles
  its cards statically, is ~54 kB. If you add a Written topic, follow this
  pattern, not the FinancialTerms one.
- **`<br>` is load-bearing.** `WrittenData.jsx` does `card.body.split('<br>')` to
  build the bullet list. Use `<br>` (not `<br/>`, not `\n`) between fact lines.
- **Serials are the anchor.** Renumbering cards breaks the user's recall and the
  `(topic, serial)` unique constraint will reject collisions anyway.

---

## 7. How it is visualized

The page is `/written/data` (`WrittenData.jsx`), reachable from **General home →
Written → Data**. Layout, top to bottom:

- **Sticky topbar** — back-to-home, title, hand-side toggle, theme toggle.
- **Category filter pills** — `সব` plus one pill per category, the active pill
  filled with that category's colour.
- **Search** — matches title, subtitle, body, category and tip. It does *not*
  currently look inside `issues`/`benefits`.
- **Card grid** — `repeat(auto-fill, minmax(min(300px, 100%), 1fr))`, one column
  under 640 px.

Each card, in order:

| Part | Rendering |
|---|---|
| Header | icon chip + Bangla title (in the category colour) + `#serial` badge + English subtitle |
| Body | one bullet per `<br>`-separated line, dot in the category colour, `<strong>` figures in the same accent |
| `সমস্যা` | red-tinted box, **folded by default**, click to unfold, red bullet dots |
| `সুফল` | green-tinted box, folded by default, independent of the সমস্যা toggle |
| `tip` | dashed mnemonic strip at the bottom, lightbulb icon |

Design rules that were deliberate (don't undo them without a reason):

- **Fold-out sections default to closed** — the card stays scannable; the
  consequences are recall practice, not reading material.
- **`সমস্যা` and `সুফল` unfold independently**, so a card carrying both doesn't
  force-open the other half.
- **Grid uses `align-items: start`** — when one card unfolds, its neighbours keep
  their own height instead of stretching into large empty boxes.
- **No hover background tint on cards** — it was added first and removed: the
  colour shift hurt text contrast while reading.
- **Bullets are drawn with `::before` dots**, not list markers: the app's global
  reset strips default markers, and the dots carry the section's colour
  (category colour in the body, red in সমস্যা, green in সুফল).

---

## 8. Backup

`scripts/backup.mjs` pulls `categories`, `questions`, `written_categories` and
`written_cards` into `backups/content.json` (plus the owner's `user_progress`
into `backups/progress.json`), with an integrity check (row counts must match the
DB) and a shrink guard (refuses to publish a snapshot smaller than the last one
unless `ALLOW_SHRINK=1`).

`.github/workflows/backup.yml` runs it **every ~3 days at 03:00 UTC** and
force-pushes a single orphan commit to the `backups` branch, so exactly one
snapshot exists at a time. It can also be run manually
(Actions → *Backup Supabase* → Run workflow).

**Any new Written table must be added to `backup.mjs`** — the four-table list,
its distinct/DB count check, and the `counts` block written into `content.json`
(the shrink guard reads previous counts by key, and treats a missing key as 0, so
adding a table is backward-compatible).

---

## 9. Adding a new Written topic (beyond `data`)

The schema is already topic-scoped, so a second topic (e.g. `charts`, `essays`)
does **not** need new tables:

1. Insert its categories/cards with `topic='<new>'` (copy
   `seed-written-data.mjs`, change the topic constant and the source file).
2. Add a loader that filters `.eq('topic', '<new>')` — copy
   `dataTopicLoader.js`.
3. Add the topic to the `TOPICS` array in `src/components/written/HomeScreen.jsx`
   and a route in `src/App.jsx` next to `/written/data`.
4. Reuse the `wd-` styles if the content is card-shaped; the CSS is not
   `data`-specific.
