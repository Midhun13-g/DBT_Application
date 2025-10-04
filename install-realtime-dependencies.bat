@echo off
echo Installing Real-time Dependencies...
echo.

echo Installing Frontend WebSocket Dependencies...
cd project
call npm install @stomp/stompjs@^7.0.0 sockjs-client@^1.6.1
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Frontend dependencies installed successfully!
echo.

echo Installing Backend WebSocket Dependencies...
cd ..\project_backend
call mvn dependency:resolve
if %errorlevel% neq 0 (
    echo Failed to resolve backend dependencies
    pause
    exit /b 1
)

echo.
echo Backend dependencies resolved successfully!
echo.

echo ========================================
echo Real-time System Enhancement Complete!
echo ========================================
echo.
echo New Features Added:
echo - WebSocket real-time communication
echo - Live updates for notices and events
echo - Connection status indicators
echo - Enhanced admin interfaces
echo - Automatic synchronization
echo.
echo To start the application:
echo 1. Run: start-backend.bat
echo 2. Run: start-frontend.bat
echo.
pause