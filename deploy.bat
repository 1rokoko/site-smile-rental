@echo off
echo Deploying to server...
echo.

echo Step 1: Connecting to server and updating code...
ssh root@38.180.122.239 "cd /var/www/site-smile-rental && git pull origin main"

echo.
echo Step 2: Building application...
ssh root@38.180.122.239 "cd /var/www/site-smile-rental && npm run build"

echo.
echo Step 3: Restarting PM2...
ssh root@38.180.122.239 "pm2 restart smile-rental"

echo.
echo Step 4: Checking status...
ssh root@38.180.122.239 "pm2 status"

echo.
echo Deployment completed!
pause
