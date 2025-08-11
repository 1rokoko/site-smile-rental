# Restore site script
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "RESTORING SITE..." -ForegroundColor Green

Write-Host "1. Checking PM2..." -ForegroundColor Cyan
$cmd1 = "pm2 list"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd1

Write-Host "2. Deleting old processes..." -ForegroundColor Cyan
$cmd2 = "pm2 delete all"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

Write-Host "3. Starting dev server..." -ForegroundColor Cyan
$cmd3 = "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

Write-Host "4. Saving PM2..." -ForegroundColor Cyan
$cmd4 = "pm2 save"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4

Write-Host "5. Waiting 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "6. Checking local access..." -ForegroundColor Cyan
$cmd5 = "curl -I http://localhost:3000"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd5

Write-Host "7. Reloading Nginx..." -ForegroundColor Cyan
$cmd6 = "systemctl reload nginx"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd6

Write-Host "8. Checking domain..." -ForegroundColor Cyan
$cmd7 = "curl -I https://smilerentalphuket.com"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd7

Write-Host "DONE!" -ForegroundColor Green
