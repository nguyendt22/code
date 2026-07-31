@echo off
cls
echo ========================================
echo  TU DONG TEST CODE MOI - MCQ4 FIX
echo ========================================
echo.
echo Script nay se TU DONG:
echo 1. Dung server cu
echo 2. Xoa cache Vite
echo 3. Start server moi
echo 4. Mo browser voi Console
echo.
echo Thoi gian: 10-15 giay
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Stop server
echo [1/4] Dung server cu...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo   Done!

REM Clear Vite cache only (fast)
echo [2/4] Xoa Vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo   - Deleted node_modules\.vite
) else (
    echo   - No cache found
)

REM Start server
echo [3/4] Khoi dong server moi...
start "EduMath Server" cmd /c "npm run dev"
echo   Doi 8 giay de server khoi dong...
timeout /t 8 >nul
echo   Done!

REM Open browser with Console
echo [4/4] Mo browser voi Console...
start chrome.exe "http://localhost:3000" --auto-open-devtools-for-tabs
timeout /t 2 >nul

echo.
echo ========================================
echo  XONG! Browser da mo!
echo ========================================
echo.
echo BAY GIO:
echo.
echo 1. Console da mo san (tab ben duoi)
echo.
echo 2. Login Teacher -^> Upload DOCX
echo.
echo 3. NHIN Console - TIM CAC LOGS:
echo    - "Found choice: A - ..."
echo    - "Found choice: B - ..."
echo    - "Found choice: C - ..."
echo    - "Found choice: D - ..."
echo    - "Detected 4 main choices (A/B/C/D) -^> type: mcq4"
echo    - "Q2: with 4 choices, type: mcq4"  ^<-- QUAN TRONG!
echo.
echo 4. NHIN Preview Modal:
echo    - Badge hien thi [mcq4] (khong phai short_answer)
echo    - Co dropdown de chon type
echo    - Section "Dap an:" hien ra
echo    - 4 choices A/B/C/D ro rang
echo.
echo 5. Chup 2 man hinh:
echo    - Console logs (full)
echo    - Preview Modal (expand 1 cau)
echo.
echo 6. Gui toi!
echo.
echo ========================================
echo  Server dang chay o cua so khac
echo  Ctrl+C de dung server
echo ========================================
echo.
pause
