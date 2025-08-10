# Deploy website updates to production server
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "🚀 DEPLOYING WEBSITE UPDATES TO PRODUCTION SERVER..." -ForegroundColor Green
Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
Write-Host "🎯 Deploying: Analytics, Security, Policies, UI fixes" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Pulling latest changes from GitHub..." -ForegroundColor Cyan
$cmd1 = "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd1

Write-Host ""
Write-Host "Step 2: Checking current status..." -ForegroundColor Cyan
$cmd2 = "pm2 list"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

Write-Host ""
Write-Host "Step 3: Deleting old processes..." -ForegroundColor Cyan
$cmd3 = "pm2 delete all"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

Write-Host ""
Write-Host "Step 4: Starting dev server..." -ForegroundColor Cyan
$cmd4 = "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4

Write-Host ""
Write-Host "Step 5: Saving PM2 configuration..." -ForegroundColor Cyan
$cmd5 = "pm2 save"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd5

Write-Host ""
Write-Host "Step 6: Waiting 10 seconds for startup..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Step 7: Checking local server..." -ForegroundColor Cyan
$cmd6 = "curl -I http://localhost:3000"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd6

Write-Host ""
Write-Host "Step 8: Reloading Nginx..." -ForegroundColor Cyan
$cmd7 = "systemctl reload nginx"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd7

Write-Host ""
Write-Host "Step 9: Checking domain..." -ForegroundColor Cyan
$cmd8 = "curl -I https://smilerentalphuket.com"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd8

Write-Host ""
Write-Host "✅ DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host ""
Write-Host "VERIFICATION:" -ForegroundColor Yellow
Write-Host "1. Check website: https://smilerentalphuket.com/scooter-rental/" -ForegroundColor White
Write-Host "2. Verify floating buttons have WHITE text" -ForegroundColor White
Write-Host "3. Check analytics are working (Yandex.Metrika + Google Analytics)" -ForegroundColor White
Write-Host "4. Confirm security headers are present" -ForegroundColor White
Write-Host "5. Test policy links in footer" -ForegroundColor White
Write-Host ""
