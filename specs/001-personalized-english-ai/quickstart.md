# Quickstart: EnglishStudyAI Planning Baseline

## 1. Prerequisites
- Node.js 20+
- npm 10+
- Modern desktop browser (Chrome or Edge latest stable)

## 2. Suggested Project Bootstrap
1. Initialize frontend with Vite (`frontend/`).
2. Keep dependencies minimal and document any non-trivial addition.
3. Enable TypeScript strict mode by default for frontend code.

## 3. Install and Start
- `cd frontend && npm install`
- `cd frontend && npm run dev`

## 4. Run Quality Gates During Development
- `cd frontend && npm run lint`
- `cd frontend && npm run test:unit`
- `cd frontend && npm run test:integration`
- `cd frontend && npm run test:smoke`

## 5. Evidence Collection
- Capture screenshots for UI-impacting changes (stored under `tests/e2e/artifacts/screenshots/`).
- Capture and review browser console errors during smoke runs.
- Track automated repair attempts; stop after 3 failed loops and escalate.

## 6. MVP Verification Flow
1. Open homepage and confirm first-screen accessibility.
2. Confirm baseline test suites are runnable.
3. Confirm smoke test produces screenshot artifact and has no console errors.
