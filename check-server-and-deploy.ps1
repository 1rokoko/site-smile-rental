# Check server status and deploy with increased disk space
Write-Host "CHECKING SERVER STATUS AND DEPLOYING SITE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "SITUATION UPDATE:" -ForegroundColor Yellow
Write-Host "- Server disk space increased by 20GB" -ForegroundColor Cyan
Write-Host "- Previous GitHub Actions failed due to memory/disk issues" -ForegroundColor Cyan
Write-Host "- Need to verify server restart and deploy with new resources" -ForegroundColor Cyan
Write-Host ""

$server = "38.180.122.239"
$user = "root"
$password = "[REMOVED]"

Write-Host "1. CHECKING SERVER CONNECTIVITY..." -ForegroundColor Yellow
try {
    $pingResult = Test-Connection -ComputerName $server -Count 3 -Quiet
    if ($pingResult) {
        Write-Host "✅ Server is reachable via ping" -ForegroundColor Green
    } else {
        Write-Host "❌ Server is not reachable" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Ping test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. DEPLOYMENT COMMANDS FOR SERVER:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Connect to server:" -ForegroundColor Cyan
Write-Host "ssh root@$server" -ForegroundColor White
Write-Host "Password: $password" -ForegroundColor Gray
Write-Host ""

Write-Host "Commands to run on server:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Check disk space (should show increased space)" -ForegroundColor Green
Write-Host "df -h" -ForegroundColor White
Write-Host ""

Write-Host "# Check server uptime (to verify restart)" -ForegroundColor Green
Write-Host "uptime" -ForegroundColor White
Write-Host ""

Write-Host "# Check current PM2 status" -ForegroundColor Green
Write-Host "pm2 list" -ForegroundColor White
Write-Host ""

Write-Host "# Navigate to project directory" -ForegroundColor Green
Write-Host "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor White
Write-Host ""

Write-Host "# Clean previous build and start fresh" -ForegroundColor Green
Write-Host "rm -rf .next" -ForegroundColor White
Write-Host "rm -rf node_modules" -ForegroundColor White
Write-Host "npm install" -ForegroundColor White
Write-Host ""

Write-Host "# Build with increased memory (now should work with more disk space)" -ForegroundColor Green
Write-Host "NODE_OPTIONS=`"--max-old-space-size=4096`" npm run build" -ForegroundColor White
Write-Host ""

Write-Host "# Stop any existing app and start fresh" -ForegroundColor Green
Write-Host "pm2 delete smile-rental || echo 'No existing app'" -ForegroundColor White
Write-Host "pm2 start npm --name smile-rental -- start" -ForegroundColor White
Write-Host "pm2 save" -ForegroundColor White
Write-Host ""

Write-Host "# Verify deployment" -ForegroundColor Green
Write-Host "pm2 list" -ForegroundColor White
Write-Host "curl -I http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "ONE-LINER COMMAND (copy and paste):" -ForegroundColor Yellow
Write-Host "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && rm -rf .next node_modules && npm install && NODE_OPTIONS=`"--max-old-space-size=4096`" npm run build && pm2 delete smile-rental && pm2 start npm --name smile-rental -- start && pm2 save && pm2 list" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. OPENING SSH CONNECTION..." -ForegroundColor Yellow
try {
    Start-Process -FilePath "ssh" -ArgumentList "$user@$server"
    Write-Host "✅ SSH connection opened" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not open SSH automatically" -ForegroundColor Yellow
    Write-Host "Please connect manually using: ssh $user@$server" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "EXPECTED RESULTS:" -ForegroundColor Green
Write-Host "- Disk space should show 20GB+ available" -ForegroundColor White
Write-Host "- Build should complete without SIGKILL error" -ForegroundColor White
Write-Host "- PM2 should show smile-rental app running" -ForegroundColor White
Write-Host "- Site should be accessible at http://smilerentalphuket.com" -ForegroundColor White
