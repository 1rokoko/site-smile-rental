#!/bin/bash

echo "🚨 SIMPLE EMERGENCY FIX - Smile Rental Phuket"
echo "=============================================="
echo "📅 Fix time: $(date)"

# Create maintenance page
mkdir -p /var/www/html
cat > /var/www/html/maintenance.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Maintenance - Smile Rental Phuket</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
        .emoji { font-size: 48px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🔧</div>
        <h1>Site Under Maintenance</h1>
        <p>We're updating our website to serve you better. Please check back in a few minutes.</p>
        <p><strong>Мы обновляем наш сайт, чтобы лучше вам служить. Пожалуйста, зайдите через несколько минут.</strong></p>
        <p><em>Expected completion: 5-10 minutes</em></p>
    </div>
</body>
</html>
EOF

echo "✅ Maintenance page created"

# Navigate to project directory
cd /var/www/smilerentalphuket.com/site-smile-rental || exit 1

# Stop all PM2 processes
echo "🛑 Stopping all applications..."
pm2 stop all || echo "No PM2 processes running"
pm2 delete all || echo "No PM2 processes to delete"

# Free memory aggressively
echo "💾 Freeing memory..."
sync
echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || echo "Cannot clear cache"

# Clean everything
echo "🧹 Deep cleaning..."
rm -rf .next
rm -rf node_modules
rm -rf /var/www/smilerentalphuket.com/package-lock.json

# Pull latest
echo "📥 Getting latest code..."
git fetch origin main
git reset --hard origin/main

# Install with minimal memory
echo "📦 Installing dependencies (minimal)..."
NODE_OPTIONS="--max-old-space-size=512" npm install --production

# Try simple build
echo "🔨 Attempting simple build..."
NODE_OPTIONS="--max-old-space-size=512" npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start application
    echo "🚀 Starting application..."
    NODE_OPTIONS="--max-old-space-size=512" pm2 start npm --name "smile-rental" -- start
    pm2 save
    
    # Wait and test
    sleep 10
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is running!"
        rm -f /var/www/html/maintenance.html
        echo "🎉 Emergency fix completed successfully!"
        echo "🌐 Website: http://smilerentalphuket.com"
    else
        echo "❌ Application failed to start"
        exit 1
    fi
else
    echo "❌ Build failed - trying development mode..."
    
    # Try development mode as fallback
    echo "🔄 Starting in development mode..."
    NODE_OPTIONS="--max-old-space-size=512" pm2 start npm --name "smile-rental-dev" -- run dev
    pm2 save
    
    sleep 10
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "⚠️ Running in development mode"
        rm -f /var/www/html/maintenance.html
        echo "🌐 Website: http://smilerentalphuket.com (dev mode)"
    else
        echo "❌ Complete failure - keeping maintenance page"
        exit 1
    fi
fi

echo "🏁 Emergency fix completed!"
