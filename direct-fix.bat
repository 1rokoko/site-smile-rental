@echo off
echo 🔧 DIRECT FIX: Resolving 502 Bad Gateway error

echo Connecting to server and fixing the issue...
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && echo 'Current directory:' && pwd && echo 'PM2 status:' && pm2 status && echo 'Cleaning PM2:' && pm2 delete all && echo 'Building app:' && npm run build && echo 'Starting with ecosystem:' && pm2 start ecosystem.config.js && echo 'Final status:' && pm2 status && echo 'Testing localhost:' && curl -I http://localhost:3000"

echo.
echo Fix completed! Testing site...
timeout /t 5 /nobreak > nul

echo Testing https://smilerentalphuket.com
curl -I https://smilerentalphuket.com

echo.
echo Direct fix process completed!
pause
