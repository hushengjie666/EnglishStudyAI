param(
  [int]$MaxRounds = 3
)

$ErrorActionPreference = "Stop"

for ($i = 1; $i -le $MaxRounds; $i++) {
  Write-Host "[auto-fix] round $i/$MaxRounds"
  try {
    powershell -ExecutionPolicy Bypass -File scripts/quality/run-quality-gates.ps1
    Write-Host "[auto-fix] success"
    exit 0
  } catch {
    Write-Host "[auto-fix] failed on round $i"
    if ($i -eq $MaxRounds) {
      exit 1
    }
  }
}
