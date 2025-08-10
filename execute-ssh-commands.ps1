# Execute SSH Commands for Site Smile Rental
# Using Method 6.1 approach with individual commands

Write-Host "=== EXECUTING SSH COMMANDS ===" -ForegroundColor Green

# Function to execute SSH command
function Execute-SSHCommand {
    param($command)
    Write-Host "`nExecuting: $command" -ForegroundColor Yellow
    
    # Create temporary file with password and command
    $tempFile = "temp-ssh-cmd.txt"
    @"
925LudK9Bv
$command
exit
"@ | Out-File -FilePath $tempFile -Encoding ASCII
    
    try {
        $result = wsl bash -c "ssh root@38.180.122.239 < $tempFile" 2>&1
        Write-Host "Result: $result" -ForegroundColor Cyan
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        return $result
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        return $null
    }
}

# Execute commands one by one
Write-Host "1. Checking PM2 status..." -ForegroundColor Magenta
Execute-SSHCommand "pm2 list"

Write-Host "`n2. Stopping all PM2 processes..." -ForegroundColor Magenta
Execute-SSHCommand "pm2 delete all"

Write-Host "`n3. Starting new PM2 process..." -ForegroundColor Magenta
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev"

Write-Host "`n4. Saving PM2 configuration..." -ForegroundColor Magenta
Execute-SSHCommand "pm2 save"

Write-Host "`n5. Testing Nginx configuration..." -ForegroundColor Magenta
Execute-SSHCommand "nginx -t"

Write-Host "`n6. Restarting Nginx..." -ForegroundColor Magenta
Execute-SSHCommand "systemctl restart nginx"

Write-Host "`n7. Final PM2 status check..." -ForegroundColor Magenta
Execute-SSHCommand "pm2 list"

Write-Host "`n8. Testing local connection..." -ForegroundColor Magenta
Execute-SSHCommand "curl -I http://localhost:3000"

Write-Host "`n=== SSH COMMANDS COMPLETED ===" -ForegroundColor Green
