@echo off
echo ========================================
echo   Login & Signup Test Script
echo ========================================

echo.
echo 1. Starting all services...
echo.

echo Starting backend server...
cd project_backend
start "Backend Server" cmd /k "mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

echo Starting frontend server...
cd ..\project
start "Frontend Server" cmd /k "npm run dev"

echo Waiting for frontend to start...
timeout /t 10 /nobreak > nul

echo.
echo 2. Testing Login & Signup...
echo.
echo Open your browser and go to: http://localhost:5173
echo.
echo 3. Test Login with Demo Credentials:
echo    Admin: admin@dbt.gov.in / admin123
echo    User:  user@example.com / password
echo.
echo 4. Test Signup:
echo    - Go to /signup
echo    - Fill in all required fields
echo    - Password must be at least 8 characters
echo    - Should auto-login after successful signup
echo.
echo 5. Expected Results:
echo    ✅ Login redirects admin to /admin dashboard
echo    ✅ Login redirects user to / homepage
echo    ✅ Signup creates new user and auto-logs in
echo    ✅ Socket connection initializes after login
echo.

echo ========================================
echo Press any key to exit...
pause > nul