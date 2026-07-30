# Auto Push Script - EduMath AI Math Rendering Upgrade
# Right-click and "Run with PowerShell" or double-click

Write-Host "========================================" -ForegroundColor Green
Write-Host " AUTO PUSH TO GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location "C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs"

Write-Host "[1/4] Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "[2/4] Adding all files..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "[3/4] Creating commit..." -ForegroundColor Yellow
git commit -m "Upgrade Math Rendering System - Professional KaTeX display for all THCS curriculum

- Enhanced MathRenderer with support for all THCS math notation
- Added 42 comprehensive test cases
- Improved responsive styling for all devices
- Created teacher documentation guide
- Added Vercel deployment configuration
- Math test page for verification"
Write-Host ""

Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
git push
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
if ($LASTEXITCODE -eq 0) {
    Write-Host " SUCCESS! Code pushed to GitHub" -ForegroundColor Green
    Write-Host " Vercel will auto-deploy in 1-2 minutes" -ForegroundColor Cyan
    Write-Host " Check: https://code-eta-jet.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host " FAILED! Check error messages above" -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
