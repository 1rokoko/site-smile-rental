@echo off
echo ========================================
echo FIXING REDIRECT ISSUE
echo ========================================
echo.
echo The issue is that both Next.js and Nginx are redirecting to https://0.0.0.0/
echo This needs to be fixed to redirect to the correct domain.
echo.

echo Step 1: Stopping current PM2 processes...
ssh root@38.180.122.239 "pm2 delete all"

echo.
echo Step 2: Starting Next.js without hostname parameter...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev"

echo.
echo Step 3: Waiting for startup...
timeout /t 10

echo.
echo Step 4: Testing local app without redirect...
ssh root@38.180.122.239 "curl -L http://localhost:3000"

echo.
echo Step 5: Testing domain access...
ssh root@38.180.122.239 "curl -I http://smilerentalphuket.com"

echo.
echo ========================================
echo FIX COMPLETED
echo ========================================
pause
