@echo off
echo Testing Simple Real-time System...
echo.

echo Starting Frontend Server...
cd project
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Simple Real-time Test Instructions:
echo ========================================
echo.
echo 1. Open http://localhost:5173 in browser
echo 2. Go to Admin Community Events (/admin/community-events)
echo 3. Create/edit/delete events
echo 4. Open another tab with Community Events (/events)
echo 5. Changes should appear within 5 seconds (polling)
echo.
echo Connection Status:
echo - Green "Live Updates": System working
echo - Shows last update timestamp
echo.
echo Press any key to stop server...
pause > nul

echo Stopping server...
taskkill /f /im node.exe 2>nul
echo Server stopped.