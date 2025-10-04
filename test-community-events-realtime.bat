@echo off
echo ========================================
echo   Community Events Real-time Test
echo ========================================

echo.
echo 1. Starting all services...
echo.

echo Starting socket server...
start "Socket Server" cmd /k "node socket-server.js"
timeout /t 5 /nobreak > nul

echo Starting backend server...
cd project_backend
start "Backend Server" cmd /k "mvn spring-boot:run"
timeout /t 15 /nobreak > nul

echo Starting frontend server...
cd ..\project
start "Frontend Server" cmd /k "npm run dev"
timeout /t 10 /nobreak > nul

echo.
echo 2. Testing Community Events Real-time Sync...
echo.
echo Open TWO browser windows:
echo   Window 1 (Admin): http://localhost:5173/admin/community-events
echo   Window 2 (User):  http://localhost:5173/events
echo.
echo 3. Test Steps:
echo    a) In Admin window: Add a new community event
echo    b) In User window: Should see the event appear automatically
echo    c) In Admin window: Delete an event
echo    d) In User window: Should see the event disappear automatically
echo.
echo 4. Expected Results:
echo    ✅ Admin creates event → User sees it instantly
echo    ✅ Admin deletes event → User sees removal instantly
echo    ✅ Socket status shows "Connected" in admin header
echo    ✅ No page refresh needed for updates
echo.
echo 5. Debug Console Messages:
echo    Admin: "📡 Event update broadcasted via socket"
echo    User:  "📅 USER - Received event update"
echo.

echo ========================================
echo Press any key to exit...
pause > nul