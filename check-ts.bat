@echo off
echo ========================================
echo  CHECKING TYPESCRIPT COMPILATION
echo ========================================
echo.
node_modules\.bin\tsc --noEmit
echo.
echo ========================================
echo  DONE
echo ========================================
pause
