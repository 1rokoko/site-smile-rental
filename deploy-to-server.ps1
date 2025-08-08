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
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Cyan
$cmd2 = "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

Write-Host ""
Write-Host "Step 3: Building production version..." -ForegroundColor Cyan
$cmd3 = "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

Write-Host ""
Write-Host "Step 4: Restarting PM2 processes..." -ForegroundColor Cyan
$cmd4 = "pm2 restart smile-rental"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4

Write-Host ""
Write-Host "Step 5: Checking website status..." -ForegroundColor Cyan
$cmd5 = "curl -I http://localhost:3000"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd5

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
