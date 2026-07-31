@echo off
REM Auto Push Script - EduMath AI Comprehensive Exam Import System
REM Double-click this file to push changes to GitHub

echo ========================================
echo  AUTO PUSH - EXAM IMPORT SYSTEM REBUILD
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
git commit -m "MAJOR: Rebuild comprehensive exam import system" -m "Complete rebuild of DOCX import pipeline:" -m "" -m "ROOT CAUSE FIXED:" -m "- Old code read DOCX binary as UTF-8 text -> PK! garbage" -m "- No structured content support (text/math/image)" -m "- No OMML equation extraction" -m "- No question structure detection" -m "" -m "NEW ARCHITECTURE:" -m "- DocumentParser: Main orchestrator with validation" -m "- DocxParser: Proper DOCX unzip using mammoth.js + jszip" -m "- OMMLConverter: Office Math XML -> LaTeX (fractions, radicals, etc.)" -m "- QuestionDetector: Auto-detect question numbers, types, choices" -m "- ExamImportPreview: Review UI with validation" -m "" -m "NEW FEATURES:" -m "- ContentBlock system (text/math/image/table)" -m "- OMML equation extraction and LaTeX conversion" -m "- Auto-detect: Câu 1, Question 1, sections, A/B/C/D choices" -m "- Question type classification (MCQ/TrueFalse/ShortAnswer)" -m "- Parse validation with warnings/errors" -m "- Preview modal with expandable questions" -m "- Math rendering with KaTeX" -m "- Image extraction from DOCX" -m "" -m "FILES CREATED:" -m "- src/types/exam.ts (ContentBlock, EnhancedQuestion, ParsedExamDocument)" -m "- src/services/DocumentParser.ts" -m "- src/services/DocxParser.ts" -m "- src/services/OMMLConverter.ts" -m "- src/services/QuestionDetector.ts" -m "- src/components/teacher/ExamImportPreview.tsx" -m "- EXAM_IMPORT_DOCS.md (comprehensive documentation)" -m "" -m "DEPENDENCIES:" -m "- mammoth@1.8.0: DOCX to HTML" -m "- jszip@3.10.1: Unzip DOCX files" -m "" -m "NEXT STEPS:" -m "- npm install (or yarn install)" -m "- Test with real DOCX files" -m "- Verify no more PK! errors" -m "- Verify math equations render properly"
echo.

echo [4/4] Pushing to GitHub...
git push
echo.

echo ========================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Code pushed to GitHub
    echo  Vercel will auto-deploy in 1-2 minutes
    echo.
    echo  MAJOR REBUILD DEPLOYED:
    echo  - Comprehensive DOCX parser with mammoth.js
    echo  - OMML equation extraction and LaTeX conversion
    echo  - Intelligent question structure detection
    echo  - Validation and preview system
    echo  - No more PK! binary garbage errors
    echo.
    echo  BEFORE TESTING:
    echo  1. Wait for Vercel deployment
    echo  2. SSH into server or local: npm install
    echo  3. This will install mammoth and jszip
    echo.
    echo  TESTING STEPS:
    echo  1. Hard refresh: Ctrl+Shift+R
    echo  2. Login as teacher
    echo  3. Click "Tạo Đề Thi"
    echo  4. Click "Upload DOCX" button
    echo  5. Select a DOCX file with math equations
    echo  6. Verify preview shows questions properly
    echo  7. Check math equations render (not raw text)
    echo  8. Click "Chấp Nhận & Import"
    echo.
    echo  Check deployment: https://vercel.com/dashboard
    echo  Live site: https://code-eta-jet.vercel.app
) else (
    echo  FAILED! Check error messages above
)
echo ========================================
echo.
pause
