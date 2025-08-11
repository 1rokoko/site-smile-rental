# Automatic server fix with password auto-input
# Password: [REMOVED] (hardcoded for automation)

$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

function Run-SSHCommand {
    param([string]$Command)
    
    Write-Host "Executing: $Command" -ForegroundColor Yellow
    
    # Create process info
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "ssh"
    $psi.Arguments = "-o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"$Command`""
    $psi.UseShellExecute = $false
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $false
    
    # Start process
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    $process.Start()
    
    # Auto-send password
    Start-Sleep -Milliseconds 500
    $process.StandardInput.WriteLine($SERVER_PASSWORD)
    $process.StandardInput.Close()
    
    # Wait and get output
    $process.WaitForExit(60000)  # 60 seconds timeout
    $output = $process.StandardOutput.ReadToEnd()
    $error = $process.StandardError.ReadToEnd()
    
    if ($output) { 
        Write-Host $output -ForegroundColor Green
    }
    if ($error -and $error -notmatch "password") { 
        Write-Host $error -ForegroundColor Red 
    }
    
    $process.Close()
    return $output
}

Write-Host "AUTO-FIXING SERVER (Password: [REMOVED])" -ForegroundColor Cyan
Write-Host "Server: $SERVER_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Pull latest changes..." -ForegroundColor Cyan
Run-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main"

Write-Host ""
Write-Host "Step 2: Check package.json..." -ForegroundColor Cyan
Run-SSHCommand "ls -la /var/www/smilerentalphuket.com/site-smile-rental/package.json"

Write-Host ""
Write-Host "Step 3: Install dependencies..." -ForegroundColor Cyan
Run-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install"

Write-Host ""
Write-Host "Step 4: Build project..." -ForegroundColor Cyan
Run-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

Write-Host ""
Write-Host "Step 5: Stop PM2..." -ForegroundColor Cyan
Run-SSHCommand "pm2 stop smile-rental"

Write-Host ""
Write-Host "Step 6: Start PM2..." -ForegroundColor Cyan
Run-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

Write-Host ""
Write-Host "Step 7: Final check..." -ForegroundColor Cyan
Run-SSHCommand "pm2 list && curl -I http://localhost:3000"

Write-Host ""
Write-Host "AUTO-FIX COMPLETED!" -ForegroundColor Green
Write-Host "Check website: https://smilerentalphuket.com/scooter-rental/" -ForegroundColor Yellow
