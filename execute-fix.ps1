# Node.js Deployment Fix - PowerShell Version
# Based on analysis showing memory issues and SIGKILL failures

Write-Host "========================================" -ForegroundColor Green
Write-Host "NODE.JS DEPLOYMENT FIX - AUTOMATED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will fix the Node.js deployment issues" -ForegroundColor Cyan
Write-Host "identified through commit history analysis." -ForegroundColor Cyan
Write-Host ""

$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

function Execute-SSHCommand {
    param([string]$Command, [string]$Description, [int]$StepNumber)
    
    Write-Host "Step $StepNumber`: $Description" -ForegroundColor Yellow
    Write-Host "Command: $Command" -ForegroundColor Gray
    
    try {
        # Use the working SSH method
        $result = & ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $Command
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS" -ForegroundColor Green
            if ($result) {
                Write-Host "Output: $result" -ForegroundColor White
            }
        } else {
            Write-Host "FAILED (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
            if ($result) {
                Write-Host "Error: $result" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "EXCEPTION: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "$(('-' * 50))" -ForegroundColor Gray
    Write-Host ""
}

# Execute fix steps
Write-Host "PHASE 1: SYSTEM CLEANUP" -ForegroundColor Magenta

Execute-SSHCommand "node -e 'console.log(\"Node.js working:\", process.version)'" "Test Node.js functionality" 1
Execute-SSHCommand "pkill -f node; pkill -f npm" "Kill hanging processes" 2
Execute-SSHCommand "pm2 kill" "Kill PM2 daemon" 3
Execute-SSHCommand "sync && echo 3 > /proc/sys/vm/drop_caches" "Clear system caches" 4
Execute-SSHCommand "npm cache clean --force" "Clear NPM cache" 5

Write-Host "PHASE 2: PROJECT CLEANUP" -ForegroundColor Magenta

Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next .next.backup.* node_modules/.cache" "Remove build artifacts" 6

Write-Host "PHASE 3: MEMORY-OPTIMIZED RESTART" -ForegroundColor Magenta

Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' npm install" "Install dependencies with memory limit" 7
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name smile-rental-dev -- run dev" "Start application in dev mode" 8
Execute-SSHCommand "pm2 save" "Save PM2 configuration" 9

Write-Host "PHASE 4: VERIFICATION" -ForegroundColor Magenta

Execute-SSHCommand "pm2 list" "Check PM2 status" 10
Execute-SSHCommand "systemctl reload nginx" "Reload Nginx" 11
Execute-SSHCommand "curl -I http://localhost:3000" "Test local connectivity" 12
Execute-SSHCommand "curl -I https://smilerentalphuket.com" "Test domain access" 13

Write-Host "========================================" -ForegroundColor Green
Write-Host "FIX EXECUTION COMPLETED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "If all steps completed successfully, the website should be accessible at:" -ForegroundColor Cyan
Write-Host "https://smilerentalphuket.com/" -ForegroundColor White
Write-Host ""
Write-Host "If issues persist, check the COMPREHENSIVE_SOLUTION.md file for alternative solutions." -ForegroundColor Yellow
