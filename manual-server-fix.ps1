# Manual server fix for 502 Bad Gateway
Write-Host "🔧 MANUAL SERVER FIX: Resolving 502 Bad Gateway" -ForegroundColor Yellow

$serverIP = "38.180.122.239"
$username = "root"
$password = "[REMOVED]"

Write-Host "Step 1: Connecting to server and diagnosing issue..." -ForegroundColor Cyan

# Create a temporary script file for server commands
$serverCommands = @"
#!/bin/bash
cd /var/www/smilerentalphuket.com/site-smile-rental
echo "=== CURRENT DIRECTORY ==="
pwd
echo "=== PM2 STATUS ==="
pm2 status
echo "=== CLEANING PM2 ==="
pm2 delete all || echo "No processes to delete"
echo "=== CHECKING FILES ==="
ls -la package.json
ls -la ecosystem.config.js
echo "=== CHECKING .NEXT ==="
ls -la .next/
echo "=== REBUILDING APPLICATION ==="
npm install
npm run build
echo "=== STARTING APPLICATION ==="
pm2 start ecosystem.config.js
echo "=== FINAL STATUS ==="
pm2 status
echo "=== TESTING LOCAL CONNECTION ==="
curl -I http://localhost:3000
echo "=== FIX COMPLETED ==="
"@

# Save commands to a temporary file
$tempFile = "temp-server-fix.sh"
$serverCommands | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Step 2: Uploading and executing fix script..." -ForegroundColor Cyan

# Use SCP to upload the script and then execute it
try {
    # Upload the script
    Write-Host "Uploading fix script to server..." -ForegroundColor Yellow
    & scp -o StrictHostKeyChecking=no $tempFile "${username}@${serverIP}:/tmp/fix-script.sh"
    
    # Execute the script
    Write-Host "Executing fix script on server..." -ForegroundColor Yellow
    & ssh -o StrictHostKeyChecking=no "${username}@${serverIP}" "chmod +x /tmp/fix-script.sh && /tmp/fix-script.sh"
    
    Write-Host "✅ Server fix completed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error during server fix: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Direct SSH command
    $directCommands = "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 delete all && npm run build && pm2 start ecosystem.config.js && pm2 status"
    & ssh -o StrictHostKeyChecking=no "${username}@${serverIP}" $directCommands
}

# Clean up temporary file
Remove-Item $tempFile -ErrorAction SilentlyContinue

Write-Host "🧪 Testing site status..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Test the site
try {
    $response = Invoke-WebRequest -Uri "https://smilerentalphuket.com" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Site is responding! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Site still not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check server logs manually." -ForegroundColor Yellow
}

Write-Host "Manual fix process completed!" -ForegroundColor Green
