# Monitor GitHub Actions Deployment
Write-Host "MONITORING GITHUB ACTIONS DEPLOYMENT" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Deployment Status:" -ForegroundColor Yellow
Write-Host "- Commit: f4c6e5d" -ForegroundColor Cyan
Write-Host "- Files: 40 files changed, 2146 insertions" -ForegroundColor Cyan
Write-Host "- Trigger: Deploy: Fix 502 error 2025-08-09 11:54" -ForegroundColor Cyan
Write-Host ""

Write-Host "GitHub Actions Workflow includes:" -ForegroundColor Yellow
Write-Host "1. Build and test application" -ForegroundColor White
Write-Host "2. Deploy to VPS server" -ForegroundColor White
Write-Host "3. Fix Next.js configuration" -ForegroundColor White
Write-Host "4. Install dependencies and build" -ForegroundColor White
Write-Host "5. Start application with PM2" -ForegroundColor White
Write-Host "6. Run health checks" -ForegroundColor White
Write-Host "7. Security and functionality tests" -ForegroundColor White
Write-Host ""

Write-Host "Expected timeline:" -ForegroundColor Yellow
Write-Host "- Build phase: 1-2 minutes" -ForegroundColor Cyan
Write-Host "- Deployment phase: 2-3 minutes" -ForegroundColor Cyan
Write-Host "- Health checks: 30 seconds" -ForegroundColor Cyan
Write-Host "- Total: 3-5 minutes" -ForegroundColor Cyan
Write-Host ""

# Wait for deployment to start
Write-Host "Waiting for deployment to process..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Test site periodically
$maxAttempts = 10
$attempt = 1

Write-Host "Testing site availability..." -ForegroundColor Cyan
while ($attempt -le $maxAttempts) {
    Write-Host "Attempt $attempt/$maxAttempts..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "SUCCESS! Site is working!" -ForegroundColor Green
            Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "Response Size: $($response.Content.Length) bytes" -ForegroundColor Green
            
            # Check for proper content
            if ($response.Content -match "Smile Rental|scooter|rental") {
                Write-Host "Content verification: PASSED" -ForegroundColor Green
            } else {
                Write-Host "Content verification: WARNING - may need review" -ForegroundColor Yellow
            }
            
            Write-Host ""
            Write-Host "Opening site in browser..." -ForegroundColor Cyan
            Start-Process "http://smilerentalphuket.com"
            break
        }
    } catch {
        $errorMessage = $_.Exception.Message
        if ($errorMessage -match "502") {
            Write-Host "Still getting 502 error - deployment in progress..." -ForegroundColor Yellow
        } else {
            Write-Host "Error: $errorMessage" -ForegroundColor Red
        }
    }
    
    if ($attempt -lt $maxAttempts) {
        Write-Host "Waiting 30 seconds before next check..." -ForegroundColor Cyan
        Start-Sleep -Seconds 30
    }
    
    $attempt++
}

if ($attempt -gt $maxAttempts) {
    Write-Host ""
    Write-Host "Deployment may still be in progress." -ForegroundColor Yellow
    Write-Host "Check GitHub Actions for detailed status:" -ForegroundColor Cyan
    Write-Host "https://github.com/1rokoko/site-smile-rental/actions" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "DEPLOYMENT MONITORING COMPLETED" -ForegroundColor Green
