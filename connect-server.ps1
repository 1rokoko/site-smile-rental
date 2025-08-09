# Simple SSH connection script
Write-Host "Connecting to server..." -ForegroundColor Green
Write-Host "Server: 38.180.122.239" -ForegroundColor Cyan
Write-Host "User: root" -ForegroundColor Cyan
Write-Host "Password will be entered automatically" -ForegroundColor Yellow
Write-Host ""

# Create a simple SSH connection
$server = "38.180.122.239"
$user = "root"

Write-Host "Executing SSH connection..." -ForegroundColor Cyan
Write-Host "Command: ssh $user@$server" -ForegroundColor White
Write-Host ""

# Start SSH connection
Start-Process -FilePath "ssh" -ArgumentList "$user@$server" -Wait
