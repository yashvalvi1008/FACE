# Safe cleanup script that checks if files exist before removing them

Write-Host "🧹 Starting safe cleanup..." -ForegroundColor Green

# Function to safely remove items
function Safe-Remove {
    param([string]$Path, [string]$Description)
    
    if (Test-Path $Path) {
        Write-Host "Removing $Description..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $Path -ErrorAction SilentlyContinue
        if (-not (Test-Path $Path)) {
            Write-Host "✅ $Description removed successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Failed to remove $Description" -ForegroundColor Red
        }
    } else {
        Write-Host "ℹ️ $Description not found (already clean)" -ForegroundColor Blue
    }
}

# Clean up files and directories
Safe-Remove "node_modules" "node_modules directory"
Safe-Remove "package-lock.json" "package-lock.json"
Safe-Remove "yarn.lock" "yarn.lock"
Safe-Remove ".next" ".next build directory"
Safe-Remove "dist" "dist directory"

Write-Host "🎉 Cleanup completed!" -ForegroundColor Green
