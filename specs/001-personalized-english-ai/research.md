# Research: EnglishStudyAI Core Learning Flow

## Decision 1: Frontend-only architecture for current phase
- Decision: Use frontend-only architecture with direct AI API calls and no dedicated backend.
- Rationale: Matches current project scope and speeds MVP delivery for core user flow validation.
- Alternatives considered:
  - Dedicated backend service: rejected for phase scope and delivery speed.
  - Mock-only AI integration: rejected because it cannot validate real personalized behavior.

## Decision 2: Keep dependency footprint minimal
- Decision: Use Vite + native HTML/CSS/TypeScript patterns and avoid heavy UI/state frameworks.
- Rationale: Aligns with maintainability and performance goals while reducing lock-in.
- Alternatives considered:
  - Full SPA framework stack: rejected as unnecessary complexity for current scope.
  - Utility-heavy UI kits: rejected due to dependency policy and customization overhead.

## Decision 3: Local metadata persistence
- Decision: Persist key learning metadata in browser local storage.
- Rationale: Satisfies refresh-resilience requirement without backend dependency.
- Alternatives considered:
  - Session-only memory: rejected because data would be lost on refresh.
  - Cloud persistence: rejected because backend is out of scope.

## Decision 4: Dynamic planning loop design
- Decision: Treat each learning session as feedback input to update weakness profile and next plan.
- Rationale: Directly supports personalized adaptation objective.
- Alternatives considered:
  - Static plan only: rejected because it cannot provide personalized progression.
  - Manual-only plan updates: rejected due to higher user effort and weaker guidance quality.

## Decision 5: Testing and auto-acceptance strategy
- Decision: Enforce lint + unit + integration per constitution, plus Playwright smoke at milestones.
- Rationale: Meets mandatory quality gates and ensures core flow reliability.
- Alternatives considered:
  - Unit-only strategy: rejected for missing end-to-end risk coverage.
  - Manual QA only: rejected due to low repeatability and slower feedback.

## Decision 6: Smoke test scope under frontend-only mode
- Decision: Cover homepage, login entry state, and core create/read/update flow for learning plan and session data.
- Rationale: Preserves user's requested smoke scope while mapping CRUD to local metadata operations.
- Alternatives considered:
  - Skip login checks: rejected because entry path reliability remains critical.
  - Pure visual smoke only: rejected because interaction and data flow must be verified.

## Decision 7: Error and usability baseline
- Decision: Every key page must validate load, click interaction, form submission, and explicit error messaging.
- Rationale: Constitution and acceptance criteria require usable first-screen interaction with clear failures.
- Alternatives considered:
  - Best-effort error handling: rejected as non-verifiable and high-risk for user trust.