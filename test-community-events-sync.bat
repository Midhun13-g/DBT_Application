@echo off
echo Testing Community Events Sync...
echo.

echo Starting Frontend Server...
cd project
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Community Events Sync Test:
echo ========================================
echo.
echo 1. Open http://localhost:5173/admin/community-events
echo 2. Create a new community event (e.g., "Digital Literacy Workshop")
echo 3. Open http://localhost:5173/events in another tab
echo 4. The event should appear within 5 seconds
echo.
echo What to check:
echo - Admin creates event → User sees it immediately
echo - Only community events show (not notices)
echo - Event details match (title, description, venue, etc.)
echo - Status shows "Live Updates" in green
echo.
echo Press any key to stop server...
pause > nul

echo Stopping server...
taskkill /f /im node.exe 2>nul
echo Server stopped.