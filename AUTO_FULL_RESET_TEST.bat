@echo off
cls
echo ========================================
echo  FULL RESET VA TEST - XOA TAT CA CACHE
echo ========================================
echo.
echo Script nay se TU DONG:
echo 1. Dong tat ca Chrome/Edge
echo 2. Dung server
echo 3. Xoa Vite cache
echo 4. Xoa browser cache (tu dong)
echo 5. Start server moi
echo 6. Mo browser SACH voi Console
echo.
echo Thoi gian: 20 giay
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Close all browsers
echo [1/6] Dong tat ca browser...
taskkill /F /IM chrome.exe >nul 2>&1
taskkill /F /IM msedge.exe >nul 2>&1
timeout /t 2 >nul
echo   Done!

REM Stop server
echo [2/6] Dung server...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo   Done!

REM Clear Vite cache
echo [3/6] Xoa Vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo   - Deleted node_modules\.vite
)
if exist dist (
    rmdir /s /q dist
    echo   - Deleted dist
)
echo   Done!

REM Clear Chrome cache data
echo [4/6] Xoa Chrome cache (localStorage, cookies)...
set CHROME_USER_DATA=%LOCALAPPDATA%\Google\Chrome\User Data
if exist "%CHROME_USER_DATA%\Default\Cache" (
    rmdir /s /q "%CHROME_USER_DATA%\Default\Cache" >nul 2>&1
    echo   - Deleted Chrome cache
)
if exist "%CHROME_USER_DATA%\Default\Code Cache" (
    rmdir /s /q "%CHROME_USER_DATA%\Default\Code Cache" >nul 2>&1
    echo   - Deleted Chrome code cache
)
echo   Done!

REM Start server
echo [5/6] Khoi dong server moi...
start "EduMath Server" cmd /c "npm run dev"
echo   Doi 10 giay de server on dinh...
timeout /t 10 >nul
echo   Done!

REM Open browser with clean profile
echo [6/6] Mo Chrome voi profile SACH...
start chrome.exe "http://localhost:3000" --auto-open-devtools-for-tabs --incognito
timeout /t 2 >nul

echo.
echo ========================================
echo  XONG! Chrome INCOGNITO da mo!
echo ========================================
echo.
echo CHU Y: Chrome mo trong che do INCOGNITO (khong co cache cu)!
echo.
echo BAY GIO:
echo.
echo 1. Console da mo san
echo.
echo 2. Login Teacher -^> Upload DOCX
echo.
echo 3. SCROLL Console LEN TREN - TIM:
echo    =====================================
echo    Tim chuoi: "Found choice:"
echo      - Co thay khong?
echo      - Neu CO: Chup man hinh
echo      - Neu KHONG: Code chua load!
echo.
echo    Tim chuoi: "Detected"
echo      - Co thay "Detected X main choices" khong?
echo.
echo    Tim chuoi: "mcq4"
echo      - Co thay khong?
echo      - Neu KHONG: Code chua chay!
echo    =====================================
echo.
echo 4. Expand 1 cau trong Preview:
echo    - Co section "Dap an:" khong?
echo    - Co choices A/B/C/D khong?
echo    - Dropdown type hien gi?
echo.
echo 5. Chup 2 man hinh:
echo    - Console (FULL, tu dau den cuoi)
echo    - Preview Modal (expand 1 cau)
echo.
echo 6. GUI TOI CA 2 ANH!
echo.
echo ========================================
echo  Neu van khong thay logs "Found choice:"
echo  ^=^> Code MOI chua duoc build!
echo  ^=^> Can rebuild lai toan bo!
echo ========================================
echo.
pause
