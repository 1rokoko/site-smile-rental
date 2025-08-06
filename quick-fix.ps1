$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "Quick server fix..."

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

# Quick fix commands
Write-Host "Killing port 3000 processes..."
$process.StandardInput.WriteLine("fuser -k 3000/tcp")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

Write-Host "Restarting PM2..."
$process.StandardInput.WriteLine("pm2 restart all")
$process.StandardInput.Flush()
Start-Sleep -Seconds 3

Write-Host "Checking PM2 status..."
$process.StandardInput.WriteLine("pm2 status")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

Write-Host "Restarting nginx..."
$process.StandardInput.WriteLine("systemctl restart nginx")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

Write-Host "Testing website..."
$process.StandardInput.WriteLine("curl -I http://localhost")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Exit
$process.StandardInput.WriteLine("exit")
$process.StandardInput.Flush()

# Wait and read output
Start-Sleep -Seconds 5
$output = $process.StandardOutput.ReadToEnd()

Write-Host "Output:"
Write-Host $output

$process.WaitForExit()
$process.Close()

Write-Host "Quick fix completed!"
