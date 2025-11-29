@echo off
echo ========================================
echo Prathinityam News Portal - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js version:
node -v
echo npm version:
npm -v
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed
echo.

REM Seed admin account
echo Creating admin account...
call npm run seed-admin
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed
echo.

REM Success message
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Default Admin Credentials:
echo    Email: admin@prathinityam.com
echo    Password: Admin@123
echo.
echo To start the application:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.
echo Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo For more information, see README.md
echo.
echo Happy coding!
echo.

pause
