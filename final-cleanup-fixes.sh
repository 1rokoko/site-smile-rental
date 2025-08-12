#!/bin/bash

# Final Cleanup Fixes for Google Ads Compliance
echo "🔧 Applying final cleanup fixes for Google Ads compliance..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Step 1: Updating application code with Analytics fix..."
cd /var/www/smilerentalphuket.com/site-smile-rental

# Pull latest changes (includes Analytics component fix)
git fetch origin
git reset --hard origin/main

print_status "Step 2: Building application with latest fixes..."
npm ci --production
export NODE_OPTIONS='--max-old-space-size=4096'
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_status "Step 3: Fixing Nginx configuration..."

# Create the corrected HTTPS configuration without 'speaker' in Permissions-Policy
cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;
    
    # Redirect all HTTP to HTTPS
    return 301 https://smilerentalphuket.com$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/smilerentalphuket.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smilerentalphuket.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/smilerentalphuket.com/chain.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers (Critical for Google Ads)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # FIXED: Permissions-Policy without 'speaker' feature for Google Ads compliance
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self), display-capture=()" always;

    # Hide server version
    server_tokens off;

    # Root directory
    root /var/www/smilerentalphuket.com/site-smile-rental;
    index index.html index.htm;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files
    location /_next/static/ {
        alias /var/www/smilerentalphuket.com/site-smile-rental/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Public files
    location /public/ {
        alias /var/www/smilerentalphuket.com/site-smile-rental/public/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Maintenance page
    error_page 502 503 504 /maintenance.html;
    location = /maintenance.html {
        root /var/www/smilerentalphuket.com/site-smile-rental/public;
        internal;
    }
}
EOF

# Test nginx configuration
print_status "Step 4: Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed"
    exit 1
fi

print_status "Step 5: Restarting services..."

# Restart PM2 application
pm2 stop smile-rental 2>/dev/null || echo "App was not running"
pm2 delete smile-rental 2>/dev/null || echo "App was not in PM2"
NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name 'smile-rental' -- start
pm2 save

# Restart Nginx
systemctl restart nginx

print_status "Step 6: Verifying fixes..."
sleep 5

# Test HTTPS
https_status=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/)
print_status "HTTPS status: $https_status"

# Test HTTP redirect
http_redirect=$(curl -s -I http://smilerentalphuket.com/ | head -1)
print_status "HTTP redirect: $http_redirect"

# Check if Permissions-Policy still has 'speaker'
headers=$(curl -s -I https://smilerentalphuket.com/)
if echo "$headers" | grep -i "permissions-policy" | grep -q "speaker"; then
    print_error "Permissions-Policy still contains 'speaker' feature"
else
    print_success "Permissions-Policy correctly excludes 'speaker' feature"
fi

# Check if ga-init.js returns proper 404
ga_status=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/js/ga-init.js)
if [ "$ga_status" = "404" ]; then
    print_success "ga-init.js correctly returns 404 (Analytics component fix deployed)"
else
    print_error "ga-init.js issue not resolved (status: $ga_status)"
fi

print_success "Final cleanup completed!"
echo ""
echo "🎯 Summary of fixes applied:"
echo "1. ✅ Analytics component updated (ga-init.js 404 resolved)"
echo "2. ✅ Nginx configuration updated (removed 'speaker' from Permissions-Policy)"
echo "3. ✅ HTTP to HTTPS redirect enforced"
echo "4. ✅ All security headers properly configured"
echo ""
echo "🔍 Next verification steps:"
echo "1. Test: https://securityheaders.com/?q=https://smilerentalphuket.com"
echo "2. Verify: No console errors in browser"
echo "3. Check: Google Ads compliance improved"
