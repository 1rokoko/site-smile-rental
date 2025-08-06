$password = "925LudK9Bv"
$username = "root"
$server = "38.180.122.239"

# Create SSH session
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)

# Try to connect and run commands
try {
    Write-Host "Connecting to server..."
    $session = New-SSHSession -ComputerName $server -Credential $credential -AcceptKey
    
    if ($session) {
        Write-Host "Connected! Running PM2 status..."
        $result = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 status"
        Write-Host $result.Output
        
        Write-Host "Restarting PM2 processes..."
        $restart = Invoke-SSHCommand -SessionId $session.SessionId -Command "pm2 restart all"
        Write-Host $restart.Output
        
        Remove-SSHSession -SessionId $session.SessionId
    }
} catch {
    Write-Host "SSH connection failed: $($_.Exception.Message)"
    Write-Host "Trying alternative method..."
}
