@echo off
REM Auto Push Script - EduMath AI Exam Creator Feature
REM Double-click this file to push changes to GitHub

echo ========================================
echo  AUTO PUSH - EXAM CREATOR FEATURE
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
git commit -m "Feature: Complete Exam Creator with auto math formatting" -m "Added comprehensive exam creation feature for teachers:" -m "- autoMathFormatter.ts: Auto-detect and wrap math formulas in $ delimiters" -m "- ExamCreator.tsx: Full exam creation UI with question management" -m "- excelImporter.ts: Import questions from Excel/CSV files" -m "- TeacherDashboard.tsx: Integrated Exam Creator with UI" -m "" -m "Teachers can now:" -m "- Create exams manually with visual math editor" -m "- Import questions from Excel/CSV files" -m "- Download Excel template for bulk question upload" -m "- Auto-format math expressions (toggle on/off)" -m "- Preview exams before saving" -m "- View all created exams in dashboard"
echo.

echo [4/4] Pushing to GitHub...
git push
echo.

echo ========================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Code pushed to GitHub
    echo  Vercel will auto-deploy in 1-2 minutes
    echo.
    echo  NEW FEATURES DEPLOYED:
    echo  - Exam Creator with auto math formatting
    echo  - Excel/CSV import functionality
    echo  - Visual math editor integration
    echo  - Created exams display in dashboard
    echo.
    echo  TESTING STEPS:
    echo  1. Wait for Vercel deployment
    echo  2. Hard refresh: Ctrl+Shift+R
    echo  3. Login as teacher
    echo  4. Click "Tạo Đề Thi" button
    echo  5. Test manual question creation
    echo  6. Test Excel import
    echo  7. Verify math formulas render
    echo.
    echo  Check deployment: https://vercel.com/dashboard
    echo  Live site: https://code-eta-jet.vercel.app
) else (
    echo  FAILED! Check error messages above
)
echo ========================================
echo.
pause
