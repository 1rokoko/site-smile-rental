@echo off
echo 🔧 EMERGENCY FIX: Resolving 502 Bad Gateway error

echo Connecting to server...
ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && echo '📋 Current directory:' && pwd && echo '📋 PM2 status:' && pm2 status && echo '📋 Cleaning PM2:' && pm2 delete all || echo 'No processes' && echo '📋 Package.json:' && ls -la package.json && echo '📋 .next directory:' && ls -la .next/ && echo '🔨 Building:' && npm run build && echo '🚀 Starting PM2:' && pm2 start npm --name smile-rental -- start && echo '✅ Status:' && pm2 status && curl -I http://localhost:3000"

echo Emergency fix completed!
pause
