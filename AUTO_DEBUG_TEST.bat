@echo off
cls
echo ========================================
echo  AUTO DEBUG TEST - EDUMATH AI
echo ========================================
echo.
echo Dang tu dong:
echo 1. Restart server
echo 2. Mo browser voi Console
echo 3. Chi dan upload DOCX
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Kill existing node processes
echo [1/4] Dung server cu...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Start server in background
echo [2/4] Khoi dong server moi...
start "EduMath Server" cmd /c "npm run dev"
echo Doi 5 giay de server khoi dong...
timeout /t 5 >nul

REM Open browser with dev tools
echo [3/4] Mo browser...
start chrome.exe "http://localhost:3000" --auto-open-devtools-for-tabs

echo.
echo ========================================
echo  XONG! Browser da mo voi Console
echo ========================================
echo.
echo HUONG DAN:
echo.
echo 1. Trong browser, tab Console da mo san
echo 2. Login as Teacher
echo 3. Click "Tao De Thi" -^> Tab "Cau Hoi"
echo 4. Click "Upload DOCX"
echo 5. Chon file DOCX
echo 6. NHIN VAO Console - co nhieu logs!
echo.
echo CAC LOGS CAN TIM:
echo   - Found X images in paragraph
echo   - Image 1: src length = ...
echo   - Found X OMML equations
echo   - Equation 1: LaTeX = ...
echo   - Found choice: A - "..."
echo   - Found SECOND choice on same line: B
echo   - Detected X questions
echo.
echo 7. Chup man hinh Console
echo 8. Copy text logs (Right-click -^> Select All -^> Copy)
echo 9. Gui cho toi!
echo.
echo ========================================
echo  Server dang chay o cua so khac!
echo  Nhan Ctrl+C o cua so do de dung.
echo ========================================
echo.
pause
