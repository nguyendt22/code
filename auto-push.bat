@echo off
REM Auto Push Script - EduMath AI Math Rendering Upgrade
REM Double-click this file to push changes to GitHub

echo ========================================
echo  AUTO PUSH TO GITHUB - UPDATE 2
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
git commit -m "Fix: Add QuickMathTest component for verification" -m "- Added quick test component to verify MathRenderer" -m "- Debugging math rendering issues"
echo.

echo [4/4] Pushing to GitHub...
git push
echo.

echo ========================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Code pushed to GitHub
    echo  Vercel will auto-deploy in 1-2 minutes
    echo  IMPORTANT: Hard refresh browser: Ctrl+Shift+R
    echo  Check: https://code-eta-jet.vercel.app
) else (
    echo  FAILED! Check error messages above
)
echo ========================================
echo.
pause
