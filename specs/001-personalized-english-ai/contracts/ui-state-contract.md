# Contract: UI State and Flow

## Key Pages and Required Interactions

### Home Page
- Must support:
  - select popular domain
  - input custom domain
  - choose goal level
  - start short assessment
- Must block progression with explicit prompt if domain/goal missing.

### Assessment Page
- Must support:
  - answer and submit short vocabulary test
  - recover in-progress data after refresh
- Submit output must transition to plan view on success.

### Learning Plan Page
- Must show:
  - active plan version
  - focus vocabulary
  - recommended tasks
- Must persist active plan metadata across refresh.

### Learning Session Page
- Must support:
  - record mastered/missed words
  - submit session outcome
- On submit success, next plan must reflect weakness-based adjustments.

### Assignment Page
- Must support:
  - user-triggered assignment generation
  - submit assignment answers
  - show score and feedback summary

## Error State Contract
- Error states must include:
  - clear title
  - actionable instruction (retry/edit/back)
  - non-blocking recovery path where possible

## Persistence Contract
- Key metadata persisted locally:
  - selected domain and goal level
  - latest assessment result
  - current active plan
  - latest learning session result