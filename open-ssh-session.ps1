# Open SSH session in new window
Write-Host "Opening SSH session to server..." -ForegroundColor Green
Write-Host "Server: 38.180.122.239" -ForegroundColor Yellow
Write-Host "Username: root" -ForegroundColor Yellow
Write-Host "Password: 925LudK9Bv" -ForegroundColor Yellow
Write-Host ""
Write-Host "After connecting, run these commands:" -ForegroundColor Cyan
Write-Host "1. pm2 status" -ForegroundColor White
Write-Host "2. pm2 stop all" -ForegroundColor White
Write-Host "3. pm2 kill" -ForegroundColor White
Write-Host "4. cd /var/www/smile-rental || cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor White
Write-Host "5. pm2 start ecosystem.config.js" -ForegroundColor White
Write-Host "6. pm2 startup" -ForegroundColor White
Write-Host "7. pm2 save" -ForegroundColor White
Write-Host "8. systemctl restart nginx" -ForegroundColor White
Write-Host ""

# Try to open SSH in new window
Start-Process -FilePath "ssh" -ArgumentList "root@38.180.122.239" -Wait
