param(
  [switch]$SkipSmoke
)

$ErrorActionPreference = "Stop"

Write-Host "[release] stop lingering node processes (Windows file-lock mitigation)"
cmd /c "taskkill /IM node.exe /F" | Out-Null

Write-Host "[release] clean install"
Push-Location frontend
npm ci

Write-Host "[release] verify lint/build/tests"
npm run lint
npm run build
npm run test:unit
npm run test:integration
if (-not $SkipSmoke) {
  npm run test:smoke
}
Pop-Location

Write-Host "[release] check complete"
