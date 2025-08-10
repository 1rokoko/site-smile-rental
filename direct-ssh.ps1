# Direct SSH commands using PowerShell
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "RESTORING SITE..." -ForegroundColor Green

# Function to execute SSH command
function SSH-Execute {
    param([string]$Command, [string]$Description)
    
    Write-Host $Description -ForegroundColor Cyan
    
    # Use PowerShell to pipe password to SSH
    $passwordSecure = $SERVER_PASSWORD | ConvertTo-SecureString -AsPlainText -Force
    $passwordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($passwordSecure))
    
    try {
        # Create a process to run SSH
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "ssh"
        $psi.Arguments = "-o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"$Command`""
        $psi.UseShellExecute = $false
        $psi.RedirectStandardInput = $true
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.CreateNoWindow = $true
        
        $process = [System.Diagnostics.Process]::Start($psi)
        
        # Send password
        $process.StandardInput.WriteLine($SERVER_PASSWORD)
        $process.StandardInput.Close()
        
        # Read output
        $output = $process.StandardOutput.ReadToEnd()
        $error = $process.StandardError.ReadToEnd()
        
        $process.WaitForExit()
        
        if ($output) {
            Write-Host $output -ForegroundColor White
        }
        if ($error -and $error -notmatch "password") {
            Write-Host $error -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Execute commands
SSH-Execute "pm2 list" "1. Checking PM2..."
SSH-Execute "pm2 delete all" "2. Deleting old processes..."
SSH-Execute "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev" "3. Starting dev server..."
SSH-Execute "pm2 save" "4. Saving PM2..."

Write-Host "5. Waiting 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

SSH-Execute "curl -I http://localhost:3000" "6. Checking local access..."
SSH-Execute "systemctl reload nginx" "7. Reloading Nginx..."
SSH-Execute "curl -I https://smilerentalphuket.com" "8. Checking domain..."

Write-Host "RESTORATION COMPLETED!" -ForegroundColor Green
