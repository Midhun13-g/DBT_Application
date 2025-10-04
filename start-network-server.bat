@echo off
echo ========================================
echo   DBT Application - Network Server
echo ========================================

echo.
echo Getting your local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set LOCAL_IP=%%b
        goto :found
    )
)
:found

echo Your local IP address is: %LOCAL_IP%
echo.
echo Frontend will be available at:
echo   - http://localhost:5173 (same computer)
echo   - http://%LOCAL_IP%:5173 (other devices on network)
echo.
echo Backend API will be available at:
echo   - http://localhost:8080/api (same computer)
echo   - http://%LOCAL_IP%:8080/api (other devices on network)
echo.

echo Starting backend server...
cd project_backend
start "Backend Server" cmd /k "mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting frontend server...
cd ..\project
start "Frontend Server" cmd /k "npm run dev -- --host 0.0.0.0"

echo.
echo ========================================
echo Both servers are starting...
echo Wait a moment and then access the application
echo from any browser on your network!
echo ========================================
echo.
echo Press any key to exit...
pause > nul