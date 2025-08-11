@echo off
echo 🚀 DEPLOYING WEBSITE UPDATES TO PRODUCTION SERVER...
echo.
echo ✅ Changes pushed to GitHub
echo 🎯 Deploying: Analytics, Security, Policies, UI fixes
echo.

echo Step 1: Connecting to server and pulling latest changes...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

echo.
echo Step 2: Installing dependencies...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo.
echo Step 3: Building production version...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Step 4: Restarting PM2 processes...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 restart smile-rental"

echo.
echo Step 5: Checking website status...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "curl -I http://localhost:3000"

echo.
echo ✅ DEPLOYMENT COMPLETED!
echo.
echo 🔍 VERIFICATION:
echo 1. Check website: https://smilerentalphuket.com/scooter-rental/
echo 2. Verify floating buttons have WHITE text
echo 3. Check analytics are working (Yandex.Metrika + Google Analytics)
echo 4. Confirm security headers are present
echo 5. Test policy links in footer
echo.
pause
