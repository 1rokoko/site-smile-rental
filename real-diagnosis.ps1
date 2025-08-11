# Real Server Diagnosis - No Background Interference
Write-Host "REAL SERVER DIAGNOSIS" -ForegroundColor Red
Write-Host "=====================" -ForegroundColor Red

$commands = @(
    @{cmd="pm2 list"; desc="PM2 Status"},
    @{cmd="systemctl status nginx --no-pager -l"; desc="Nginx Status"},
    @{cmd="netstat -tlnp | grep -E ':80|:3000'"; desc="Port Status"},
    @{cmd="curl -I http://localhost:3000"; desc="Local App Test"},
    @{cmd="curl -I http://localhost"; desc="Local Nginx Test"},
    @{cmd="ps aux | grep -E 'node|nginx' | grep -v grep"; desc="Running Processes"},
    @{cmd="journalctl -u nginx --no-pager -n 10"; desc="Nginx Logs"},
    @{cmd="pm2 logs --lines 10"; desc="PM2 Logs"}
)

foreach ($item in $commands) {
    Write-Host "`n--- $($item.desc) ---" -ForegroundColor Yellow
    Write-Host "Command: $($item.cmd)" -ForegroundColor Gray
    
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "ssh"
    $psi.Arguments = "root@38.180.122.239 `"$($item.cmd)`""
    $psi.UseShellExecute = $false
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    
    try {
        $process = [System.Diagnostics.Process]::Start($psi)
        $process.StandardInput.WriteLine("[REMOVED]")
        $process.StandardInput.Close()
        
        if ($process.WaitForExit(15000)) {
            $output = $process.StandardOutput.ReadToEnd()
            $error = $process.StandardError.ReadToEnd()
            
            if ($output.Trim()) {
                Write-Host "OUTPUT:" -ForegroundColor Green
                Write-Host $output -ForegroundColor White
            }
            
            if ($error.Trim() -and $error -notmatch "password") {
                Write-Host "ERROR:" -ForegroundColor Red
                Write-Host $error -ForegroundColor Red
            }
            
            Write-Host "Exit Code: $($process.ExitCode)" -ForegroundColor $(if($process.ExitCode -eq 0){"Green"}else{"Red"})
        } else {
            Write-Host "TIMEOUT" -ForegroundColor Red
            $process.Kill()
        }
    } catch {
        Write-Host "EXCEPTION: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "$(('-' * 60))" -ForegroundColor Gray
}

Write-Host "`nDIAGNOSIS COMPLETE" -ForegroundColor Red
