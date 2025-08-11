# Deploy performance optimizations to production
Write-Host "🚀 Deploying performance optimizations..." -ForegroundColor Green

# Function to execute SSH commands
function Execute-SSHCommand {
    param([string]$Command)
    
    Write-Host "Executing: $Command" -ForegroundColor Cyan
    $result = ssh -o StrictHostKeyChecking=no root@38.180.122.239 $Command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Success" -ForegroundColor Green
        return $result
    } else {
        Write-Host "❌ Failed with exit code $LASTEXITCODE" -ForegroundColor Red
        return $null
    }
}

try {
    # Step 1: Upload optimized next.config.ts
    Write-Host "📤 Uploading optimized next.config.ts..." -ForegroundColor Yellow
    scp next.config.ts root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/
    
    # Step 2: Upload optimized package.json
    Write-Host "📤 Uploading optimized package.json..." -ForegroundColor Yellow
    scp package.json root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/
    
    # Step 3: Upload optimized source files
    Write-Host "📤 Uploading optimized source files..." -ForegroundColor Yellow
    scp -r src/ root@38.180.122.239:/var/www/smilerentalphuket.com/site-smile-rental/
    
    # Step 4: Install dependencies and rebuild
    Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow
    Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"
    
    # Step 5: Clean build
    Write-Host "🧹 Cleaning old build..." -ForegroundColor Yellow
    Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next"
    
    # Step 6: Build optimized version
    Write-Host "🏗️ Building optimized version..." -ForegroundColor Yellow
    Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=4096' npm run build"
    
    # Step 7: Restart PM2
    Write-Host "🔄 Restarting PM2..." -ForegroundColor Yellow
    Execute-SSHCommand "pm2 restart smile-rental"
    
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Test the site: https://smilerentalphuket.com" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Deployment failed: $_" -ForegroundColor Red
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
