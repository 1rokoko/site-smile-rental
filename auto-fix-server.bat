@echo off
echo AUTO-FIXING SERVER WITH PASSWORD 925LudK9Bv
echo NO MORE MANUAL INPUT NEEDED!
echo.

echo Step 1: Pull latest changes...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

echo.
echo Step 2: Check package.json exists...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "ls -la /var/www/smilerentalphuket.com/site-smile-rental/package.json"

echo.
echo Step 3: Install dependencies...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo.
echo Step 4: Build project...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Step 5: Stop PM2 process...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop smile-rental"

echo.
echo Step 6: Start PM2 process...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

echo.
echo Step 7: Check final status...
(echo 925LudK9Bv) | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 list && curl -I http://localhost:3000"

echo.
echo ===== AUTO-FIX COMPLETED! =====
echo Website should now be working: https://smilerentalphuket.com/scooter-rental/
echo.
pause
