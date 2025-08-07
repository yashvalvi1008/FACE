#!/bin/bash

# Script to fix npm installation issues

echo "🔧 Fixing npm installation issues..."

# Step 1: Clean existing installation
echo "📦 Cleaning existing installation..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Step 2: Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Step 3: Update npm to latest version
echo "⬆️ Updating npm..."
npm install -g npm@latest

# Step 4: Install dependencies with specific flags
echo "📥 Installing dependencies..."
npm install --no-optional --legacy-peer-deps

# Step 5: Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

echo "✅ Installation fixed! You can now run 'npm run dev'"
