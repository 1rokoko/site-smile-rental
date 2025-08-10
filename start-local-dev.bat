@echo off
echo 🚀 Starting Smile Rental Local Development Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not available
    pause
    exit /b 1
)

echo ✅ npm is available
npm --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🌐 Starting development server on http://localhost:3000
echo 📝 The website will automatically open in your browser
echo 🔄 Hot reload is enabled - changes will be reflected automatically
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev

pause
