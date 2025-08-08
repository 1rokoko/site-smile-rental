#!/bin/bash

echo "🚨 EMERGENCY SERVER FIX - Smile Rental Phuket"
echo "=============================================="

# Stop the broken application
echo "🛑 Stopping broken application..."
pm2 stop smile-rental || echo "App was not running"

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
cd /var/www/smilerentalphuket.com/site-smile-rental
rm -rf .next
rm -rf node_modules/.cache

# Ensure all required files exist
echo "📁 Creating missing files..."
mkdir -p src/components/analytics

# Create Analytics.tsx if missing
if [ ! -f "src/components/analytics/Analytics.tsx" ]; then
    cat > src/components/analytics/Analytics.tsx << 'EOF'
'use client';

import Script from 'next/script';

export const Analytics = () => {
  return (
    <>
      {/* Google Analytics - Clean implementation */}
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

# Create index.ts if missing
if [ ! -f "src/components/analytics/index.ts" ]; then
    echo "export { Analytics } from './Analytics';" > src/components/analytics/index.ts
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start the application
    echo "🚀 Starting application..."
    pm2 start npm --name "smile-rental" -- start
    pm2 save
    
    echo "✅ Application started successfully!"
    echo ""
    echo "🌐 Testing application..."
    sleep 5
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is responding on localhost:3000"
        echo "✅ Website should be working now: http://smilerentalphuket.com"
    else
        echo "❌ Application is not responding"
        echo "📋 Checking PM2 status..."
        pm2 status
        echo "📋 Checking logs..."
        pm2 logs smile-rental --lines 5
    fi
else
    echo "❌ Build failed!"
    echo "📋 Checking for errors..."
    npm run build 2>&1 | tail -20
fi

echo ""
echo "🏁 Emergency fix completed!"
echo "=============================================="
