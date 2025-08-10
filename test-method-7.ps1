# Method 7: PowerShell Credential Objects
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "Testing Method 7: PowerShell Credential Objects" -ForegroundColor Green

# Create secure credential
$securePassword = ConvertTo-SecureString $SERVER_PASSWORD -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($SERVER_USER, $securePassword)

Write-Host "1. Testing basic credential approach..." -ForegroundColor Cyan

try {
    # Method 7.1: Direct credential with Invoke-Command (requires PSRemoting)
    Write-Host "7.1 Invoke-Command with credential..." -ForegroundColor Yellow
    $result = Invoke-Command -ComputerName $SERVER_IP -Credential $credential -ScriptBlock { pm2 list } -ErrorAction Stop
    Write-Host "SUCCESS: $result" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "2. Testing credential with SSH..." -ForegroundColor Cyan

try {
    # Method 7.2: Use credential with SSH (convert back to plain text)
    Write-Host "7.2 SSH with credential conversion..." -ForegroundColor Yellow
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
    
    # Create process with credential
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "ssh"
    $psi.Arguments = "-o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP `"pm2 list`""
    $psi.UseShellExecute = $false
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    
    $process = [System.Diagnostics.Process]::Start($psi)
    
    # Send password
    $process.StandardInput.WriteLine($plainPassword)
    $process.StandardInput.Close()
    
    $finished = $process.WaitForExit(10000)
    
    if ($finished) {
        $output = $process.StandardOutput.ReadToEnd()
        $error = $process.StandardError.ReadToEnd()
        
        if ($output) {
            Write-Host "SUCCESS: $output" -ForegroundColor Green
        }
        if ($error) {
            Write-Host "ERROR: $error" -ForegroundColor Red
        }
    } else {
        Write-Host "TIMEOUT" -ForegroundColor Red
        $process.Kill()
    }
    
    $process.Dispose()
    
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Method 7 testing completed." -ForegroundColor Green
