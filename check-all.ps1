
$ErrorActionPreference = "Continue"
$root = "C:\Users\Lenovo\UniSphere"

Write-Host "`n=== UNISPHERE AUTOMATED CHECK ===" -ForegroundColor Cyan

Set-Location "$root\frontend"

Write-Host "`n[1/3] Frontend lint..."
npm.cmd run lint
$lint = $LASTEXITCODE

Write-Host "`n[2/3] Frontend production build..."
npm.cmd run build
$build = $LASTEXITCODE

Set-Location "$root\backend"

Write-Host "`n[3/3] Backend tests..."
.\.venv\Scripts\python.exe -m pytest -q
$tests = $LASTEXITCODE

Write-Host "`n=== FINAL REPORT ===" -ForegroundColor Cyan

if ($lint -eq 0) {
    Write-Host "Lint command: PASS (warnings may remain)" -ForegroundColor Green
} else {
    Write-Host "Lint command: FAIL" -ForegroundColor Red
}

if ($build -eq 0) {
    Write-Host "Frontend build: PASS" -ForegroundColor Green
} else {
    Write-Host "Frontend build: FAIL" -ForegroundColor Red
}

if ($tests -eq 0) {
    Write-Host "Backend tests: PASS" -ForegroundColor Green
} else {
    Write-Host "Backend tests: FAIL" -ForegroundColor Red
}

if ($lint -ne 0 -or $build -ne 0 -or $tests -ne 0) {
    exit 1
}

Write-Host "`nAll three check commands completed successfully." -ForegroundColor Green
