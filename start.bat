@echo off
REM Production startup script for SvelteKit Backend (Windows)
REM Usage: start.bat

echo ===================================
echo Sistem Informasi Infaq ^& Jariyah
echo SvelteKit Backend
echo ===================================
echo.

REM Check if build exists
if not exist "build" (
    echo Build not found. Running build...
    call npm run build
    if errorlevel 1 (
        echo.
        echo ERROR: Build failed!
        pause
        exit /b 1
    )
)

REM Check if database exists
if not exist "..\data\infaq_jariyah.db" (
    echo.
    echo ERROR: Database not found!
    echo Please run migration first.
    echo    cd flask_backend
    echo    python export_to_sqlite.py
    echo.
    pause
    exit /b 1
)

echo Starting production server...
echo.

REM Start the server
node build
