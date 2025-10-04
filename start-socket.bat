@echo off
echo Starting Socket Server...
echo.
echo To stop the server, press Ctrl+C
echo.

cd /d D:\project1\DBT_Application

:: Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

:: Start the socket server
node socket-server.js