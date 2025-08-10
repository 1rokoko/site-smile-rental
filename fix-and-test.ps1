# Fix and Test Website Script
Write-Host "FIXING AND TESTING WEBSITE..." -ForegroundColor Green

# Step 1: Check PM2 status
Write-Host "Step 1: Checking PM2 status..." -ForegroundColor Yellow
$pm2Status = echo "925LudK9Bv" | ssh root@38.180.122.239 "pm2 list"
Write-Host "PM2 Status: $pm2Status" -ForegroundColor White

# Step 2: Test local app
Write-Host "Step 2: Testing local app..." -ForegroundColor Yellow
$localTest = echo "925LudK9Bv" | ssh root@38.180.122.239 "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
Write-Host "Local App HTTP Code: $localTest" -ForegroundColor White

# Step 3: Test Nginx
Write-Host "Step 3: Testing Nginx..." -ForegroundColor Yellow
$nginxTest = echo "925LudK9Bv" | ssh root@38.180.122.239 "curl -s -o /dev/null -w '%{http_code}' http://localhost"
Write-Host "Nginx HTTP Code: $nginxTest" -ForegroundColor White

# Step 4: Check firewall
Write-Host "Step 4: Checking firewall..." -ForegroundColor Yellow
$firewallStatus = echo "925LudK9Bv" | ssh root@38.180.122.239 "ufw status"
Write-Host "Firewall Status: $firewallStatus" -ForegroundColor White

# Step 5: Test external access
Write-Host "Step 5: Testing external access..." -ForegroundColor Yellow
try {
    $webTest = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -Method Head -TimeoutSec 10
    Write-Host "External Access: SUCCESS - Status Code $($webTest.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "External Access: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "TESTING COMPLETED!" -ForegroundColor Green
