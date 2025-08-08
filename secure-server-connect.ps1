# Secure server connection script
# Reads credentials from .env.local file

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Error ".env.local file not found. Please create it with SERVER_IP, SERVER_USER, and SERVER_PASSWORD"
    exit 1
}

# Read environment variables from .env.local
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Variable -Name $name -Value $value
    }
}

Write-Host "Connecting to server $SERVER_IP as $SERVER_USER..." -ForegroundColor Green
Write-Host "Note: Password will be prompted securely" -ForegroundColor Yellow

# Connect using SSH (password will be prompted)
ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP"
