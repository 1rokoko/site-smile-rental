#!/bin/bash

# EMERGENCY: Force complete server cleanup and rebuild
echo "🚨 EMERGENCY: Force complete server cleanup and rebuild"
echo "This will completely clean and rebuild the website"

# Navigate to project directory
cd /var/www/smilerentalphuket.com/site-smile-rental

# Stop all PM2 processes
echo "⏹️ Stopping all PM2 processes..."
pm2 stop all
pm2 delete all

# Complete cleanup - remove everything that could be corrupted
echo "🧹 Complete cleanup - removing all build artifacts..."
rm -rf .next
rm -rf out
rm -rf node_modules
rm -rf .npm
rm -rf package-lock.json

# Clear all caches
echo "🧹 Clearing all caches..."
npm cache clean --force
sync
echo 3 > /proc/sys/vm/drop_caches

# Pull latest code
echo "📥 Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# Fresh install
echo "📦 Fresh install of dependencies..."
npm install

# Build in production mode
echo "🔨 Building in production mode..."
NODE_ENV=production npm run build

# Verify build
if [ ! -f ".next/BUILD_ID" ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Start in production mode
echo "🚀 Starting in production mode..."
NODE_ENV=production pm2 start npm --name "smile-rental" -- start

# Save PM2 config
pm2 save

echo "🎉 Server cleanup and rebuild complete!"
echo "Testing..."
sleep 5
curl -I http://localhost:3000

echo "✅ Done! Check https://smilerentalphuket.com"
