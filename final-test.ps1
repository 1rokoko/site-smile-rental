# Final Test and Fix Script for Site Smile Rental

Write-Host "=== FINAL DIAGNOSTIC AND FIX ATTEMPT ===" -ForegroundColor Green

# Test current status
Write-Host "`n1. Testing current server status..." -ForegroundColor Cyan

# Test ping
$ping = Test-Connection -ComputerName "38.180.122.239" -Count 1 -Quiet
Write-Host "Server ping: $(if($ping){'✅ OK'}else{'❌ FAIL'})" -ForegroundColor $(if($ping){'Green'}else{'Red'})

# Test ports
$ports = @(80, 443, 3000, 22)
foreach ($port in $ports) {
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ReceiveTimeout = 2000
        $tcpClient.SendTimeout = 2000
        $tcpClient.Connect("38.180.122.239", $port)
        if ($tcpClient.Connected) {
            Write-Host "Port $port`: ✅ OPEN" -ForegroundColor Green
            $tcpClient.Close()
        }
    } catch {
        Write-Host "Port $port`: ❌ CLOSED" -ForegroundColor Red
    }
}

# Test HTTP responses
Write-Host "`n2. Testing HTTP responses..." -ForegroundColor Cyan

$urls = @(
    "http://38.180.122.239:3000",
    "http://smilerentalphuket.com",
    "https://smilerentalphuket.com"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
        Write-Host "$url`: ✅ $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*503*") {
            Write-Host "$url`: ⚠️ 503 Service Unavailable (Nginx misconfiguration)" -ForegroundColor Yellow
        } elseif ($errorMsg -like "*refused*") {
            Write-Host "$url`: ❌ Connection Refused" -ForegroundColor Red
        } else {
            Write-Host "$url`: ❌ $errorMsg" -ForegroundColor Red
        }
    }
}

Write-Host "`n3. Attempting to fix via SSH..." -ForegroundColor Cyan
Write-Host "Creating SSH command file..." -ForegroundColor Yellow

# Create SSH command file
$sshCommands = @"
pm2 delete all
cd /var/www/smilerentalphuket.com/site-smile-rental
pm2 start 'npm run dev' --name smile-rental-dev --watch
pm2 save
nginx -t
systemctl restart nginx
systemctl status nginx --no-pager -l
pm2 list
curl -I http://localhost:3000
exit
"@

$sshCommands | Out-File -FilePath "auto-fix-commands.txt" -Encoding ASCII

Write-Host "SSH commands created. Manual execution required:" -ForegroundColor Yellow
Write-Host "1. Run: ssh root@38.180.122.239" -ForegroundColor Cyan
Write-Host "2. Enter password: [REMOVED]" -ForegroundColor Cyan
Write-Host "3. Copy and paste commands from auto-fix-commands.txt" -ForegroundColor Cyan

Write-Host "`n=== DIAGNOSTIC COMPLETE ===" -ForegroundColor Green
Write-Host "Next: Manual SSH execution required" -ForegroundColor Yellow
