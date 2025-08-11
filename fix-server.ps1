# PowerShell script to fix 502 error on server
Write-Host "🔧 Connecting to server to fix 502 error..." -ForegroundColor Yellow

# Execute commands on server
$commands = @(
    "cd /var/www/smilerentalphuket.com/site-smile-rental",
    "echo '=== PM2 STATUS ==='",
    "pm2 status",
    "echo '=== PM2 LOGS ==='", 
    "pm2 logs smile-rental --lines 10",
    "echo '=== CHECKING BUILD ==='",
    "ls -la .next",
    "echo '=== REBUILDING APPLICATION ==='",
    "npm run build",
    "echo '=== RESTARTING PM2 ==='",
    "pm2 restart smile-rental",
    "echo '=== CHECKING PORT 3000 ==='",
    "netstat -tlnp | grep :3000",
    "echo '=== TESTING LOCALHOST ==='",
    "curl -I http://localhost:3000"
)

$commandString = $commands -join " && "
$sshCommand = "ssh root@38.180.122.239 `"$commandString`""

Write-Host "Executing: $sshCommand" -ForegroundColor Green
Invoke-Expression $sshCommand

Write-Host "✅ Server fix completed!" -ForegroundColor Green
