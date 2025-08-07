# Windows Setup Instructions

## The Problem
You're getting a "command not found" error because the batch file doesn't exist in your current directory.

## Solutions

### Option 1: Create and Run Batch File
1. **Create the batch file:**
   - Copy the content from `complete-setup.bat` above
   - Save it as `complete-setup.bat` in your project root directory
   - Make sure you're in the correct project directory

2. **Run the batch file:**
   \`\`\`cmd
   # In Command Prompt
   complete-setup.bat
   
   # Or in PowerShell
   .\complete-setup.bat
   \`\`\`

### Option 2: Use PowerShell Script
1. **Create the PowerShell script:**
   - Copy the content from `setup.ps1` above
   - Save it as `setup.ps1` in your project root

2. **Run the PowerShell script:**
   ```powershell
   # You may need to allow script execution first
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   
   # Then run the script
   .\setup.ps1
   \`\`\`

### Option 3: Manual Commands
If you prefer to run commands manually:

\`\`\`cmd
# Clean up (if files exist)
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

# Clear cache
npm cache clean --force

# Install dependencies
npm install --no-optional --legacy-peer-deps

# Create directories
mkdir public\models 2>nul
mkdir prisma 2>nul
\`\`\`

## Current Directory Check
Make sure you're in the right directory:
\`\`\`cmd
# Check current directory
cd

# List files to verify you're in the project root
dir

# You should see files like package.json, etc.
\`\`\`

## After Setup
Once the setup completes successfully:

1. **Download face-api.js models** to `public/models/`
2. **Update .env file** with your database credentials
3. **Run the development server:**
   \`\`\`cmd
   npm run dev
   \`\`\`

## Troubleshooting
- If you get permission errors, run Command Prompt as Administrator
- If npm install fails, try: `npm install --force`
- Make sure Node.js and npm are installed and up to date
