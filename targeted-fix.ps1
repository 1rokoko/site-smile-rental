# Targeted Node.js Deployment Fix
# Based on analysis of recent commits showing memory issues and SIGKILL failures

$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "TARGETED NODE.JS DEPLOYMENT FIX" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host "Based on commit history analysis showing memory issues and SIGKILL failures" -ForegroundColor Cyan
Write-Host ""

function Execute-Fix {
    param([string]$Command, [string]$Description)
    
    Write-Host "EXECUTING: $Description" -ForegroundColor Yellow
    Write-Host "Command: $Command" -ForegroundColor Gray
    
    # Use the confirmed working SSH Method 6.1 approach
    $process = Start-Process -FilePath "ssh" -ArgumentList "-o", "StrictHostKeyChecking=no", "$SERVER_USER@$SERVER_IP", $Command -PassThru -Wait -NoNewWindow
    
    if ($process.ExitCode -eq 0) {
        Write-Host "SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "FAILED (Exit Code: $($process.ExitCode))" -ForegroundColor Red
    }
    
    Write-Host "$(('-' * 50))" -ForegroundColor Gray
    Write-Host ""
}

# Step 1: Clean up memory and processes
Write-Host "PHASE 1: SYSTEM CLEANUP" -ForegroundColor Magenta
Write-Host "Addressing memory issues identified in recent commits" -ForegroundColor Cyan

# Kill any hanging Node.js processes
Execute-Fix "pkill -f node" "Kill hanging Node.js processes"
Execute-Fix "pkill -f npm" "Kill hanging NPM processes"

# Clean PM2 completely
Execute-Fix "pm2 kill" "Kill PM2 daemon"
Execute-Fix "pm2 delete all" "Delete all PM2 processes"

# Clear system caches (from emergency memory fix commit)
Execute-Fix "sync && echo 3 > /proc/sys/vm/drop_caches" "Clear system caches"
Execute-Fix "npm cache clean --force" "Clear NPM cache"

# Step 2: Clean project directory
Write-Host "PHASE 2: PROJECT CLEANUP" -ForegroundColor Magenta
Write-Host "Removing corrupted build artifacts" -ForegroundColor Cyan

Execute-Fix "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next" "Remove .next build directory"
Execute-Fix "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf node_modules/.cache" "Remove node_modules cache"
Execute-Fix "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next.backup.*" "Remove backup directories"

# Step 3: Verify Node.js installation
Write-Host "PHASE 3: NODE.JS VERIFICATION" -ForegroundColor Magenta
Write-Host "Testing Node.js installation integrity" -ForegroundColor Cyan

Execute-Fix "node --version" "Check Node.js version"
Execute-Fix "npm --version" "Check NPM version"
Execute-Fix "which node" "Verify Node.js location"

# Step 4: Test basic Node.js functionality
Write-Host "PHASE 4: FUNCTIONALITY TEST" -ForegroundColor Magenta
Write-Host "Testing basic Node.js execution" -ForegroundColor Cyan

Execute-Fix "node -e 'console.log(\"Node.js is working\")'" "Test Node.js execution"
Execute-Fix "npm list -g --depth=0" "Check global packages"

# Step 5: Reinstall dependencies with memory optimization
Write-Host "PHASE 5: DEPENDENCY RESTORATION" -ForegroundColor Magenta
Write-Host "Reinstalling with memory optimization (from memory fix commits)" -ForegroundColor Cyan

Execute-Fix "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' npm install" "Install dependencies with memory limit"

# Step 6: Test PM2 functionality
Write-Host "PHASE 6: PM2 RESTORATION" -ForegroundColor Magenta
Write-Host "Restoring PM2 process management" -ForegroundColor Cyan

Execute-Fix "pm2 --version" "Verify PM2 installation"
Execute-Fix "pm2 list" "Check PM2 status"

Write-Host "TARGETED FIX COMPLETED" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. If Node.js tests passed, try starting the application" -ForegroundColor White
Write-Host "2. If Node.js tests failed, Node.js installation needs repair/reinstall" -ForegroundColor White
Write-Host "3. Monitor memory usage during application startup" -ForegroundColor White
Write-Host "4. Use development mode first to test functionality" -ForegroundColor White
