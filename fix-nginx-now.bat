@echo off
echo ========================================
echo NGINX FIX - FINAL STEP
echo ========================================
echo.
echo Fixing Nginx to complete website restoration...
echo.

echo Step 1: Installing Nginx if needed...
ssh root@38.180.122.239 "apt update && apt install -y nginx"

echo.
echo Step 2: Creating basic Nginx config...
ssh root@38.180.122.239 "cat > /etc/nginx/sites-available/smile-rental << 'EOF'
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF"

echo.
echo Step 3: Enabling site...
ssh root@38.180.122.239 "ln -sf /etc/nginx/sites-available/smile-rental /etc/nginx/sites-enabled/"

echo.
echo Step 4: Removing default site...
ssh root@38.180.122.239 "rm -f /etc/nginx/sites-enabled/default"

echo.
echo Step 5: Testing Nginx config...
ssh root@38.180.122.239 "nginx -t"

echo.
echo Step 6: Starting Nginx...
ssh root@38.180.122.239 "systemctl start nginx && systemctl enable nginx"

echo.
echo Step 7: Checking status...
ssh root@38.180.122.239 "systemctl status nginx --no-pager"

echo.
echo Step 8: Testing website...
ssh root@38.180.122.239 "curl -I http://localhost"

echo.
echo Step 9: Testing domain...
ssh root@38.180.122.239 "curl -I http://smilerentalphuket.com"

echo.
echo ========================================
echo NGINX FIX COMPLETED
echo ========================================
echo.
echo Website should now be accessible at:
echo http://smilerentalphuket.com
echo.
pause
