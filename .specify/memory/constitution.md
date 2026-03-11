<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles:
  - N/A -> I. Core User Flow First
  - N/A -> II. Strict TypeScript by Default
  - N/A -> III. Verifiable Acceptance Criteria
  - N/A -> IV. Baseline Usability Coverage
  - N/A -> V. Mandatory Quality Gates
- Added sections:
  - Delivery & Quality Standards
  - Workflow & Review Policy
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
- Follow-up TODOs:
  - None
-->
# EnglishStudyAI Constitution

## Core Principles

### I. Core User Flow First
All features MUST prioritize the core user journey before any extension or optimization work.
When scope conflict exists, teams MUST deliver the smallest complete core flow first and defer
non-essential enhancements.

Rationale: predictable value delivery and lower delivery risk.

### II. Strict TypeScript by Default
All frontend code MUST use TypeScript strict mode by default.
Any exception MUST be explicitly documented with scope, reason, and removal plan.

Rationale: stronger type safety and maintainability at scale.

### III. Verifiable Acceptance Criteria
Every feature MUST define measurable and testable acceptance criteria before implementation.
Acceptance criteria MUST be traceable to tests or explicit manual verification steps.

Rationale: removes ambiguity and enables objective completion checks.

### IV. Baseline Usability Coverage
All pages MUST pass baseline usability checks, including:
- successful initial load
- clickable primary interactive elements
- form submission behavior
- clear and actionable error messaging
- all user-facing UI copy and navigation text MUST be Chinese by default; only learning content
  (e.g., English vocabulary, example sentences) may contain English

Rationale: protects minimum product usability and prevents regressions.

### V. Mandatory Quality Gates
All changes MUST pass lint, unit tests, and integration tests before merge.
Key pages MUST pass Playwright smoke tests.
UI changes MUST produce screenshots for acceptance.
Automated self-fix loops MUST NOT exceed 3 rounds; beyond that, human handling is required.
Unapproved heavy dependencies MUST NOT be introduced.
Maintainability and testability MUST take priority in architecture and implementation choices.

Rationale: enforces consistent delivery quality and sustainable code evolution.

## Delivery & Quality Standards

- Definition of Done MUST include:
  - linked acceptance criteria
  - required test pass evidence (lint, unit, integration)
  - Playwright smoke evidence for key pages (if impacted)
  - UI screenshot evidence for UI-impacting changes
- Dependency changes MUST include impact review. Heavy dependencies require explicit approval
before introduction.
- If automatic repair attempts reach 3 unsuccessful rounds, work MUST be escalated with
failure summary and blocker details.

## Workflow & Review Policy

- Planning MUST sequence work as: core flow first, extensions second.
- Reviewers MUST reject changes missing any mandatory gate evidence.
- Any exception to this constitution MUST be documented in the plan with approver identity,
scope, expiry condition, and rollback path.
- Constitution compliance checks are mandatory in planning, implementation, and PR review.

## Governance

This constitution supersedes conflicting project conventions.

Amendment process:
1. Propose a documented change with rationale and impact scope.
2. Review impact on templates, tests, and workflow checks.
3. Obtain project maintainer approval.
4. Update version, amendment date, and synchronization notes.

Versioning policy:
- MAJOR: breaking governance changes or principle removals/redefinitions.
- MINOR: new principle/section or materially expanded requirements.
- PATCH: clarifications without semantic behavior change.

Compliance expectations:
- Every plan, tasks list, and PR review MUST include constitution compliance checks.
- Non-compliant items MUST be resolved or approved via formal exception.

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
