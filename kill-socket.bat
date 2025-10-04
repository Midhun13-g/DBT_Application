@echo off
echo Stopping Socket Server...

:: Kill all node processes running socket-server.js
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo Socket server stopped successfully
) else (
    echo No socket server process found
)

:: Also kill by port if needed
netstat -ano | findstr :3001 > temp.txt
for /f "tokens=5" %%a in (temp.txt) do (
    taskkill /f /pid %%a 2>nul
)
del temp.txt 2>nul

echo Done.
pause