# Final site testing
Write-Host "TESTING SITE AFTER DEPLOYMENT..." -ForegroundColor Green
Write-Host ""

$sites = @(
    "http://smilerentalphuket.com",
    "https://smilerentalphuket.com"
)

foreach ($site in $sites) {
    Write-Host "Testing: $site" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $site -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            Write-Host "SUCCESS: Site is working (HTTP $statusCode)" -ForegroundColor Green
            Write-Host "Response size: $($response.Content.Length) bytes" -ForegroundColor White
            
            # Check for key content
            if ($response.Content -match "Smile Rental|scooter|rental|Phuket") {
                Write-Host "CONTENT: Correct content found" -ForegroundColor Green
            } else {
                Write-Host "WARNING: Content might be incorrect" -ForegroundColor Yellow
            }
        } else {
            Write-Host "WARNING: Site responds with code: $statusCode" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "ERROR: Site not accessible: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Open browser for visual check
Write-Host "Opening site in browser for visual verification..." -ForegroundColor Cyan
try {
    Start-Process "http://smilerentalphuket.com"
    Write-Host "Browser opened successfully" -ForegroundColor Green
} catch {
    Write-Host "Could not open browser: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "TESTING COMPLETED" -ForegroundColor Green
Write-Host "If site is not working, follow instructions in DEPLOYMENT_INSTRUCTIONS.md" -ForegroundColor Yellow
