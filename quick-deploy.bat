@echo off
echo Deploying key optimizations...

echo Uploading next.config.ts...
echo 925LudK9Bv | scp next.config.ts root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/

echo Uploading package.json...
echo 925LudK9Bv | scp package.json root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/

echo Rebuilding on server...
echo 925LudK9Bv | ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next && npm run build && pm2 restart smile-rental"

echo Done!
pause
