# Fix Nginx Configuration for Site Smile Rental
# Using Method 6.1 SSH approach

Write-Host "=== FIXING NGINX CONFIGURATION ===" -ForegroundColor Green

# Create SSH commands to execute
$sshCommands = @(
    "echo '=== PM2 STATUS ==='"
    "pm2 list"
    "echo '=== CHECKING NGINX CONFIG ==='"
    "cat /etc/nginx/sites-available/smilerentalphuket.com"
    "echo '=== CHECKING IF SITE IS ENABLED ==='"
    "ls -la /etc/nginx/sites-enabled/"
    "echo '=== TESTING NGINX CONFIG ==='"
    "nginx -t"
    "echo '=== RESTARTING PM2 PROCESS ==='"
    "pm2 delete all"
    "cd /var/www/smilerentalphuket.com/site-smile-rental"
    "pm2 start 'npm run dev' --name smile-rental-dev"
    "pm2 save"
    "echo '=== RESTARTING NGINX ==='"
    "systemctl restart nginx"
    "echo '=== FINAL STATUS CHECK ==='"
    "pm2 list"
    "systemctl status nginx --no-pager"
)

Write-Host "Commands to execute via SSH:" -ForegroundColor Yellow
foreach ($cmd in $sshCommands) {
    Write-Host "  $cmd" -ForegroundColor Cyan
}

Write-Host "`nNow launching interactive SSH session..." -ForegroundColor Yellow
Write-Host "You will need to:" -ForegroundColor Red
Write-Host "1. Enter password: 925LudK9Bv" -ForegroundColor Red
Write-Host "2. Execute the commands above manually" -ForegroundColor Red

# Launch SSH session
Start-Process -FilePath "ssh" -ArgumentList "root@38.180.122.239" -Wait
