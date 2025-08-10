cd /var/www/site-smile-rental 
git fetch origin 
git reset --hard origin/main 
rm -rf .next 
npm ci --production 
export NODE_OPTIONS="--max-old-space-size=4096" 
npm run build 
pm2 stop smile-rental 2>/dev/null || echo "App stopped" 
pm2 delete smile-rental 2>/dev/null || echo "App deleted" 
NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "smile-rental" -- start 
pm2 save 
pm2 status 
