@echo off
REM Development script for SvelteKit Backend (Windows)
REM Usage: dev.bat

echo ===================================
echo Sistem Informasi Infaq ^& Jariyah
echo Development Mode
echo ===================================
echo.

REM Build and run
echo Building application...
call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting server...
echo.

node build
