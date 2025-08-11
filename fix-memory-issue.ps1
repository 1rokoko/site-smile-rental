# Fix memory issue and deploy site
Write-Host "FIXING MEMORY ISSUE AND DEPLOYING SITE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "PROBLEM IDENTIFIED:" -ForegroundColor Red
Write-Host "GitHub Actions failed due to memory issue during Next.js build" -ForegroundColor Yellow
Write-Host "Error: Next.js build worker exited with SIGKILL" -ForegroundColor Yellow
Write-Host ""

Write-Host "SOLUTION:" -ForegroundColor Green
Write-Host "Increase Node.js memory limit during build process" -ForegroundColor Cyan
Write-Host ""

Write-Host "MANUAL COMMANDS TO RUN ON SERVER:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Connect to server:" -ForegroundColor Cyan
Write-Host "   ssh root@38.180.122.239" -ForegroundColor White
Write-Host "   Password: [REMOVED]" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Navigate to project:" -ForegroundColor Cyan
Write-Host "   cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor White
Write-Host ""

Write-Host "3. Build with increased memory:" -ForegroundColor Cyan
Write-Host "   NODE_OPTIONS=`"--max-old-space-size=2048`" npm run build" -ForegroundColor White
Write-Host ""

Write-Host "4. Start application:" -ForegroundColor Cyan
Write-Host "   pm2 start npm --name smile-rental -- start" -ForegroundColor White
Write-Host "   pm2 save" -ForegroundColor White
Write-Host ""

Write-Host "5. Check status:" -ForegroundColor Cyan
Write-Host "   pm2 list" -ForegroundColor White
Write-Host "   curl http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "ALTERNATIVE - One-liner command:" -ForegroundColor Green
Write-Host "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && NODE_OPTIONS=`"--max-old-space-size=2048`" npm run build && pm2 start npm --name smile-rental -- start && pm2 save" -ForegroundColor Cyan
Write-Host ""

Write-Host "EXPECTED RESULT:" -ForegroundColor Green
Write-Host "- Build completes successfully with increased memory" -ForegroundColor White
Write-Host "- PM2 shows smile-rental app running" -ForegroundColor White
Write-Host "- Site accessible at http://smilerentalphuket.com" -ForegroundColor White
Write-Host "- No more 502 Bad Gateway error" -ForegroundColor White
Write-Host ""

Write-Host "Opening SSH connection..." -ForegroundColor Cyan
try {
    Start-Process -FilePath "ssh" -ArgumentList "root@38.180.122.239"
    Write-Host "SSH connection opened" -ForegroundColor Green
} catch {
    Write-Host "Could not open SSH automatically" -ForegroundColor Yellow
    Write-Host "Please connect manually using the commands above" -ForegroundColor Cyan
}
