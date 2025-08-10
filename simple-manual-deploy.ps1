# Simple Manual Server Deployment Script
Write-Host "🚀 Simple Manual Server Deployment" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    exit 1
}

# Load environment variables
$envContent = Get-Content ".env.local"
$VPS_HOST = ""
$VPS_USERNAME = ""
$VPS_SSH_KEY_PATH = ""

foreach ($line in $envContent) {
    if ($line -like "VPS_HOST=*") {
        $VPS_HOST = $line.Split("=")[1]
    }
    if ($line -like "VPS_USERNAME=*") {
        $VPS_USERNAME = $line.Split("=")[1]
    }
    if ($line -like "VPS_SSH_KEY_PATH=*") {
        $VPS_SSH_KEY_PATH = $line.Split("=")[1]
    }
}

Write-Host "🔗 Connecting to: $VPS_USERNAME@$VPS_HOST" -ForegroundColor Cyan

# Create simple deployment commands
$commands = @"
cd /var/www/site-smile-rental
echo '🚀 Starting manual deployment...'
git fetch origin
git reset --hard origin/main
echo '🧹 Cleaning old build...'
rm -rf .next
echo '📦 Installing dependencies...'
npm ci --production
echo '🔨 Building with increased memory...'
export NODE_OPTIONS='--max-old-space-size=4096'
npm run build
if [ `$? -eq 0 ]; then
    echo '✅ Build successful!'
    pm2 stop smile-rental 2>/dev/null || echo 'App was not running'
    pm2 delete smile-rental 2>/dev/null || echo 'App was not in PM2'
    NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name 'smile-rental' -- start
    pm2 save
    echo '📊 PM2 Status:'
    pm2 status
    echo '🎉 Deployment completed!'
else
    echo '❌ Build failed!'
fi
"@

# Execute commands on server
Write-Host "▶️ Executing deployment commands..." -ForegroundColor Yellow

$sshCmd = "ssh -i `"$VPS_SSH_KEY_PATH`" -o StrictHostKeyChecking=no $VPS_USERNAME@$VPS_HOST"
$fullCommand = "$sshCmd `"$commands`""

try {
    Invoke-Expression $fullCommand
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🌐 Check site: http://smilerentalphuket.com" -ForegroundColor Yellow
