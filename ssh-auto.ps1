$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

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
Start-Sleep -Seconds 2
$process.StandardInput.WriteLine($password)
$process.StandardInput.Flush()

# Send commands
Start-Sleep -Seconds 2
$process.StandardInput.WriteLine("pm2 status")
$process.StandardInput.Flush()

Start-Sleep -Seconds 2
$process.StandardInput.WriteLine("pm2 restart all")
$process.StandardInput.Flush()

Start-Sleep -Seconds 2
$process.StandardInput.WriteLine("exit")
$process.StandardInput.Flush()

# Read output
$output = $process.StandardOutput.ReadToEnd()
$error = $process.StandardError.ReadToEnd()

Write-Host "Output:"
Write-Host $output
Write-Host "Error:"
Write-Host $error

$process.WaitForExit()
$process.Close()
