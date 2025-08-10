@echo off
echo ========================================
echo NODE.JS DEPLOYMENT FIX - MANUAL EXECUTION
echo ========================================
echo.
echo This script will execute the fix commands one by one.
echo You will need to enter the password: 925LudK9Bv
echo for each command when prompted.
echo.
pause

echo.
echo Step 1: Testing Node.js functionality...
echo Command: ssh root@38.180.122.239 "node -e 'console.log(\"Node.js working:\", process.version)'"
ssh root@38.180.122.239 "node -e 'console.log(\"Node.js working:\", process.version)'"

echo.
echo Step 2: Killing hanging processes...
echo Command: ssh root@38.180.122.239 "pkill -f node; pkill -f npm"
ssh root@38.180.122.239 "pkill -f node; pkill -f npm"

echo.
echo Step 3: Killing PM2 daemon...
echo Command: ssh root@38.180.122.239 "pm2 kill"
ssh root@38.180.122.239 "pm2 kill"

echo.
echo Step 4: Clearing system caches...
echo Command: ssh root@38.180.122.239 "sync && echo 3 > /proc/sys/vm/drop_caches"
ssh root@38.180.122.239 "sync && echo 3 > /proc/sys/vm/drop_caches"

echo.
echo Step 5: Clearing NPM cache...
echo Command: ssh root@38.180.122.239 "npm cache clean --force"
ssh root@38.180.122.239 "npm cache clean --force"

echo.
echo Step 6: Removing build artifacts...
echo Command: ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next .next.backup.* node_modules/.cache"
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next .next.backup.* node_modules/.cache"

echo.
echo Step 7: Installing dependencies with memory limit...
echo Command: ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' npm install"
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' npm install"

echo.
echo Step 8: Starting application in development mode...
echo Command: ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name smile-rental-dev -- run dev"
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name smile-rental-dev -- run dev"

echo.
echo Step 9: Saving PM2 configuration...
echo Command: ssh root@38.180.122.239 "pm2 save"
ssh root@38.180.122.239 "pm2 save"

echo.
echo Step 10: Checking PM2 status...
echo Command: ssh root@38.180.122.239 "pm2 list"
ssh root@38.180.122.239 "pm2 list"

echo.
echo Step 11: Reloading Nginx...
echo Command: ssh root@38.180.122.239 "systemctl reload nginx"
ssh root@38.180.122.239 "systemctl reload nginx"

echo.
echo Step 12: Testing local connectivity...
echo Command: ssh root@38.180.122.239 "curl -I http://localhost:3000"
ssh root@38.180.122.239 "curl -I http://localhost:3000"

echo.
echo Step 13: Testing domain access...
echo Command: ssh root@38.180.122.239 "curl -I https://smilerentalphuket.com"
ssh root@38.180.122.239 "curl -I https://smilerentalphuket.com"

echo.
echo ========================================
echo FIX EXECUTION COMPLETED
echo ========================================
echo.
echo If all steps completed successfully, the website should be accessible at:
echo https://smilerentalphuket.com/
echo.
pause
