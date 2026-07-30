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
git commit -m "Fix: Word file import with proper text extraction" -m "- Created wordImporter.ts utility for .doc/.docx files" -m "- Extracts text from Word binary/XML format" -m "- Supports numbered and plain text question formats" -m "- Better error messages for unsupported formats" -m "- Updated ExamCreator to use new Word importer" -m "- Changed button label to 'Import Word/Text'"
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
    echo  - Word file import (.doc/.docx) with text extraction
    echo  - Better error messages for unsupported formats
    echo  - Support for numbered question format
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
