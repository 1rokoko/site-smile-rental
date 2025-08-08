@echo off
echo 🚨 DEPLOYING SECURITY FIXES TO PRODUCTION SERVER...
echo.
echo Branch: security-fixes-google-ads-compliance
echo Purpose: Remove blacklisted CDN and add security headers
echo.

echo Step 1: Connecting to server and fetching latest changes...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git fetch origin"

echo.
echo Step 2: Switching to security fixes branch...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git checkout security-fixes-google-ads-compliance"

echo.
echo Step 3: Pulling latest security fixes...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin security-fixes-google-ads-compliance"

echo.
echo Step 4: Installing dependencies...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo.
echo Step 5: Building application with security fixes...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Step 6: Stopping current application...
ssh root@38.180.122.239 "pm2 stop smile-rental || echo 'No process to stop'"

echo.
echo Step 7: Starting application with security fixes...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name 'smile-rental' -- start"

echo.
echo Step 8: Checking application status...
ssh root@38.180.122.239 "pm2 status"

echo.
echo Step 9: Testing website accessibility...
ssh root@38.180.122.239 "curl -I http://localhost:3000"

echo.
echo Step 10: Checking for blacklisted CDN removal...
ssh root@38.180.122.239 "curl -s http://localhost:3000 | grep -i '274418.selcdn.ru' || echo 'SUCCESS: No blacklisted CDN found'"

echo.
echo ✅ SECURITY FIXES DEPLOYMENT COMPLETED!
echo.
echo 🔍 VERIFICATION STEPS:
echo 1. Check website: http://smilerentalphuket.com
echo 2. Verify no blacklisted CDN references
echo 3. Confirm security headers are present
echo.
echo 🔄 ROLLBACK COMMAND (if needed):
echo ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git checkout main && git pull origin main && npm run build && pm2 restart smile-rental"
echo.
pause
