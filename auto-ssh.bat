@echo off
echo AUTOMATED SSH FIX...

set PASSWORD=925LudK9Bv
set SERVER=38.180.122.239
set USER=root

echo 1. Deleting old processes and starting dev server...
(echo %PASSWORD%) | ssh -o StrictHostKeyChecking=no %USER%@%SERVER% "pm2 delete all && cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev && pm2 save"

echo.
echo 2. Waiting 10 seconds...
timeout /t 10 /nobreak > nul

echo.
echo 3. Checking local server...
(echo %PASSWORD%) | ssh -o StrictHostKeyChecking=no %USER%@%SERVER% "curl -I http://localhost:3000"

echo.
echo 4. Reloading Nginx...
(echo %PASSWORD%) | ssh -o StrictHostKeyChecking=no %USER%@%SERVER% "systemctl reload nginx"

echo.
echo 5. Final check...
(echo %PASSWORD%) | ssh -o StrictHostKeyChecking=no %USER%@%SERVER% "curl -I https://smilerentalphuket.com"

echo.
echo AUTOMATED FIX COMPLETED!
