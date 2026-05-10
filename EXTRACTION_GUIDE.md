# Question Bank Extraction Guide

This document explains how questions were extracted from screenshots and how to extract more in the future.

---

## Overview

Questions were extracted from mobile phone screenshots taken from quiz/practice apps. Each screenshot shows one or more MCQ questions with:
- Question text
- 4 options (a/b/c/d or ক/খ/গ/ঘ for Bangla)
- A ticked/highlighted correct answer
- An explanation paragraph

Extracted questions are stored in:
- `src/data/bangla/` — Bangla grammar topics
- `src/data/english/` — English grammar topics

Each JSON file has the structure:
```json
{
  "topic": "Topic Name",
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "correct_answer": "a",
      "correct_answer_text": "option a text",
      "explanation": "explanation text"
    }
  ]
}
```

---

## Extraction Rules

### What to extract
- Only **fully visible** questions — all of the following must be completely on screen:
  - Question text (no text cut off at top)
  - All 4 options (a, b, c, d)
  - The correct answer marking (tick, highlight, or "Show Answer" revealed)
  - The explanation text (not cut off at bottom)

### What to SKIP
- Any question where the question text starts mid-sentence (top of screen is cut off)
- Any question where the explanation runs off the bottom of the screen
- Any question without an explanation visible
- Continuation screenshots (where the same question spans multiple screenshots — only extract once when fully visible)

### One question per screenshot vs multiple
- Some screenshots show 1 question, others show 2-3
- For each screenshot: identify all questions and check each separately
- Extract only those that are fully visible; skip the rest

---

## Extraction Process Used

### Step 1: Organize screenshots
Screenshots were organized into folders by topic (e.g., `Tense/`, `Preposition/`, `সন্ধি/`).

### Step 2: Launch parallel AI agents
For each topic folder, sub-agents were launched to read screenshots in batches. Batch size limit: **≤ 20 screenshots per agent** to avoid image dimension errors.

Example agent prompt structure:
```
You are extracting English Grammar MCQ questions from screenshots.
Read each screenshot file using the Read tool, then extract all FULLY VISIBLE questions.

RULES:
- Extract ONLY questions where ALL parts are FULLY visible
- SKIP any question that is partially cut off
- SKIP if explanation runs off the bottom

FORMAT:
### Question N
**Question:** [text]
a) [option a]
b) [option b]
c) [option c]
d) [option d]
**✅ Answer:** [letter]) [answer text]
**Explanation:** [explanation]
---

Number from 1. Return ONLY formatted blocks, no other text.
```

### Step 3: Store in question bank MD file
All extracted questions were written to a Markdown question bank file:
- Bangla: `/home/syed/Downloads/Bangla/Practice Problem/questions_bank.md`
- English: `/home/syed/Downloads/Bangla/English/English Grammer/questions_bank.md`

The MD format for English questions:
```markdown
## Topic Name

> Total Questions: N

---

### Question 1

**Question:** [question text]

a) [option a]
b) [option b]
c) [option c]
d) [option d]

**✅ Answer:** a) [answer text]

**Explanation:** [explanation text]

---
```

The MD format for Bangla questions:
```markdown
## টপিক নাম

> মোট প্রশ্ন: N টি

---

### প্রশ্ন ১
**প্রশ্ন:** [প্রশ্নের টেক্সট]
**ক)** [বিকল্প ক]
**খ)** [বিকল্প খ]
**গ)** [বিকল্প গ]
**ঘ)** [বিকল্প ঘ]
**✅ উত্তর:** ক) [সঠিক উত্তর]
**ব্যাখ্যা:** [ব্যাখ্যার টেক্সট]

---
```

### Step 4: Parse MD → JSON
A Python script parses the MD files and generates JSON data files for each topic.

The script handles two English question formats (old format used `**Q:**` / `**A)**`, new format uses `**Question:**` / `a)` etc.).

---

## Adding New Questions

### Option A: Add directly to JSON
Edit the appropriate JSON file in `src/data/bangla/` or `src/data/english/`. Add a new entry to the `questions` array following the existing structure.

### Option B: Add via MD → JSON pipeline

1. **Take screenshots** of the new questions
2. **Run an AI agent** to extract the questions using the prompt template above
3. **Append to the MD file** in the correct topic section
4. **Re-run the parser** (save the inline Python parser from the session or write a new one using the format described above)
5. **Rebuild and deploy**: `npm run deploy`

---

## Image Dimension Limit

When passing screenshots to an AI agent, keep batches to **≤ 20 screenshots per agent**. Larger batches may hit an image dimension limit error: `"An image in the conversation exceeds the dimension limit for many-image requests (2000px)"`.

If an agent fails with this error, split the batch into smaller groups and retry.

---

## Deployment

After adding new questions, rebuild and deploy to GitHub Pages:

```bash
npm run deploy
```

This runs `vite build` then pushes the `dist/` folder to the `gh-pages` branch.

Live URL: https://s-shahriar.github.io/general-quiz
