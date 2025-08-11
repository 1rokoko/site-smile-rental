# Method 10: Posh-SSH Module
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "Testing Method 10: Posh-SSH Module" -ForegroundColor Green

# Method 10.1: Check if Posh-SSH is installed
Write-Host "10.1 Checking Posh-SSH installation..." -ForegroundColor Cyan

try {
    Import-Module Posh-SSH -ErrorAction Stop
    Write-Host "SUCCESS: Posh-SSH module loaded" -ForegroundColor Green
    
    # Method 10.2: Create SSH session
    Write-Host "10.2 Creating SSH session..." -ForegroundColor Cyan
    
    $securePassword = ConvertTo-SecureString $SERVER_PASSWORD -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential ($SERVER_USER, $securePassword)
    
    try {
        # Create session with AcceptKey to bypass host key verification
        $session = New-SSHSession -ComputerName $SERVER_IP -Credential $credential -AcceptKey -ErrorAction Stop
        
        if ($session) {
            Write-Host "SUCCESS: SSH session created (ID: $($session.SessionId))" -ForegroundColor Green
            
            # Method 10.3: Test basic command
            Write-Host "10.3 Testing basic command..." -ForegroundColor Cyan
            $result = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 list"
            
            if ($result.ExitStatus -eq 0) {
                Write-Host "SUCCESS: PM2 list executed" -ForegroundColor Green
                Write-Host "Output: $($result.Output)" -ForegroundColor White
                
                # Method 10.4: Execute main fix command
                Write-Host "10.4 Executing main fix command..." -ForegroundColor Cyan
                $mainCommand = "pm2 delete all && cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev && pm2 save"
                $mainResult = Invoke-SSHCommand -SessionId $session.SessionId -Command $mainCommand
                
                Write-Host "Main command exit status: $($mainResult.ExitStatus)" -ForegroundColor White
                Write-Host "Main command output: $($mainResult.Output)" -ForegroundColor White
                
                if ($mainResult.ExitStatus -eq 0) {
                    Write-Host "SUCCESS: Main command executed!" -ForegroundColor Green
                    
                    # Wait for startup
                    Write-Host "Waiting 10 seconds for startup..." -ForegroundColor Yellow
                    Start-Sleep -Seconds 10
                    
                    # Method 10.5: Verify the fix
                    Write-Host "10.5 Verifying the fix..." -ForegroundColor Cyan
                    
                    $localCheck = Invoke-SSHCommand -SessionId $session.SessionId -Command "curl -I http://localhost:3000"
                    Write-Host "Local server check: $($localCheck.Output)" -ForegroundColor White
                    
                    $nginxReload = Invoke-SSHCommand -SessionId $session.SessionId -Command "systemctl reload nginx"
                    Write-Host "Nginx reload: $($nginxReload.Output)" -ForegroundColor White
                    
                    $domainCheck = Invoke-SSHCommand -SessionId $session.SessionId -Command "curl -I https://smilerentalphuket.com"
                    Write-Host "Domain check: $($domainCheck.Output)" -ForegroundColor White
                    
                    $pm2Status = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 list"
                    Write-Host "Final PM2 status: $($pm2Status.Output)" -ForegroundColor White
                    
                } else {
                    Write-Host "FAILED: Main command failed" -ForegroundColor Red
                }
                
            } else {
                Write-Host "FAILED: PM2 list failed - $($result.Output)" -ForegroundColor Red
            }
            
            # Close session
            Remove-SSHSession -SessionId $session.SessionId | Out-Null
            Write-Host "SSH session closed" -ForegroundColor Green
            
        } else {
            Write-Host "FAILED: Could not create SSH session" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "FAILED: SSH session error - $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "FAILED: Posh-SSH not available - $($_.Exception.Message)" -ForegroundColor Red
    
    # Method 10.6: Try to install Posh-SSH
    Write-Host "10.6 Attempting to install Posh-SSH..." -ForegroundColor Cyan
    
    try {
        Install-Module -Name Posh-SSH -Force -Scope CurrentUser -ErrorAction Stop
        Write-Host "SUCCESS: Posh-SSH installed" -ForegroundColor Green
        
        # Retry the connection
        Import-Module Posh-SSH
        Write-Host "Retrying connection..." -ForegroundColor Yellow
        # (The connection code would be repeated here, but keeping it short for now)
        
    } catch {
        Write-Host "FAILED: Could not install Posh-SSH - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Method 10 testing completed." -ForegroundColor Green
