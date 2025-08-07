@echo off
echo 🧹 Starting safe cleanup...

REM Function to safely remove files/directories
:safe_remove
if exist "%~1" (
    echo Removing %~2...
    if exist "%~1\*" (
        rmdir /s /q "%~1" 2>nul
    ) else (
        del /q "%~1" 2>nul
    )
    if not exist "%~1" (
        echo ✅ %~2 removed successfully
    ) else (
        echo ⚠️ Failed to remove %~2
    )
) else (
    echo ℹ️ %~2 not found (already clean)
)
goto :eof

REM Clean up files and directories
call :safe_remove "node_modules" "node_modules directory"
call :safe_remove "package-lock.json" "package-lock.json"
call :safe_remove "yarn.lock" "yarn.lock"
call :safe_remove ".next" ".next build directory"
call :safe_remove "dist" "dist directory"

echo 🎉 Cleanup completed!
