#!/bin/bash
# Force start script for smile-rental

echo "🔧 FORCE START: Smile Rental Application"
echo "========================================"

# Navigate to project directory
cd /var/www/smilerentalphuket.com/site-smile-rental

echo "📍 Current directory: $(pwd)"

# Kill any existing processes
echo "🛑 Stopping all PM2 processes..."
pm2 delete all || echo "No PM2 processes to stop"

echo "🛑 Killing any remaining Node processes..."
pkill -f node || echo "No Node processes to kill"

# Check if port 3000 is free
echo "🔍 Checking port 3000..."
if netstat -tlnp | grep :3000; then
    echo "⚠️ Port 3000 is occupied, killing process..."
    fuser -k 3000/tcp || echo "Could not kill process on port 3000"
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Start with PM2
echo "🚀 Starting with PM2..."
pm2 start ecosystem.config.js

# Check status
echo "📊 PM2 Status:"
pm2 status

echo "🔍 Checking port 3000..."
netstat -tlnp | grep :3000

echo "🧪 Testing localhost..."
curl -I http://localhost:3000

echo "✅ Force start completed!"
