@echo off
echo Starting Socket Server (Safe Mode)...

:: Kill any existing socket server first
call kill-socket.bat

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start the socket server
cd /d D:\project1\DBT_Application
echo Starting on port 3001...
echo Press Ctrl+C to stop
node socket-server.js