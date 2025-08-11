@echo off
echo Deploying to server...

echo Step 1: Copy package.json to server
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

echo Step 2: Install dependencies
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

echo Step 3: Build project
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo Step 4: Restart PM2
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 restart smile-rental"

echo Deployment completed!
pause
