#!/bin/bash

echo "🔒 Installing SSL Certificate for smilerentalphuket.com"
echo "=================================================="

# Update system
echo "📦 Updating system packages..."
apt update

# Install Certbot
echo "🔧 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Check current Nginx configuration
echo "🔍 Checking current Nginx configuration..."
nginx -t

# Stop Nginx temporarily for certificate generation
echo "⏹️ Stopping Nginx temporarily..."
systemctl stop nginx

# Generate SSL certificate
echo "🔒 Generating SSL certificate for smilerentalphuket.com..."
certbot certonly --standalone -d smilerentalphuket.com --email admin@smilerentalphuket.com --agree-tos --non-interactive

# Create enhanced Nginx configuration with SSL
echo "📝 Creating enhanced Nginx configuration..."
cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;
    return 301 https://smilerentalphuket.com$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/smilerentalphuket.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smilerentalphuket.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Root directory
    root /var/www/smilerentalphuket.com/site-smile-rental;
    index index.html index.htm;

    # Main location block for Next.js app
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

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @proxy;
    }

    location @proxy {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security: deny access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ /(\.git|node_modules|\.env) {
        deny all;
    }
}
EOF

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Start Nginx
    echo "🚀 Starting Nginx..."
    systemctl start nginx
    systemctl enable nginx
    
    # Setup automatic certificate renewal
    echo "🔄 Setting up automatic certificate renewal..."
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --reload-nginx") | crontab -
    
    echo ""
    echo "🎉 SSL Certificate installation completed!"
    echo "✅ Website is now available at: https://smilerentalphuket.com"
    echo "✅ HTTP traffic will automatically redirect to HTTPS"
    echo "✅ Certificate will auto-renew every 12 hours"
    echo ""
    echo "🔍 Testing SSL certificate..."
    curl -I https://smilerentalphuket.com || echo "⚠️ SSL test failed - check DNS and firewall"
    
else
    echo "❌ Nginx configuration test failed!"
    echo "🔧 Please check the configuration manually"
    exit 1
fi

echo ""
echo "📊 SSL Certificate Status:"
certbot certificates

echo ""
echo "🎯 Next steps:"
echo "1. Test the website: https://smilerentalphuket.com"
echo "2. Check SSL rating: https://www.ssllabs.com/ssltest/"
echo "3. Verify automatic renewal: certbot renew --dry-run"
