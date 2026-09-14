# LiveMCQ Module — Pipeline, Data Format & Setup

> This document explains the **LiveMCQ** module: how questions are pulled from the
> LiveMCQ app, categorized, stored, rendered, and kept duplicate‑free. It also
> documents the **Termux** setup for the sync script (`livefav`) — including the
> gotchas we hit — so it can be reproduced cleanly.
>
> **Storage moved to Supabase — read §0 first.** Where older sections say questions
> are "given as JSON" in `public/lmdata/*.json`, the live app now reads them from
> the **DB**; the JSON files are a frozen seed. Syncing = INSERT into the DB (§8).
>
> LiveMCQ is a plain **MCQ module** (like Bangla/English Grammar): each topic has
> `question · options · correct answer · explanation`, and gets Quiz, Study,
> Exam, Important and Nailed for free. It is **not** the GK study‑notes type — see
> `GK_PATTERN.md` for that.

---

## ⚠️ 0. SOURCE OF TRUTH — read this before syncing anything

**The Supabase database is the source of truth.** The app reads LiveMCQ questions
**live from the DB** at runtime (`src/data/contentLoader.js`), NOT from the JSON
files. To sync new favourites you **INSERT rows into the Supabase `questions`
table** — see §8.

The `public/lmdata/*.json` files are the **original seed only** (a historical
snapshot / backup). **Writing to them does nothing for the live app** — an agent
that appends to `public/lmdata/*.json` (as older sections of this doc describe)
produces a change that never appears in the app. Sections §1, §3, §6, §7 below
still describe the old JSON pipeline; treat them as **format/reference only** and
mentally substitute "DB `questions` table" wherever they say "`public/lmdata/*.json`".

Baseline/dedup is measured against the **DB**, not the JSON files:

```sql
select count(*) as db_count, max((extra->>'favorite_id')::bigint) as db_max
from questions q join categories c on c.id=q.category_id where c.module='livemcq';
```

> **Two-baseline gotcha (why counts disagree):** the DB has already been synced
> past the frozen JSON seed. Counting "new" from the JSON files (e.g. 2008) vs.
> from the DB (e.g. 2023) yields different totals for the *same* backend — always
> use the DB `db_max` as the baseline.

---

## 1. Big picture (the pipeline)

> **⚠️ This diagram is the OLD (pre-Supabase) pipeline** — kept because the
> fetch→categorize→dedup front half is still how you get + classify favourites.
> The back half changed: the categorized questions now land in the **Supabase
> `questions` table** (which the app reads), **not** in `public/lmdata/*.json`.
> Read §0; the current end-to-end sync is §8.

```
LiveMCQ app (phone)                     PC / this repo
──────────────────                      ─────────────
your saved "favourites"
        │  central-favorite-list API (Token auth)
        ▼
  livefav (Termux)  ──►  JSON of newest N favourites
        │                       │  copy off phone
        ▼                       ▼
  ~/Downloads/livemcq_favourites/           (categorize + dedup)
        │
        ▼
  favourites_clean_categorized.json  ──►  per-category build
        │
        ▼           [OLD]  public/lmdata/<category>.json  (frozen seed)
        └──────────► [NOW]  INSERT into Supabase `questions`  ──►  app reads live
```

- **Source of truth = the Supabase `questions` table** (§0). The off-repo
  `~/Downloads/livemcq_favourites/` PC master and the `public/lmdata/*.json` files
  are **historical seed/backup**, not what the app renders.
- **What the app renders:** rows from the DB, loaded lazily per module via
  `src/data/contentLoader.js` (see §6). The 13 `public/lmdata/*.json` files no
  longer feed the runtime.

---

## 2. The LiveMCQ API (how favourites are fetched)

| | |
|---|---|
| Endpoint | `GET https://livemcq.com/api/v1/central-favorite-list/?page=N` |
| Auth | header `Authorization: Token <token>` |
| Page size | **20** questions/page |
| Order | **newest first** — `favorite_id` descending |
| Per-question filter | `favorite-list-subject/{id}/` also exists but its subject IDs are unreliable; **do not** use it for categories (see §4). |

- The **token** is a long-lived Django REST token. It lives in the app's
  private prefs: `/data/data/com.livemcq.livemcq/shared_prefs/FlutterSharedPreferences.xml`
  → key `flutter.token` (root required to read).
- It only rotates when you **log out** of the LiveMCQ app (Google Sign-In). While
  logged in, the same token keeps working — even from a PC with `curl`.
- The response has `question_list` (20), `category_list`, `pagination`
  (`total_results`, `num_pages`, `has_next`, …). Each question object has:
  `favorite_id, slug, question, option1..option5, answer, exp`.
  - `answer` is **1-based** into `option1..option5` (1→option1 … 5→option5).
  - `answer = 0` means the server has **no answer key** for it (rare).
  - `question`, `option*`, `exp` may contain **HTML** (see §5).

### 2.1 Quick hit (copy-paste) — "hit backend api"

Sanity-check the API / see the newest favourites in one shot:

```bash
TOKEN="<LiveMCQ token>"   # do NOT commit the real token; it lives in the app prefs (§2)
curl -s -H "Authorization: Token $TOKEN" \
  "https://livemcq.com/api/v1/central-favorite-list/?page=1" \
  -o /tmp/lm_check.json -w "HTTP %{http_code} | %{size_download} bytes\n"
jq '{ total: .pagination.total_results,
      pages: .pagination.total_pages,
      newest: .question_list[0].favorite_id }' /tmp/lm_check.json
```

Expected: `HTTP 200` and e.g. `{ "total": 2023, "pages": 102, "newest": "152853716" }`.
- `total` = total favourites (compare to the app's current count).
- `newest` = highest `favorite_id`; if it's greater than the last-synced baseline,
  there are new questions to sync (§8).

> ⚠️ **Security:** the token is a live credential for the account. Keep it out of
> the repo and any committed file. (The assistant holds it in private memory, so
> "hit backend api" can be run on request without pasting it here.)

---

## 3. Data format (fields of one question)

> **These fields are the DB columns.** The JSON shape below is the legacy seed
> format, but every field maps 1:1 to a column on the Supabase `questions` table
> (`uid, category_id, question, options, correct_answer, correct_answer_text,
> explanation, extra, sort_order`) — `favorite_id` lives in `extra->>'favorite_id'`.
> This section is the field/mapping reference for the INSERT in §8.

Legacy per-file shape (`public/lmdata/<category>.json` — seed only):

```json
{
  "questions": [
    {
      "id": 1,
      "favorite_id": "151982481",
      "question": "The <u>students are</u> <u>accustomed to work</u> …",
      "options": { "a": "…", "b": "…", "c": "…", "d": "…", "e": "…" },
      "correct_answer": "b",
      "correct_answer_text": "accustomed to work",
      "explanation": "<p><strong>সঠিক উত্তর …</strong></p>"
    }
  ]
}
```

Field rules:

| field | rule |
|---|---|
| `id` | sequential within the file (1..n). Display/stable key only. |
| `favorite_id` | **the LiveMCQ favourite id — the global unique key** used for dedup (§7). Keep it. |
| `question` | string; **may be HTML** (`<sup>`, `<sub>`, `<img>`, `<strong>`, `<u>`, tables) or plain text or contain entities (`&gt;`). |
| `options` | object keyed `a,b,c,d` (and `e` when a 5th option exists). Built from `option1..option5`, skipping empties. Option text may also be HTML. |
| `correct_answer` | the option **letter** = `["a","b","c","d","e"][answer-1]`. If `answer = 0` → **`null`** (question is then auto-excluded from quiz/study/exam). |
| `correct_answer_text` | the text of the correct option (or `null` if `answer = 0`). |
| `explanation` | string; usually HTML (long, with sources). |

> **Mapping from the API:** `answer 1→a … 5→e`; array `[option1..option5]`
> (non-empty) → `{a,b,c,d,e}`; HTML is **preserved as-is** (only `<script>` /
> `on*=` handlers stripped — the data has none). Do **not** strip `<sup>/<sub>/<img>`
> or the math/figures break.

To add a question: **INSERT a row into the DB** (§8) with a unique
`extra->>'favorite_id'`, a `correct_answer` letter that exists in `options`, the
`uid` from `qid.js`, and (optionally) HTML in `question`/`explanation`. *(The old
"append to the category JSON file" method is seed-only and does not reach the
live app — see §0.)*

---

## 4. Categories & how they are assigned

The LiveMCQ subject endpoint is unreliable (it mislabels e.g. English grammar as
"Surgery"), so **categories are assigned by reading the question content**, into
these 13 topics (`src/data/index.js` → `LIVEMCQ_TOPICS`):

> **DB slug = `lm_` + the key below**, and one key differs from its file name.
> The `categories.slug` you INSERT against (§8, `category_id` lookup) is
> `lm_bangla_sahitya`, `lm_math`, `lm_banking`, etc. Exceptions to watch:
> `english_literature` → slug **`lm_english_lit`**, `general_science` → slug
> **`lm_science`**. Always resolve the real id with
> `select id, slug from categories where module='livemcq'` rather than guessing.

| # | key (legacy file `public/lmdata/…`; DB slug = `lm_`+key) | topic name | what goes here |
|--:|---|---|---|
| 1 | `bangla_sahitya` | বাংলা সাহিত্য | authors, works, novels, poets, periodicals, pen-names, quotes, চর্যাপদ, ছন্দ/অলংকার |
| 2 | `bangla_byakoron` | বাংলা ব্যাকরণ | সন্ধি, সমাস, কারক, প্রত্যয়, উপসর্গ, বানান, পদ, বাক্য, বাগধারা, সমার্থক/বিপরীত, phonetics, loanwords, পরিভাষা |
| 3 | `english_literature` | English Literature | authors, works, characters, literary terms |
| 4 | `english_grammar` | English Grammar | grammar, vocab, idioms, synonym/antonym, spelling, prepositions |
| 5 | `bd_affairs` | বাংলাদেশ বিষয়াবলি | BD history, constitution, politics, economy/trade, culture, ethnic groups, admin, institutions, sports, liberation war, current events |
| 6 | `intl_affairs` | আন্তর্জাতিক বিষয়াবলি | world orgs, treaties, geopolitics, world history, foreign countries, global sports/current |
| 7 | `mental_ability` | মানসিক দক্ষতা | series, analogy, coding, clock, calendar, direction, blood-relation, figure-counting, mirror/spatial, verbal/logical reasoning |
| 8 | `general_science` | সাধারণ বিজ্ঞান | physics, chemistry, biology, astronomy, health, agriculture-science |
| 9 | `ict` | কম্পিউটার ও তথ্য প্রযুক্তি | computers, networking, programming, IT |
| 10 | `geography` | ভূগোল | **physical/world** geography: rivers, mountains, straits, tides, winds, climate, latitudes, tectonics, geology |
| 11 | `ethics` | নৈতিকতা, মূল্যবোধ ও সু-শাসন | ethics, values, good governance (সুশাসন), political/legal philosophy |
| 12 | `math` | গণিত | arithmetic, algebra, geometry, probability, mensuration, data interpretation — anything solved by **calculation** |
| 13 | `banking` | ব্যাংকিং | banking/finance/monetary/tax/economics concepts (repo, LC, Basel, GDP, inflation, VAT, budget…) |

**Tie-breaker rules (important for consistency):**

- **মানসিক দক্ষতা (7) vs গণিত (12):** reasoning/pattern recognition (series,
  analogy, coding, clock, calendar, direction) → **7**; anything requiring real
  computation (profit/loss, algebra, geometry, probability, DI) → **12**.
- **Science vs Computer:** physics/chem/bio/astronomy → **8**; anything IT →
  **9**. (The redundant "Science & Computer" bucket is not used.)
- **Banking (13) vs Intl affairs (6) — ask what the question actually measures.**
  If the thing being asked about is an **economic/financial property**, it is
  **13**, even when framed as a world ranking or a foreign country's policy. If it
  is an **institutional or procedural fact** about a body that merely happens to
  work on trade/economics, it is **6** — answering needs no economics, just recall.

  Worked contrast (settled 2026-07-19):
  | Question | Topic | Why |
  |---|---|---|
  | "Which country tops the Index of Economic Freedom?" | **13** | the property being measured *is* economic |
  | "How often does the WTO Ministerial Conference meet?" | **6** | org procedure; purely knowledge-based |

  → **13:** global economic indices (Economic Freedom, Doing Business, GDP league
  tables), world macro indicators, foreign central-bank/monetary policy, any
  finance/economics *concept*.
  → **6:** WTO/IMF/World Bank founding treaties, membership, structure, meeting
  cadence; trade *geography* (busiest container port).
  → **5:** BD trade facts (top export partner).
- Macro indicators (GDP, inflation, budget, tax) → 13.
- **BD affairs (5) vs Geography (10):** BD-specific history/politics/culture/
  admin → **5**; physical/world geography (even BD rivers/hills) → **10**.
- **Analogies:** abstract/relationship/vocab analogies → **7**; analogies that
  hinge on a specific GK/science fact → that subject.
- **`answer = 0`** (no key): keep the question but `correct_answer = null` so it
  is excluded from quizzes.

---

## 5. HTML / math rendering in the app

LiveMCQ content carries real HTML that **must not be flattened**:

- `<sup>` / `<sub>` — exponents & indices (heavy in **math** & science).
- `<img>` — figures/diagrams; **some questions are image-only** (blank if stripped).
- `<strong>/<em>/<u>/<table>/<br>/<p>` — emphasis, underline error-markers, tables.
- HTML **entities** — `&gt; &lt; &amp; &#39;` etc.

Rendering is handled by **`src/components/shared/RichText.jsx`**:

- If the string has real tags → render the (pre-sanitized) HTML.
- Else if it has entities → decode them to plain text (safe; tags not parsed).
- Else → plain text.

`RichText` is wired into **QuizMode, StudyMode, ExamMode, QuizOptions,
GroupSearch (search results), NailedScreen, ImportantScreen**. Older
plain-text topics render unchanged. Styling for `.rich img/sup/sub/table` lives
in `src/index.css`.

> In **search**, LiveMCQ explanations (which are long) are **folded by default**
> behind a "ব্যাখ্যা ▾" toggle; other modules show their short explanation inline.

---

## 6. How the app loads LiveMCQ (lazy, to keep the bundle small)

> **⚠️ Outdated as of the Supabase migration (§0).** The app now loads LiveMCQ
> questions **from the DB** via `src/data/contentLoader.js` (lazy per module,
> paginated with `.range()` past PostgREST's 1000-row cap), **not** by fetching
> `/lmdata/*.json`. The description below documents the original static-file
> loader (`livemcqLoader.js` / `useLiveMcq.js`) and is kept for history; the
> lazy-load *idea* is unchanged, only the source (DB, not JSON) differs. The
> `livemcqLoader.js` and `useLiveMcq.js` files named below **no longer exist** —
> they were replaced by the generalized `contentLoader.js`.

The 13 files are ~4.6 MB, so they are **not** imported into JS. Instead:

- `src/data/index.js` → `LIVEMCQ_TOPICS`: metadata only (`id, name, icon, color,
  file`) with `questions: []`. **Do not `import` the JSON here.**
- `src/data/livemcqLoader.js` → `loadLiveMcq()`: fetches
  `/lmdata/<file>.json` for every topic and fills `questions` **in place** (one
  shared promise, runs once per session).
- `src/hooks/useLiveMcq.js` → `useLiveMcqReady(enabled)`: triggers the load only
  where LiveMCQ is actually used, and re-renders when data arrives.

Load is triggered from: LiveMCQ **home** (`activeGroup === 'livemcq'`), any
`lm_*` **quiz/study** route, the **exam** config screen, and **Nailed/Important**
(only if a saved item is a `lm_*` id). Everything shows a brief "লোড হচ্ছে…"
until ready. Result: the initial JS bundle stays ~990 kB (208 kB gzip) instead of
5.4 MB.

Static hosting note: `public/lmdata/*.json` deploy to the site root; on Vercel
real files are served **before** the SPA rewrite, so `/lmdata/banking.json`
returns JSON (not `index.html`). The folder is named `lmdata` (not `livemcq`) to
avoid clashing with the `/livemcq` client route.

---

## 7. No duplicates (required)

Duplicates are prevented **by construction and must stay that way**:

- **`favorite_id` is the unique key.** Every LiveMCQ favourite has a distinct
  `favorite_id`. Each favourite is assigned **exactly one** category → it appears
  in **exactly one** `public/lmdata/*.json` file.
- **Never** copy a question into two category files.
- When **syncing new questions**, only add favourites whose `favorite_id` is
  **greater than the last-synced max** (dedup vs. everything already imported).

Verify uniqueness before shipping (must print nothing / equal counts):

```bash
# no favorite_id appears twice across all category files
cat public/lmdata/*.json | jq -s '[.[].questions[].favorite_id]' \
  | jq 'group_by(.) | map(select(length>1)) | length'      # -> 0

# total equals distinct favorite_ids
cat public/lmdata/*.json | jq -s '[.[].questions[].favorite_id]' \
  | jq '{total: length, distinct: (unique|length)}'        # total == distinct
```

**Dedup by `favorite_id` only — never by question text.** A quick text-collision
scan finds ~15 groups of "identical" text, but these are **false positives, not
duplicates**, and removing them would delete real questions:

- **Image-only questions** — the text is just `<img …>`, so normalized text is
  empty and they all collapse together (different figures, different answers).
- **Generic stems** — e.g. *"Choose the correct spelling."* (×7),
  *"Choose the correct sentence."* (×3), *"প্রদত্ত চিত্রে কয়টি ত্রিভুজ আছে?"* (×3),
  *"নিচের কোন বানানটি অশুদ্ধ?"* (×2). Same stem, **different options/answer** →
  distinct questions.

So the data has **0 real duplicates** — every `favorite_id` is unique, and text
collisions are expected. Do **not** collapse by text. (GroupSearch does hide
same-text results in the *search list* for readability; that is a UI convenience
only and does not affect the underlying data.) *(The `2008`-item figure this
section originally cited was the JSON-seed snapshot; the live DB count grows with
each sync — get the current count from §0/§8's baseline query.)*

---

## 8. Syncing new favourites → TWO coexisting paths

**Target = the Supabase `questions` table, NOT `public/lmdata/*.json` (§0).** No
rebuild/redeploy is needed — the app reads the DB live, so new rows appear on the
next load.

There are **two ways to sync, both fully supported — pick per sync**:

- **§8.A — no-AI, the in-app Admin panel:** do it yourself in the app — upload the
  JSON, classify from a dropdown, click Insert. Use this when you want to sync
  *without* an AI. Everything except the category (and optional sub-topic) choice
  is mechanical (dedup, option/answer mapping, `uid`, `sort_order`), so there's no
  hand-editing SQL — the thing that caused the option-corruption bug (§11).
- **§8.B — AI-guided (backend sync):** hand the livefav/API JSON to an AI agent,
  which classifies each question (§4), picks its sub-topic where the category has
  them (§8.C), and inserts via the Supabase MCP. Use this when you're syncing
  *with* an AI.

Both write through the same DB and dedup by `favorite_id`, so you can mix them
freely across syncs. **Sub-topics (§8.C)** apply to both paths.

### 8.A No-AI path — the in-app LiveMCQ Admin panel

#### The flow
1. **Extract on the phone** with `livefav` (Termux, §9) → a JSON file of the newest
   favourites (`favorite_id, slug, question, options[], answer, explanation`).
   Transfer that file to your computer.
2. **Open the app → account menu → “LiveMCQ Admin”** (only visible when signed in
   as the owner) → **Import & classify** tab.
3. **Upload the livefav JSON.** The panel dedups it against every stored
   `favorite_id` (including recycle-binned rows) and shows **only the new
   questions**, each rendered with `RichText` (Bengali/HTML/images intact).
4. **Pick which questions to insert.** Every card has a checkbox (all ticked by
   default). Insert acts on the **selected subset only**, so a 30-question file
   can be worked through in several passes instead of all-or-nothing. Each card
   also has its own **Insert** button for a one-off.
5. **Assign a category** to each selected question from the 13-topic dropdown
   (§4). **A category is mandatory** — pressing Insert (bulk or per-card) with any
   selected question uncategorised inserts *nothing*, reddens the offenders and
   scrolls to the first one. The card also flags edge cases: *no correct answer*
   (`answer=0` → `correct_answer` null), *empty option before a filled one* (the
   old misalignment bug), *answer index out of range*.
   Shortcuts: **Set category for N selected** applies one category in bulk, and
   **Apply N suggestions** accepts the confident suggestions (§8.A.1) at once.
   **Sub-topic (optional, §8.C):** once a category is picked, a second dropdown
   offers that category's sub-topics (today বাংলা ব্যাকরণ, English Grammar and
   গণিত), with its own suggestion chip and an **Apply N sub-topic suggestions**
   shortcut. Leaving it empty never blocks Insert. `+ নতুন sub-topic…` creates a
   new one in place — a category with no list shows a `+ sub-topic যোগ করুন` link.
6. **Click Insert.** The panel builds each row deterministically
   (`src/lib/livemcqAdmin.js` → `toInsertRow`), computes `uid` with the app's own
   `qid.js` (so it matches at render time), and calls the `admin_livemcq_insert`
   RPC. Inserted questions leave the list; the rest stay for the next pass. New
   rows are live on the next load.
7. **Delete, recategorise or set a sub-topic** from the **Manage & delete** tab —
   search by text or `favorite_id`, then hit the trash icon (`admin_livemcq_delete`),
   the folder icon / category chip to move it (`admin_livemcq_set_category`), or
   the tag chip to set/clear its sub-topic (`admin_livemcq_set_subtopic`). With a
   category selected, a second filter narrows the list by sub-topic (or *No
   sub-topic*, to find unlabelled rows).

#### 8.A.1 Category suggestions (still no AI)
The panel suggests a category, but nothing about it is a model: it is a plain
**tf-idf + k-nearest-neighbour text ranker** (`src/lib/livemcqClassify.js`) built
in the browser over the questions you have **already classified**. No network
call, no inference, nothing learned at runtime — the same machinery as a search
box. It never auto-assigns: it renders a chip that stays inert until clicked, so
every category that reaches the DB is still an explicit human choice.

Bengali is suffix-inflecting, so each token is indexed both whole and as a
4-char leading stem (শব্দ / শব্দের collapse to one feature). Neighbours vote
weighted by similarity², and the winner's vote share is shown as a confidence.
The card also shows the **closest stored question** it matched, so a suggestion
can be judged instead of trusted.

##### What a document is (the 2026-08 rework)
The first version indexed the **question text alone** and scored 76.3% top-1.
The single biggest change since is that a question is now indexed from three
fields, each in its own feature space so they never merge:

| field | weight | why |
|---|---|---|
| `question` | 1 | the ask itself |
| `explanation` | 0.55 | **+18pp on its own** — see below |
| `options` | 0.25 | the answer set; weak but real topical signal |

The explanation is the surprise. LiveMCQ ships a worked, subject-specific
writeup with *every* question — a গণিত one walks through a সমাধান, a ব্যাংকিং one
names instruments and circulars — so it carries far more topical vocabulary than
the one-line question. It is **not** a leak: `normalizeItem` already parses
`explanation`/`exp` out of the import file, so every indexed field is in hand
before a category is picked.

Two smaller changes: votes are divided by their category's size^0.3, so গণিত
(384 rows) stops out-massing English Literature (30) on tie-ish neighbourhoods
(+2.5pp macro); and tokens with `df = 1` are dropped, which cuts the index ~55%
for free. A shipped `$analogy` feature (`X : Y :: A : ?` ⇒ মানসিক দক্ষতা, never
গণিত) lifts the weakest category 67.6% → 71.6% and leaves the other twelve
bit-identical — but it rests on only 9 examples, so treat it as a notation rule,
not a trend.

##### What it also trains on (`src/lib/livemcqTraining.js`)
The suggester now reads the **whole question database**, not just livemcq. The
other modules were built around a different syllabus, so their categories do not
line up — `somas`, `karak` and `sondhi` are three বাংলা topics but one LiveMCQ
topic, and `vocab_p` has no counterpart at all. A foreign row therefore never
carries its own category across: it is **relabelled** into a LiveMCQ category by
an explicit map, or dropped.

| source | → LiveMCQ | rows |
|---|---|---|
| whole `bangla` module | `lm_bangla_byakoron` | 597 |
| whole `sahitya` module | `lm_bangla_sahitya` | 401 |
| whole `english` module | `lm_english_grammar` | 378 |
| `gk_bd_affairs` | `lm_bd_affairs` | 91 |
| `gk_science` | `lm_science` | 103 |
| `gk_intl_affairs` | `lm_intl_affairs` | 71 |
| `gk_ict` | `lm_ict` | 22 |
| `gk_lang_misc`, `vocab_*` | **dropped** | 1062 |

`gk_lang_misc` is three subjects in one bucket; `vocab_*` ("Pellucid এর অর্থ কি?")
has no LiveMCQ counterpart and its Bengali glosses make it look like বাংলা
ব্যাকরণ to a bag-of-words index — folding it in cost precision for no gain. The
map's targets are checked against `LIVEMCQ_TOPICS` at module load, so **a LiveMCQ
import can only ever be suggested a LiveMCQ category** — verified end-to-end:
0 out-of-set suggestions across all 2271 rows.

Be honest about the payoff: at today's corpus size these 1663 rows are a **wash**
(94.63% → 94.50% top-1; Apply-all 90.1%@97.90% → 91.0%@98.02%). They reinforce
categories already at 99% while the ones that actually miss have no counterpart
module. They earn their place only when a category is *thin* — with the livemcq
corpus sampled down, the same rows are worth +1.5 to +3pp (10% of corpus:
86.5% → 89.6%; 33%: 90.6% → 92.6%). That is the case they exist for: a new
category, or a lopsided import week. Weight is 0.25 so they never outvote a real
LiveMCQ neighbour.

##### Measured now (2026-09-14 — 5-fold over the 2024 live livemcq rows)

Re-measure any time with `node scripts/eval-livemcq-classifier.mjs` (add
`--grid` to re-run the tuning search). It reads the live DB with the anon key,
excludes recycle-binned rows, and builds each fold's index exactly the way the
browser does. (The earlier 2271-row figures counted rows that have since been
recycle-binned, so the two runs are not directly comparable.)

| confidence | tier | n | correct |
|---|---|---|---|
| 85–100% | strong | 1387 | 99.4% |
| 60–85% | likely | 441 | 92.1% |
| 34–60% | **weak** | 184 | 64.1% |

**94.0% correct overall** (macro 93.2%), abstaining on 12 of 2024. **Apply-all
only touches ≥60%** (`BULK_APPLY_MIN`) — that subset is **90.3% of a batch at
97.6% precision**. Weak suggestions still render, marked *low confidence*, but
must be accepted one at a time.

**Retrain (2026-09-14):** the grid over `k` ∈ {10, 15, 20} × explanation weight
∈ {0.4, 0.55, 0.7} × `priorAlpha` ∈ {0.2, 0.3, 0.4} topped out at 94.4% — +0.4pp,
inside the ~0.3–0.5pp plateau noted in `livemcqClassify.js`, and the best cell
(`k=20`) lowers Apply-all coverage to 88.9%. Shipped settings are unchanged;
the new rows since the last run are picked up automatically because the index is
rebuilt from the DB, not trained offline.

Remaining weak spots are genuinely ambiguous rather than fixable by more data:
`lm_mental_ability` 78.4% (puzzles that read as গণিত), and the
বাংলাদেশ ↔ আন্তর্জাতিক ↔ বিজ্ঞান group at 88–90%. Read the nearest-match line
there. The ranker improves on its own as you classify more; there is no keyword
list to maintain.

#### 8.A.2 The knowledge cache (why it doesn't refetch the corpus)
That corpus only changes when **the app** writes to it, so it is cached instead
of refetched. `src/lib/livemcqKnowledge.js` resolves it in three tiers, cheapest
first:

1. **In memory** — repeat imports in one session cost nothing.
2. **IndexedDB + fingerprint** — one 51-byte request, no corpus download.
3. **The app's own module cache** — when the corpus really must load, it calls
   `loadModule(m)` for each trained module, which the quiz screens already use,
   so the rows are *shared* rather than fetched twice. (The first version of this
   had its own `fetchLabeledQuestions` query — a duplicate of a fetch the app
   already makes.)

**Why IndexedDB, since 2026-08.** The corpus used to be question text alone:
2205 rows, ~222 KiB of JSON, a comfortable ~8.7% of a 5 MiB `localStorage`
quota. Indexing options and explanations took the same corpus to **~5.5 MB**,
which does not fit in `localStorage` on any browser and throws
`QuotaExceededError` on write. Packing it down (hashed token ids, pruned
vocabulary) reached ~3.4 MB — still most of a quota the whole app shares, and it
would no longer hold the neighbour text the card displays. IndexedDB has no such
ceiling and stores structured values without a JSON round-trip, so the corpus is
kept as-is. Where IndexedDB is unavailable (private mode), the tier is skipped
and the corpus rebuilds from the module cache each session — slower, never
wrong. The old `livemcq.knowledge.v1` localStorage key is deleted on cache clear
so it stops occupying quota.

Staleness is decided by the server, never guessed. `classifier_fingerprint()`
returns `{n, sig}` where `sig` is an md5 over `(id, category_id, extra.subtopic)`
for every live row **in all five trained modules** — so an insert, a delete, a
**recategorise or a sub-topic change** all invalidate the cache, including
changes made from another browser. The cached corpus also carries each row's
sub-topic label (`FORMAT = 3`). It replaces `livemcq_fingerprint()` here for exactly one reason: the
index now contains সাহিত্য and GK rows, and the livemcq-only hash would let an
edit in those modules sit unnoticed. A `count`/`max(created_at)` probe would
silently miss recategorises, since neither value moves.

The corpus is re-read after the fetch completes and persisted **only if the
fingerprint still matches**; if a write landed mid-fetch the corpus is used but
not cached, so a stale set can never be pinned as valid. Bump `FORMAT` in that
file whenever the tokenizer or row shape changes, so old caches are rejected
rather than scored under stale rules.

#### How ordering stays correct (no manual `sort_order`)
Display is `sort_order DESC` and must track `favorite_id` (see
[[ordering-latest-first]]). After any insert/delete, the RPC calls
`admin_livemcq_renumber(cat)`, which rewrites `sort_order` for the whole category
as the **dense ascending rank of `favorite_id`** — so the newest favourite lands
on top and any old below-max backfill slots into its correct position, with **no
positional shifting**. Because `(category_id, sort_order)` is UNIQUE across all
rows, the renumber first vacates values into a disjoint negative range so the
reassign can never collide mid-statement. Verify (should be 0):
```sql
with r as (select c.slug, rank() over (partition by c.slug order by q.sort_order) rs,
       rank() over (partition by c.slug order by (q.extra->>'favorite_id')::bigint) rf
  from questions q join categories c on c.id=q.category_id where c.module='livemcq')
select sum(case when rs<>rf then 1 else 0 end) from r;
```

#### Access model (why the browser can write at all)
`questions` and `categories` are **read-only** under RLS (public SELECT only) —
the browser cannot write to them directly. The only write path is four
`SECURITY DEFINER` functions, each of which rejects anyone whose `auth.uid()` is
not the owner uid (`803521e1-…`, ksnkkc), so even a signed-in non-owner (there are
none by design — see the account lockdown) cannot insert or delete:
- `admin_livemcq_insert(rows jsonb)` — dedup by `favorite_id` (DB + within batch),
  insert, renumber each touched category. Each row may carry an optional
  `subtopic` slug, which must belong to that row's category (else the call
  raises). Returns `{inserted, skipped, skipped_fids}`.
- `admin_livemcq_delete(fids text[])` — hard-delete by `favorite_id`, renumber.
- `admin_livemcq_set_category(fids text[], new_slug text)` — recategorise.
  Writes `questions.category_id` and drops `extra.subtopic` (sub-topic lists are
  per category, so the old one can't be valid in the new home); `uid`,
  `question`, `options`, `correct_answer`, `correct_answer_text`, `explanation`
  and `extra.favorite_id` are never touched. Renumbers the old **and** new
  category. Returns `{moved}`.
  ⚠ Because `(category_id, sort_order)` is UNIQUE, a moved row cannot carry its
  old `sort_order` into the destination — it would collide with whatever holds
  that slot. The function parks moved rows on distinct negative `sort_order`s
  first and lets `admin_livemcq_renumber` hand out the real slots. Parking is
  deliberately shallow (`-(1000000 + rn)`): renumber's own `-1000000000` pass
  runs over those rows too and `sort_order` is `int4`.
  Because `user_progress` is keyed by `uid` (a hash of the question text), a move
  cannot detach a Nailed/Important flag.
- `admin_livemcq_set_subtopic(fids text[], new_subtopic text)` — set a sub-topic
  (must belong to each row's category) or clear it with `null`/`''`. Writes
  **only** `extra.subtopic`. Returns `{updated}`.
- `admin_livemcq_add_subtopic(cat_slug text, sub_name text)` — create a sub-topic
  under a livemcq category (latin names get a readable slug, others `st_<hash>`;
  re-adding an existing name returns it). Returns `{slug, name, created}`.
- `admin_livemcq_renumber(cat uuid)` — internal; `EXECUTE` revoked from public,
  anon **and** authenticated (only `service_role` + the definer functions call
  it). ⚠ Until 2026-09-14 it was in fact still executable by anon despite this
  doc; fixed in migration `livemcq_admin_rpc_grants`.

All six owner-gated RPCs above have `EXECUTE` revoked from `anon`/`public` and
granted to `authenticated` — the owner check inside each body is still the real
gate; the grant just keeps signed-out callers from reaching them at all.

One further function is **read-only** and not part of the write path:
- `classifier_fingerprint()` — `STABLE`, *not* `SECURITY DEFINER`, granted to
  `anon`/`authenticated`. Returns `{n, sig}` over the five modules the suggester
  trains on (hashing `id, category_id, extra.subtopic`), for the knowledge cache
  (§8.A.2). It reads exactly what the caller
  could already `SELECT` under the public-read policy, so it grants no new
  access. `livemcq_fingerprint()` is the livemcq-only predecessor; it is still
  defined but no longer called.

Migrations: `admin_livemcq_rpcs`, then `admin_livemcq_set_category` +
`admin_livemcq_set_category_fix_sort_order_collision`, then
`livemcq_fingerprint`, then `classifier_fingerprint`, then `livemcq_subtopics`
(table + seed lists + sub-topic RPCs + sub-topic-aware fingerprint) and
`livemcq_admin_rpc_grants` (general-quiz).
UI: `src/components/admin/AdminScreen.jsx`, helpers in `src/lib/livemcqAdmin.js`,
sub-topic lists in `src/lib/subtopics.js`,
suggester in `src/lib/livemcqClassify.js`, what it is allowed to learn from in
`src/lib/livemcqTraining.js`, its cached corpus in `src/lib/livemcqKnowledge.js`,
gated route `/admin` in `App.jsx`, entry link in `AccountButton.jsx`.

### 8.C Sub-topics (বাংলা ব্যাকরণ · English Grammar · গণিত)

Three LiveMCQ categories are split one level further, so they can be studied the
way the বাংলা / English modules are (সন্ধি, সমাস … / Voice, Narration …). A
sub-topic is **optional** everywhere: a question without one still inserts,
renders and counts — it just shows under *অন্যান্য* in the sub-topic view.

#### Data model
- **Lists:** table `subtopics(id, category_id → categories, slug, name, sort_order)`,
  `unique(category_id, slug)`, public SELECT under RLS. Lists are **per category**
  and created from the Admin panel (`admin_livemcq_add_subtopic`), so they are not
  hard-coded in the bundle. Client: `src/lib/subtopics.js` (one fetch per session,
  `useSubtopicLists()`).
- **Assignment:** `questions.extra.subtopic = <subtopics.slug>` of the row's own
  category. `contentLoader` spreads `extra`, so every screen already sees
  `q.subtopic`. It plays no part in dedup, `uid`, ordering or progress.
- **Moving category clears it** (`admin_livemcq_set_category`).
- **Any category can get a list later** — create its first sub-topic from the
  Admin panel; the Study switcher appears as soon as a category has one.

#### The lists (seeded 2026-09-14) and what goes where
Every existing question in these three categories (332 + 211 + 336, recycle-binned
included) was labelled by reading it, on 2026-09-14. বাংলা / English reuse the
sibling module's topic slugs so those modules can train the suggester.

**`lm_bangla_byakoron` — বাংলা ব্যাকরণ**
| slug | name | what goes here |
|---|---|---|
| `dhwoni_o_borno` | ধ্বনি ও বর্ণ | ধ্বনি/বর্ণ, মাত্রা, উচ্চারণের স্থান, যুক্তবর্ণ, অক্ষর; **সঠিক উচ্চারণ**; ছন্দের শ্বাসাঘাত |
| `dhwoni_poriborton` | ধ্বনি পরিবর্তন | অপিনিহিতি, অভিশ্রুতি, স্বরসঙ্গতি, সমীভবন, বিপ্রকর্ষ … |
| `notwo_bidhan` | ণত্ব ও ষত্ব বিধান | only when the ask is the **rule itself** |
| `sondhi` | সন্ধি | সন্ধি বিচ্ছেদ / নিয়ম |
| `uposhorgo` | উপসর্গ | |
| `prokiti_protoy` | প্রকৃতি ও প্রত্যয় | কৃৎ/তদ্ধিত, ধাতু |
| `somas` | সমাস | সমাস নির্ণয়, ব্যাসবাক্য |
| `karak` | কারক ও বিভক্তি | কারক, বিভক্তি, অনুসর্গ |
| `pod` | পদ | পদ প্রকরণ, লিঙ্গ, বচন, পুরুষ, কাল; নির্দেশক, বলক, ক্রিয়াবিভক্তি |
| `shobdo` | শব্দ | শব্দের উৎস (তৎসম/দেশি/বিদেশি…), গঠন, দ্বিরুক্ত, যৌগিক/রূঢ়ি |
| `poribhasha` | পরিভাষা | |
| `banan_bakko` | বানান ও বাক্য শুদ্ধি | শুদ্ধ/অশুদ্ধ বানান (even if the explanation cites ণত্ব/ষত্ব), বাক্য শুদ্ধি, অপপ্রয়োগ, গুরুচণ্ডালী |
| `somarthok_shobdo` | সমার্থক ও বিপরীত শব্দ | প্রতিশব্দ, বিপরীতার্থক, শব্দের অর্থ |
| `bagdhara` | বাগধারা ও এককথায় প্রকাশ | বাগধারা, প্রবাদ, বাক্য সংকোচন |
| `bakko` | বাক্য, বাচ্য ও উক্তি | বাক্যের প্রকার/অংশ, বাক্যের বর্গ, বাচ্য, উক্তি, যতিচিহ্ন |
| `bhasha` | ভাষা, উপভাষা ও রীতি | ভাষার উৎপত্তি, উপভাষা, সাধু-চলিত, ব্যাকরণ গ্রন্থ/বৈয়াকরণ |

**`lm_english_grammar` — English Grammar**
| slug | name | what goes here |
|---|---|---|
| `parts_of_speech` | Parts of Speech | word class, gerund/participle/infinitive identification, **degree of comparison** |
| `tense` | Tense | |
| `right_form_of_verbs` | Right Form of Verbs | verb form in a blank, conditionals, subjunctive, modals |
| `subject_verb` | Subject-Verb Agreement | blank-filling on agreement |
| `voice` | Voice | |
| `narration` | Narration | |
| `transformation` | Transformation of Sentences | simple/complex/compound, clause & phrase types, **inversion**, sentence arrangement |
| `tag_question` | Tag Question | |
| `preposition` | Preposition | appropriate preposition, a fixed preposition after a word (dispense *with*) |
| `determiner` | Determiner / Article | |
| `error_correct` | Error Correction | "find the error" / "choose the correct sentence" — **even when the rule behind it is SVA, a determiner etc.** (format decides) |
| `synonym_antonym` | Synonym & Antonym | |
| `idioms` | Idioms & Phrases | idioms, proverbs, **meaning-changing phrasal verbs** (tide over, make off) |
| `spelling` | Spelling | incl. questions whose options differ only by spelling |
| `vocabulary` | Vocabulary | word meaning, one-word substitution, lexical blanks, foreign phrases (ad valorem) |

**`lm_math` — গণিত** (8 types, grouped from all 336 questions)
| slug | name | what goes here |
|---|---|---|
| `percent_profit` | শতকরা, লাভ-ক্ষতি ও সুদ | শতকরা, লাভ-ক্ষতি, ছাড়, VAT/কর, সরল ও চক্রবৃদ্ধি সুদ, "দাম x% কমায় y কেজি বেশি", পাস নম্বর % |
| `ratio_average` | অনুপাত, গড় ও মিশ্রণ | অনুপাত-সমানুপাত, অংশীদারি ব্যবসা, মিশ্রণ/alligation (দুধ-পানি, দুই দামের মিশ্রণ), গড় (weighted, median, গড় ব্যবধান, জ্যামিতিক গড়), বয়স, চলক/ব্যস্ত অনুপাত |
| `work_speed` | সময়-কাজ ও ট্রেন-নৌকা | কাজ ও সময়, নল-চৌবাচ্চা, গতি-দূরত্ব, ট্রেন, নৌকা-স্রোত (উজান-ভাটি) |
| `number_theory` | সংখ্যা, ল.সা.গু-গ.সা.গু ও ভাগশেষ | ল.সা.গু/গ.সা.গু, ভাগশেষ ও বিভাজ্যতা, উৎপাদক/মৌলিক, মূলদ সংখ্যা, rounding / custom operator arithmetic |
| `algebra` | বীজগণিত, সূচক-লগ ও ধারা | সমীকরণ ও দ্বিঘাত মূল, অভেদ, উৎপাদকে বিশ্লেষণ, ভাগশেষ উপপাদ্য, অসমতা/পরমমান, সূচক ও করণী, লগারিদম, ধারা (AP/GP), দ্বিপদী, limit; সরল সমীকরণে দাঁড়ানো word problem |
| `geometry_trig` | জ্যামিতি ও ত্রিকোণমিতি | কোণ, ত্রিভুজের ধর্ম/সদৃশতা/পিথাগোরাস, বৃত্তের জ্যা ও অন্তর্বৃত্তের ব্যাসার্ধ, বহুভুজের কোণ, স্থানাঙ্ক জ্যামিতি (ঢাল, রেখা), ত্রিকোণমিতি ও উচ্চতা-দূরত্ব |
| `mensuration` | পরিমিতি: ক্ষেত্রফল ও আয়তন | ক্ষেত্রফল/পরিসীমা/আয়তন/পৃষ্ঠতল (আয়ত, বর্গ, বৃত্ত, ঘনক, সিলিন্ডার, কোণক, গোলক), অন্তর্লিখিত আকৃতির ক্ষেত্রফল, চাপ/বৃত্তকলা, বেড়া-কার্পেট খরচ, গলিয়ে নতুন আকৃতি |
| `probability_counting` | সম্ভাবনা, বিন্যাস-সমাবেশ ও সেট | সম্ভাবনা, বিন্যাস-সমাবেশ, handshake/team selection, সেট ও Venn (দুই বিষয়ে পাস %) |

**Tie-breakers:** classify by **what the ask needs**, not what it mentions — a
square-area % increase is `mensuration`; an alligation on profit % is
`ratio_average`; a sum of two-digit numbers with remainder 2 is `number_theory`.

#### Where a sub-topic gets set
1. **Admin Import (§8.A step 5)** — optional dropdown + suggestion chip + Apply-all.
2. **Admin Manage** — tag chip on each row (dashed *no sub-topic* when empty) →
   modal; with a category selected, filter by sub-topic or *No sub-topic*.
2b. **On the go (owner only)** — the *Topic* button beside Delete on a LiveMCQ
   Study card, a saved (Important / Nailed) card, or a quiz question after
   answering, moves the question to another topic and/or sets its sub-topic.
   The card updates at once (`src/lib/questionEdits.js` edits the loaded
   content in place); the write goes through the offline queue as kind `move` /
   `subtopic` → `admin_livemcq_set_category` / `_set_subtopic`, shows in the sync
   drawer with **Undo** (undoing a move also restores the dropped sub-topic),
   and survives being offline. A sub-topic change queued after a move is always
   sent after it, since it is validated against the new topic.
3. **AI-guided sync (§8.B)** — the agent **must** pick a sub-topic for every new
   question in these three categories, using the rules above, and write it into
   `extra`. Read the live slugs first (the owner may have added some):
   ```sql
   select c.slug as cat, s.slug, s.name from subtopics s
   join categories c on c.id = s.category_id order by c.slug, s.sort_order;
   ```
   Never invent a slug. If nothing fits, leave `subtopic` out and say so in the
   sync report (the owner can create one in the Admin panel).

#### Sub-topic suggester (still no AI)
The same tf-idf/kNN ranker as §8.A.1, but **one index per split category**,
built by `assemble()` in `livemcqKnowledge.js` over that category's labelled
rows — so it can only ever answer with that category's sub-topics, and a guess
naming a sub-topic that is not on the live list is dropped. Cross-module rows:
the বাংলা module's topics and the English module's topics carry across **as
sub-topic labels** (same slugs, `SUBTOPIC_SIBLINGS` in `livemcqTraining.js`,
weight `SUBTOPIC_CROSS_WEIGHT = 0.25`; English `pin_point` / `final_exam` are exam
sets and excluded). গণিত has no sibling module and trains on LiveMCQ rows alone.

Measured 2026-09-14 (5-fold, 780 labelled live rows, `scripts/eval-livemcq-classifier.mjs`):

| category | n | top-1 | Apply-all (≥60%) |
|---|---|---|---|
| বাংলা ব্যাকরণ | 332 | 90.7% | 84.0% of a batch @ 98.6% |
| English Grammar | 211 | 69.7% | 38.9% @ 95.1% |
| গণিত | 237 | 79.7% | 67.5% @ 90.6% |
| **all** | 780 | **81.7%** | 66.8% @ 95.6% |

Tiers overall: strong 254 @ 99.2%, likely 267 @ 92.1%, weak 208 @ 66.8%.
English is the weak one for a real reason: several sub-topics hold 1–4 examples
(Voice, Tag Question, Determiner) and `error_correct` / `preposition` /
`parts_of_speech` share vocabulary. In গণিত, `geometry_trig` (9/19) reads like
`mensuration`. Both improve as questions get labelled. Grid (k × explanation
weight × priorAlpha × cross weight) best was 82.2% — noise, with lower macro
accuracy — so defaults are shared with the category index.

#### Study view (LiveMCQ)
On a LiveMCQ topic's **Study** page, a category with a sub-topic list gets a
switch: **সব একসাথে** (default — unchanged) | **Sub-topic অনুযায়ী** → a grid of
sub-topic cards with their un-nailed question counts (empty ones hidden,
unlabelled ones under *অন্যান্য*) → tap one for its list, where the Important
filter, search and pagination all work inside that sub-topic. Quiz mode still
runs over the whole category.

### 8.B AI-guided path (backend sync) — mapping reference
Hand the livefav/API JSON to the AI agent and let it classify (§4) and insert via
the Supabase MCP. This path stays fully supported. The mapping the agent applies:
`answer 1→a…5→e` (`0`/absent → `null`); `[option1..option5]` non-empty → `options`
`{a..e}`; `correct_answer_text` = chosen option; `question`/`explanation` HTML
**as-is**; `type='mcq'`; `extra = {"favorite_id":"<id>"}` (**required dedup key**)
— plus `"subtopic":"<slug>"` for বাংলা ব্যাকরণ / English Grammar / গণিত (§8.C);
`uid = uidOfText(question)` from `src/lib/qid.js` (never invent a uid). Baseline /
verify with the DB `db_max`:
```sql
select count(*), max((extra->>'favorite_id')::bigint) as db_max
from questions q join categories c on c.id=q.category_id where c.module='livemcq';
```
When inserting via SQL, mind `sort_order` (track `favorite_id`) and the corruption
guard in §11 — or run the reconcile script after. The no-AI Admin panel (§8.A)
handles both automatically.

> **Legacy JSON path (deprecated):** the old flow appended to the PC master
> `favourites_clean_categorized.json` and regenerated `public/lmdata/<file>.json`.
> That store is a frozen seed now (§0) — only touch it if you are deliberately
> refreshing the backup snapshot, and know it does **not** feed the live app.

---

## 9. Termux setup for the `livefav` script (Android)

`livefav` reads the token from the LiveMCQ app (root) and downloads the newest N
favourites to `Download/live_fav/`. Prerequisite: the phone is **rooted**
(this device uses **KernelSU**).

### 9.1 Install packages
```bash
pkg update -y
pkg install -y curl jq
termux-setup-storage        # tap "Allow" — needed for Download/ access
```

### 9.2 ⚠️ If `curl` is broken (we hit this) — fix it properly
Symptom when running `curl`:
```
CANNOT LINK EXECUTABLE "curl": cannot locate symbol
"SSL_set_quic_tls_transport_params" referenced by … libngtcp2_crypto_ossl.so
Failed to run the 'curl' command.
```
Cause: openssl / libngtcp2 / curl are out of sync.

**Fix — use `apt`, NOT `pkg upgrade`.** `pkg upgrade` itself calls the broken
`curl` and dies instantly. Run:
```bash
apt update
apt full-upgrade -y
```
On the config-file prompts (`openssl.cnf`, `sources.list`, `bash.bashrc`) press
**Enter** to **keep your current version** (default `N`). After it finishes,
`curl --version` works.

### 9.3 Grant Termux root (KernelSU)
The script reads the token via `su`. KernelSU only exposes `su` to allowlisted
apps, so:
> **KernelSU Manager → Superuser tab → toggle ON for "Termux"**

(Without this, `livefav` prints `ERROR: could not read token`.)
The same applies to the **Shell** profile if you drive Termux over `adb`.

### 9.4 Install the script
The script source is `livefav.sh` (also kept at `~/Downloads/livefav.sh` on the
PC). On the phone:
```bash
mkdir -p $PREFIX/bin
cp /sdcard/Download/livefav.sh $PREFIX/bin/livefav   # or paste the file, then cp
chmod +x $PREFIX/bin/livefav
```

### 9.5 Use it
```bash
livefav            # newest 20 (1 page)
livefav -p 2       # newest 2 pages (40)
livefav -n 5       # newest 5 questions
```
Output → `Download/live_fav/livefav_<timestamp>.json` (clean shape:
`favorite_id, slug, question, options[], answer, explanation`). This is exactly
the file the **Admin panel's Import tab uploads** (§8.1). The Import parser also
accepts a raw `central-favorite-list` page (`{question_list:[…]}` with
`option1..5`/`exp`), so either shape works. The script **re-reads the token each
run**, so it keeps working after an app re-login.

### 9.6 Termux gotchas recap
- `curl` broken → `apt update && apt full-upgrade -y` (never `pkg upgrade`).
- `ERROR: could not read token` → grant **Termux** root in KernelSU + be logged
  in to LiveMCQ.
- `su: inaccessible or not found` (over adb) → grant the **Shell** profile in
  KernelSU.
- Can't write to `Download/` → run `termux-setup-storage` and allow it.

### 9.7 ⚠ Commit the script into the repo
The authoritative copy lives on the phone at `$PREFIX/bin/livefav`; the PC copy
`~/Downloads/livefav.sh` has gone missing. **Pull it into the repo** next time the
phone is adb-connected so it is version-controlled, then commit `scripts/livefav.sh`:
```bash
adb -s <device> shell su -c 'cat /data/data/com.termux/files/usr/bin/livefav' \
  > scripts/livefav.sh
```

---

## 10. File map (where things live)

| path | purpose |
|---|---|
| **Supabase `questions` table** (`module='livemcq'`) | **the live source of truth** (§0) — what the app renders |
| `src/data/contentLoader.js` | loads questions **from the DB** per module (lazy, paginated `.range()`) — the current loader |
| **`src/components/admin/AdminScreen.jsx`** | the in-app LiveMCQ Admin panel (Import & classify · Manage & delete) — §8 |
| **`src/lib/livemcqAdmin.js`** | deterministic helpers: normalize livefav JSON, `toInsertRow`, dedup, RPC wrappers, `OWNER_UID` |
| **`src/lib/livemcqClassify.js`** | no-AI category suggester: tf-idf + kNN over question + explanation + options of already-classified questions (§8.A.1) |
| **`src/lib/livemcqTraining.js`** | what the suggester may learn from: the map that relabels other modules' rows into LiveMCQ categories, and the rule that its output can never leave that set (§8.A.1) |
| **`src/lib/livemcqKnowledge.js`** | the suggester's corpus: IndexedDB cache + server fingerprint, reuses `loadModule()` across the trained modules (§8.A.2); builds the per-category sub-topic indexes (§8.C) |
| **Supabase `subtopics` table** + `src/lib/subtopics.js` | sub-topic lists per category and the session-cached client hook (§8.C) |
| `scripts/eval-livemcq-classifier.mjs` | 5-fold CV (and `--grid` re-tuning) of the category and sub-topic suggesters against the live DB (§8.A.1, §8.C) |
| `src/lib/qid.js` → `uidOfText()` | stable content-hash `uid`; the Admin panel computes it client-side so client/DB uids match (§8) |
| DB RPCs `admin_livemcq_insert` / `_delete` / `_set_category` / `_set_subtopic` / `_add_subtopic` / `_renumber` | the only write path to `questions` / `subtopics` for livemcq; owner-gated (§8.A access model) |
| `public/lmdata/*.json` | the 13 category files — **frozen original seed / backup only**, not read at runtime |
| `src/data/index.js` → `LIVEMCQ_TOPICS` | topic metadata (name/icon/color); `questions:[]` filled from the DB |
| `src/components/shared/RichText.jsx` | HTML/entity-safe renderer for math/figures |
| `scripts/livefav.sh` (to be committed — §9.7) | the Termux sync script source; pull from the phone |
| ~~`src/data/livemcqLoader.js`, `src/hooks/useLiveMcq.js`~~ | **removed** in the Supabase migration (superseded by `contentLoader.js`) |

To add more questions later: **use the LiveMCQ Admin panel** (§8) — upload the
livefav JSON, classify (category, plus sub-topic where offered), Insert. No code
changes or redeploy needed; the app reads the DB live.

---

## 11. ⚠ Option-corruption history + reconcile safety net

A past **hand-edited** sync corrupted **option values** by stripping leading/
trailing `a`/`u`/`0` characters (e.g. `"Austria"→"Austri"`, `"upon"→"pon"`,
`"Tk. 18,000"→"Tk. 18,"`) — it hit **195 / 2075** questions, sometimes the correct
answer itself. The Admin panel (§8) removes the root cause: options are mapped
positionally in code (`toInsertRow`) and never hand-edited. The card also flags an
**empty option before a filled one** so a genuine gap can't silently shift letters.

`scripts/reconcile-livemcq.mjs` remains the **verify/repair net**: it rebuilds each
question's options + `correct_answer` positionally from the authoritative API and
updates any drift. Run it after a sync (dry run, then `--apply`):
```bash
LIVEMCQ_TOKEN=<token> node scripts/reconcile-livemcq.mjs           # dry run
LIVEMCQ_TOKEN=<token> node scripts/reconcile-livemcq.mjs --apply   # write
```
It matches DB↔API by `favorite_id` and touches only options/`correct_answer`/
`correct_answer_text` — never question text or `uid`. "N not found in API (skipped)"
is the expected un-favourited-retainer count, not an error. **Keep the
`LIVEMCQ_TOKEN` secret — never commit it.**
