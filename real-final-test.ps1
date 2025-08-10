# Real Final Website Test
Write-Host "REAL FINAL WEBSITE TEST" -ForegroundColor Red
Write-Host "======================" -ForegroundColor Red

Write-Host "`nTesting PM2 status..." -ForegroundColor Yellow
$pm2Result = & ssh root@38.180.122.239 "pm2 list"
Write-Host "PM2 Result: $pm2Result" -ForegroundColor White

Write-Host "`nTesting local app..." -ForegroundColor Yellow  
$localResult = & ssh root@38.180.122.239 "curl -I http://localhost:3000"
Write-Host "Local App Result: $localResult" -ForegroundColor White

Write-Host "`nTesting Nginx..." -ForegroundColor Yellow
$nginxResult = & ssh root@38.180.122.239 "curl -I http://localhost"
Write-Host "Nginx Result: $nginxResult" -ForegroundColor White

Write-Host "`nTesting ports..." -ForegroundColor Yellow
$portResult = & ssh root@38.180.122.239 "netstat -tlnp | grep ':80\|:3000'"
Write-Host "Port Result: $portResult" -ForegroundColor White

Write-Host "`nTEST COMPLETE" -ForegroundColor Red
