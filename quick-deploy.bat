@echo off
echo Deploying key optimizations...

echo Uploading next.config.ts...
echo [REMOVED] | scp next.config.ts root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/

echo Uploading package.json...
echo [REMOVED] | scp package.json root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/

echo Rebuilding on server...
echo [REMOVED] | ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next && npm run build && pm2 restart smile-rental"

echo Done!
pause
