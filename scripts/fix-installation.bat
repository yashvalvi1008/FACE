@echo off
echo 🔧 Fixing npm installation issues...

REM Step 1: Clean existing installation
echo 📦 Cleaning existing installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

REM Step 2: Clear npm cache
echo 🧹 Clearing npm cache...
npm cache clean --force

REM Step 3: Update npm to latest version
echo ⬆️ Updating npm...
npm install -g npm@latest

REM Step 4: Install dependencies with specific flags
echo 📥 Installing dependencies...
npm install --no-optional --legacy-peer-deps

REM Step 5: Generate Prisma client
echo 🗄️ Generating Prisma client...
npx prisma generate

echo ✅ Installation fixed! You can now run 'npm run dev'
pause
