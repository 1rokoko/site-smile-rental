# Server deployment script
$password = "925LudK9Bv"
$server = "38.180.122.239"
$user = "root"

Write-Host "========================================" -ForegroundColor Green
Write-Host "SERVER DIAGNOSTICS AND DEPLOYMENT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

function Execute-SSHCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host $Description -ForegroundColor Cyan
    
    # Use plink if available, otherwise regular ssh
    try {
        $result = & echo $password | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=nul $user@$server $Command 2>&1
        Write-Host $result -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# 1. Check disk space
Execute-SSHCommand "df -h" "1. Checking disk space..."

# 2. Check PM2 status
Execute-SSHCommand "pm2 list" "2. Checking PM2 status..."

# 3. Check Nginx status
Execute-SSHCommand "systemctl status nginx --no-pager -l | head -10" "3. Checking Nginx status..."

# 4. Check project directory
Execute-SSHCommand "ls -la /var/www/smilerentalphuket.com/site-smile-rental/" "4. Checking project directory..."

# 5. Update from GitHub
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main" "5. Updating project from GitHub..."

# 6. Install dependencies
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm install" "6. Installing dependencies..."

# 7. Build project
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm run build" "7. Building project..."

# 8. Start application
Execute-SSHCommand "pm2 stop smile-rental || echo 'App was not running'" "8a. Stopping old application..."
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pm2 start npm --name smile-rental -- start" "8b. Starting new application..."
Execute-SSHCommand "pm2 save" "8c. Saving PM2 configuration..."

# 9. Final status
Execute-SSHCommand "pm2 list" "9. Final PM2 status..."

# 10. Test site
Execute-SSHCommand "curl -I http://localhost:3000" "10. Testing local site..."

Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
