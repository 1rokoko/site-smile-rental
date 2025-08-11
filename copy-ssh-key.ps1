# Copy SSH public key to server
$keyPath = "$env:USERPROFILE\.ssh\smile_rental_key.pub"
$server = "38.180.122.239"
$user = "root"
$password = "[REMOVED]"

Write-Host "Copying SSH public key to server..." -ForegroundColor Green

# Read the public key
if (Test-Path $keyPath) {
    $publicKey = Get-Content $keyPath
    Write-Host "Public key found: $($publicKey.Substring(0, 50))..." -ForegroundColor Cyan
    
    # Create a batch file to handle the password input
    $batchContent = @"
@echo off
echo $password | ssh -o StrictHostKeyChecking=no $user@$server "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'SSH key added successfully'"
"@
    
    $batchFile = "temp_copy_key.bat"
    $batchContent | Out-File -FilePath $batchFile -Encoding ASCII
    
    Write-Host "Executing key copy..." -ForegroundColor Cyan
    & cmd /c $batchFile
    
    # Clean up
    Remove-Item $batchFile -Force
    
    Write-Host "Key copy completed" -ForegroundColor Green
} else {
    Write-Host "SSH key not found at $keyPath" -ForegroundColor Red
    exit 1
}

# Update SSH config
Write-Host "Updating SSH config..." -ForegroundColor Cyan

$sshDir = "$env:USERPROFILE\.ssh"
$configPath = "$sshDir\config"
$configEntry = @"

# Smile Rental Server
Host smile-rental
    HostName $server
    User $user
    IdentityFile $env:USERPROFILE\.ssh\smile_rental_key
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null

"@

# Add to config if not already present
$configContent = ""
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
}

if ($configContent -notmatch "Host smile-rental") {
    Add-Content -Path $configPath -Value $configEntry
    Write-Host "SSH config updated" -ForegroundColor Green
} else {
    Write-Host "SSH config already contains smile-rental entry" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup completed!" -ForegroundColor Green
Write-Host "Testing connection..." -ForegroundColor Cyan

# Test the connection
try {
    $testResult = & ssh smile-rental "echo 'Connection successful'"
    Write-Host "Test result: $testResult" -ForegroundColor White
} catch {
    Write-Host "Test failed: $($_.Exception.Message)" -ForegroundColor Red
}
