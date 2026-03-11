param(
  [string]$FailedStage = "unknown",
  [string]$RootCause = "unknown"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force tests/e2e/artifacts/reports | Out-Null

@"
# Failure Report

- Failed stage: $FailedStage
- Root cause: $RootCause
- Generated at: $(Get-Date -Format o)
"@ | Set-Content tests/e2e/artifacts/reports/failure-report.md
