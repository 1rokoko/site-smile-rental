#!/bin/bash

# Emergency script to clear maintenance mode and restart the application
# This script should be run on the VPS server

echo "🚨 EMERGENCY: Clearing maintenance mode and restarting application..."
echo "📅 Time: $(date)"

# Remove maintenance page
echo "🟢 Removing maintenance page..."
rm -f /var/www/html/maintenance.html
rm -f /var/www/smilerentalphuket.com/maintenance.html

# Reload nginx to clear any maintenance redirects
echo "🔄 Reloading Nginx..."
nginx -t && systemctl reload nginx

# Navigate to project directory
cd /var/www/smilerentalphuket.com/site-smile-rental

# Check if application is running
echo "📊 Checking application status..."
pm2 status smile-rental

# If app is not running, start it
if ! pm2 list | grep -q "smile-rental.*online"; then
    echo "🚀 Starting application..."
    pm2 start npm --name "smile-rental" -- start
    pm2 save
    sleep 10
fi

# Health check
echo "🧪 Running health check..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Application is responding on localhost:3000"
else
    echo "❌ Application is not responding, checking logs..."
    pm2 logs smile-rental --lines 20
fi

# Check domain accessibility
if curl -f -s http://smilerentalphuket.com > /dev/null; then
    echo "✅ Domain smilerentalphuket.com is accessible"
else
    echo "⚠️ Domain may have issues"
fi

echo "🎉 Emergency maintenance clearing completed!"
echo "🌐 Please check: http://smilerentalphuket.com"
