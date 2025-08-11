# Simple SSH automation
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "RESTORING SITE..." -ForegroundColor Green

# Function to execute SSH commands
function Execute-Command {
    param([string]$Command, [string]$Description)
    
    Write-Host $Description -ForegroundColor Cyan
    
    # Create temporary expect script
    $expectScript = @"
#!/usr/bin/expect -f
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "$Command"
expect "password:"
send "$SERVER_PASSWORD\r"
expect eof
"@
    
    # Save to temp file
    $tempFile = [System.IO.Path]::GetTempFileName() + ".exp"
    $expectScript | Out-File -FilePath $tempFile -Encoding ASCII
    
    # Execute with WSL
    try {
        $result = wsl expect $tempFile
        Write-Host $result -ForegroundColor White
    } catch {
        Write-Host "Error executing command" -ForegroundColor Red
    } finally {
        Remove-Item $tempFile -ErrorAction SilentlyContinue
    }
    
    Write-Host ""
}

# 1. Check PM2
Execute-Command "pm2 list" "1. Checking PM2..."

# 2. Delete old processes
Execute-Command "pm2 delete all" "2. Deleting old processes..."

# 3. Start dev server
Execute-Command "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev" "3. Starting dev server..."

# 4. Save PM2
Execute-Command "pm2 save" "4. Saving PM2..."

# 5. Wait
Write-Host "5. Waiting 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 6. Check local access
Execute-Command "curl -I http://localhost:3000" "6. Checking local access..."

# 7. Reload Nginx
Execute-Command "systemctl reload nginx" "7. Reloading Nginx..."

# 8. Check domain
Execute-Command "curl -I https://smilerentalphuket.com" "8. Checking domain..."

Write-Host "RESTORATION COMPLETED!" -ForegroundColor Green
