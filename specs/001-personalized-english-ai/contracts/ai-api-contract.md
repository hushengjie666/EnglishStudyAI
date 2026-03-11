# Contract: AI API Interaction

## Purpose
Define the frontend contract for invoking AI capabilities used in assessment scoring,
plan generation, adaptive updates, and assignment generation.

## Client Contract

### 1) Assessment Evaluation
- Input:
  - `domain` (string)
  - `goalLevel` (string)
  - `assessmentAnswers` (array)
- Output:
  - `estimatedLevel` (string)
  - `score` (number)
  - `weaknessTags` (array of string)
- Error contract:
  - `errorCode` (string)
  - `message` (string, user-safe)
  - `retryable` (boolean)

### 2) Initial Learning Plan Generation
- Input:
  - `profile` (object)
  - `assessmentResult` (object)
- Output:
  - `planVersion` (number)
  - `focusVocabulary` (array of string)
  - `recommendedTasks` (array of object)

### 3) Adaptive Plan Update
- Input:
  - `currentPlan` (object)
  - `sessionResult` (object)
- Output:
  - `nextPlanVersion` (number)
  - `adjustedFocus` (array of string)
  - `adjustmentReason` (string)

### 4) Class Assignment Generation
- Input:
  - `sessionKnowledgePoints` (array of string)
  - `goalLevel` (string)
- Output:
  - `assignmentQuestions` (array)
  - `expectedCoverage` (array of string)

## Non-Functional Contract
- All AI failures must map to explicit user-facing error states.
- Requests must be idempotent from UI perspective: repeated submit should not create duplicate visible records.
- Response handling must support timeout and retry messaging.