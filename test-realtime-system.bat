@echo off
echo ========================================
echo DBT Application Real-time System Test
echo ========================================
echo.

echo Starting backend server...
cd project_backend
start "DBT Backend" cmd /k "mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10

echo Starting frontend...
cd ../project
start "DBT Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Real-time System Test Instructions:
echo ========================================
echo.
echo 1. Wait for both servers to start
echo 2. Open http://localhost:5173 in TWO browser windows
echo 3. In first window: Login as admin@dbt.gov.in / admin123
echo 4. In second window: Login as a regular user (signup first)
echo 5. In admin window: Go to Admin Dashboard -> Notice Board
echo 6. Add a new notice and watch it appear in user window INSTANTLY
echo 7. Check the real-time connection status indicators
echo.
echo Features to test:
echo - Real-time notice updates
echo - Connection status indicators  
echo - Browser notifications
echo - User activity tracking
echo - Login/signup validation
echo.
echo Press any key to continue...
pause > nul