@echo off
REM Setup script for Email + SMS Follow-up Automation System (Windows)

echo.
echo 🚀 Setting up Click2Website - Email + SMS Automation System
echo ===========================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Create .env files
echo 📝 Setting up environment variables...

if not exist "server\.env" (
    echo Creating server\.env...
    copy server\.env.example server\.env
    echo ⚠️  Please fill in your credentials in server\.env
) else (
    echo ✅ server\.env already exists
)

if not exist "client\.env.local" (
    echo Creating client\.env.local...
    (
        echo VITE_API_URL=http://localhost:5000
    ) > client\.env.local
    echo ✅ Created client\.env.local
) else (
    echo ✅ client\.env.local already exists
)

echo.
echo 📦 Installing dependencies...

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..
echo ✅ Server dependencies installed

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
cd ..
echo ✅ Client dependencies installed

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit server\.env with your credentials:
echo    - MongoDB URI
echo    - Gmail credentials
echo    - Twilio credentials
echo.
echo 2. Start development:
echo    Terminal 1: npm run server:dev
echo    Terminal 2: npm run client:dev
echo.
echo 3. Or run both together:
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
pause
