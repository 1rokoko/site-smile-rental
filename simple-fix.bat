@echo off
echo FIXING 502 ERROR...
echo.

echo Step 1: Testing current site status...
curl -I https://smilerentalphuket.com
echo.

echo Step 2: Connecting to server...
echo Password: [REMOVED]
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 delete all && npm run build && pm2 start ecosystem.config.js && pm2 status"

echo.
echo Step 3: Waiting for stabilization...
timeout /t 15 /nobreak > nul

echo.
echo Step 4: Testing fixed site...
curl -I https://smilerentalphuket.com

echo.
echo Fix completed!
pause
