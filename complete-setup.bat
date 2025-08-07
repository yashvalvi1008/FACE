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
echo 📋 Step 3: Checking versions...
echo Node.js version:
node --version
echo npm version:
npm --version

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
if not exist "public" mkdir "public"
if not exist "public\models" mkdir "public\models"
if not exist "prisma" mkdir "prisma"
if not exist "scripts" mkdir "scripts"

REM Step 6: Create basic .env file if it doesn't exist
echo.
echo 📄 Step 6: Setting up environment file...
if not exist ".env" (
    echo Creating .env file...
    echo # Database URL > .env
    echo DATABASE_URL="postgresql://username:password@localhost:5432/attendance_db" >> .env
    echo. >> .env
    echo # JWT Secret >> .env
    echo JWT_SECRET="your-super-secret-jwt-key-here" >> .env
    echo. >> .env
    echo # Next.js >> .env
    echo NEXTAUTH_URL="http://localhost:3000" >> .env
    echo NEXTAUTH_SECRET="your-nextauth-secret" >> .env
    echo ✅ .env file created
) else (
    echo ℹ️ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo ⚠️ IMPORTANT NEXT STEPS:
echo 1. Download face-api.js models to public/models/ directory
echo 2. Update DATABASE_URL in .env file with your database credentials
echo 3. Update JWT_SECRET in .env file with a secure secret
echo 4. Run: npm run dev
echo.
echo 📚 Model files needed in public/models/:
echo - tiny_face_detector_model-weights_manifest.json
echo - tiny_face_detector_model-shard1
echo - face_landmark_68_model-weights_manifest.json
echo - face_landmark_68_model-shard1
echo - face_recognition_model-weights_manifest.json
echo - face_recognition_model-shard1
echo - face_recognition_model-shard2
echo.
pause
