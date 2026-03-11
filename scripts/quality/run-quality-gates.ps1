$ErrorActionPreference = "Stop"

Write-Host "[quality] lint"
cd frontend
npm run lint

Write-Host "[quality] unit"
npm run test:unit

Write-Host "[quality] integration"
npm run test:integration

Write-Host "[quality] smoke"
npm run test:smoke
