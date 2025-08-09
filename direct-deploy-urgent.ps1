# URGENT DIRECT DEPLOYMENT SCRIPT - BYPASS GITHUB
# Deploys files directly to server via SCP
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"
$SERVER_PATH = "/var/www/smilerentalphuket.com/site-smile-rental"
$LOCAL_PATH = "smile-rental-modern"

Write-Host "🚨 URGENT DEPLOYMENT - BYPASSING GITHUB" -ForegroundColor Red
Write-Host "🎯 Target: $SERVER_IP" -ForegroundColor Yellow
Write-Host "📁 Source: $LOCAL_PATH" -ForegroundColor Yellow
Write-Host ""

# Function to run SSH commands
function Run-SSHCommand {
    param($command)
    Write-Host "🔧 Executing: $command" -ForegroundColor Cyan
    $result = echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $command
    return $result
}

# Function to upload files via SCP
function Upload-Files {
    param($localPath, $remotePath, $excludePattern = "")
    Write-Host "📤 Uploading $localPath to $remotePath" -ForegroundColor Green
    
    if ($excludePattern) {
        # Use rsync for selective upload with exclusions
        $rsyncCmd = "rsync -avz --delete --exclude='node_modules' --exclude='out' --exclude='.next' --exclude='*.log' --exclude='.git' $localPath/ $SERVER_USER@${SERVER_IP}:$remotePath/"
        Write-Host "🔄 Using rsync: $rsyncCmd" -ForegroundColor Cyan
        $env:RSYNC_PASSWORD = $SERVER_PASSWORD
        & rsync -avz --delete --exclude='node_modules' --exclude='out' --exclude='.next' --exclude='*.log' --exclude='.git' "$localPath/" "${SERVER_USER}@${SERVER_IP}:$remotePath/"
    } else {
        # Fallback to SCP
        echo $SERVER_PASSWORD | scp -o StrictHostKeyChecking=no -r $localPath/* $SERVER_USER@${SERVER_IP}:$remotePath/
    }
}

Write-Host "Step 1: Backing up current deployment..." -ForegroundColor Cyan
Run-SSHCommand "cd $SERVER_PATH && cp -r . ../backup-$(date +%Y%m%d-%H%M%S) || true"

Write-Host ""
Write-Host "Step 2: Stopping PM2 process..." -ForegroundColor Cyan
Run-SSHCommand "pm2 stop smile-rental || true"

Write-Host ""
Write-Host "Step 3: Uploading files directly to server..." -ForegroundColor Cyan
# Create target directory if it doesn't exist
Run-SSHCommand "mkdir -p $SERVER_PATH"

# Upload files excluding build artifacts and dependencies
try {
    Upload-Files $LOCAL_PATH $SERVER_PATH "exclude"
    Write-Host "✅ Files uploaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed, trying alternative method..." -ForegroundColor Red
    # Fallback: upload individual directories
    echo $SERVER_PASSWORD | scp -o StrictHostKeyChecking=no -r "$LOCAL_PATH/src" "$LOCAL_PATH/public" "$LOCAL_PATH/package.json" "$LOCAL_PATH/package-lock.json" "$LOCAL_PATH/next.config.ts" "$LOCAL_PATH/tsconfig.json" $SERVER_USER@${SERVER_IP}:$SERVER_PATH/
}

Write-Host ""
Write-Host "Step 4: Installing dependencies..." -ForegroundColor Cyan
Run-SSHCommand "cd $SERVER_PATH && npm install --production=false"

Write-Host ""
Write-Host "Step 5: Building application..." -ForegroundColor Cyan
Run-SSHCommand "cd $SERVER_PATH && npm run build"

Write-Host ""
Write-Host "Step 6: Starting PM2 process..." -ForegroundColor Cyan
Run-SSHCommand "cd $SERVER_PATH && pm2 start npm --name smile-rental -- start"

Write-Host ""
Write-Host "Step 7: Checking deployment status..." -ForegroundColor Cyan
Run-SSHCommand "pm2 status"
Run-SSHCommand "pm2 logs smile-rental --lines 5"

Write-Host ""
Write-Host "Step 8: Testing website accessibility..." -ForegroundColor Cyan
Run-SSHCommand "curl -I http://localhost:3000"
Run-SSHCommand "curl -I http://smilerentalphuket.com"

Write-Host ""
Write-Host "🎉 URGENT DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "🌐 Website: http://smilerentalphuket.com" -ForegroundColor Yellow
Write-Host "📊 Check status: pm2 status" -ForegroundColor Yellow
Write-Host "📋 View logs: pm2 logs smile-rental" -ForegroundColor Yellow
