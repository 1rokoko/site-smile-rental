# Setup SSH keys for passwordless connection
Write-Host "Setting up SSH keys for passwordless connection..." -ForegroundColor Green
Write-Host ""

$sshDir = "$env:USERPROFILE\.ssh"
$keyName = "smile_rental_key"
$keyPath = "$sshDir\$keyName"
$server = "38.180.122.239"
$user = "root"
$password = "925LudK9Bv"

# Step 1: Generate SSH key if it doesn't exist
if (-not (Test-Path "$keyPath")) {
    Write-Host "Generating SSH key pair..." -ForegroundColor Cyan
    
    # Generate SSH key
    & ssh-keygen -t rsa -b 4096 -C "smile-rental@local" -f $keyPath -N '""'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH key generated successfully" -ForegroundColor Green
    } else {
        Write-Host "Failed to generate SSH key" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "SSH key already exists" -ForegroundColor Yellow
}

# Step 2: Copy public key to server
Write-Host "Copying public key to server..." -ForegroundColor Cyan

# Read the public key
$publicKey = Get-Content "$keyPath.pub"

# Create a script to copy the key
$copyKeyScript = @"
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo '$publicKey' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo 'Public key added successfully'
"@

# Copy key to server using password
Write-Host "Adding public key to server authorized_keys..." -ForegroundColor Cyan
try {
    # Use echo to pipe password and execute the script
    $command = "echo '$password' | ssh -o StrictHostKeyChecking=no $user@$server `"$copyKeyScript`""
    Invoke-Expression $command
    Write-Host "Public key copied to server" -ForegroundColor Green
} catch {
    Write-Host "Error copying key: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Update SSH config
Write-Host "Updating SSH config..." -ForegroundColor Cyan

$configPath = "$sshDir\config"
$configEntry = @"

# Smile Rental Server
Host smile-rental
    HostName $server
    User $user
    IdentityFile $keyPath
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

# Step 4: Test connection
Write-Host "Testing SSH connection..." -ForegroundColor Cyan
try {
    $testResult = & ssh smile-rental "echo 'SSH connection successful'"
    if ($testResult -match "successful") {
        Write-Host "SSH connection test passed!" -ForegroundColor Green
        Write-Host "You can now use: ssh smile-rental" -ForegroundColor Cyan
    } else {
        Write-Host "SSH connection test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "SSH test error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup completed!" -ForegroundColor Green
Write-Host "You can now connect without password using: ssh smile-rental" -ForegroundColor Cyan
