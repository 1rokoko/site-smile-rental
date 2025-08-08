@echo off
echo ULTIMATE SERVER FIX - NO MORE MANUAL PASSWORDS!
echo.

echo Step 1: Pull latest changes...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

echo.
echo Step 2: Check package.json...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "ls -la /var/www/smilerentalphuket.com/site-smile-rental/package.json"

echo.
echo Step 3: Install dependencies...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo.
echo Step 4: Build project...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Step 5: Stop PM2...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop smile-rental"

echo.
echo Step 6: Start PM2...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

echo.
echo Step 7: Final check...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 list && curl -I http://localhost:3000"

echo.
echo ===== ULTIMATE FIX COMPLETED! =====
echo Check: https://smilerentalphuket.com/scooter-rental/
echo.
pause
