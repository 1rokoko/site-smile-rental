@echo off
echo Fixing server deployment...

echo Step 1: Stopping current processes
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop all && pm2 delete all"

echo Step 2: Navigate to correct directory and build
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm install && npm run build"

echo Step 3: Start application
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pm2 start npm --name smile-rental -- start && pm2 save"

echo Step 4: Check status
echo 925LudK9Bv | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 status && curl -I http://localhost:3000"

echo Deployment fix completed!
pause
