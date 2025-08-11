# Emergency Server Fix for 502 Bad Gateway
Write-Host "🚨 EMERGENCY SERVER FIX - 502 Bad Gateway" -ForegroundColor Red
Write-Host "=============================================" -ForegroundColor Yellow

# Test current site status
Write-Host "`n🔍 Step 1: Testing current site status..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://smilerentalphuket.com" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Site Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Site Status: $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Red
}

# Server connection details
$serverIP = "38.180.122.239"
$username = "root"
$password = "[REMOVED]"

Write-Host "`n🔧 Step 2: Connecting to server for emergency fix..." -ForegroundColor Cyan
Write-Host "Server: $serverIP" -ForegroundColor Yellow
Write-Host "Username: $username" -ForegroundColor Yellow

# Create fix commands
$fixCommands = @"
cd /var/www/smilerentalphuket.com/site-smile-rental
echo "Current directory: `$(pwd)"
echo "PM2 status before fix:"
pm2 status
echo "Cleaning PM2 processes:"
pm2 delete all || echo "No processes to delete"
echo "Checking files:"
ls -la package.json ecosystem.config.js
echo "Installing dependencies:"
npm install
echo "Building application:"
npm run build
echo "Starting PM2 with ecosystem config:"
pm2 start ecosystem.config.js
echo "PM2 status after fix:"
pm2 status
echo "Testing localhost:"
curl -I http://localhost:3000
echo "Emergency fix completed!"
"@

Write-Host "`n📝 Commands to execute:" -ForegroundColor Yellow
Write-Host $fixCommands -ForegroundColor Gray

Write-Host "`n🚀 Executing fix on server..." -ForegroundColor Cyan

try {
    # Try to execute SSH command
    $sshCommand = "ssh -o StrictHostKeyChecking=no $username@$serverIP `"$fixCommands`""
    Write-Host "SSH Command: $sshCommand" -ForegroundColor Gray
    
    # Execute the command
    Invoke-Expression $sshCommand
    
    Write-Host "`n✅ Server commands executed!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Error executing server commands: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run the commands manually:" -ForegroundColor Yellow
    Write-Host "ssh $username@$serverIP" -ForegroundColor White
    Write-Host "Password: $password" -ForegroundColor White
}

Write-Host "`n⏳ Step 3: Waiting for application to stabilize..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

Write-Host "`n🧪 Step 4: Testing fixed site..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://smilerentalphuket.com" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Site is now working! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "🎉 SUCCESS: 502 error has been resolved!" -ForegroundColor Green
} catch {
    Write-Host "❌ Site still not working: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Manual intervention may be required." -ForegroundColor Yellow
}

Write-Host "`n=============================================" -ForegroundColor Yellow
Write-Host "🎯 Emergency fix process completed!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Yellow
