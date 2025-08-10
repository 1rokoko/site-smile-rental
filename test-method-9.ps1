# Method 9: PuTTY plink
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "Testing Method 9: PuTTY plink" -ForegroundColor Green

# Method 9.1: Check if plink is available
Write-Host "9.1 Checking for plink..." -ForegroundColor Cyan

$plinkPaths = @(
    "plink",
    "C:\Program Files\PuTTY\plink.exe",
    "C:\Program Files (x86)\PuTTY\plink.exe",
    "$env:USERPROFILE\AppData\Local\Programs\PuTTY\plink.exe"
)

$plinkFound = $false
$plinkPath = ""

foreach ($path in $plinkPaths) {
    try {
        $result = & $path -V 2>&1
        if ($LASTEXITCODE -eq 0 -or $result -match "plink") {
            Write-Host "SUCCESS: plink found at $path" -ForegroundColor Green
            $plinkFound = $true
            $plinkPath = $path
            break
        }
    } catch {
        # Continue to next path
    }
}

if (-not $plinkFound) {
    Write-Host "FAILED: plink not found" -ForegroundColor Red
    
    # Method 9.2: Try to download plink
    Write-Host "9.2 Attempting to download plink..." -ForegroundColor Cyan
    
    try {
        $plinkUrl = "https://the.earth.li/~sgtatham/putty/latest/w64/plink.exe"
        $plinkPath = "$env:TEMP\plink.exe"
        
        Write-Host "Downloading plink to $plinkPath..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $plinkUrl -OutFile $plinkPath -UseBasicParsing
        
        if (Test-Path $plinkPath) {
            Write-Host "SUCCESS: plink downloaded" -ForegroundColor Green
            $plinkFound = $true
        } else {
            Write-Host "FAILED: Download failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "FAILED: Download error - $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($plinkFound) {
    # Method 9.3: Test plink with password
    Write-Host "9.3 Testing plink with password..." -ForegroundColor Cyan
    
    try {
        Write-Host "Using plink at: $plinkPath" -ForegroundColor Yellow
        
        # Method 9.3a: plink with -pw parameter
        Write-Host "9.3a plink with -pw parameter..." -ForegroundColor Yellow
        $result = & $plinkPath -ssh -pw $SERVER_PASSWORD -batch $SERVER_USER@$SERVER_IP "pm2 list" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: $result" -ForegroundColor Green
        } else {
            Write-Host "FAILED: Exit code $LASTEXITCODE, Output: $result" -ForegroundColor Red
            
            # Method 9.3b: plink with echo pipe
            Write-Host "9.3b plink with echo pipe..." -ForegroundColor Yellow
            $result = echo $SERVER_PASSWORD | & $plinkPath -ssh -batch $SERVER_USER@$SERVER_IP "pm2 list" 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "SUCCESS: $result" -ForegroundColor Green
            } else {
                Write-Host "FAILED: Exit code $LASTEXITCODE, Output: $result" -ForegroundColor Red
            }
        }
        
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIPPED: plink not available" -ForegroundColor Yellow
}

Write-Host "Method 9 testing completed." -ForegroundColor Green
