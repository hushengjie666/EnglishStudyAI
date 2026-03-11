# Tasks: 英语学习AI私人定制学习

**Input**: Design documents from `/specs/001-personalized-english-ai/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Lint, unit tests, and integration tests are MANDATORY for all changes. Add Playwright smoke tests for key pages.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline engineering setup

- [X] T001 Initialize frontend project with Vite in frontend/package.json
- [X] T002 Create desktop-first app shell in frontend/index.html
- [X] T003 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [X] T004 [P] Configure ESLint rules and scripts in frontend/eslint.config.js
- [X] T005 [P] Configure Vitest and test scripts in frontend/vitest.config.ts
- [X] T006 [P] Configure Playwright baseline in tests/e2e/playwright.config.ts
- [X] T007 [P] Define environment variable template for AI API in frontend/.env.example
- [X] T008 Create base directory structure and placeholders in frontend/src/main.ts
- [X] T009 Document baseline setup and local run steps in specs/001-personalized-english-ai/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shared modules and quality automation that block all stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 Implement local metadata storage adapter in frontend/src/app/services/local-storage.ts
- [X] T011 [P] Implement AI API client wrapper with timeout/retry handling in frontend/src/app/services/ai-client.ts
- [X] T012 [P] Implement application error model and mapper in frontend/src/app/services/error-mapper.ts
- [X] T013 [P] Implement core app state store for profile/plan/session data in frontend/src/app/state/store.ts
- [X] T014 Create domain and goal-level constants in frontend/src/app/state/learning-options.ts
- [X] T015 [P] Implement shared form/input validators in frontend/src/app/services/validators.ts
- [X] T016 [P] Implement reusable notification/error UI component in frontend/src/components/notice-banner.ts
- [X] T017 [P] Add quality gate script (lint + unit + integration) in scripts/quality/run-quality-gates.ps1
- [X] T018 [P] Add Playwright smoke + screenshot + console capture script in scripts/quality/run-smoke-with-evidence.ps1
- [X] T019 [P] Add auto-fix loop controller (max 3 rounds) in scripts/quality/auto-fix-loop.ps1
- [X] T020 [P] Add failure report template generator in scripts/quality/generate-failure-report.ps1
- [X] T021 Define smoke evidence artifact directories in tests/e2e/artifacts/.gitkeep

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 设定学习目标并生成计划 (Priority: P1) 🎯 MVP

**Goal**: 用户可设置学习领域与目标等级，完成短测并得到首个个性化学习计划

**Independent Test**: 新用户在 3 分钟内完成首页设置 + 短测 + 计划生成，并且刷新后关键数据不丢失

### Tests for User Story 1

- [X] T022 [P] [US1] Add unit tests for goal/domain selection logic in tests/unit/us1-learning-options.test.ts
- [X] T023 [P] [US1] Add unit tests for assessment scoring adapter in tests/unit/us1-assessment-adapter.test.ts
- [X] T024 [P] [US1] Add integration test for home->assessment->plan data flow in tests/integration/us1-core-flow.test.ts
- [X] T025 [US1] Add Playwright smoke test for homepage first-screen interaction in tests/e2e/us1-homepage-smoke.spec.ts
- [X] T026 [US1] Add Playwright smoke test for login-entry state and navigation in tests/e2e/us1-login-entry-smoke.spec.ts

### Implementation for User Story 1

- [X] T027 [P] [US1] Implement homepage domain/goal selection UI in frontend/src/pages/home-page.ts
- [X] T028 [P] [US1] Implement short assessment page and submit flow in frontend/src/pages/assessment-page.ts
- [X] T029 [US1] Implement initial plan generation orchestration in frontend/src/app/flows/generate-initial-plan.ts
- [X] T030 [US1] Implement plan display page in frontend/src/pages/plan-page.ts
- [X] T031 [US1] Persist profile/assessment/plan metadata on refresh in frontend/src/app/state/persistence.ts
- [X] T032 [US1] Add common error prompts for missing inputs and API failures in frontend/src/app/services/error-prompts.ts
- [X] T033 [US1] Update app routing for US1 core flow in frontend/src/app/routes.ts

### Evidence and Validation for User Story 1

- [X] T034 [US1] Capture US1 acceptance screenshots in tests/e2e/artifacts/screenshots/us1/
- [X] T035 [US1] Capture and assert browser console errors for US1 smoke run in tests/e2e/artifacts/console/us1-console.json
- [X] T036 [US1] Run lint + unit tests after US1 tasks and record output in tests/e2e/artifacts/reports/us1-quality-report.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 学习中动态调整计划 (Priority: P2)

**Goal**: 系统基于学习结果识别薄弱点并动态更新后续学习计划

**Independent Test**: 用户完成至少两次学习后，系统能够根据薄弱点调整后续计划版本

### Tests for User Story 2

- [X] T037 [P] [US2] Add unit tests for weakness tag extraction logic in tests/unit/us2-weakness-analysis.test.ts
- [X] T038 [P] [US2] Add unit tests for adaptive plan updater in tests/unit/us2-plan-update.test.ts
- [X] T039 [P] [US2] Add integration test for session result -> next plan update flow in tests/integration/us2-adaptive-flow.test.ts
- [X] T040 [US2] Add Playwright smoke test for learning session submission flow in tests/e2e/us2-session-smoke.spec.ts

### Implementation for User Story 2

- [X] T041 [P] [US2] Implement learning session page for mastery input in frontend/src/pages/session-page.ts
- [X] T042 [US2] Implement weakness analysis service in frontend/src/app/services/weakness-analyzer.ts
- [X] T043 [US2] Implement adaptive plan update flow in frontend/src/app/flows/update-plan-from-session.ts
- [X] T044 [US2] Implement plan versioning and history persistence in frontend/src/app/state/plan-history.ts
- [X] T045 [US2] Add dynamic focus UI rendering for updated plans in frontend/src/components/plan-focus-list.ts

### Evidence and Validation for User Story 2

- [X] T046 [US2] Capture US2 acceptance screenshots in tests/e2e/artifacts/screenshots/us2/
- [X] T047 [US2] Capture and assert browser console errors for US2 smoke run in tests/e2e/artifacts/console/us2-console.json
- [X] T048 [US2] Run lint + unit + integration tests after US2 tasks and record output in tests/e2e/artifacts/reports/us2-quality-report.md

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 课后作业与成就反馈 (Priority: P3)

**Goal**: 用户可在学习后申请课堂作业并获得结果反馈

**Independent Test**: 用户完成一次学习后发起作业并提交，系统返回分数、反馈和下一步建议

### Tests for User Story 3

- [X] T049 [P] [US3] Add unit tests for assignment generation mapper in tests/unit/us3-assignment-mapper.test.ts
- [X] T050 [P] [US3] Add unit tests for assignment scoring and feedback formatter in tests/unit/us3-assignment-feedback.test.ts
- [X] T051 [P] [US3] Add integration test for assignment request->submit->feedback flow in tests/integration/us3-assignment-flow.test.ts
- [X] T052 [US3] Add Playwright smoke test for assignment lifecycle in tests/e2e/us3-assignment-smoke.spec.ts

### Implementation for User Story 3

- [X] T053 [P] [US3] Implement assignment request action from session page in frontend/src/components/request-assignment-button.ts
- [X] T054 [US3] Implement assignment generation flow in frontend/src/app/flows/generate-assignment.ts
- [X] T055 [US3] Implement assignment page and submit interaction in frontend/src/pages/assignment-page.ts
- [X] T056 [US3] Implement assignment result summary card in frontend/src/components/assignment-result-card.ts
- [X] T057 [US3] Persist assignment records and status in frontend/src/app/state/assignment-store.ts

### Evidence and Validation for User Story 3

- [X] T058 [US3] Capture US3 acceptance screenshots in tests/e2e/artifacts/screenshots/us3/
- [X] T059 [US3] Capture and assert browser console errors for US3 smoke run in tests/e2e/artifacts/console/us3-console.json
- [X] T060 [US3] Run lint + unit + integration tests after US3 tasks and record output in tests/e2e/artifacts/reports/us3-quality-report.md

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality closure, automation loop, and failure reporting

- [X] T061 [P] Add integration test for full core flow time-budget (<=3 minutes target path) in tests/integration/core-flow-time-budget.test.ts
- [X] T062 [P] Add Playwright milestone smoke suite (home/login/core CRUD-equivalent flow) in tests/e2e/milestone-smoke.spec.ts
- [X] T063 Execute milestone smoke run with screenshots and console checks via scripts/quality/run-smoke-with-evidence.ps1
- [X] T064 Execute global lint + unit + integration quality gates via scripts/quality/run-quality-gates.ps1
- [X] T065 Execute automated fix loop (max 3) and store cycle logs in tests/e2e/artifacts/reports/auto-fix-cycles.md
- [X] T066 Generate structured failure report when unresolved after 3 rounds in tests/e2e/artifacts/reports/failure-report.md
- [X] T067 [P] Update delivery evidence index in specs/001-personalized-english-ai/checklists/delivery-evidence.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all targeted user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; defines MVP core flow
- **User Story 2 (P2)**: Depends on US1 plan/session baseline data model
- **User Story 3 (P3)**: Depends on US2 session completion events

### Parallel Opportunities

- Phase 1 tasks marked `[P]` can run concurrently (T003-T007)
- Phase 2 tasks marked `[P]` can run concurrently after T010 baseline
- US1 tests (T022-T026) can run in parallel with UI implementation tasks (T027-T028)
- US2 service work (T042-T044) and tests (T037-T040) can proceed in parallel
- US3 component task T053 and page task T055 can proceed in parallel

---

## Parallel Example: User Story 1

```bash
# Parallel test authoring
Task: T022 tests/unit/us1-learning-options.test.ts
Task: T023 tests/unit/us1-assessment-adapter.test.ts
Task: T024 tests/integration/us1-core-flow.test.ts

# Parallel UI implementation
Task: T027 frontend/src/pages/home-page.ts
Task: T028 frontend/src/pages/assessment-page.ts
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2
2. Deliver Phase 3 (US1) with full evidence
3. Validate refresh persistence + smoke + console checks

### Incremental Delivery

1. Add US2 adaptive update loop
2. Add US3 assignment and feedback
3. Run Phase 6 quality closure and auto-fix loop

### Auto-fix and Escalation Rule

1. For failing gates, run `scripts/quality/auto-fix-loop.ps1`
2. Stop after 3 unsuccessful cycles
3. Run `scripts/quality/generate-failure-report.ps1` and attach failure report artifact

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Every task description contains a concrete file path
- MVP suggestion: deliver through T036 (US1 complete + evidence)





