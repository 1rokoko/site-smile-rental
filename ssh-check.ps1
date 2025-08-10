# SSH Connection Script for Site Smile Rental
# Using Method 6.1 from SSH_CONNECTION_METHODS.md

Write-Host "=== SITE SMILE RENTAL SSH DIAGNOSTICS ===" -ForegroundColor Green
Write-Host "Server: root@38.180.122.239" -ForegroundColor Yellow
Write-Host "Using Interactive SSH Method (Method 6.1)" -ForegroundColor Yellow

# Test 1: Check if server is reachable
Write-Host "`n1. Testing server connectivity..." -ForegroundColor Cyan
try {
    $ping = Test-Connection -ComputerName "38.180.122.239" -Count 2 -Quiet
    if ($ping) {
        Write-Host "✅ Server is reachable" -ForegroundColor Green
    } else {
        Write-Host "❌ Server is not reachable" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Ping failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Check port 3000 (Next.js dev server)
Write-Host "`n2. Testing port 3000 (Next.js dev server)..." -ForegroundColor Cyan
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.ReceiveTimeout = 3000
    $tcpClient.SendTimeout = 3000
    $tcpClient.Connect("38.180.122.239", 3000)
    if ($tcpClient.Connected) {
        Write-Host "✅ Port 3000 is open" -ForegroundColor Green
        $tcpClient.Close()
    }
} catch {
    Write-Host "❌ Port 3000 is closed or not responding" -ForegroundColor Red
}

# Test 3: Check port 80 (HTTP)
Write-Host "`n3. Testing port 80 (HTTP)..." -ForegroundColor Cyan
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.ReceiveTimeout = 3000
    $tcpClient.SendTimeout = 3000
    $tcpClient.Connect("38.180.122.239", 80)
    if ($tcpClient.Connected) {
        Write-Host "✅ Port 80 is open" -ForegroundColor Green
        $tcpClient.Close()
    }
} catch {
    Write-Host "❌ Port 80 is closed or not responding" -ForegroundColor Red
}

# Test 4: Check port 443 (HTTPS)
Write-Host "`n4. Testing port 443 (HTTPS)..." -ForegroundColor Cyan
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.ReceiveTimeout = 3000
    $tcpClient.SendTimeout = 3000
    $tcpClient.Connect("38.180.122.239", 443)
    if ($tcpClient.Connected) {
        Write-Host "✅ Port 443 is open" -ForegroundColor Green
        $tcpClient.Close()
    }
} catch {
    Write-Host "❌ Port 443 is closed or not responding" -ForegroundColor Red
}

# Test 5: Try HTTP request to domain
Write-Host "`n5. Testing domain HTTP response..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Domain responds with status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Domain HTTP error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Try HTTPS request to domain
Write-Host "`n6. Testing domain HTTPS response..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://smilerentalphuket.com" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Domain HTTPS responds with status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Domain HTTPS error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== DIAGNOSTICS COMPLETE ===" -ForegroundColor Green
Write-Host "Next step: Use interactive SSH to fix issues" -ForegroundColor Yellow
