# Site status check
Write-Host "Checking site status..." -ForegroundColor Green
Write-Host ""

# Check main site
Write-Host "Checking: http://smilerentalphuket.com" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "Site is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host "Response size: $($response.Content.Length) bytes" -ForegroundColor White
} catch {
    Write-Host "Site is not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Check HTTPS version
Write-Host "Checking: https://smilerentalphuket.com" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "HTTPS site is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "HTTPS site is not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Check server availability
Write-Host "Checking server 38.180.122.239..." -ForegroundColor Cyan
$pingResult = Test-Connection -ComputerName "38.180.122.239" -Count 2 -Quiet
if ($pingResult) {
    Write-Host "Server is reachable via ping" -ForegroundColor Green
} else {
    Write-Host "Server is not reachable via ping" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next step: connect to server for diagnostics" -ForegroundColor Yellow
