@echo off
cls
echo ========================================
echo  FIX BUILD ERROR - CLEAR CACHE
echo ========================================
echo.
echo Dang fix loi build...
echo.

cd /d "%~dp0"

REM Stop server
echo [1/5] Dung server...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Clear Vite cache
echo [2/5] Xoa Vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo   - Deleted node_modules\.vite
)

REM Clear dist
echo [3/5] Xoa dist folder...
if exist dist (
    rmdir /s /q dist
    echo   - Deleted dist
)

REM Clear browser cache instruction
echo [4/5] Ban can clear browser cache:
echo   - Nhan Ctrl + Shift + Delete
echo   - Chon "Cached images and files"
echo   - Chon "All time"
echo   - Click "Clear data"
echo.
echo Hoac nhan Ctrl + Shift + R de hard reload
echo.

REM Reinstall dependencies
echo [5/5] Reinstall dependencies...
echo.
echo Chay lenh nay:
echo   npm install
echo.
echo Sau do:
echo   npm run dev
echo.

echo ========================================
echo  XONG! Bay gio chay:
echo  1. npm install
echo  2. npm run dev
echo  3. Ctrl + Shift + R trong browser
echo ========================================
echo.
pause
