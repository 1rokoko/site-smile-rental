# Direct deployment using credentials from .env.local
Write-Host "DIRECT DEPLOYMENT USING STORED CREDENTIALS" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Read credentials from .env.local
Write-Host "Reading credentials from .env.local..." -ForegroundColor Cyan
$envContent = Get-Content ".env.local"
$serverIP = ($envContent | Where-Object { $_ -match "SERVER_IP=" }) -replace "SERVER_IP=", ""
$serverUser = ($envContent | Where-Object { $_ -match "SERVER_USER=" }) -replace "SERVER_USER=", ""
$serverPassword = ($envContent | Where-Object { $_ -match "SERVER_PASSWORD=" }) -replace "SERVER_PASSWORD=", ""

Write-Host "Server: $serverIP" -ForegroundColor Green
Write-Host "User: $serverUser" -ForegroundColor Green
Write-Host "Password: [LOADED]" -ForegroundColor Green
Write-Host ""

# Create deployment commands
$deployCommands = @(
    "echo 'Starting deployment...'",
    "cd /var/www/smilerentalphuket.com/site-smile-rental",
    "git pull origin main",
    "cd smile-rental-modern",
    "npm install",
    "npm run build",
    "pm2 stop smile-rental || echo 'App not running'",
    "pm2 start npm --name smile-rental -- start",
    "pm2 save",
    "pm2 list",
    "curl -I http://localhost:3000",
    "echo 'Deployment completed'"
)

Write-Host "Executing deployment commands..." -ForegroundColor Cyan
Write-Host ""

foreach ($cmd in $deployCommands) {
    Write-Host "Executing: $cmd" -ForegroundColor Yellow
    
    # Create a temporary expect-like script
    $tempScript = @"
@echo off
echo $serverPassword | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=nul $serverUser@$serverIP "$cmd"
"@
    
    $tempFile = "temp_deploy_cmd.bat"
    $tempScript | Out-File -FilePath $tempFile -Encoding ASCII
    
    try {
        & cmd /c $tempFile
        Write-Host "Command completed" -ForegroundColor Green
    } catch {
        Write-Host "Command failed: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
}

Write-Host "Testing site after deployment..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "SUCCESS! Site is working!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Size: $($response.Content.Length) bytes" -ForegroundColor Green
    
    # Open in browser
    Start-Process "http://smilerentalphuket.com"
    
} catch {
    Write-Host "Site still not working: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual steps needed:" -ForegroundColor Yellow
    Write-Host "1. ssh $serverUser@$serverIP" -ForegroundColor Cyan
    Write-Host "2. cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor Cyan
    Write-Host "3. pm2 start npm --name smile-rental -- start" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "DEPLOYMENT COMPLETED" -ForegroundColor Green
