@echo off
echo 🚀 Complete Project Setup for Windows
echo ====================================

REM Step 1: Safe cleanup
echo.
echo 📦 Step 1: Cleaning existing files...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
    echo ✅ node_modules removed
) else (
    echo ℹ️ node_modules not found (already clean)
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
    echo ✅ package-lock.json removed
) else (
    echo ℹ️ package-lock.json not found (already clean)
)

if exist yarn.lock (
    echo Removing yarn.lock...
    del yarn.lock
    echo ✅ yarn.lock removed
) else (
    echo ℹ️ yarn.lock not found
)

REM Step 2: Clear npm cache
echo.
echo 🧹 Step 2: Clearing npm cache...
npm cache clean --force

REM Step 3: Check npm version
echo.
echo 📋 Step 3: Checking npm version...
npm --version
node --version

REM Step 4: Install dependencies
echo.
echo 📥 Step 4: Installing dependencies...
echo This may take a few minutes...
npm install --no-optional --legacy-peer-deps

REM Check if installation was successful
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Installation failed. Trying alternative method...
    npm install --force
)

REM Step 5: Create necessary directories
echo.
echo 📁 Step 5: Creating necessary directories...
if not exist "public\models" mkdir "public\models"
if not exist "prisma" mkdir "prisma"

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Download face-api.js models to public/models/
echo 2. Set up your database connection in .env
echo 3. Run: npm run dev
echo.
pause
