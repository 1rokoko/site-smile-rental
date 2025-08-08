#!/bin/bash

echo "🔧 NGINX SETUP - Smile Rental Phuket"
echo "===================================="

# Backup existing nginx config
echo "💾 Backing up existing nginx config..."
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "No existing config to backup"

# Create new nginx config
echo "📝 Creating new nginx configuration..."
cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Maintenance mode check
    if (-f /var/www/html/maintenance.html) {
        return 503;
    }
    
    # Error page for maintenance
    error_page 503 @maintenance;
    location @maintenance {
        root /var/www/html;
        try_files /maintenance.html =503;
        internal;
    }
    
    # Main application proxy
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
        
        # Handle 502/503/504 errors gracefully
        proxy_intercept_errors on;
        error_page 502 503 504 @fallback;
    }
    
    # Fallback for when app is down
    location @fallback {
        root /var/www/html;
        try_files /maintenance.html /index.html =502;
    }
    
    # Static files optimization
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes
    location /api/ {
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
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# Enable the site
echo "🔗 Enabling nginx site..."
ln -sf /etc/nginx/sites-available/smilerentalphuket.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    systemctl reload nginx
    
    echo "✅ Nginx setup completed successfully!"
    echo "🌐 Site should be accessible at: http://smilerentalphuket.com"
else
    echo "❌ Nginx configuration test failed!"
    echo "🔄 Restoring backup..."
    cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default 2>/dev/null || echo "No backup to restore"
    systemctl reload nginx
    exit 1
fi

echo ""
echo "🏁 Nginx setup completed!"
echo "========================"
