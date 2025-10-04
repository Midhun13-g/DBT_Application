@echo off
echo ========================================
echo DBT Application Real-time System Startup
echo ========================================
echo.

echo Installing Socket.IO server dependencies...
cd /d "d:\project1\DBT_Application"
call npm install

echo.
echo Starting Socket.IO server on port 3001...
start "Socket.IO Server" cmd /k "npm start"

echo.
echo Starting Spring Boot backend on port 8080...
cd project_backend
start "Spring Boot Backend" cmd /k "mvn spring-boot:run"

echo.
echo Waiting for servers to start...
timeout /t 10

echo.
echo Starting React frontend on port 5173...
cd ../project
start "React Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Real-time System Started Successfully!
echo ========================================
echo.
echo Services running:
echo - Socket.IO Server: http://localhost:3001
echo - Spring Boot Backend: http://localhost:8080  
echo - React Frontend: http://localhost:5173
echo.
echo Test the real-time functionality:
echo 1. Open http://localhost:5173 in TWO browser windows
echo 2. Login as admin in first window: admin@dbt.gov.in / admin123
echo 3. Login as user in second window (signup first)
echo 4. In admin window: Add a notice
echo 5. Watch it appear INSTANTLY in user window!
echo.
echo Press any key to continue...
pause > nul