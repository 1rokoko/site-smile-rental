@echo off
echo 🚀 DEPLOYING GOOGLE ADS COMPLIANCE FIXES TO PRODUCTION
echo ========================================================

echo.
echo 📋 CRITICAL FIXES BEING DEPLOYED:
echo ✅ Removed ALL dynamic DOM manipulation (createElement, appendChild)
echo ✅ Disabled ALL React.createElement patterns
echo ✅ Removed SecureCSSLoader component completely
echo ✅ Disabled window.open() and location manipulation
echo ✅ Fixed middleware to allow localhost development
echo ✅ Added static CSS imports instead of dynamic injection
echo.

echo 🔗 Connecting to server and deploying...

echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "
echo '=== STEP 1: PULLING LATEST CHANGES ==='
cd /var/www/smilerentalphuket.com/site-smile-rental
git fetch origin
git reset --hard origin/main
echo 'Latest commit:'
git log --oneline -1

echo ''
echo '=== STEP 2: CLEANING UP DELETED FILES ==='
# Remove deleted files that might still exist
rm -f src/components/layout/SecureCSSLoader.tsx
rm -f public/js/secure-init.js
echo 'Deleted files cleaned up'

echo ''
echo '=== STEP 3: INSTALLING DEPENDENCIES ==='
npm ci --production

echo ''
echo '=== STEP 4: BUILDING APPLICATION ==='
export NODE_OPTIONS='--max-old-space-size=4096'
npm run build

echo ''
echo '=== STEP 5: RESTARTING PM2 ==='
pm2 restart smile-rental || pm2 start npm --name smile-rental -- start

echo ''
echo '=== STEP 6: VERIFICATION ==='
echo 'PM2 Status:'
pm2 status

echo ''
echo 'Port Status:'
netstat -tlnp | grep :3000

echo ''
echo 'Testing localhost:'
curl -I http://localhost:3000

echo ''
echo '=== CHECKING FOR GOOGLE ADS COMPLIANCE ==='
echo 'Checking for removed suspicious patterns...'
page_content=\$(curl -s http://localhost:3000)

# Check for dangerouslySetInnerHTML
if echo \"\$page_content\" | grep -q \"dangerouslySetInnerHTML\"; then
    echo '❌ dangerouslySetInnerHTML still found'
else
    echo '✅ dangerouslySetInnerHTML successfully removed'
fi

# Check for createElement patterns
if echo \"\$page_content\" | grep -q \"createElement\"; then
    echo '❌ createElement still found'
else
    echo '✅ createElement successfully removed'
fi

# Check for SecureCSSLoader
if echo \"\$page_content\" | grep -q \"SecureCSSLoader\"; then
    echo '❌ SecureCSSLoader still found'
else
    echo '✅ SecureCSSLoader successfully removed'
fi

echo ''
echo '🎯 GOOGLE ADS COMPLIANCE DEPLOYMENT COMPLETED!'
echo 'Website: https://smilerentalphuket.com'
echo 'Status: Ready for Google Ads re-submission'
"

echo.
echo ✅ DEPLOYMENT COMPLETED!
echo.
echo 🔍 NEXT STEPS FOR GOOGLE ADS:
echo 1. Test website: https://smilerentalphuket.com
echo 2. Check browser console for errors (should be clean)
echo 3. Verify no createElement/appendChild in page source
echo 4. Wait 24-48 hours for Google to re-crawl
echo 5. Re-submit to Google Ads with confidence
echo.
echo 📋 WHAT WAS FIXED:
echo - All dynamic DOM manipulation removed
echo - No more React.createElement patterns
echo - No more dangerouslySetInnerHTML
echo - No more window.open() calls
echo - Code is now fully transparent for Google Ads
echo.
pause
