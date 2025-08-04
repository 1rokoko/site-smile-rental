#!/bin/bash

echo "🔧 Final SSL Fix for smilerentalphuket.com"
echo "=========================================="

# Step 1: Create working HTTP configuration first
echo "📝 Step 1: Creating working HTTP configuration..."
cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

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
    }
}
EOF

# Step 2: Test and restart Nginx
echo "🧪 Step 2: Testing Nginx configuration..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✅ Configuration valid, restarting Nginx..."
    systemctl restart nginx
    sleep 3
    
    echo "🔍 Step 3: Testing HTTP..."
    if curl -s -I http://smilerentalphuket.com | grep -q "200 OK"; then
        echo "✅ HTTP working!"
        
        # Step 4: Add SSL configuration
        echo "🔒 Step 4: Adding SSL configuration..."
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
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

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
    }
}
EOF
        
        # Step 5: Test SSL configuration
        echo "🧪 Step 5: Testing SSL configuration..."
        nginx -t
        if [ $? -eq 0 ]; then
            echo "✅ SSL configuration valid, reloading Nginx..."
            systemctl reload nginx
            sleep 3
            
            echo "🔍 Step 6: Testing HTTPS..."
            if curl -s -I https://smilerentalphuket.com | grep -q "200 OK"; then
                echo "🎉 SUCCESS! HTTPS is working!"
                echo "✅ Website: https://smilerentalphuket.com"
                echo "✅ HTTP redirects to HTTPS"
                echo "✅ SSL certificate active"
            else
                echo "⚠️ HTTPS test failed, but configuration is valid"
                echo "🔍 Manual check needed"
            fi
        else
            echo "❌ SSL configuration failed"
            # Restore HTTP-only configuration
            cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

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
    }
}
EOF
            systemctl reload nginx
            echo "🔄 Restored HTTP-only configuration"
        fi
    else
        echo "❌ HTTP test failed"
    fi
else
    echo "❌ Nginx configuration test failed"
fi

echo ""
echo "📊 Final Status:"
systemctl status nginx --no-pager
echo ""
echo "🔍 Testing both protocols:"
echo "HTTP: $(curl -s -o /dev/null -w '%{http_code}' http://smilerentalphuket.com || echo 'Failed')"
echo "HTTPS: $(curl -s -o /dev/null -w '%{http_code}' https://smilerentalphuket.com || echo 'Failed')"
