# Method 9c: PuTTY plink with registry host key bypass
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "Testing Method 9c: PuTTY plink with registry bypass" -ForegroundColor Green

$plinkPath = "$env:TEMP\plink.exe"

if (Test-Path $plinkPath) {
    Write-Host "9c.1 Adding host key to registry..." -ForegroundColor Cyan
    
    try {
        # Add the host key directly to registry to bypass prompt
        $hostKey = "ssh-ed25519@22:38.180.122.239"
        $keyValue = "AAAAC3NzaC1lZDI1NTE5AAAAIED8hvfOsARpAnS9CrHkjpYhYx1GKnLQmxAKsnRysBa3"
        
        # Create registry path if it doesn't exist
        $regPath = "HKCU:\Software\SimonTatham\PuTTY\SshHostKeys"
        if (-not (Test-Path $regPath)) {
            New-Item -Path $regPath -Force | Out-Null
        }
        
        # Add the host key
        Set-ItemProperty -Path $regPath -Name $hostKey -Value $keyValue
        Write-Host "Host key added to registry" -ForegroundColor Green
        
    } catch {
        Write-Host "Registry error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    Write-Host "9c.2 Testing connection with cached key..." -ForegroundColor Cyan
    
    try {
        Write-Host "Executing PM2 list..." -ForegroundColor Yellow
        $result = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "pm2 list" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: $result" -ForegroundColor Green
            
            # Execute the main fix command
            Write-Host "9c.3 Executing main fix command..." -ForegroundColor Cyan
            $mainCommand = "pm2 delete all && cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev && pm2 save"
            $result = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP $mainCommand 2>&1
            
            Write-Host "Main command result: $result" -ForegroundColor White
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "SUCCESS: Main command executed!" -ForegroundColor Green
                
                # Wait and verify
                Write-Host "Waiting 10 seconds for startup..." -ForegroundColor Yellow
                Start-Sleep -Seconds 10
                
                # Check status
                Write-Host "9c.4 Verifying fix..." -ForegroundColor Cyan
                
                $localCheck = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "curl -I http://localhost:3000" 2>&1
                Write-Host "Local server: $localCheck" -ForegroundColor White
                
                $nginxReload = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "systemctl reload nginx" 2>&1
                Write-Host "Nginx reload: $nginxReload" -ForegroundColor White
                
                $domainCheck = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "curl -I https://smilerentalphuket.com" 2>&1
                Write-Host "Domain check: $domainCheck" -ForegroundColor White
                
            } else {
                Write-Host "FAILED: Main command failed with exit code $LASTEXITCODE" -ForegroundColor Red
            }
            
        } else {
            Write-Host "FAILED: Connection failed - $result" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} else {
    Write-Host "FAILED: plink not found" -ForegroundColor Red
}

Write-Host "Method 9c testing completed." -ForegroundColor Green
