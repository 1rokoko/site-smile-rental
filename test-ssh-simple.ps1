# Simple SSH Test
Write-Host "Testing SSH Connection..." -ForegroundColor Green

try {
    # Test basic SSH connectivity
    $result = & ssh -o ConnectTimeout=10 root@38.180.122.239 "echo 'SSH_TEST_SUCCESS'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH Connection: SUCCESS" -ForegroundColor Green
        Write-Host "Output: $result" -ForegroundColor White
    } else {
        Write-Host "SSH Connection: FAILED" -ForegroundColor Red
        Write-Host "Exit Code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Output: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "SSH Exception: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test complete." -ForegroundColor Cyan
