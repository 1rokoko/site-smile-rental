@echo off
echo ========================================
echo SERVER DIAGNOSTICS AND DEPLOYMENT
echo ========================================
echo.

echo 1. Checking disk space...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h"
echo.

echo 2. Checking PM2 status...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 list"
echo.

echo 3. Checking Nginx status...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "systemctl status nginx --no-pager -l"
echo.

echo 4. Checking project directory...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "ls -la /var/www/smilerentalphuket.com/site-smile-rental/"
echo.

echo 5. Updating project from GitHub...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"
echo.

echo 6. Installing dependencies...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm install"
echo.

echo 7. Building project...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm run build"
echo.

echo 8. Starting application...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop smile-rental || echo 'App was not running'"
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pm2 start npm --name smile-rental -- start"
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 save"
echo.

echo 9. Final status check...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 list"
echo.

echo 10. Testing site...
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "curl -I http://localhost:3000"
echo.

echo ========================================
echo DEPLOYMENT COMPLETED
echo ========================================
pause
