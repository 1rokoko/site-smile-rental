$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "Starting server recovery process..."

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

Write-Host "Password sent, executing recovery commands..."

# Wait for login
Start-Sleep -Seconds 3

# Execute recovery commands
$commands = @(
    "pm2 status",
    "lsof -i :3000",
    "fuser -k 3000/tcp",
    "pm2 stop all",
    "pm2 kill",
    "cd /var/www/smile-rental",
    "git pull origin main",
    "npm install",
    "npm run build",
    "pm2 start ecosystem.config.js",
    "pm2 status",
    "systemctl restart nginx",
    "curl -I http://localhost",
    "exit"
)

foreach ($cmd in $commands) {
    Write-Host "Executing: $cmd"
    $process.StandardInput.WriteLine($cmd)
    $process.StandardInput.Flush()
    Start-Sleep -Seconds 3
}

# Wait and read all output
Start-Sleep -Seconds 10
$output = $process.StandardOutput.ReadToEnd()
$errorOutput = $process.StandardError.ReadToEnd()

Write-Host "Server Recovery Output:"
Write-Host $output
if ($errorOutput) {
    Write-Host "Errors:"
    Write-Host $errorOutput
}

$process.WaitForExit()
$process.Close()

Write-Host "Server recovery process completed!"
