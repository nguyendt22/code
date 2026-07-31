@echo off
cls
echo ========================================
echo  EDUMATH AI - DEV SERVER
echo ========================================
echo.
echo Khoi dong server tai http://localhost:3000
echo.
echo Nhan Ctrl+C de dung server
echo.
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

pause
