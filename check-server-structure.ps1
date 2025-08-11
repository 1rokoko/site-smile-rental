# Check server directory structure
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "Checking server directory structure..." -ForegroundColor Yellow

Write-Host "1. Checking main directory..." -ForegroundColor Cyan
$cmd1 = "ls -la /var/www/smilerentalphuket.com/"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd1

Write-Host ""
Write-Host "2. Checking site-smile-rental directory..." -ForegroundColor Cyan
$cmd2 = "ls -la /var/www/smilerentalphuket.com/site-smile-rental/"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

Write-Host ""
Write-Host "3. Checking for package.json..." -ForegroundColor Cyan
$cmd3 = "find /var/www/smilerentalphuket.com -name 'package.json' -type f"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

Write-Host ""
Write-Host "4. Checking PM2 processes..." -ForegroundColor Cyan
$cmd4 = "pm2 list"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4
