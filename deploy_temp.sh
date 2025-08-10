#!/bin/bash 
set -e 
cd /var/www/site-smile-rental 
echo "Starting deployment..." 
git fetch origin 
git reset --hard origin/main 
echo "Cleaning old build..." 
rm -rf .next 
echo "Installing dependencies..." 
npm ci --production 
echo "Building with increased memory..." 
export NODE_OPTIONS="--max-old-space-size=4096" 
npm run build 
if [ $? -eq 0 ]; then 
  echo "Build successful!" 
  pm2 stop smile-rental 2>/dev/null || echo "App was not running" 
  pm2 delete smile-rental 2>/dev/null || echo "App was not in PM2" 
  NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "smile-rental" -- start 
  pm2 save 
  echo "PM2 Status:" 
  pm2 status 
  echo "Deployment completed successfully!" 
else 
  echo "Build failed!" 
  exit 1 
fi 
