# Auto fix 502 error using SSH key
Write-Host "AUTO-FIXING 502 ERROR..." -ForegroundColor Green
Write-Host ""

$server = "38.180.122.239"
$user = "root"
$keyPath = "$env:USERPROFILE\.ssh\smile_rental_key"

if (Test-Path $keyPath) {
    Write-Host "Using SSH key for automatic fix..." -ForegroundColor Green
    
    Write-Host "1. Checking PM2 status..." -ForegroundColor Cyan
    & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server "pm2 list"
    
    Write-Host ""
    Write-Host "2. Going to project directory..." -ForegroundColor Cyan
    & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pwd"
    
    Write-Host ""
    Write-Host "3. Starting application..." -ForegroundColor Cyan
    & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pm2 start npm --name smile-rental -- start"
    
    Write-Host ""
    Write-Host "4. Saving PM2 config..." -ForegroundColor Cyan
    & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server "pm2 save"
    
    Write-Host ""
    Write-Host "5. Checking final status..." -ForegroundColor Cyan
    & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server "pm2 list"
    
    Write-Host ""
    Write-Host "6. Testing local connection..." -ForegroundColor Cyan
    & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server "curl -I http://localhost:3000"
    
} else {
    Write-Host "SSH key not found. Manual connection needed:" -ForegroundColor Yellow
    Write-Host "ssh root@$server" -ForegroundColor Cyan
    Write-Host "Password: 925LudK9Bv" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Testing site..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "SUCCESS! Site is now working (HTTP $($response.StatusCode))" -ForegroundColor Green
    Start-Process "http://smilerentalphuket.com"
} catch {
    Write-Host "Site still not working. May need manual intervention." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
