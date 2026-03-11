[auto-fix] round 1/3
[quality] lint
npm warn Unknown user config "python". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown user config "3.6.5". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> frontend@0.0.0 lint
> eslint .

[quality] unit
npm warn Unknown user config "python". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown user config "3.6.5". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> frontend@0.0.0 test:unit
> vitest run --config vitest.unit.config.ts


 RUN  v3.2.4 D:/Users/hudashuai/PrivateProjects/AI/EnglishStudyAI/frontend

 ✓ ../tests/unit/us1-learning-options.test.ts (2 tests) 5ms
 ✓ ../tests/unit/us1-assessment-adapter.test.ts (2 tests) 6ms
 ✓ ../tests/unit/us3-assignment-feedback.test.ts (1 test) 5ms
 ✓ ../tests/unit/setup-sanity.test.ts (1 test) 4ms
 ✓ ../tests/unit/us3-assignment-mapper.test.ts (1 test) 9ms
 ✓ ../tests/unit/us2-plan-update.test.ts (1 test) 6ms
 ✓ ../tests/unit/us2-weakness-analysis.test.ts (1 test) 7ms

 Test Files  7 passed (7)
      Tests  9 passed (9)
   Start at  00:35:59
   Duration  5.29s (transform 503ms, setup 0ms, collect 1.02s, tests 42ms, environment 26.13s, prepare 2.96s)

[quality] integration
npm warn Unknown user config "python". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown user config "3.6.5". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> frontend@0.0.0 test:integration
> vitest run --config vitest.integration.config.ts


 RUN  v3.2.4 D:/Users/hudashuai/PrivateProjects/AI/EnglishStudyAI/frontend

 ✓ ../tests/integration/app-shell.integration.test.ts (1 test) 27ms
 ✓ ../tests/integration/us1-core-flow.test.ts (1 test) 83ms
 ✓ ../tests/integration/core-flow-time-budget.test.ts (1 test) 89ms
 ✓ ../tests/integration/us2-adaptive-flow.test.ts (1 test) 106ms
 ✓ ../tests/integration/us3-assignment-flow.test.ts (1 test) 107ms

 Test Files  5 passed (5)
      Tests  5 passed (5)
   Start at  00:36:06
   Duration  5.03s (transform 248ms, setup 0ms, collect 1.52s, tests 412ms, environment 16.19s, prepare 2.18s)

[quality] smoke
npm warn Unknown user config "python". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown user config "3.6.5". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> frontend@0.0.0 test:smoke
> node ./scripts/run-smoke.mjs


  VITE v7.3.1  ready in 523 ms

  ➜  Local:   http://127.0.0.1:4173/

Running 6 tests using 6 workers

(node:28804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:28232) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:26824) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:33648) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:1276) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:24548) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:28804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:28232) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:26824) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:33648) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:24548) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:1276) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 1 ..\tests\e2e\specs\milestone-smoke.spec.ts:4:5 › milestone smoke: home/login/core CRUD-equivalent flow (2.3s)
  ok 3 ..\tests\e2e\specs\setup-smoke.spec.ts:4:5 › homepage first screen is accessible and interactive (2.4s)
  ok 2 ..\tests\e2e\specs\us1-homepage-smoke.spec.ts:4:5 › US1 homepage interaction to assessment (2.7s)
  ok 4 ..\tests\e2e\specs\us1-login-entry-smoke.spec.ts:4:5 › US1 login-entry state navigation (2.4s)
  ok 6 ..\tests\e2e\specs\us2-session-smoke.spec.ts:4:5 › US2 learning session submission (2.7s)
  ok 5 ..\tests\e2e\specs\us3-assignment-smoke.spec.ts:4:5 › US3 assignment lifecycle (3.2s)

  6 passed (8.0s)
[auto-fix] success
