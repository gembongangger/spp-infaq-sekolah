@echo off
REM Quick deploy script for Railway (Windows)
REM Usage: deploy.bat

echo ===================================
echo Deploy to Railway (Windows)
echo ===================================
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if errorlevel 1 (
    echo Railway CLI not found. Installing...
    call npm install -g @railway/cli
)

REM Login
echo.
echo Logging in to Railway...
railway login

REM Link project
echo.
echo Linking to Railway project...
railway link

REM Upload database
echo.
echo Uploading database...
railway volume upload ..\data\infaq_jariyah.db --path /app/data/infaq_jariyah.db

REM Deploy
echo.
echo Deploying to Railway...
railway up

echo.
echo ===================================
echo Deployment complete!
echo ===================================
pause
