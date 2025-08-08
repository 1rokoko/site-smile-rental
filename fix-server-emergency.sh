#!/bin/bash

echo "🚨 EMERGENCY SERVER FIX - Smile Rental Phuket"
echo "=============================================="
echo "📅 Fix time: $(date)"

# Enable maintenance mode first
echo "🟡 Enabling maintenance mode..."
cp /var/www/smilerentalphuket.com/site-smile-rental/public/maintenance.html /var/www/html/maintenance.html 2>/dev/null || echo "Maintenance file not found"

# Navigate to correct directory
echo "📁 Navigating to project directory..."
cd /var/www/smilerentalphuket.com/site-smile-rental || exit 1
pwd

# Stop and clean PM2
echo "🛑 Stopping and cleaning PM2..."
pm2 stop smile-rental || echo "App was not running"
pm2 delete smile-rental || echo "App was not in PM2"
pm2 kill || echo "PM2 was not running"

# Clean build artifacts completely
echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf node_modules/.next

# Pull latest changes
echo "📥 Pulling latest changes..."
git fetch origin main
git reset --hard origin/main

# Ensure all required files exist
echo "📁 Verifying required files..."
mkdir -p src/components/analytics

# Verify Analytics component exists
if [ ! -f "src/components/analytics/Analytics.tsx" ]; then
    echo "❌ Analytics.tsx missing, creating..."
    cat > src/components/analytics/Analytics.tsx << 'EOF'
'use client';

import Script from 'next/script';

export const Analytics = () => {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XQYEJ26C2J"
        strategy="afterInteractive"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XQYEJ26C2J');
        `}
      </Script>
    </>
  );
};
EOF
fi

# Verify index.ts exists
if [ ! -f "src/components/analytics/index.ts" ]; then
    echo "export { Analytics } from './Analytics';" > src/components/analytics/index.ts
fi

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"

    # Verify build
    if [ ! -f ".next/BUILD_ID" ]; then
        echo "❌ Build verification failed - no BUILD_ID found"
        exit 1
    fi
    echo "✅ Build verification successful"

    # Start the application on port 3000
    echo "🚀 Starting application on port 3000..."
    pm2 start npm --name "smile-rental" -- start
    pm2 save

    echo "✅ Application started successfully!"
    echo ""
    echo "🌐 Testing application..."
    sleep 10

    # Test application multiple times
    for i in {1..5}; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Application is responding on localhost:3000 (attempt $i)"
            break
        else
            echo "⏳ Attempt $i/5: Application not ready yet, waiting..."
            sleep 5
        fi
        if [ $i -eq 5 ]; then
            echo "❌ Application failed to start after 5 attempts"
            echo "📋 PM2 Status:"
            pm2 status
            echo "📋 PM2 Logs:"
            pm2 logs smile-rental --lines 10
            exit 1
        fi
    done

    # Disable maintenance mode
    echo "🟢 Disabling maintenance mode..."
    rm -f /var/www/html/maintenance.html

    echo "✅ Website should be working now: http://smilerentalphuket.com"
else
    echo "❌ Build failed!"
    echo "📋 Build error details:"
    npm run build 2>&1 | tail -20
    exit 1
fi

echo ""
echo "🏁 Emergency fix completed successfully!"
echo "=============================================="
