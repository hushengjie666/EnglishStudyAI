$ErrorActionPreference = "Stop"

cd frontend
npm run test:smoke

Write-Host "[smoke] screenshot path: tests/e2e/artifacts/screenshots/setup-home.png"
Write-Host "[smoke] console path: tests/e2e/artifacts/console/setup-console.json"
