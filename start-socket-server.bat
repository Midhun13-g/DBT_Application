@echo off
echo Starting Socket.IO Server for DBT Application...
echo.
echo Make sure you have installed dependencies:
echo npm install
echo.
cd /d "%~dp0"
node socket-server.js
pause