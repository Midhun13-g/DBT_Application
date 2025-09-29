@echo off
echo ========================================
echo DBT Application Setup and Start
echo ========================================

echo.
echo Installing Frontend Dependencies...
cd project
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting Frontend Server...
start "DBT Frontend" cmd /k "npm run dev"

echo.
echo Frontend started on http://localhost:5173
echo Backend should be running on http://localhost:8080
echo.
echo Login Credentials:
echo Admin: admin@dbt.gov.in / admin123
echo User: user@example.com / password
echo.
echo Press any key to exit...
pause > nul