# Implementation Plan: EnglishStudyAI Core Learning Flow

**Branch**: `001-personalized-english-ai` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personalized-english-ai/spec.md`

## Summary

Build a desktop-first web application that helps working professionals rapidly accumulate
English vocabulary in target domains. The MVP must complete the core path: choose domain and
goal, finish a short vocabulary assessment, receive a personalized learning plan, complete one
learning session, and dynamically update the next plan from mastery outcomes.

The product runs with a frontend-only architecture using AI API calls and local metadata storage.

## Technical Context

**Language/Version**: JavaScript (ES2022), HTML5, CSS3  
**Primary Dependencies**: Vite, Playwright, Vitest, ESLint  
**Storage**: Browser local storage (user-local metadata only)  
**Testing**: ESLint, Vitest (unit), integration tests (frontend data flow), Playwright smoke  
**Target Platform**: Desktop web browsers (latest Chrome/Edge baseline)  
**Project Type**: Web application (frontend-only for current phase)  
**Performance Goals**: Key pages interactive on first screen and core flow completion within 3 minutes  
**Constraints**: No backend in this phase; direct AI API invocation from frontend; minimal libraries  
**Scale/Scope**: Single-user local usage for MVP; no social/admin/multi-language features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Core flow first: MVP core user journey is defined and scheduled before extensions.
- [x] Frontend strict TS: impacted frontend scope enforces TypeScript strict mode or has approved exception.
- [x] Acceptance criteria: every feature story has measurable, verifiable acceptance criteria.
- [x] Baseline usability: load, click, form submit, and error message checks are planned for each impacted page.
- [x] Quality gates: lint + unit + integration test execution is planned and required for merge.
- [x] Key pages smoke tests: Playwright smoke tests are identified for key pages.
- [x] UI evidence: screenshot artifacts are planned for all UI changes.
- [x] Auto-fix cap: troubleshooting plan limits automated self-fix loops to max 3 rounds before escalation.
- [x] Dependency policy: no heavy dependency is introduced without explicit approval.
- [x] Maintainability/testability: design choices are justified for long-term maintainability and testability.

Re-check after Phase 1 design: PASS (all gates remain satisfied).

## Project Structure

### Documentation (this feature)

```text
specs/001-personalized-english-ai/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ai-api-contract.md
│   └── ui-state-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── src/
│   ├── app/
│   │   ├── state/
│   │   ├── services/
│   │   └── flows/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── main.ts
├── public/
└── vite.config.ts

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Frontend-only web app. Keep architecture modular by flow (assessment,
planning, session update, assignment), with explicit service boundaries for AI and local storage.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |