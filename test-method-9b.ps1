# Method 9b: PuTTY plink with host key acceptance
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "Testing Method 9b: PuTTY plink with host key acceptance" -ForegroundColor Green

$plinkPath = "$env:TEMP\plink.exe"

if (Test-Path $plinkPath) {
    Write-Host "9b.1 Adding host key to cache..." -ForegroundColor Cyan
    
    # First, accept the host key by connecting once
    try {
        Write-Host "Accepting host key..." -ForegroundColor Yellow
        $result = echo "y" | & $plinkPath -ssh -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "echo 'Host key accepted'" 2>&1
        Write-Host "Host key result: $result" -ForegroundColor White
    } catch {
        Write-Host "Host key acceptance error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    Write-Host "9b.2 Testing connection after host key acceptance..." -ForegroundColor Cyan
    
    try {
        Write-Host "Executing PM2 command..." -ForegroundColor Yellow
        $result = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "pm2 list" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: $result" -ForegroundColor Green
            
            # If successful, execute the main command
            Write-Host "9b.3 Executing main fix command..." -ForegroundColor Cyan
            $mainCommand = "pm2 delete all && cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev && pm2 save"
            $result = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP $mainCommand 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "SUCCESS: Main command executed - $result" -ForegroundColor Green
                
                # Wait and check status
                Write-Host "Waiting 10 seconds..." -ForegroundColor Yellow
                Start-Sleep -Seconds 10
                
                Write-Host "9b.4 Checking server status..." -ForegroundColor Cyan
                $statusResult = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "curl -I http://localhost:3000" 2>&1
                Write-Host "Local server check: $statusResult" -ForegroundColor White
                
                $nginxResult = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "systemctl reload nginx" 2>&1
                Write-Host "Nginx reload: $nginxResult" -ForegroundColor White
                
                $domainResult = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "curl -I https://smilerentalphuket.com" 2>&1
                Write-Host "Domain check: $domainResult" -ForegroundColor White
                
            } else {
                Write-Host "FAILED: Main command failed - $result" -ForegroundColor Red
            }
            
        } else {
            Write-Host "FAILED: PM2 list failed - $result" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} else {
    Write-Host "FAILED: plink not found at $plinkPath" -ForegroundColor Red
}

Write-Host "Method 9b testing completed." -ForegroundColor Green
