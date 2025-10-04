@echo off
echo ========================================
echo   Admin Socket Connection Test
echo ========================================

echo.
echo Testing socket server connection...
echo.

echo 1. Checking if socket server is running on port 3001...
netstat -an | findstr :3001 > nul
if %errorlevel% == 0 (
    echo ✅ Socket server is running on port 3001
) else (
    echo ❌ Socket server is NOT running on port 3001
    echo.
    echo Starting socket server...
    cd /d "%~dp0"
    start "Socket Server" cmd /k "node socket-server.js"
    echo ⏳ Waiting for socket server to start...
    timeout /t 5 /nobreak > nul
)

echo.
echo 2. Testing socket connection from browser...
echo Open your browser and go to: http://localhost:5173/admin
echo.
echo 3. In the admin dashboard, look for:
echo    - Socket status indicator in the header (should show "Connected")
echo    - Socket Test Panel in the overview page
echo    - Click "Run Tests" to verify all socket functions
echo.
echo 4. Expected results:
echo    ✅ Socket Connection: Connected
echo    ✅ Connection Attempt: Successfully connected
echo    ✅ Send Test Message: Test message sent successfully
echo.

echo ========================================
echo Press any key to exit...
pause > nul