@echo off
echo ========================================
echo 🚨 FINAL EMERGENCY FIX - 502 Bad Gateway
echo ========================================
echo.

echo Step 1: Connecting to server...
echo Password will be required: 925LudK9Bv
echo.

echo Executing fix commands on server...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && echo 'Current directory:' && pwd && echo 'PM2 status before fix:' && pm2 status && echo 'Stopping all PM2 processes:' && pm2 delete all && echo 'Checking package.json:' && ls -la package.json && echo 'Checking ecosystem.config.js:' && ls -la ecosystem.config.js && echo 'Building application:' && npm run build && echo 'Starting with ecosystem config:' && pm2 start ecosystem.config.js && echo 'PM2 status after fix:' && pm2 status && echo 'Testing localhost:' && curl -I http://localhost:3000 && echo 'Fix completed!'"

echo.
echo Step 2: Waiting for application to stabilize...
timeout /t 10 /nobreak > nul

echo.
echo Step 3: Testing external site...
curl -I https://smilerentalphuket.com

echo.
echo ========================================
echo 🎯 EMERGENCY FIX COMPLETED
echo ========================================
echo.
echo If site is still showing 502:
echo 1. Check GitHub Actions status
echo 2. Verify server has enough memory
echo 3. Check application logs: pm2 logs
echo.
pause
