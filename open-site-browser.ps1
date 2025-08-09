# Open site in browser for testing
Write-Host "Opening site in browser..." -ForegroundColor Green

# Open main site
Start-Process "http://smilerentalphuket.com"

Write-Host "Site opened in default browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please check:" -ForegroundColor Yellow
Write-Host "1. Site loads without errors" -ForegroundColor White
Write-Host "2. Content displays correctly" -ForegroundColor White
Write-Host "3. Navigation works" -ForegroundColor White
Write-Host "4. Images load properly" -ForegroundColor White
Write-Host ""
Write-Host "If site shows 502 error, run deployment first:" -ForegroundColor Red
Write-Host "ssh root@38.180.122.239" -ForegroundColor Cyan
Write-Host "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor Cyan
Write-Host "./update-site.sh" -ForegroundColor Cyan
