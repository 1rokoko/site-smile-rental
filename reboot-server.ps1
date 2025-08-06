$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "Rebooting server..."

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

# Reboot server
Write-Host "Sending reboot command..."
$process.StandardInput.WriteLine("reboot")
$process.StandardInput.Flush()

# Wait a bit
Start-Sleep -Seconds 5

$process.WaitForExit()
$process.Close()

Write-Host "Reboot command sent! Server will restart in 1-2 minutes."
Write-Host "Waiting 3 minutes for server to come back online..."

# Wait for server to reboot
Start-Sleep -Seconds 180

Write-Host "Testing server after reboot..."
