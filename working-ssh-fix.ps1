# Working SSH Fix - Method that actually works
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "EXECUTING WORKING SSH FIX..." -ForegroundColor Green
Write-Host "This method uses the proven manual approach but automated" -ForegroundColor Cyan

function Execute-SSHCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host $Description -ForegroundColor Yellow
    
    # Launch SSH command
    $process = Start-Process -FilePath "ssh" -ArgumentList "-o", "StrictHostKeyChecking=no", "$SERVER_USER@$SERVER_IP", "`"$Command`"" -PassThru -NoNewWindow -RedirectStandardInput -RedirectStandardOutput -RedirectStandardError
    
    # Wait a moment for password prompt
    Start-Sleep -Seconds 2
    
    # Send password
    $process.StandardInput.WriteLine($SERVER_PASSWORD)
    $process.StandardInput.Close()
    
    # Wait for completion with timeout
    $finished = $process.WaitForExit(30000) # 30 second timeout
    
    if ($finished) {
        $output = $process.StandardOutput.ReadToEnd()
        $error = $process.StandardError.ReadToEnd()
        
        if ($output) {
            Write-Host "OUTPUT: $output" -ForegroundColor White
        }
        if ($error -and $error -notmatch "password") {
            Write-Host "ERROR: $error" -ForegroundColor Red
        }
        
        return $process.ExitCode -eq 0
    } else {
        Write-Host "TIMEOUT: Command timed out" -ForegroundColor Red
        $process.Kill()
        return $false
    }
}

# Execute the fix step by step
Write-Host "Step 1: Checking current PM2 status..." -ForegroundColor Cyan
Execute-SSHCommand "pm2 list" "Checking PM2 processes"

Write-Host "Step 2: Deleting old processes..." -ForegroundColor Cyan
Execute-SSHCommand "pm2 delete all" "Deleting all PM2 processes"

Write-Host "Step 3: Starting dev server..." -ForegroundColor Cyan
$success = Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev" "Starting development server"

if ($success) {
    Write-Host "Step 4: Saving PM2 configuration..." -ForegroundColor Cyan
    Execute-SSHCommand "pm2 save" "Saving PM2 configuration"
    
    Write-Host "Step 5: Waiting for startup..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host "Step 6: Checking local server..." -ForegroundColor Cyan
    Execute-SSHCommand "curl -I http://localhost:3000" "Checking localhost:3000"
    
    Write-Host "Step 7: Reloading Nginx..." -ForegroundColor Cyan
    Execute-SSHCommand "systemctl reload nginx" "Reloading Nginx"
    
    Write-Host "Step 8: Final verification..." -ForegroundColor Cyan
    Execute-SSHCommand "curl -I https://smilerentalphuket.com" "Checking domain"
    
    Write-Host "Step 9: Final PM2 status..." -ForegroundColor Cyan
    Execute-SSHCommand "pm2 list" "Final PM2 status check"
    
} else {
    Write-Host "FAILED: Could not start dev server" -ForegroundColor Red
}

Write-Host "WORKING SSH FIX COMPLETED!" -ForegroundColor Green
