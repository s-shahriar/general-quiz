# LiveMCQ Module — Pipeline, Data Format & Setup

> This document explains the **LiveMCQ** module: how questions are pulled from the
> LiveMCQ app, categorized, given to this app as JSON, rendered, and kept
> duplicate‑free. It also documents the **Termux** setup for the sync script
> (`livefav`) — including the gotchas we hit — so it can be reproduced cleanly.
>
> LiveMCQ is a plain **MCQ module** (like Bangla/English Grammar): each topic has
> `question · options · correct answer · explanation`, and gets Quiz, Study,
> Exam, Important and Nailed for free. It is **not** the GK study‑notes type — see
> `GK_PATTERN.md` for that.

---

## 1. Big picture (the pipeline)

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
        ▼
  public/lmdata/<category>.json  ──►  lazy-loaded by the app
```

- **Source of truth (off-repo):** `~/Downloads/livemcq_favourites/` on the PC
  holds the full categorized master (`favourites_clean_categorized.json`,
  2000+ questions) plus per-category splits and a summary.
- **What ships in the app:** 13 JSON files in **`public/lmdata/`**, one per
  category. These are static assets (NOT bundled into JS) and are fetched on
  demand — see §6.

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

---

## 3. JSON data format for the app (how a question is "given")

Each category is one file: **`public/lmdata/<category>.json`**, shaped:

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

To add a question by hand: append an object to the right category file with a
unique `favorite_id`, a `correct_answer` letter that exists in `options`, and
(optionally) HTML in `question`/`explanation`.

---

## 4. Categories & how they are assigned

The LiveMCQ subject endpoint is unreliable (it mislabels e.g. English grammar as
"Surgery"), so **categories are assigned by reading the question content**, into
these 13 topics (`src/data/index.js` → `LIVEMCQ_TOPICS`):

| # | file (`public/lmdata/…`) | topic name | what goes here |
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
- **Banking (13)** = finance/economics concepts. Macro indicators (GDP,
  inflation, budget, tax) → 13; BD trade *facts* (top export partner) → 5.
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

So the current data (2008 items) has **0 real duplicates** — every `favorite_id`
is unique, and text collisions are expected. Do **not** collapse by text.
(GroupSearch does hide same-text results in the *search list* for readability;
that is a UI convenience only and does not affect the underlying data.)

---

## 8. Syncing new favourites (adding more later)

1. Fetch page 1 (newest 20) with the token:
   ```bash
   curl -s -H "Authorization: Token <TOKEN>" \
     "https://livemcq.com/api/v1/central-favorite-list/?page=1"
   ```
   or run `livefav` on the phone (§9).
2. Keep only items with `favorite_id > <last-synced max>` (dedup).
3. Classify each new question into one of the 13 categories (§4).
4. Append to the PC master `favourites_clean_categorized.json`, then regenerate
   the affected `public/lmdata/<file>.json` (same shape as §3).
5. Run the dedup check (§7). Rebuild.

The last-synced `favorite_id` baseline is recorded outside the repo (in the PC
master / notes).

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
`favorite_id, slug, question, options[], answer, explanation`). Hand that file to
the categorize step (§8). The script **re-reads the token each run**, so it keeps
working after an app re-login.

### 9.6 Termux gotchas recap
- `curl` broken → `apt update && apt full-upgrade -y` (never `pkg upgrade`).
- `ERROR: could not read token` → grant **Termux** root in KernelSU + be logged
  in to LiveMCQ.
- `su: inaccessible or not found` (over adb) → grant the **Shell** profile in
  KernelSU.
- Can't write to `Download/` → run `termux-setup-storage` and allow it.

---

## 10. File map (where things live)

| path | purpose |
|---|---|
| `public/lmdata/*.json` | the 13 category question files (static, lazy-loaded) |
| `src/data/index.js` → `LIVEMCQ_TOPICS` | topic metadata + `file` refs (no data import) |
| `src/data/livemcqLoader.js` | fetches `/lmdata/*.json`, fills `questions` |
| `src/hooks/useLiveMcq.js` | `useLiveMcqReady()` load-on-demand hook |
| `src/components/shared/RichText.jsx` | HTML/entity-safe renderer for math/figures |
| `~/Downloads/livemcq_favourites/` (off-repo) | PC master + per-category + summary |
| `~/Downloads/livefav.sh` (off-repo) | the Termux sync script source |

To add more questions later: regenerate the relevant `public/lmdata/<file>.json`
(dedup by `favorite_id`) — no code changes needed.
