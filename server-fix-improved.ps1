# Improved server recovery script with better output handling
$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "Starting improved server recovery process..." -ForegroundColor Green

# Create SSH process with better configuration
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "ssh"
$psi.Arguments = "-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $username@$server"
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $psi

# Start the process
$process.Start()

Write-Host "Connecting to server..." -ForegroundColor Yellow

# Send password
Start-Sleep -Seconds 3
$process.StandardInput.WriteLine($password)
$process.StandardInput.Flush()

Write-Host "Password sent, waiting for login..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Execute commands one by one with output reading
$commands = @(
    "echo '=== Connected to server ==='",
    "pwd",
    "echo '=== Checking /var/www directories ==='",
    "ls -la /var/www/",
    "echo '=== PM2 Status ==='",
    "pm2 status",
    "echo '=== Stopping all PM2 processes ==='",
    "pm2 stop all",
    "echo '=== Killing all PM2 processes ==='", 
    "pm2 kill",
    "echo '=== Checking port 3000 ==='",
    "netstat -tlnp | grep :3000",
    "echo '=== Killing processes on port 3000 ==='",
    "fuser -k 3000/tcp",
    "echo '=== Checking smile-rental directory ==='",
    "ls -la /var/www/smile-rental/ 2>/dev/null || echo 'Directory not found'",
    "echo '=== Checking alternative location ==='",
    "ls -la /var/www/smilerentalphuket.com/ 2>/dev/null || echo 'Alternative directory not found'",
    "echo '=== Navigating to project directory ==='",
    "cd /var/www/smile-rental 2>/dev/null || cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern 2>/dev/null || echo 'Could not find project directory'",
    "pwd",
    "ls -la",
    "echo '=== Starting PM2 processes ==='",
    "pm2 start ecosystem.config.js 2>/dev/null || pm2 start npm --name 'smile-rental' -- start",
    "echo '=== PM2 Status after restart ==='",
    "pm2 status",
    "echo '=== Setting up PM2 startup ==='",
    "pm2 startup",
    "echo '=== Saving PM2 configuration ==='",
    "pm2 save",
    "echo '=== Restarting Nginx ==='",
    "systemctl restart nginx",
    "echo '=== Testing localhost ==='",
    "curl -I http://localhost",
    "echo '=== Testing external domain ==='",
    "curl -I http://smilerentalphuket.com"
)

foreach ($cmd in $commands) {
    Write-Host "Executing: $cmd" -ForegroundColor Cyan
    $process.StandardInput.WriteLine($cmd)
    $process.StandardInput.Flush()
    Start-Sleep -Seconds 2
    
    # Try to read any available output
    try {
        while ($process.StandardOutput.Peek() -ne -1) {
            $line = $process.StandardOutput.ReadLine()
            Write-Host "OUTPUT: $line" -ForegroundColor White
        }
    } catch {
        # Continue if no output available
    }
}

# Exit SSH
Write-Host "Exiting SSH session..." -ForegroundColor Yellow
$process.StandardInput.WriteLine("exit")
$process.StandardInput.Flush()

# Wait for process to complete and read final output
Start-Sleep -Seconds 5

try {
    $output = $process.StandardOutput.ReadToEnd()
    $errorOutput = $process.StandardError.ReadToEnd()
    
    if ($output) {
        Write-Host "=== FINAL OUTPUT ===" -ForegroundColor Green
        Write-Host $output
    }
    
    if ($errorOutput) {
        Write-Host "=== ERRORS ===" -ForegroundColor Red
        Write-Host $errorOutput
    }
} catch {
    Write-Host "Could not read final output" -ForegroundColor Yellow
}

$process.WaitForExit(10000)  # Wait max 10 seconds
$process.Close()

Write-Host "Server recovery process completed!" -ForegroundColor Green
