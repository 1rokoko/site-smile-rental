@echo off
echo SIMPLE SERVER FIX - WORKING VERSION
echo.

echo Connecting to server and fixing 502 error...
echo.

rem Step 1: Pull changes
echo Step 1: Git pull...
ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

rem Step 2: Install
echo Step 2: NPM install...
ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

rem Step 3: Build
echo Step 3: NPM build...
ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

rem Step 4: Restart PM2
echo Step 4: PM2 restart...
ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 restart smile-rental"

echo.
echo DONE! Check: https://smilerentalphuket.com/scooter-rental/
pause
