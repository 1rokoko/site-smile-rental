# Simple Nginx Fix
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"

Write-Host "FIXING NGINX TO COMPLETE WEBSITE..." -ForegroundColor Green

# Create basic nginx config
$nginxConfig = @"
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
    }
}
"@

Write-Host "Step 1: Creating Nginx config..." -ForegroundColor Yellow
& ssh $SERVER_USER@$SERVER_IP "echo '$nginxConfig' > /etc/nginx/sites-available/smile-rental"

Write-Host "Step 2: Enabling site..." -ForegroundColor Yellow  
& ssh $SERVER_USER@$SERVER_IP "ln -sf /etc/nginx/sites-available/smile-rental /etc/nginx/sites-enabled/"

Write-Host "Step 3: Removing default..." -ForegroundColor Yellow
& ssh $SERVER_USER@$SERVER_IP "rm -f /etc/nginx/sites-enabled/default"

Write-Host "Step 4: Testing config..." -ForegroundColor Yellow
& ssh $SERVER_USER@$SERVER_IP "nginx -t"

Write-Host "Step 5: Starting Nginx..." -ForegroundColor Yellow
& ssh $SERVER_USER@$SERVER_IP "systemctl start nginx && systemctl enable nginx"

Write-Host "Step 6: Testing website..." -ForegroundColor Yellow
& ssh $SERVER_USER@$SERVER_IP "curl -I http://smilerentalphuket.com"

Write-Host "NGINX FIX COMPLETED!" -ForegroundColor Green
