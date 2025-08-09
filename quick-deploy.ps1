# Quick deployment using existing server scripts
Write-Host "Quick deployment to server..." -ForegroundColor Green
Write-Host "This will use existing scripts on the server" -ForegroundColor Cyan
Write-Host ""

$server = "38.180.122.239"
$user = "root"

# Test if SSH key works
Write-Host "Testing SSH key connection..." -ForegroundColor Cyan
try {
    $testResult = & ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\smile_rental_key" $user@$server "echo 'Key works'"
    if ($testResult -match "Key works") {
        Write-Host "SSH key authentication successful!" -ForegroundColor Green
        $useKey = $true
    } else {
        Write-Host "SSH key not working, will need password" -ForegroundColor Yellow
        $useKey = $false
    }
} catch {
    Write-Host "SSH key test failed, will need password" -ForegroundColor Yellow
    $useKey = $false
}

if ($useKey) {
    Write-Host "Using SSH key for deployment..." -ForegroundColor Green
    
    # Use existing deployment script on server
    Write-Host "Running deployment script on server..." -ForegroundColor Cyan
    & ssh -i "$env:USERPROFILE\.ssh\smile_rental_key" $user@$server "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && ./deployment-status.sh"
    
    Write-Host "Running update script..." -ForegroundColor Cyan
    & ssh -i "$env:USERPROFILE\.ssh\smile_rental_key" $user@$server "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && ./update-site.sh"
    
} else {
    Write-Host "SSH key not available. Manual steps needed:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Connect to server manually:" -ForegroundColor White
    Write-Host "   ssh root@$server" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Run these commands on server:" -ForegroundColor White
    Write-Host "   cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor Cyan
    Write-Host "   ./deployment-status.sh" -ForegroundColor Cyan
    Write-Host "   ./update-site.sh" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Or run the setup script to create SSH keys:" -ForegroundColor White
    Write-Host "   ./setup-ssh-keys.sh" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "After deployment, test the site at: http://smilerentalphuket.com" -ForegroundColor Green
