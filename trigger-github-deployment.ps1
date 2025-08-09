# Trigger GitHub Actions Deployment
Write-Host "🚀 TRIGGERING GITHUB ACTIONS DEPLOYMENT" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Read server credentials from .env.local
Write-Host "📋 Reading server credentials from .env.local..." -ForegroundColor Cyan
$envContent = Get-Content ".env.local"
$serverIP = ($envContent | Where-Object { $_ -match "SERVER_IP=" }) -replace "SERVER_IP=", ""
$serverUser = ($envContent | Where-Object { $_ -match "SERVER_USER=" }) -replace "SERVER_USER=", ""
$serverPassword = ($envContent | Where-Object { $_ -match "SERVER_PASSWORD=" }) -replace "SERVER_PASSWORD=", ""

Write-Host "✅ Server IP: $serverIP" -ForegroundColor Green
Write-Host "✅ Server User: $serverUser" -ForegroundColor Green
Write-Host "✅ Server Password: [HIDDEN]" -ForegroundColor Green
Write-Host ""

# Check if we're in a git repository
Write-Host "📂 Checking git repository status..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Found changes in repository:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    # Add and commit changes to trigger deployment
    Write-Host "📦 Adding changes to git..." -ForegroundColor Cyan
    git add .
    
    Write-Host "💾 Creating commit to trigger deployment..." -ForegroundColor Cyan
    $commitMessage = "🚀 Trigger automated deployment - Fix 502 error $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMessage
    
    Write-Host "🔄 Pushing to GitHub to trigger deployment..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Changes pushed to GitHub!" -ForegroundColor Green
    Write-Host "🔄 GitHub Actions deployment should start automatically" -ForegroundColor Cyan
    
} else {
    Write-Host "ℹ️ No changes detected. Triggering manual deployment..." -ForegroundColor Yellow
    
    # Create a small change to trigger deployment
    $triggerFile = "deployment-trigger.txt"
    "Deployment triggered at $(Get-Date)" | Out-File -FilePath $triggerFile
    
    git add $triggerFile
    git commit -m "🚀 Manual deployment trigger $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin main
    
    Write-Host "✅ Manual trigger pushed to GitHub!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 GitHub Actions Workflow:" -ForegroundColor Yellow
Write-Host "   https://github.com/1rokoko/site-smile-rental/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What happens next:" -ForegroundColor Yellow
Write-Host "   1. GitHub Actions will detect the push" -ForegroundColor White
Write-Host "   2. Build and test the application" -ForegroundColor White
Write-Host "   3. Deploy to server using SSH" -ForegroundColor White
Write-Host "   4. Start the application with PM2" -ForegroundColor White
Write-Host "   5. Run health checks" -ForegroundColor White
Write-Host ""
Write-Host "⏱️ Expected deployment time: 3-5 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔍 Monitor deployment progress:" -ForegroundColor Green
Write-Host "   Open: https://github.com/1rokoko/site-smile-rental/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Site will be available at:" -ForegroundColor Green
Write-Host "   http://smilerentalphuket.com" -ForegroundColor Cyan

# Wait a moment and then open GitHub Actions page
Write-Host ""
Write-Host "🌐 Opening GitHub Actions page..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
try {
    Start-Process "https://github.com/1rokoko/site-smile-rental/actions"
    Write-Host "✅ GitHub Actions page opened in browser" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not open browser automatically" -ForegroundColor Yellow
}
