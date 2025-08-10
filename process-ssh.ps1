# PowerShell Process-based SSH automation
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "PROCESS-BASED SSH AUTOMATION..." -ForegroundColor Green

function Execute-SSHCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host $Description -ForegroundColor Cyan
    
    try {
        # Create process info
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "ssh"
        $psi.Arguments = "-o StrictHostKeyChecking=no -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP `"$Command`""
        $psi.UseShellExecute = $false
        $psi.RedirectStandardInput = $true
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.CreateNoWindow = $true
        
        # Start process
        $process = [System.Diagnostics.Process]::Start($psi)
        
        # Send password immediately
        $process.StandardInput.WriteLine($SERVER_PASSWORD)
        $process.StandardInput.Close()
        
        # Wait with timeout
        $finished = $process.WaitForExit(15000) # 15 second timeout
        
        if ($finished) {
            $output = $process.StandardOutput.ReadToEnd()
            $error = $process.StandardError.ReadToEnd()
            
            if ($output) {
                Write-Host $output -ForegroundColor White
            }
            if ($error -and $error -notmatch "password") {
                Write-Host $error -ForegroundColor Yellow
            }
        } else {
            Write-Host "Command timed out" -ForegroundColor Red
            $process.Kill()
        }
        
        $process.Dispose()
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Execute commands
Execute-SSHCommand "pm2 list" "1. Checking PM2..."
Execute-SSHCommand "pm2 delete all" "2. Deleting processes..."
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev" "3. Starting dev server..."
Execute-SSHCommand "pm2 save" "4. Saving PM2..."

Write-Host "5. Waiting 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Execute-SSHCommand "curl -I http://localhost:3000" "6. Checking local server..."
Execute-SSHCommand "systemctl reload nginx" "7. Reloading Nginx..."
Execute-SSHCommand "curl -I https://smilerentalphuket.com" "8. Checking domain..."

Write-Host "PROCESS AUTOMATION COMPLETED!" -ForegroundColor Green
