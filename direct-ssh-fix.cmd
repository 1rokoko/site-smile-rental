@echo off
echo Direct SSH Fix for 502 Error
echo =============================
echo.
echo Connecting to server...
echo Password: [REMOVED]
echo.

ssh root@38.180.122.239

echo.
echo After connecting, run these commands:
echo cd /var/www/smilerentalphuket.com/site-smile-rental
echo pm2 delete all
echo npm run build
echo pm2 start ecosystem.config.js
echo pm2 status
echo.
pause
