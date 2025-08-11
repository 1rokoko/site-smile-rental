# Quick Server Diagnostics using Working Method
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "QUICK SERVER DIAGNOSTICS" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

function Run-Diagnostic {
    param([string]$Command, [string]$Description)
    
    Write-Host "CHECKING: $Description" -ForegroundColor Cyan
    Write-Host "Command: $Command" -ForegroundColor Gray
    
    try {
        $result = Write-Output $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $Command
        if ($result) {
            Write-Host "RESULT:" -ForegroundColor Green
            Write-Host $result -ForegroundColor White
        } else {
            Write-Host "NO OUTPUT" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "$(('-' * 50))" -ForegroundColor Gray
    Write-Host ""
}

# Run key diagnostics
Write-Host "MEMORY USAGE:" -ForegroundColor Magenta
Run-Diagnostic "free -h" "Memory Status"

Write-Host "NODE.JS ENVIRONMENT:" -ForegroundColor Magenta
Run-Diagnostic "node --version" "Node.js Version"
Run-Diagnostic "npm --version" "NPM Version"
Run-Diagnostic "which node" "Node.js Location"
Run-Diagnostic "which npm" "NPM Location"

Write-Host "PM2 STATUS:" -ForegroundColor Magenta
Run-Diagnostic "pm2 --version" "PM2 Version"
Run-Diagnostic "pm2 list" "PM2 Process List"

Write-Host "BASIC SYSTEM INFO:" -ForegroundColor Magenta
Run-Diagnostic "uptime" "System Uptime"
Run-Diagnostic "ps aux | grep node | grep -v grep" "Node Processes"

Write-Host "PROJECT DIRECTORY:" -ForegroundColor Magenta
Run-Diagnostic "ls -la /var/www/smilerentalphuket.com/site-smile-rental/" "Project Directory"
Run-Diagnostic "ls -la /var/www/smilerentalphuket.com/site-smile-rental/.next/" "Build Directory"

Write-Host "NETWORK PORTS:" -ForegroundColor Magenta
Run-Diagnostic "netstat -tlnp | grep :3000" "Port 3000 Status"

Write-Host "DIAGNOSTICS COMPLETED" -ForegroundColor Green
Write-Host "Review the output above to identify issues" -ForegroundColor Cyan
