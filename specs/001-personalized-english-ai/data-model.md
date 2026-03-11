# Data Model: EnglishStudyAI

## Entity: UserLearningProfile
- Purpose: Captures user learning intent and current proficiency baseline.
- Fields:
  - `profileId` (string, required, unique)
  - `targetDomains` (string[], required, min 1)
  - `customDomain` (string, optional)
  - `goalLevel` (enum: READING, LISTEN_SPEAK, FLUENT, EXPERT, required)
  - `currentLevel` (string, required)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
- Validation:
  - At least one domain source must exist (preset or custom).
  - Goal level must be one of supported levels.

## Entity: VocabularyAssessment
- Purpose: Stores short test attempts and resulting proficiency signal.
- Fields:
  - `assessmentId` (string, required, unique)
  - `profileId` (string, required, relation -> UserLearningProfile)
  - `questions` (AssessmentQuestion[], required)
  - `answers` (AssessmentAnswer[], required)
  - `score` (number, required, 0-100)
  - `estimatedLevel` (string, required)
  - `completedAt` (datetime, required)
- Validation:
  - `answers.length` must equal required question count.
  - `score` range must be bounded to 0-100.

## Entity: LearningPlan
- Purpose: Defines the active and historical plan generated from profile + assessment + session feedback.
- Fields:
  - `planId` (string, required, unique)
  - `profileId` (string, required, relation -> UserLearningProfile)
  - `version` (number, required, >=1)
  - `domain` (string, required)
  - `goalLevel` (enum, required)
  - `focusVocabulary` (string[], required)
  - `weaknessFocus` (string[], optional)
  - `recommendedTasks` (PlanTask[], required)
  - `status` (enum: ACTIVE, SUPERSEDED, required)
  - `generatedAt` (datetime, required)
- Validation:
  - Only one ACTIVE plan per profile.
  - Version increments by 1 on each dynamic update.

## Entity: LearningSessionResult
- Purpose: Records outcome of each study session and drives adaptive updates.
- Fields:
  - `sessionId` (string, required, unique)
  - `planId` (string, required, relation -> LearningPlan)
  - `attemptedWords` (string[], required)
  - `masteredWords` (string[], required)
  - `missedWords` (string[], required)
  - `weaknessTags` (string[], required)
  - `durationSeconds` (number, required)
  - `submittedAt` (datetime, required)
- Validation:
  - `masteredWords` and `missedWords` must be subsets of `attemptedWords`.
  - `durationSeconds` must be positive.

## Entity: ClassAssignment
- Purpose: Represents user-triggered post-session quiz and feedback result.
- Fields:
  - `assignmentId` (string, required, unique)
  - `sessionId` (string, required, relation -> LearningSessionResult)
  - `knowledgePoints` (string[], required)
  - `questions` (AssignmentQuestion[], required)
  - `answers` (AssignmentAnswer[], optional until submitted)
  - `resultSummary` (string, optional until submitted)
  - `score` (number, optional until submitted)
  - `status` (enum: GENERATED, SUBMITTED, required)
  - `createdAt` (datetime, required)
  - `submittedAt` (datetime, optional)
- Validation:
  - Assignment can be generated only after a completed session.
  - A submitted assignment must include answers and score.

## Relationships
- UserLearningProfile 1 -> N VocabularyAssessment
- UserLearningProfile 1 -> N LearningPlan
- LearningPlan 1 -> N LearningSessionResult
- LearningSessionResult 1 -> N ClassAssignment

## State Transitions
- Profile: CREATED -> ACTIVE
- Plan: ACTIVE -> SUPERSEDED (when new adaptive plan is produced)
- Assignment: GENERATED -> SUBMITTED