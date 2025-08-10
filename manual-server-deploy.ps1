# Manual Server Deployment Script
# This script will connect to the server and manually deploy the site with proper memory settings

Write-Host "🚀 Manual Server Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please make sure .env.local exists with VPS credentials" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env.local
Write-Host "📋 Loading environment variables..." -ForegroundColor Cyan
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
        Write-Host "✅ Loaded: $name" -ForegroundColor Green
    }
}

# Get credentials
$VPS_HOST = $env:VPS_HOST
$VPS_USERNAME = $env:VPS_USERNAME
$VPS_SSH_KEY_PATH = $env:VPS_SSH_KEY_PATH

if (-not $VPS_HOST -or -not $VPS_USERNAME -or -not $VPS_SSH_KEY_PATH) {
    Write-Host "❌ Error: Missing VPS credentials in .env.local" -ForegroundColor Red
    Write-Host "Required: VPS_HOST, VPS_USERNAME, VPS_SSH_KEY_PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔗 Connecting to VPS: $VPS_USERNAME@$VPS_HOST" -ForegroundColor Cyan

# Create deployment script for server
$deployScript = @"
#!/bin/bash
set -e

echo "🚀 Manual deployment started..."
echo "📅 Time: `$(date)"

# Navigate to project directory
cd /var/www/site-smile-rental

echo "📥 Pulling latest changes..."
git fetch origin
git reset --hard origin/main

echo "🧹 Cleaning old build..."
rm -rf .next

echo "📦 Installing dependencies..."
npm ci --production

echo "🔨 Building with increased memory..."
# Set Node.js memory options for build
export NODE_OPTIONS="--max-old-space-size=4096 --max-semi-space-size=512"

# Build the application
npm run build

if [ `$? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "⏹️ Stopping current PM2 process..."
    pm2 stop smile-rental 2>/dev/null || echo "App was not running"
    pm2 delete smile-rental 2>/dev/null || echo "App was not in PM2"
    
    echo "🚀 Starting application with PM2..."
    # Start with increased memory settings
    NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "smile-rental" -- start
    
    echo "💾 Saving PM2 configuration..."
    pm2 save
    
    echo "📊 PM2 Status:"
    pm2 status
    
    echo "🌐 Testing site..."
    sleep 5
    curl -I http://localhost:3000 || echo "Site may need more time to start"
    
    echo "🎉 Manual deployment completed!"
    echo "🌐 Website: http://smilerentalphuket.com"
    
else
    echo "❌ Build failed!"
    exit 1
fi
"@

# Save deployment script to temp file
$tempScript = [System.IO.Path]::GetTempFileName() + ".sh"
$deployScript | Out-File -FilePath $tempScript -Encoding UTF8

Write-Host "📝 Created deployment script: $tempScript" -ForegroundColor Cyan

# Execute deployment on server
Write-Host "🔧 Executing deployment on server..." -ForegroundColor Yellow

try {
    # Copy script to server and execute
    $scpCommand = "scp -i `"$VPS_SSH_KEY_PATH`" -o StrictHostKeyChecking=no `"$tempScript`" $VPS_USERNAME@$VPS_HOST`:/tmp/deploy.sh"
    Write-Host "📤 Copying script to server..." -ForegroundColor Cyan
    Invoke-Expression $scpCommand
    
    # Make script executable and run it
    $sshCommand = "ssh -i `"$VPS_SSH_KEY_PATH`" -o StrictHostKeyChecking=no $VPS_USERNAME@$VPS_HOST `"chmod +x /tmp/deploy.sh; /tmp/deploy.sh`""
    Write-Host "▶️ Running deployment script..." -ForegroundColor Cyan
    Invoke-Expression $sshCommand
    
    Write-Host "✅ Manual deployment completed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error during deployment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Clean up temp file
    if (Test-Path $tempScript) {
        Remove-Item $tempScript -Force
    }
}

Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check site: http://smilerentalphuket.com" -ForegroundColor White
Write-Host "2. Verify PM2 status on server" -ForegroundColor White
Write-Host "3. Monitor server resources" -ForegroundColor White

Write-Host "✅ Script completed!" -ForegroundColor Green
