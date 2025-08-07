@echo off
echo Fixing repository on server...
echo.

echo Step 1: Checking current directory contents...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && ls -la"

echo.
echo Step 2: Checking git status...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git status"

echo.
echo Step 3: Resetting repository...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git reset --hard HEAD"

echo.
echo Step 4: Pulling latest changes...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

echo.
echo Step 5: Installing dependencies...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo.
echo Step 6: Building application...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Step 7: Restarting PM2...
ssh root@38.180.122.239 "pm2 restart smile-rental"

echo.
echo Repository fixed and deployed!
pause
