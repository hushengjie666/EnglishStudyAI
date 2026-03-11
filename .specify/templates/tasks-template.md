---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Lint, unit tests, and integration tests are MANDATORY for all changes. Add Playwright smoke tests for key pages.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T004 [P] Enforce TypeScript strict mode for frontend scope
- [ ] T005 Define core user flow boundaries and mark post-core items

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T006 Setup database schema and migrations framework
- [ ] T007 [P] Implement authentication/authorization framework
- [ ] T008 [P] Setup API routing and middleware structure
- [ ] T009 Create base models/entities that all stories depend on
- [ ] T010 Configure error handling and logging infrastructure
- [ ] T011 Setup environment configuration management
- [ ] T012 Document approval for any heavy dependency addition (if applicable)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Mandatory Quality Tasks for User Story 1

- [ ] T013 [P] [US1] Unit tests in tests/unit/
- [ ] T014 [P] [US1] Integration tests in tests/integration/
- [ ] T015 [US1] Baseline usability checks (load/click/form/error) for impacted pages
- [ ] T016 [US1] Playwright smoke test for key page(s)
- [ ] T017 [US1] Capture UI screenshots for acceptance (if UI changed)

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T019 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T020 [US1] Implement [Service] in src/services/[service].py (depends on T018, T019)
- [ ] T021 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T022 [US1] Add validation and error handling
- [ ] T023 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Mandatory Quality Tasks for User Story 2

- [ ] T024 [P] [US2] Unit tests in tests/unit/
- [ ] T025 [P] [US2] Integration tests in tests/integration/
- [ ] T026 [US2] Baseline usability checks (load/click/form/error) for impacted pages
- [ ] T027 [US2] Playwright smoke test for key page(s)
- [ ] T028 [US2] Capture UI screenshots for acceptance (if UI changed)

### Implementation for User Story 2

- [ ] T029 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T030 [US2] Implement [Service] in src/services/[service].py
- [ ] T031 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T032 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Mandatory Quality Tasks for User Story 3

- [ ] T033 [P] [US3] Unit tests in tests/unit/
- [ ] T034 [P] [US3] Integration tests in tests/integration/
- [ ] T035 [US3] Baseline usability checks (load/click/form/error) for impacted pages
- [ ] T036 [US3] Playwright smoke test for key page(s)
- [ ] T037 [US3] Capture UI screenshots for acceptance (if UI changed)

### Implementation for User Story 3

- [ ] T038 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T039 [US3] Implement [Service] in src/services/[service].py
- [ ] T040 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Documentation updates in docs/
- [ ] T042 Code cleanup and refactoring
- [ ] T043 Performance optimization across all stories
- [ ] T044 [P] Additional unit tests in tests/unit/
- [ ] T045 Security hardening
- [ ] T046 Run quickstart.md validation
- [ ] T047 Execute full quality gate: lint + unit + integration + Playwright smoke (as applicable)
- [ ] T048 If auto-fix attempts exceed 3 rounds, escalate to human reviewer with failure summary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Core flow requirements before post-core enhancements
- Unit + integration + usability checks before story completion
- Playwright smoke for key pages before story completion
- Screenshot evidence for UI changes before story completion
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Test tasks for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Keep automated self-fix loops to 3 rounds max, then escalate
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence