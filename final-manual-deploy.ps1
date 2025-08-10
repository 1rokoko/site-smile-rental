# Final Manual Deployment Script
Write-Host "🚀 Final Manual Deployment to Server" -ForegroundColor Green

# Load credentials from .env.local
$envContent = Get-Content ".env.local"
$SERVER_IP = ""
$SERVER_USER = ""
$SERVER_PASSWORD = ""

foreach ($line in $envContent) {
    if ($line -like "SERVER_IP=*") {
        $SERVER_IP = $line.Split("=")[1]
    }
    if ($line -like "SERVER_USER=*") {
        $SERVER_USER = $line.Split("=")[1]
    }
    if ($line -like "SERVER_PASSWORD=*") {
        $SERVER_PASSWORD = $line.Split("=")[1]
    }
}

Write-Host "🔗 Connecting to: $SERVER_USER@$SERVER_IP" -ForegroundColor Cyan

# Create deployment commands as a single string
$deployCommands = @"
cd /var/www/site-smile-rental && \
echo '🚀 Starting deployment...' && \
git fetch origin && \
git reset --hard origin/main && \
echo '🧹 Cleaning old build...' && \
rm -rf .next && \
echo '📦 Installing dependencies...' && \
npm ci --production && \
echo '🔨 Building with increased memory...' && \
export NODE_OPTIONS='--max-old-space-size=4096' && \
npm run build && \
if [ \$? -eq 0 ]; then \
    echo '✅ Build successful!' && \
    pm2 stop smile-rental 2>/dev/null || echo 'App was not running' && \
    pm2 delete smile-rental 2>/dev/null || echo 'App was not in PM2' && \
    NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name 'smile-rental' -- start && \
    pm2 save && \
    echo '📊 PM2 Status:' && \
    pm2 status && \
    echo '🎉 Deployment completed successfully!'; \
else \
    echo '❌ Build failed!'; \
fi
"@

Write-Host "▶️ Executing deployment commands..." -ForegroundColor Yellow

try {
    # Use ssh with password authentication
    $sshCommand = "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $SERVER_USER@$SERVER_IP"
    
    # Create a temporary expect-like script for Windows
    $expectScript = @"
@echo off
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $SERVER_USER@$SERVER_IP "$deployCommands"
"@
    
    $expectScript | Out-File -FilePath "temp_ssh.bat" -Encoding ASCII
    
    Write-Host "🔧 Running deployment via SSH..." -ForegroundColor Cyan
    & .\temp_ssh.bat
    
    # Cleanup
    Remove-Item "temp_ssh.bat" -Force -ErrorAction SilentlyContinue
    
    Write-Host "✅ Deployment script executed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🌐 Check site: http://smilerentalphuket.com" -ForegroundColor Yellow
Write-Host "📊 To check PM2 status, run: ssh $SERVER_USER@$SERVER_IP 'pm2 status'" -ForegroundColor Cyan
