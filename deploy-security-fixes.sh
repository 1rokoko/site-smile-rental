#!/bin/bash

# Deploy Security Fixes for Google Ads Compliance
echo "🚀 Deploying security fixes for Google Ads compliance..."

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Update application code
print_status "Step 1: Updating application code..."
cd /var/www/smilerentalphuket.com/site-smile-rental

# Pull latest changes
git fetch origin
git reset --hard origin/main

# Step 2: Install dependencies and build
print_status "Step 2: Building application..."
npm ci --production
export NODE_OPTIONS='--max-old-space-size=4096'
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

# Step 3: Update Nginx configuration for HTTPS and security headers
print_status "Step 3: Updating Nginx configuration..."

# Use the corrected SSL configuration
cp nginx-ssl-config.conf /etc/nginx/sites-available/smilerentalphuket.com

# Enable the site
ln -sf /etc/nginx/sites-available/smilerentalphuket.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
print_status "Testing Nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed"
    exit 1
fi

# Step 4: Restart services
print_status "Step 4: Restarting services..."

# Restart PM2 application
pm2 stop smile-rental 2>/dev/null || echo "App was not running"
pm2 delete smile-rental 2>/dev/null || echo "App was not in PM2"
NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name 'smile-rental' -- start
pm2 save

# Restart Nginx
systemctl restart nginx

# Step 5: Verify deployment
print_status "Step 5: Verifying deployment..."
sleep 5

# Test HTTPS
https_status=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/)
if [ "$https_status" = "200" ]; then
    print_success "HTTPS is working (Status: $https_status)"
else
    print_error "HTTPS test failed (Status: $https_status)"
fi

# Test HTTP redirect
http_status=$(curl -s -o /dev/null -w "%{http_code}" http://smilerentalphuket.com/)
if [ "$http_status" = "301" ] || [ "$http_status" = "302" ]; then
    print_success "HTTP to HTTPS redirect is working (Status: $http_status)"
else
    print_warning "HTTP redirect may not be working (Status: $http_status)"
fi

# Check security headers
print_status "Checking security headers..."
headers=$(curl -s -I https://smilerentalphuket.com/)

if echo "$headers" | grep -qi "strict-transport-security"; then
    print_success "HSTS header present"
else
    print_error "HSTS header missing"
fi

if echo "$headers" | grep -qi "x-frame-options"; then
    print_success "X-Frame-Options header present"
else
    print_error "X-Frame-Options header missing"
fi

if echo "$headers" | grep -qi "permissions-policy"; then
    print_success "Permissions-Policy header present"
    # Check if speaker is still there
    if echo "$headers" | grep -i "permissions-policy" | grep -q "speaker"; then
        print_warning "Permissions-Policy still contains 'speaker' feature"
    else
        print_success "Permissions-Policy correctly excludes 'speaker' feature"
    fi
else
    print_error "Permissions-Policy header missing"
fi

# Step 6: Check PM2 status
print_status "Step 6: Checking PM2 status..."
pm2 status

print_success "Security fixes deployment completed!"
echo ""
echo "🔍 Next steps:"
echo "1. Test website: https://smilerentalphuket.com"
echo "2. Run security scan: https://securityheaders.com/?q=smilerentalphuket.com"
echo "3. Check SSL: https://www.ssllabs.com/ssltest/analyze.html?d=smilerentalphuket.com"
echo "4. Verify Google Safe Browsing: https://transparencyreport.google.com/safe-browsing/search?url=smilerentalphuket.com"
echo ""
echo "🔧 If issues persist, check:"
echo "- Browser cache (hard refresh with Ctrl+F5)"
echo "- CDN cache (if using any)"
echo "- DNS propagation"
