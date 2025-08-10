# SSH Fix using Posh-SSH
Import-Module Posh-SSH

$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "CONNECTING TO SERVER..." -ForegroundColor Green

# Create credentials
$securePassword = ConvertTo-SecureString $SERVER_PASSWORD -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($SERVER_USER, $securePassword)

try {
    # Create SSH session
    Write-Host "Creating SSH session..." -ForegroundColor Cyan
    $session = New-SSHSession -ComputerName $SERVER_IP -Credential $credential -AcceptKey

    if ($session) {
        Write-Host "Connected successfully!" -ForegroundColor Green
        
        # 1. Check PM2
        Write-Host "1. Checking PM2..." -ForegroundColor Cyan
        $result1 = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 list"
        Write-Host $result1.Output
        
        # 2. Delete old processes
        Write-Host "2. Deleting old processes..." -ForegroundColor Cyan
        $result2 = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 delete all"
        Write-Host $result2.Output
        
        # 3. Start dev server
        Write-Host "3. Starting dev server..." -ForegroundColor Cyan
        $result3 = Invoke-SSHCommand -SessionId $session.SessionId -Command "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev"
        Write-Host $result3.Output
        
        # 4. Save PM2
        Write-Host "4. Saving PM2..." -ForegroundColor Cyan
        $result4 = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 save"
        Write-Host $result4.Output
        
        # 5. Wait
        Write-Host "5. Waiting 10 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # 6. Check local access
        Write-Host "6. Checking local access..." -ForegroundColor Cyan
        $result5 = Invoke-SSHCommand -SessionId $session.SessionId -Command "curl -I http://localhost:3000"
        Write-Host $result5.Output
        
        # 7. Reload Nginx
        Write-Host "7. Reloading Nginx..." -ForegroundColor Cyan
        $result6 = Invoke-SSHCommand -SessionId $session.SessionId -Command "systemctl reload nginx"
        Write-Host $result6.Output
        
        # 8. Check domain
        Write-Host "8. Checking domain..." -ForegroundColor Cyan
        $result7 = Invoke-SSHCommand -SessionId $session.SessionId -Command "curl -I https://smilerentalphuket.com"
        Write-Host $result7.Output
        
        # Close session
        Remove-SSHSession -SessionId $session.SessionId
        Write-Host "RESTORATION COMPLETED!" -ForegroundColor Green
        
    } else {
        Write-Host "Failed to create SSH session" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
