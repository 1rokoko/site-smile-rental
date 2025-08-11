#!/bin/bash

echo "🚨 EMERGENCY RESTORE: Fixing 502 Bad Gateway"
echo "================================================"

# 1. Check current PM2 status
echo "1️⃣ Checking PM2 status..."
pm2 list

# 2. Stop and delete all PM2 processes
echo "2️⃣ Cleaning PM2 processes..."
pm2 delete all || echo "No processes to delete"

# 3. Navigate to project directory
echo "3️⃣ Navigating to project..."
cd /var/www/smilerentalphuket.com/site-smile-rental

# 4. Start PM2 dev server
echo "4️⃣ Starting PM2 dev server..."
pm2 start npm --name smile-rental-dev -- run dev

# 5. Save PM2 configuration
echo "5️⃣ Saving PM2 configuration..."
pm2 save

# 6. Wait for startup
echo "6️⃣ Waiting 10 seconds for startup..."
sleep 10

# 7. Check PM2 status
echo "7️⃣ Checking PM2 status..."
pm2 list

# 8. Test local access
echo "8️⃣ Testing local access..."
curl -I http://localhost:3000

# 9. Check nginx configuration
echo "9️⃣ Checking nginx configuration..."
nginx -t

# 10. Restart nginx
echo "🔟 Restarting nginx..."
systemctl restart nginx

# 11. Final test
echo "✅ Final test..."
curl -I https://smilerentalphuket.com

echo "🎉 Emergency restore completed!"
