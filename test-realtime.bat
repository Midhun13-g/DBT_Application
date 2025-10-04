@echo off
echo Testing Real-time Content Sync System
echo.

echo 1. Starting Socket Server...
start "Socket Server" cmd /k "cd /d D:\project1\DBT_Application && node socket-server.js"

timeout /t 3 /nobreak >nul

echo 2. Starting Backend Server...
start "Backend Server" cmd /k "cd /d D:\project1\DBT_Application\project_backend && mvnw spring-boot:run"

timeout /t 5 /nobreak >nul

echo 3. Starting Frontend...
start "Frontend" cmd /k "cd /d D:\project1\DBT_Application\project && npm run dev"

echo.
echo ✅ All servers started!
echo.
echo 📋 Test Instructions:
echo 1. Open http://localhost:5173 in two browser windows
echo 2. Login as admin in first window: admin@dbt.gov.in / admin123
echo 3. Go to Admin Dashboard > Awareness Management
echo 4. In second window, go to Awareness Center (as user)
echo 5. Add content in admin window
echo 6. Check if it appears in user window immediately
echo.
echo 🔍 Check browser console for real-time update logs
echo.
pause