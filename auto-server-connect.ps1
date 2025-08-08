# Automatic server connection using .env.local credentials
# No more manual password input!

function Read-EnvFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Error ".env.local file not found!"
        exit 1
    }
    
    $envVars = @{}
    Get-Content $FilePath | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            $envVars[$name] = $value
        }
    }
    return $envVars
}

function Run-ServerCommand {
    param([string]$Command, [hashtable]$EnvVars)
    
    $SERVER_IP = $EnvVars["SERVER_IP"]
    $SERVER_USER = $EnvVars["SERVER_USER"] 
    $SERVER_PASSWORD = $EnvVars["SERVER_PASSWORD"]
    
    Write-Host "🔧 Executing: $Command" -ForegroundColor Yellow
    
    # Use echo to pipe password to ssh
    $fullCommand = "echo '$SERVER_PASSWORD' | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"$Command`""
    Invoke-Expression $fullCommand
}

# Read environment variables
$envVars = Read-EnvFile ".env.local"

Write-Host "🚀 AUTO-CONNECTING TO SERVER (no manual password needed!)" -ForegroundColor Green
Write-Host "📡 Server: $($envVars['SERVER_IP'])" -ForegroundColor Cyan
Write-Host ""

# Execute the command passed as parameter, or interactive session
if ($args.Count -gt 0) {
    $command = $args -join " "
    Run-ServerCommand $command $envVars
} else {
    Write-Host "💡 Usage: .\auto-server-connect.ps1 'command'" -ForegroundColor Yellow
    Write-Host "💡 Example: .\auto-server-connect.ps1 'pm2 list'" -ForegroundColor Yellow
}
