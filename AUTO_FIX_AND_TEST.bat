@echo off
cls
echo ========================================
echo  TU DONG FIX BUILD ERROR VA TEST
echo ========================================
echo.
echo Script nay se TU DONG:
echo 1. Dung server cu
echo 2. Xoa cache (Vite, dist)
echo 3. Reinstall dependencies
echo 4. Start server moi
echo 5. Mo browser voi Console
echo.
echo Thoi gian: 2-3 phut
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Stop server
echo [1/6] Dung server cu...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo   Done!

REM Clear Vite cache
echo [2/6] Xoa Vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo   - Deleted node_modules\.vite
) else (
    echo   - No cache found
)

REM Clear dist
echo [3/6] Xoa dist folder...
if exist dist (
    rmdir /s /q dist
    echo   - Deleted dist
) else (
    echo   - No dist found
)

REM Reinstall dependencies
echo [4/6] Reinstall dependencies (2-3 phut)...
echo   Running: npm install
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo  LOI: npm install FAILED!
    echo ========================================
    echo.
    pause
    exit /b 1
)
echo   Done!

REM Start server
echo [5/6] Khoi dong server...
start "EduMath Server" cmd /c "npm run dev"
echo   Doi 8 giay de server on dinh...
timeout /t 8 >nul
echo   Done!

REM Open browser with Console
echo [6/6] Mo browser voi Console...
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
echo 2. KIEM TRA: Co con loi do khong?
echo    - Neu KHONG: Tiep tuc buoc 3
echo    - Neu CO: Chup man hinh gui toi!
echo.
echo 3. Login as Teacher
echo 4. "Tao De Thi" -^> "Upload DOCX"
echo 5. Chon file DOCX
echo 6. NHIN Console - phai thay logs:
echo      - Step 1: Extracting...
echo      - Found X images...
echo      - Found X equations...
echo      - Found choice: A...
echo.
echo 7. Chup man hinh Console (FULL)
echo 8. Copy logs (Right-click -^> Select All -^> Copy)
echo 9. Gui toi!
echo.
echo ========================================
echo  Server dang chay o cua so khac
echo  Ctrl+C de dung server
echo ========================================
echo.
pause
