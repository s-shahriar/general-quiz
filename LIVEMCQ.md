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

- **§8.A — AI-guided (existing, unchanged):** hand the livefav/API JSON to an AI
  agent, which classifies each question (§4) and inserts via the Supabase MCP.
  Use this when you're syncing *with* an AI.
- **§8.B — no-AI, the in-app Admin panel:** do it yourself in the app — upload the
  JSON, classify from a dropdown, click Insert. Use this when you want to sync
  *without* an AI. Everything except the category choice is mechanical (dedup,
  option/answer mapping, `uid`, `sort_order`), so there's no hand-editing SQL —
  the thing that caused the option-corruption bug (§11).

Both write through the same DB and dedup by `favorite_id`, so you can mix them
freely across syncs.

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
4. **Assign a category** to each new question from the 13-topic dropdown (§4).
   You can change any choice before committing. Insert is blocked until every new
   question has a category. The card flags edge cases for you: *no correct answer*
   (`answer=0` → `correct_answer` null), *empty option before a filled one* (the
   old misalignment bug), *answer index out of range*.
5. **Click Insert.** The panel builds each row deterministically
   (`src/lib/livemcqAdmin.js` → `toInsertRow`), computes `uid` with the app's own
   `qid.js` (so it matches at render time), and calls the `admin_livemcq_insert`
   RPC. New rows are live on the next load.
6. **Delete** (retainers, mistakes) from the **Manage & delete** tab — search by
   text or `favorite_id`, hit the trash icon. That calls `admin_livemcq_delete`.

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
the browser cannot write to them directly. The only write path is three
`SECURITY DEFINER` functions, each of which rejects anyone whose `auth.uid()` is
not the owner uid (`803521e1-…`, ksnkkc), so even a signed-in non-owner (there are
none by design — see the account lockdown) cannot insert or delete:
- `admin_livemcq_insert(rows jsonb)` — dedup by `favorite_id` (DB + within batch),
  insert, renumber each touched category. Returns `{inserted, skipped, skipped_fids}`.
- `admin_livemcq_delete(fids text[])` — hard-delete by `favorite_id`, renumber.
- `admin_livemcq_renumber(cat uuid)` — internal; `EXECUTE` revoked from public.

Migration: `admin_livemcq_rpcs` (general-quiz). UI: `src/components/admin/AdminScreen.jsx`,
helpers in `src/lib/livemcqAdmin.js`, gated route `/admin` in `App.jsx`, entry link
in `AccountButton.jsx`.

### 8.B AI-guided path (existing, unchanged) — mapping reference
Hand the livefav/API JSON to the AI agent and let it classify (§4) and insert via
the Supabase MCP. This path stays fully supported. The mapping the agent applies:
`answer 1→a…5→e` (`0`/absent → `null`); `[option1..option5]` non-empty → `options`
`{a..e}`; `correct_answer_text` = chosen option; `question`/`explanation` HTML
**as-is**; `type='mcq'`; `extra = {"favorite_id":"<id>"}` (**required dedup key**);
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
| `src/lib/qid.js` → `uidOfText()` | stable content-hash `uid`; the Admin panel computes it client-side so client/DB uids match (§8) |
| DB RPCs `admin_livemcq_insert` / `_delete` / `_renumber` | the only write path to `questions` for livemcq; owner-gated (§8.3) |
| `public/lmdata/*.json` | the 13 category files — **frozen original seed / backup only**, not read at runtime |
| `src/data/index.js` → `LIVEMCQ_TOPICS` | topic metadata (name/icon/color); `questions:[]` filled from the DB |
| `src/components/shared/RichText.jsx` | HTML/entity-safe renderer for math/figures |
| `scripts/livefav.sh` (to be committed — §9.7) | the Termux sync script source; pull from the phone |
| ~~`src/data/livemcqLoader.js`, `src/hooks/useLiveMcq.js`~~ | **removed** in the Supabase migration (superseded by `contentLoader.js`) |

To add more questions later: **use the LiveMCQ Admin panel** (§8) — upload the
livefav JSON, classify, Insert. No code changes or redeploy needed; the app reads
the DB live.

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
