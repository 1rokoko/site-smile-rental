# Automated SSH Fix for Site Smile Rental
# Final attempt using PowerShell automation

Write-Host "=== AUTOMATED SSH FIX ATTEMPT ===" -ForegroundColor Green

# Create a PowerShell script that will handle SSH interaction
$sshScript = @'
$password = "[REMOVED]"
$commands = @(
    "pm2 delete all",
    "cd /var/www/smilerentalphuket.com/site-smile-rental",
    "pm2 start 'npm run dev' --name smile-rental-dev --watch",
    "pm2 save",
    "nginx -t",
    "systemctl restart nginx",
    "pm2 list",
    "curl -I http://localhost:3000",
    "exit"
)

# Start SSH process
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "ssh"
$psi.Arguments = "root@38.180.122.239"
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($psi)

# Send password
Start-Sleep -Seconds 2
$process.StandardInput.WriteLine($password)

# Send commands
foreach ($cmd in $commands) {
    Start-Sleep -Seconds 1
    Write-Host "Sending: $cmd" -ForegroundColor Yellow
    $process.StandardInput.WriteLine($cmd)
}

# Wait for completion
$process.WaitForExit(60000)  # 60 seconds timeout

# Read output
$output = $process.StandardOutput.ReadToEnd()
$error = $process.StandardError.ReadToEnd()

Write-Host "Output:" -ForegroundColor Green
Write-Host $output

if ($error) {
    Write-Host "Errors:" -ForegroundColor Red
    Write-Host $error
}

$process.Close()
'@

# Execute the SSH script
Invoke-Expression $sshScript

Write-Host "`n=== TESTING RESULTS ===" -ForegroundColor Cyan

# Test the results
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "✅ Domain HTTP works! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Domain HTTP still not working: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://38.180.122.239:3000" -TimeoutSec 10
    Write-Host "✅ Direct port 3000 works! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Direct port 3000 still not working: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== AUTOMATED FIX COMPLETE ===" -ForegroundColor Green
