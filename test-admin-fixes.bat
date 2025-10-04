@echo off
echo Testing Admin Fixes...
echo.

echo Starting Frontend Server...
cd project
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Admin Fixes Test Instructions:
echo ========================================
echo.
echo 1. COMMUNITY EVENTS TEST:
echo    - Go to /admin/community-events
echo    - Create a new event
echo    - Event should appear in admin list within 2 seconds
echo    - Go to /events to see it in user view
echo.
echo 2. AWARENESS CONTENT TEST:
echo    - Go to /admin/awareness  
echo    - Create awareness content
echo    - Go to /awareness-center to see user view
echo    - Content should appear within 5 seconds
echo.
echo What to verify:
echo - Admin community events show added events immediately
echo - User awareness center shows admin-created content
echo - Real-time sync working (green "Live Updates")
echo - All CRUD operations functional
echo.
echo Press any key to stop server...
pause > nul

echo Stopping server...
taskkill /f /im node.exe 2>nul
echo Server stopped.