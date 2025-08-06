# Server diagnosis script
$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "Starting server diagnosis..."

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

Write-Host "Connecting to server..."

# Wait for password prompt and send password
Start-Sleep -Seconds 3
$process.StandardInput.WriteLine($password)
$process.StandardInput.Flush()

Write-Host "Password sent, running diagnostics..."

# Wait for login
Start-Sleep -Seconds 3

# Check current directory
Write-Host "Checking current directory..."
$process.StandardInput.WriteLine("pwd")
$process.StandardInput.Flush()
Start-Sleep -Seconds 1

# List directories in /var/www
Write-Host "Checking /var/www directories..."
$process.StandardInput.WriteLine("ls -la /var/www/")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Check PM2 status
Write-Host "Checking PM2 status..."
$process.StandardInput.WriteLine("pm2 status")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Check nginx status
Write-Host "Checking nginx status..."
$process.StandardInput.WriteLine("systemctl status nginx")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Check what's running on port 3000
Write-Host "Checking port 3000..."
$process.StandardInput.WriteLine("netstat -tlnp | grep :3000")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Check if smile-rental directory exists
Write-Host "Checking smile-rental directory..."
$process.StandardInput.WriteLine("ls -la /var/www/smile-rental/")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Exit SSH
$process.StandardInput.WriteLine("exit")
$process.StandardInput.Flush()

# Wait and read all output
Start-Sleep -Seconds 5
$output = $process.StandardOutput.ReadToEnd()
$errorOutput = $process.StandardError.ReadToEnd()

Write-Host "=== DIAGNOSIS OUTPUT ==="
Write-Host $output
if ($errorOutput) {
    Write-Host "=== ERRORS ==="
    Write-Host $errorOutput
}

$process.WaitForExit()
$process.Close()

Write-Host "Diagnosis completed!"
