@echo off
echo Deploying to server with correct path...
echo.

echo Step 1: Updating code from GitHub...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

echo.
echo Step 2: Installing dependencies...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo.
echo Step 3: Building application...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Step 4: Restarting PM2...
ssh root@38.180.122.239 "pm2 restart smile-rental"

echo.
echo Step 5: Checking final status...
ssh root@38.180.122.239 "pm2 status"

echo.
echo Step 6: Checking logs...
ssh root@38.180.122.239 "pm2 logs smile-rental --lines 10"

echo.
echo Deployment completed!
pause
