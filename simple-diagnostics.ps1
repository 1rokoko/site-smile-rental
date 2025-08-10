# Simple Server Diagnostics using Working SSH Method
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "RUNNING SERVER DIAGNOSTICS..." -ForegroundColor Green
Write-Host "Using confirmed working SSH Method 6.1" -ForegroundColor Cyan
Write-Host ""

# Function to execute SSH command and capture output
function Execute-Diagnostic {
    param([string]$Command, [string]$Description)
    
    Write-Host "CHECKING: $Description" -ForegroundColor Yellow
    Write-Host "Command: $Command" -ForegroundColor Gray
    
    try {
        # Use the working SSH method from the documentation
        $sshCommand = "ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"$Command`""
        
        # Create process info
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "ssh"
        $psi.Arguments = "-o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"$Command`""
        $psi.UseShellExecute = $false
        $psi.RedirectStandardInput = $true
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.CreateNoWindow = $true
        
        # Start process
        $process = [System.Diagnostics.Process]::Start($psi)
        
        # Send password
        $process.StandardInput.WriteLine($SERVER_PASSWORD)
        $process.StandardInput.Close()
        
        # Wait for completion
        $process.WaitForExit(15000) # 15 second timeout
        
        # Get output
        $output = $process.StandardOutput.ReadToEnd()
        $error = $process.StandardError.ReadToEnd()
        
        if ($output) {
            Write-Host "SUCCESS Result:" -ForegroundColor Green
            Write-Host $output -ForegroundColor White
        }

        if ($error -and $error -notmatch "password") {
            Write-Host "WARNING Error:" -ForegroundColor Red
            Write-Host $error -ForegroundColor Red
        }
        
        Write-Host "$(('-' * 50))" -ForegroundColor Gray
        Write-Host ""
        
        return $true
    }
    catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Run diagnostics
Write-Host "SYSTEM OVERVIEW" -ForegroundColor Magenta
Execute-Diagnostic "uname -a" "System Information"
Execute-Diagnostic "uptime" "System Uptime and Load"

Write-Host "DISK SPACE ANALYSIS" -ForegroundColor Magenta
Execute-Diagnostic "df -h" "Disk Space Usage"

Write-Host "MEMORY ANALYSIS" -ForegroundColor Magenta
Execute-Diagnostic "free -h" "Memory Usage"

Write-Host "NODE.JS ENVIRONMENT" -ForegroundColor Magenta
Execute-Diagnostic "which node" "Node.js Location"
Execute-Diagnostic "node --version" "Node.js Version"
Execute-Diagnostic "which npm" "NPM Location"
Execute-Diagnostic "npm --version" "NPM Version"
Execute-Diagnostic "which pm2" "PM2 Location"
Execute-Diagnostic "pm2 --version" "PM2 Version"

Write-Host "PM2 STATUS" -ForegroundColor Magenta
Execute-Diagnostic "pm2 list" "PM2 Process List"

Write-Host "NETWORK AND PORTS" -ForegroundColor Magenta
Execute-Diagnostic "netstat -tlnp | grep -E ':80|:443|:3000'" "Port Usage Check"

Write-Host "PROJECT DIRECTORY" -ForegroundColor Magenta
Execute-Diagnostic "ls -la /var/www/smilerentalphuket.com/site-smile-rental/" "Project Directory"

Write-Host "DIAGNOSTICS COMPLETED" -ForegroundColor Green
Write-Host "Review the output above to identify the root cause of Node.js startup failures" -ForegroundColor Cyan
