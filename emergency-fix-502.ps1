# Emergency fix for 502 Bad Gateway error
Write-Host "🔧 EMERGENCY FIX: Resolving 502 Bad Gateway error" -ForegroundColor Yellow

$serverIP = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

# Commands to execute on server
$commands = @"
cd /var/www/smilerentalphuket.com/site-smile-rental
echo '📋 Current directory:'
pwd
echo '📋 Checking PM2 status:'
pm2 status
echo '📋 Cleaning PM2 processes:'
pm2 delete all || echo 'No processes to delete'
echo '📋 Checking package.json:'
ls -la package.json
echo '📋 Checking .next directory:'
ls -la .next/
echo '📋 Checking ecosystem config:'
cat ecosystem.config.js
echo '🔨 Rebuilding application:'
npm run build
echo '🚀 Starting PM2:'
pm2 start npm --name smile-rental -- start
echo '✅ Checking status:'
pm2 status
curl -I http://localhost:3000
echo '🎉 Done!'
"@

Write-Host "Connecting to server $serverIP..." -ForegroundColor Cyan

# Use plink for automated SSH connection
$plinkPath = "plink"
try {
    # Try to connect using plink with password
    echo $password | & $plinkPath -ssh -batch -pw $password $username@$serverIP $commands
} catch {
    Write-Host "Plink not found, trying direct SSH..." -ForegroundColor Yellow
    
    # Fallback to direct SSH (will require manual password entry)
    ssh -o StrictHostKeyChecking=no $username@$serverIP $commands
}

Write-Host "Emergency fix completed!" -ForegroundColor Green
