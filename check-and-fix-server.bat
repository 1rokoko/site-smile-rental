@echo off
echo Checking and fixing server...

echo Step 1: Check PM2 status
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 list"

echo Step 2: Check if port 3000 is working
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "curl -I http://localhost:3000"

echo Step 3: Check PM2 logs
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 logs smile-rental --lines 10"

echo Step 4: Stop and start PM2 process
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop smile-rental"
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

echo Step 5: Final check
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 list && curl -I http://localhost:3000"

pause
