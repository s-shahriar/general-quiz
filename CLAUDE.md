# general-quiz — working notes for Claude

## ⚠️ SINGLE-SOURCE RULE — never skip (web app AND Slate must both see every addition)

Slate (the Android app, `~/Projects/Self/Quiz/slate`) and this web app read the **same Supabase project**. Any new or
edited content — a question, vocab item, written data card, financial term, math formula, topic — must be saved **in
Supabase**, so it shows up in both without being re-entered. Content that lives only in a repo file, a JS/JSON bundle or
Slate's `assets/` is invisible to the other app and is a bug. Do this **every time**, and tell the user it is done:

| Content | Where it must end up | How |
|---|---|---|
| MCQs (bangla, english, gk, sahitya, vocab) | `questions` + `categories` | insert into the DB (never run the full `scripts/seed.mjs`: it destroys LiveMCQ rows) |
| LiveMCQ | `questions` (`module:'livemcq'`) | the favourites sync (`scripts/livefav.sh`, dedup by `favorite_id`) |
| Written » Data cards | `written_cards` / `written_categories` (`topic='data'`) | `scripts/seed-written-data.mjs` or direct insert |
| Financial Terms | `content_blobs` (`utility/finance`) | edit `src/data/utility/finTermsData.js`, then `node scripts/sync-static.mjs` |
| Math Formulas page for Slate | `content_blobs` (`web/math`) | edit the JSX sections, deploy the web app, then `node ~/Projects/Self/Quiz/slate/tools/prerender/build.mjs` |

Finish every content change with a check: query the DB (or reload the web app) and confirm the new row is **live**, and for
math confirm the prerender publish ran. A repo-only edit is not done. Known exceptions (still hardcoded in the web bundle
AND Slate until moved into the DB): topic names/colours/icons (`src/data/index.js`, `groups.js`, `vocabTopics.js`; Slate's
`ContentModels.kt`) — change both when you add a category.

Display order: `sort_order` DESC everywhere (latest first); LiveMCQ `sort_order` tracks `favorite_id`.
