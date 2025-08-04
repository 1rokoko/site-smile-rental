# PowerShell script for automatic SSL installation
Write-Host "🔒 Starting SSL Certificate Installation..." -ForegroundColor Green
Write-Host "Server: 38.180.122.239" -ForegroundColor Yellow
Write-Host "Domain: smilerentalphuket.com" -ForegroundColor Yellow

# Create expect-like script for SSH
$sshScript = @"
spawn ssh root@38.180.122.239
expect "password:"
send "925LudK9Bv\r"
expect "# "
send "apt update -y\r"
expect "# "
send "apt install -y certbot python3-certbot-nginx\r"
expect "# "
send "systemctl stop nginx\r"
expect "# "
send "certbot certonly --standalone -d smilerentalphuket.com --email admin@smilerentalphuket.com --agree-tos --non-interactive\r"
expect "# "
send "cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'\r"
send "# HTTP to HTTPS redirect\r"
send "server {\r"
send "    listen 80;\r"
send "    server_name smilerentalphuket.com www.smilerentalphuket.com;\r"
send "    return 301 https://smilerentalphuket.com\$request_uri;\r"
send "}\r"
send "\r"
send "# HTTPS configuration\r"
send "server {\r"
send "    listen 443 ssl http2;\r"
send "    server_name smilerentalphuket.com www.smilerentalphuket.com;\r"
send "\r"
send "    # SSL Configuration\r"
send "    ssl_certificate /etc/letsencrypt/live/smilerentalphuket.com/fullchain.pem;\r"
send "    ssl_certificate_key /etc/letsencrypt/live/smilerentalphuket.com/privkey.pem;\r"
send "    \r"
send "    # SSL Security Settings\r"
send "    ssl_protocols TLSv1.2 TLSv1.3;\r"
send "    ssl_prefer_server_ciphers off;\r"
send "    ssl_session_cache shared:SSL:10m;\r"
send "    \r"
send "    # Security Headers\r"
send "    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;\r"
send "    add_header X-Frame-Options DENY always;\r"
send "    add_header X-Content-Type-Options nosniff always;\r"
send "\r"
send "    # Main location block for Next.js app\r"
send "    location / {\r"
send "        proxy_pass http://localhost:3000;\r"
send "        proxy_http_version 1.1;\r"
send "        proxy_set_header Upgrade \$http_upgrade;\r"
send "        proxy_set_header Connection 'upgrade';\r"
send "        proxy_set_header Host \$host;\r"
send "        proxy_set_header X-Real-IP \$remote_addr;\r"
send "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\r"
send "        proxy_set_header X-Forwarded-Proto \$scheme;\r"
send "        proxy_cache_bypass \$http_upgrade;\r"
send "    }\r"
send "}\r"
send "EOF\r"
expect "# "
send "nginx -t\r"
expect "# "
send "systemctl start nginx\r"
expect "# "
send "(crontab -l 2>/dev/null; echo \"0 12 * * * /usr/bin/certbot renew --quiet --nginx\") | crontab -\r"
expect "# "
send "exit\r"
expect eof
"@

Write-Host "📝 SSL installation commands prepared" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To install SSL certificate, please run these commands manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Connect to server:" -ForegroundColor Cyan
Write-Host "   ssh root@38.180.122.239" -ForegroundColor White
Write-Host "   Password: 925LudK9Bv" -ForegroundColor White
Write-Host ""
Write-Host "2. Run the SSL installation script:" -ForegroundColor Cyan
Write-Host "   curl -s https://raw.githubusercontent.com/1rokoko/site-smile-rental/main/quick-ssl-setup.sh | bash" -ForegroundColor White
Write-Host ""
Write-Host "3. Or run commands step by step:" -ForegroundColor Cyan
Write-Host "   apt update -y" -ForegroundColor White
Write-Host "   apt install -y certbot python3-certbot-nginx" -ForegroundColor White
Write-Host "   systemctl stop nginx" -ForegroundColor White
Write-Host "   certbot certonly --standalone -d smilerentalphuket.com --email admin@smilerentalphuket.com --agree-tos --non-interactive" -ForegroundColor White
Write-Host ""
Write-Host "✅ After installation, the site will be available at:" -ForegroundColor Green
Write-Host "   https://smilerentalphuket.com" -ForegroundColor White
Write-Host ""

# Try to open SSH connection
Write-Host "🔄 Attempting to open SSH connection..." -ForegroundColor Yellow
try {
    Start-Process "ssh" -ArgumentList "root@38.180.122.239" -Wait
} catch {
    Write-Host "⚠️ Please run SSH manually: ssh root@38.180.122.239" -ForegroundColor Red
}

Write-Host "🎉 SSL installation script completed!" -ForegroundColor Green
