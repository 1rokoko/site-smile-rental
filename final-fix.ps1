# Final fix script - based on working deploy-to-server.ps1
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "RESTORING SITE IN DEV MODE..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Checking PM2 status..." -ForegroundColor Cyan
$cmd1 = "pm2 list"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd1

Write-Host ""
Write-Host "Step 2: Deleting old processes..." -ForegroundColor Cyan
$cmd2 = "pm2 delete all"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

Write-Host ""
Write-Host "Step 3: Starting dev server..." -ForegroundColor Cyan
$cmd3 = "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

Write-Host ""
Write-Host "Step 4: Saving PM2..." -ForegroundColor Cyan
$cmd4 = "pm2 save"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4

Write-Host ""
Write-Host "Step 5: Waiting 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Step 6: Checking local access..." -ForegroundColor Cyan
$cmd5 = "curl -I http://localhost:3000"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd5

Write-Host ""
Write-Host "Step 7: Reloading Nginx..." -ForegroundColor Cyan
$cmd6 = "systemctl reload nginx"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd6

Write-Host ""
Write-Host "Step 8: Final check..." -ForegroundColor Cyan
$cmd7 = "curl -I https://smilerentalphuket.com"
$SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd7

Write-Host ""
Write-Host "RESTORATION COMPLETED!" -ForegroundColor Green
