@echo off
echo ========================================
echo COMPLETE WEBSITE RESTART
echo ========================================

echo Step 1: Stopping all PM2 processes...
ssh root@38.180.122.239 "pm2 delete all"

echo.
echo Step 2: Restarting Nginx...
ssh root@38.180.122.239 "systemctl restart nginx"

echo.
echo Step 3: Opening firewall ports...
ssh root@38.180.122.239 "ufw allow 80/tcp && ufw allow 3000/tcp"

echo.
echo Step 4: Starting app with correct settings...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_ENV=development pm2 start 'npm run dev -- --hostname 0.0.0.0 --port 3000' --name smile-rental-dev"

echo.
echo Step 5: Waiting 20 seconds for startup...
timeout /t 20

echo.
echo Step 6: Testing local app...
ssh root@38.180.122.239 "curl -I http://localhost:3000"

echo.
echo ========================================
echo RESTART COMPLETED
echo ========================================
pause
