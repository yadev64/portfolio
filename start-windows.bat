@echo off
REM Start Portfolio — Windows
REM Double-click this file to start all services

echo.
echo 🚀 Starting Yadev Portfolio...
echo ================================
echo.

REM Start CMS backend server
echo 📡 Starting CMS Server (port 4000)...
start /B cmd /c "cd /d %~dp0local-admin\server && node index.js"

timeout /t 2 /nobreak >nul

REM Start Admin UI
echo 🛠  Starting Admin UI (port 5000)...
start /B cmd /c "cd /d %~dp0local-admin\ui && npm run dev"

REM Start Frontend
echo 🌐 Starting Frontend (port 5173)...
start /B cmd /c "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ================================
echo ✅ All services running!
echo.
echo   🌐 Portfolio:  http://localhost:5173
echo   🛠  Admin CMS:  http://localhost:5000
echo   📡 API Server: http://localhost:4000
echo.
echo Close this window to stop all services.
echo ================================

REM Open browser
start http://localhost:5173

pause
