@echo off
echo ========================================
echo   Admin Redirect Debug & Fix
echo ========================================

echo.
echo 1. Starting backend server...
cd project_backend
start "Backend Server" cmd /k "mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

echo.
echo 2. Starting frontend server...
cd ..\project
start "Frontend Server" cmd /k "npm run dev"

echo Waiting for frontend to start...
timeout /t 10 /nobreak > nul

echo.
echo 3. Testing Admin Login...
echo.
echo Open browser and go to: http://localhost:5173/login
echo.
echo 4. Debug Steps:
echo    a) Open browser console (F12)
echo    b) Try admin login: admin@dbt.gov.in / admin123
echo    c) Check console for debug messages
echo    d) Or run debug script in console
echo.
echo 5. Manual Debug (paste in console):
echo    fetch('/api/auth/login', {
echo      method: 'POST',
echo      headers: {'Content-Type': 'application/json'},
echo      body: JSON.stringify({email: 'admin@dbt.gov.in', password: 'admin123'})
echo    }).then(r => r.json()).then(console.log)
echo.
echo 6. Expected Results:
echo    ✅ User role: "ADMIN"
echo    ✅ Redirect to: "/admin"
echo    ✅ Should navigate to admin dashboard
echo.

echo ========================================
echo Press any key to exit...
pause > nul