# PowerShell version of the setup script

Write-Host "🚀 Complete Project Setup for Windows" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Step 1: Safe cleanup
Write-Host ""
Write-Host "📦 Step 1: Cleaning existing files..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ node_modules removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️ node_modules not found (already clean)" -ForegroundColor Blue
}

if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ package-lock.json removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️ package-lock.json not found (already clean)" -ForegroundColor Blue
}

if (Test-Path "yarn.lock") {
    Write-Host "Removing yarn.lock..." -ForegroundColor Yellow
    Remove-Item -Force "yarn.lock"
    Write-Host "✅ yarn.lock removed" -ForegroundColor Green
}

# Step 2: Clear npm cache
Write-Host ""
Write-Host "🧹 Step 2: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Step 3: Check versions
Write-Host ""
Write-Host "📋 Step 3: Checking versions..." -ForegroundColor Yellow
Write-Host "Node.js version:" -ForegroundColor Cyan
node --version
Write-Host "npm version:" -ForegroundColor Cyan
npm --version

# Step 4: Install dependencies
Write-Host ""
Write-Host "📥 Step 4: Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install --no-optional --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Installation failed. Trying alternative method..." -ForegroundColor Red
    npm install --force
}

# Step 5: Create directories
Write-Host ""
Write-Host "📁 Step 5: Creating necessary directories..." -ForegroundColor Yellow

$directories = @("public", "public\models", "prisma", "scripts")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created $dir directory" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ $dir directory already exists" -ForegroundColor Blue
    }
}

# Step 6: Create .env file
Write-Host ""
Write-Host "📄 Step 6: Setting up environment file..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    $envContent = @"
# Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/attendance_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "ℹ️ .env file already exists" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️ IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Download face-api.js models to public/models/ directory" -ForegroundColor White
Write-Host "2. Update DATABASE_URL in .env file with your database credentials" -ForegroundColor White
Write-Host "3. Update JWT_SECRET in .env file with a secure secret" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Model files needed in public/models/:" -ForegroundColor Cyan
Write-Host "- tiny_face_detector_model-weights_manifest.json" -ForegroundColor Gray
Write-Host "- tiny_face_detector_model-shard1" -ForegroundColor Gray
Write-Host "- face_landmark_68_model-weights_manifest.json" -ForegroundColor Gray
Write-Host "- face_landmark_68_model-shard1" -ForegroundColor Gray
Write-Host "- face_recognition_model-weights_manifest.json" -ForegroundColor Gray
Write-Host "- face_recognition_model-shard1" -ForegroundColor Gray
Write-Host "- face_recognition_model-shard2" -ForegroundColor Gray

Read-Host "Press Enter to continue"
