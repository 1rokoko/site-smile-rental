#!/bin/bash

# Quick HTTPS Fix for Google Ads Compliance
# This script enables HTTPS and fixes the primary security issues

echo "🔒 Enabling HTTPS for Google Ads compliance..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "/etc/letsencrypt/live/smilerentalphuket.com/fullchain.pem" ]; then
    echo "📋 SSL certificates not found. Installing Let's Encrypt..."
    
    # Install certbot
    apt update
    apt install -y certbot python3-certbot-nginx
    
    # Stop nginx temporarily
    systemctl stop nginx
    
    # Get SSL certificate
    certbot certonly --standalone -d smilerentalphuket.com -d www.smilerentalphuket.com --agree-tos --no-eff-email --email admin@smilerentalphuket.com
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to obtain SSL certificate"
        exit 1
    fi
fi

# Create HTTPS-enabled Nginx configuration
echo "📝 Creating HTTPS Nginx configuration..."
cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;
    
    # Security headers even for redirects
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
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
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;

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

# Enable the site
echo "🔗 Enabling HTTPS site..."
ln -sf /etc/nginx/sites-available/smilerentalphuket.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

# Set up automatic certificate renewal
echo "🔄 Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Test HTTPS
echo "🧪 Testing HTTPS..."
sleep 3
curl -I https://smilerentalphuket.com/ | head -5

echo ""
echo "✅ HTTPS setup completed!"
echo "🔒 SSL Certificate: Active"
echo "🛡️ Security Headers: Enabled"
echo "🔄 Auto-renewal: Configured"
echo ""
echo "🧪 Test your site:"
echo "   - https://smilerentalphuket.com"
echo "   - https://securityheaders.com/?q=smilerentalphuket.com"
echo "   - https://www.ssllabs.com/ssltest/analyze.html?d=smilerentalphuket.com"
