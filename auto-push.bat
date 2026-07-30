@echo off
REM Auto Push Script - EduMath AI Math Rendering Fix
REM Double-click this file to push changes to GitHub

echo ========================================
echo  AUTO PUSH - MATH RENDERING FIX
echo ========================================
echo.

cd /d "C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs"

echo [1/4] Checking git status...
git status
echo.

echo [2/4] Adding all files...
git add .
echo.

echo [3/4] Creating commit...
git commit -m "Fix: MathRenderer CSS import and error handling" -m "- Removed duplicate KaTeX CSS import from index.css" -m "- Added comprehensive error handling and logging" -m "- Added try-catch blocks for better debugging"
echo.

echo [4/4] Pushing to GitHub...
git push
echo.

echo ========================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Code pushed to GitHub
    echo  Vercel will auto-deploy in 1-2 minutes
    echo.
    echo  IMPORTANT STEPS AFTER DEPLOY:
    echo  1. Wait for Vercel deployment to finish
    echo  2. Hard refresh browser: Ctrl+Shift+R or Ctrl+F5
    echo  3. Open Console (F12) to see any errors
    echo  4. Check if math formulas render properly
    echo.
    echo  Check deployment: https://vercel.com/dashboard
    echo  Live site: https://code-eta-jet.vercel.app
) else (
    echo  FAILED! Check error messages above
)
echo ========================================
echo.
pause
