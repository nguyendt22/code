@echo off
REM Install Dependencies Script
REM Run this BEFORE testing DOCX import

echo ========================================
echo  INSTALL DEPENDENCIES
echo ========================================
echo.

cd /d "C:\Users\LENOVO\Downloads\edumath-ai---nền-tảng-ôn-tập-toán-thcs"

echo Installing mammoth and jszip...
echo This will take 1-2 minutes...
echo.

call npm install

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Dependencies installed.
    echo.
    echo  Installed packages:
    echo  - mammoth@1.8.0 (DOCX parser)
    echo  - jszip@3.10.1 (ZIP extractor)
    echo.
    echo  You can now test DOCX import!
    echo.
    echo  NEXT STEPS:
    echo  1. Run: npm run dev
    echo  2. Open: http://localhost:5000
    echo  3. Login as teacher
    echo  4. Click "Tạo Đề Thi"
    echo  5. Upload a DOCX file
    echo.
) else (
    echo  FAILED! Check error messages above
    echo.
    echo  If PowerShell execution policy error:
    echo  1. Open PowerShell as Administrator
    echo  2. Run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo  3. Try again
)
echo ========================================
echo.
pause
