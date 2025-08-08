# Automatic server fix using .env.local credentials
# Fixes 502 error and missing package.json

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
    
    Write-Host "Executing: $Command" -ForegroundColor Yellow
    
    $fullCommand = "echo '$SERVER_PASSWORD' | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"$Command`""
    Invoke-Expression $fullCommand
}

# Read environment variables
$envVars = Read-EnvFile ".env.local"

Write-Host "FIXING SERVER AUTOMATICALLY (502 error fix)" -ForegroundColor Green
Write-Host "Server: $($envVars['SERVER_IP'])" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Pull latest changes from GitHub..." -ForegroundColor Cyan
Run-ServerCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main" $envVars

Write-Host ""
Write-Host "Step 2: Check if package.json exists..." -ForegroundColor Cyan
Run-ServerCommand "ls -la /var/www/smilerentalphuket.com/site-smile-rental/package.json" $envVars

Write-Host ""
Write-Host "Step 3: Install dependencies..." -ForegroundColor Cyan
Run-ServerCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && npm install" $envVars

Write-Host ""
Write-Host "Step 4: Build project..." -ForegroundColor Cyan
Run-ServerCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build" $envVars

Write-Host ""
Write-Host "Step 5: Stop PM2 process..." -ForegroundColor Cyan
Run-ServerCommand "pm2 stop smile-rental" $envVars

Write-Host ""
Write-Host "Step 6: Start PM2 process..." -ForegroundColor Cyan
Run-ServerCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start" $envVars

Write-Host ""
Write-Host "Step 7: Check final status..." -ForegroundColor Cyan
Run-ServerCommand "pm2 list && curl -I http://localhost:3000" $envVars

Write-Host ""
Write-Host "SERVER FIX COMPLETED!" -ForegroundColor Green
Write-Host "Check: https://smilerentalphuket.com/scooter-rental/" -ForegroundColor Yellow
