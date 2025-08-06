$server = "38.180.122.239"
$username = "root"
$password = "925LudK9Bv"

Write-Host "🔧 Starting server recovery process..."

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

Write-Host "📡 Connecting to server..."

# Wait for password prompt and send password
Start-Sleep -Seconds 3
$process.StandardInput.WriteLine($password)
$process.StandardInput.Flush()

Write-Host "🔑 Password sent, executing recovery commands..."

# Wait for login
Start-Sleep -Seconds 3

# Check PM2 status
Write-Host "📊 Checking PM2 status..."
$process.StandardInput.WriteLine("pm2 status")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Check what's using port 3000
Write-Host "🔍 Checking port 3000..."
$process.StandardInput.WriteLine("lsof -i :3000")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Kill processes on port 3000
Write-Host "💀 Killing processes on port 3000..."
$process.StandardInput.WriteLine("fuser -k 3000/tcp")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Stop all PM2 processes
Write-Host "⏹️ Stopping PM2 processes..."
$process.StandardInput.WriteLine("pm2 stop all")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Kill PM2 daemon
Write-Host "🔄 Killing PM2 daemon..."
$process.StandardInput.WriteLine("pm2 kill")
$process.StandardInput.Flush()
Start-Sleep -Seconds 3

# Navigate to project directory
Write-Host "📁 Navigating to project directory..."
$process.StandardInput.WriteLine("cd /var/www/smile-rental")
$process.StandardInput.Flush()
Start-Sleep -Seconds 1

# Pull latest changes
Write-Host "📥 Pulling latest changes..."
$process.StandardInput.WriteLine("git pull origin main")
$process.StandardInput.Flush()
Start-Sleep -Seconds 3

# Install dependencies
Write-Host "📦 Installing dependencies..."
$process.StandardInput.WriteLine("npm install")
$process.StandardInput.Flush()
Start-Sleep -Seconds 5

# Build project
Write-Host "🔨 Building project...")
$process.StandardInput.WriteLine("npm run build")
$process.StandardInput.Flush()
Start-Sleep -Seconds 10

# Start PM2 with ecosystem
Write-Host "🚀 Starting PM2 processes..."
$process.StandardInput.WriteLine("pm2 start ecosystem.config.js")
$process.StandardInput.Flush()
Start-Sleep -Seconds 3

# Check PM2 status
Write-Host "✅ Final PM2 status check..."
$process.StandardInput.WriteLine("pm2 status")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Restart nginx
Write-Host "🔄 Restarting nginx...")
$process.StandardInput.WriteLine("systemctl restart nginx")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Test website
Write-Host "🌐 Testing website...")
$process.StandardInput.WriteLine("curl -I http://localhost")
$process.StandardInput.Flush()
Start-Sleep -Seconds 2

# Exit SSH
$process.StandardInput.WriteLine("exit")
$process.StandardInput.Flush()

# Wait and read all output
Start-Sleep -Seconds 5
$output = $process.StandardOutput.ReadToEnd()
$errorOutput = $process.StandardError.ReadToEnd()

Write-Host "📋 Server Recovery Output:"
Write-Host $output
if ($errorOutput) {
    Write-Host "⚠️ Errors:"
    Write-Host $errorOutput
}

$process.WaitForExit()
$process.Close()

Write-Host "🎉 Server recovery process completed!"
