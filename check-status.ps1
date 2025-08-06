$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "Checking server status..."

# Create SSH process
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "ssh"
$psi.Arguments = "-o StrictHostKeyChecking=no $username@$server"
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $psi
$process.Start()

# Wait for password prompt and send password
Start-Sleep -Seconds 3
$process.StandardInput.WriteLine($password)
$process.StandardInput.Flush()

# Wait for login
Start-Sleep -Seconds 3

# Check status
$process.StandardInput.WriteLine("pm2 status && echo '=== END PM2 ===' && systemctl status nginx --no-pager && echo '=== END NGINX ===' && curl -I http://localhost && echo '=== END CURL ===' && exit")
$process.StandardInput.Flush()

# Wait and read output
Start-Sleep -Seconds 10
$output = $process.StandardOutput.ReadToEnd()
$errorOutput = $process.StandardError.ReadToEnd()

Write-Host "=== SERVER STATUS OUTPUT ==="
Write-Host $output
if ($errorOutput) {
    Write-Host "=== ERRORS ==="
    Write-Host $errorOutput
}

$process.WaitForExit()
$process.Close()

Write-Host "Status check completed!"
