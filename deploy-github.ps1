# Deploy using GitHub Actions
Write-Host "TRIGGERING GITHUB ACTIONS DEPLOYMENT" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "Checking git repository status..." -ForegroundColor Cyan
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "Found changes in repository" -ForegroundColor Yellow
    
    # Add and commit changes
    Write-Host "Adding changes to git..." -ForegroundColor Cyan
    git add .
    
    Write-Host "Creating commit to trigger deployment..." -ForegroundColor Cyan
    $commitMessage = "Deploy: Fix 502 error $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMessage
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host ""
    Write-Host "SUCCESS: Changes pushed to GitHub!" -ForegroundColor Green
    Write-Host "GitHub Actions deployment will start automatically" -ForegroundColor Cyan
    
} else {
    Write-Host "No changes detected. Creating trigger..." -ForegroundColor Yellow
    
    # Create trigger file
    "Deployment triggered at $(Get-Date)" | Out-File -FilePath "deployment-trigger.txt"
    
    git add deployment-trigger.txt
    git commit -m "Manual deployment trigger $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin main
    
    Write-Host "SUCCESS: Manual trigger pushed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Monitor deployment at: https://github.com/1rokoko/site-smile-rental/actions" -ForegroundColor Cyan
Write-Host "2. Expected time: 3-5 minutes" -ForegroundColor Cyan
Write-Host "3. Site will be available at: http://smilerentalphuket.com" -ForegroundColor Cyan

# Open GitHub Actions page
Write-Host ""
Write-Host "Opening GitHub Actions page..." -ForegroundColor Cyan
try {
    Start-Process "https://github.com/1rokoko/site-smile-rental/actions"
    Write-Host "GitHub Actions page opened" -ForegroundColor Green
} catch {
    Write-Host "Could not open browser automatically" -ForegroundColor Yellow
}
