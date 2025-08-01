@echo off
echo 🚀 Setting up AI Collaboration Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit .env file and add your API keys before starting the application.
)

echo.
echo ✅ Installation complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file and add your API keys
echo 2. Run 'npm run dev' to start the application
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🔑 Required API keys:
echo    - OPENAI_API_KEY (for OpenAI models)
echo    - GOOGLE_API_KEY (for Google models)
echo    - ANTHROPIC_API_KEY (for Anthropic models)
echo    - XAI_API_KEY (for xAI models)
echo.
echo 💡 You only need the API keys for the providers you plan to use.
pause 