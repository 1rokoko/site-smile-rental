# Fix 502 Bad Gateway Error
Write-Host "FIXING 502 BAD GATEWAY ERROR..." -ForegroundColor Red
Write-Host "================================" -ForegroundColor Red
Write-Host ""

Write-Host "502 Error means Nginx is running but can't connect to the Node.js app" -ForegroundColor Yellow
Write-Host "This usually means PM2 application is not running" -ForegroundColor Yellow
Write-Host ""

Write-Host "SOLUTION: Connect to server and restart the application" -ForegroundColor Green
Write-Host ""

Write-Host "1. Connect to server:" -ForegroundColor Cyan
Write-Host "   ssh root@38.180.122.239" -ForegroundColor White
Write-Host "   Password: [REMOVED]" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Check PM2 status:" -ForegroundColor Cyan
Write-Host "   pm2 list" -ForegroundColor White
Write-Host ""

Write-Host "3. Go to project directory:" -ForegroundColor Cyan
Write-Host "   cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor White
Write-Host ""

Write-Host "4. Start the application:" -ForegroundColor Cyan
Write-Host "   pm2 start npm --name smile-rental -- start" -ForegroundColor White
Write-Host "   pm2 save" -ForegroundColor White
Write-Host ""

Write-Host "5. Check if it's working:" -ForegroundColor Cyan
Write-Host "   pm2 list" -ForegroundColor White
Write-Host "   curl http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "ALTERNATIVE - Use existing script:" -ForegroundColor Green
Write-Host "   ./update-site.sh" -ForegroundColor White
Write-Host ""

Write-Host "After fixing, the site should work at: http://smilerentalphuket.com" -ForegroundColor Green

# Try to open SSH connection
Write-Host ""
Write-Host "Opening SSH connection..." -ForegroundColor Cyan
try {
    Start-Process -FilePath "ssh" -ArgumentList "root@38.180.122.239"
} catch {
    Write-Host "Could not open SSH automatically. Please connect manually." -ForegroundColor Yellow
}
