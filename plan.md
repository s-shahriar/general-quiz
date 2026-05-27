# Implementation Plan - Merging EEE Quiz and Utility Kit into General Quiz

We will merge the `eee-quiz` and `utility-kit` projects into `general-quiz` as integrated modules. `general-quiz` will act as the master container. It has the most extensive features (Nailed It, Important questions, Backup & Restore, and Exam Mode). We will preserve all of its features while adding EEE Quiz and Utility Kit as seamless modules accessible from a premium top navigation bar.

## User Review Required

> [!IMPORTANT]
> **Module Navigation**: We will add a beautiful, sleek top navigation bar to switch between three modules: **General Quiz**, **EEE Quiz**, and **Utility Kit**. The active state, theme support (dark/light), and premium animations will be perfectly integrated.
>
> **Styling Integrations**:
> - EEE Quiz uses Tailwind CSS v4. We will add `@tailwindcss/vite` and `tailwindcss` as dependencies/plugins to `general-quiz`. This will enable Tailwind support for the integrated EEE components without altering or breaking any existing CSS rules.
> - Utility Kit uses `katex` for mathematical typesetting. We will install `katex` in `general-quiz` to render math equations.

## Proposed Changes

### Dependencies & Configuration

We need to merge dependencies from all projects into `general-quiz`.

#### [MODIFY] [package.json](file:///home/syed/Projects/Self/general-quiz/package.json)
- Add `katex` for math rendering.
- Add `tailwindcss` and `@tailwindcss/vite` for EEE quiz styles.

#### [MODIFY] [vite.config.js](file:///home/syed/Projects/Self/general-quiz/vite.config.js)
- Import and register the `tailwindcss` plugin.

---

### EEE Quiz Module Integration

We will copy all data files and components of `eee-quiz` into `general-quiz`.

#### [NEW] Data Files
- `src/data/eee/ac_fundamentals_mcq.json`
- `src/data/eee/communication_mcq.json`
- `src/data/eee/dc_circuit_mcq.json`
- `src/data/eee/electronics_mcq.json`
- `src/data/eee/transformer_mcq.json`
- `src/data/eee/topics.js` (adapted for new file paths and structure)

#### [NEW] Components
- `src/components/eee/Header.jsx`
- `src/components/eee/Home.jsx`
- `src/components/eee/QuizMode.jsx`
- `src/components/eee/ReviseMode.jsx`
- `src/components/eee/Results.jsx`
- `src/hooks/eee/useBookmarks.js`

#### [NEW] Stylesheet
- `src/eee-quiz.css` (importing `@import "tailwindcss";` and setting EEE quiz specific layers)

---

### Utility Kit Module Integration

We will copy all data and components of `utility-kit` into `general-quiz`.

#### [NEW] Data Files
- `src/data/utility/finTermsData.js`

#### [NEW] Components
- `src/components/utility/HomeScreen.jsx`
- `src/components/utility/MathFormulas.jsx`
- `src/components/utility/FinancialTerms.jsx`

#### [NEW] Stylesheets
- `src/components/utility/MathFormulas.css`
- `src/components/utility/FinancialTerms.css`
- `src/utility-kit.css` (general utility kit styles from `utility-kit/src/index.css`)

---

### Master Container Update

We will update the core layout of `general-quiz` to render the module selector and embed EEE Quiz and Utility Kit.

#### [MODIFY] [App.jsx](file:///home/syed/Projects/Self/general-quiz/src/App.jsx)
- Import EEE Quiz and Utility Kit core modules.
- Add `activeModule` state (`general` | `eee` | `utility`).
- Render the module selection header.
- Conditionally render the selected module component tree while preserving theme and states.

#### [MODIFY] [index.css](file:///home/syed/Projects/Self/general-quiz/src/index.css)
- Add new styles for the module navigation bar.
- Import `utility-kit.css`, `eee-quiz.css` and `katex` css styles as needed.

#### [MODIFY] [main.jsx](file:///home/syed/Projects/Self/general-quiz/src/main.jsx)
- Ensure stylesheets are imported in the correct priority order.

---

## Verification Plan

### Automated Tests
- Build verification: Run `npm run build` to verify there are no compilation/bundling errors.
- Run `npm run dev` to verify the development server starts cleanly.

### Manual Verification
- Verify the **Top Navigation Bar** transitions smoothly and is perfectly aligned.
- Test **General Quiz** modes (Study, Quiz, Exam, Nailed It, Important) to verify 100% functionality and no data loss.
- Test **EEE Quiz** topics, quiz mode, revise mode, and bookmarks.
- Test **Utility Kit** math formulas (Katex rendering) and financial terms/quiz.
- Verify dark/light mode switches across all three modules seamlessly.
