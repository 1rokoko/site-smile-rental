# Final Website Fix - Remove HTTPS redirect issue
Write-Host "FIXING WEBSITE - REMOVING HTTPS REDIRECT ISSUE" -ForegroundColor Green

# Step 1: Delete all PM2 processes
Write-Host "Step 1: Stopping PM2 processes..." -ForegroundColor Yellow
$result1 = echo "[REMOVED]" | ssh root@38.180.122.239 "pm2 delete all"
Write-Host "Result: $result1" -ForegroundColor White

# Step 2: Start application without hostname parameter that causes 0.0.0.0 redirect
Write-Host "Step 2: Starting app without problematic hostname..." -ForegroundColor Yellow
$result2 = echo "[REMOVED]" | ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev"
Write-Host "Result: $result2" -ForegroundColor White

# Step 3: Wait for startup
Write-Host "Step 3: Waiting 15 seconds for startup..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 4: Test local app
Write-Host "Step 4: Testing local app..." -ForegroundColor Yellow
$result4 = echo "[REMOVED]" | ssh root@38.180.122.239 "curl -I http://localhost:3000"
Write-Host "Local app result: $result4" -ForegroundColor White

# Step 5: Test domain
Write-Host "Step 5: Testing domain..." -ForegroundColor Yellow
$result5 = echo "[REMOVED]" | ssh root@38.180.122.239 "curl -I http://smilerentalphuket.com"
Write-Host "Domain result: $result5" -ForegroundColor White

Write-Host "WEBSITE FIX COMPLETED!" -ForegroundColor Green
