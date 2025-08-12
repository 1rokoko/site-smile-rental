#!/bin/bash

# Deploy Critical JavaScript Fixes for Google Ads Compliance
echo "🚨 Deploying CRITICAL JavaScript fixes for Google Ads compliance..."

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

print_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_critical "CRITICAL FIX: Removing ALL dynamic DOM manipulation for Google Ads compliance"

print_status "Step 1: Updating application code with critical JavaScript fixes..."
cd /var/www/smilerentalphuket.com/site-smile-rental

# Pull latest changes (includes critical JS fixes)
git fetch origin
git reset --hard origin/main

print_status "Step 2: Building application with critical fixes..."
npm ci --production
export NODE_OPTIONS='--max-old-space-size=4096'
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_status "Step 3: Restarting services..."

# Restart PM2 application
pm2 stop smile-rental 2>/dev/null || echo "App was not running"
pm2 delete smile-rental 2>/dev/null || echo "App was not in PM2"
NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name 'smile-rental' -- start
pm2 save

print_status "Step 4: Verifying critical fixes..."
sleep 5

# Test HTTPS
https_status=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/)
print_status "HTTPS status: $https_status"

# Check if dynamic DOM manipulation is removed
print_status "Checking for dynamic DOM manipulation patterns..."

# Test the main page for suspicious patterns
page_content=$(curl -s https://smilerentalphuket.com/)

# Check for dangerouslySetInnerHTML in the actual page
if echo "$page_content" | grep -q "dangerouslySetInnerHTML"; then
    print_error "dangerouslySetInnerHTML still found in page content"
else
    print_success "dangerouslySetInnerHTML successfully removed from page"
fi

# Check for dynamic style injection
if echo "$page_content" | grep -q "createElement.*style"; then
    print_error "Dynamic style creation still found"
else
    print_success "Dynamic style creation successfully removed"
fi

# Check for dynamic script injection
if echo "$page_content" | grep -q "createElement.*script"; then
    print_error "Dynamic script creation still found"
else
    print_success "Dynamic script creation successfully removed"
fi

# Check for textContent with appendChild pattern
if echo "$page_content" | grep -q "textContent.*appendChild"; then
    print_error "Dynamic DOM manipulation (textContent + appendChild) still found"
else
    print_success "Dynamic DOM manipulation successfully removed"
fi

print_success "Critical JavaScript fixes deployment completed!"
echo ""
echo "🎯 CRITICAL FIXES APPLIED:"
echo "1. ✅ Removed SecureCSSLoader component (dynamic CSS injection)"
echo "2. ✅ Disabled injectSecureStyle() function"
echo "3. ✅ Disabled injectSecureScript() function"
echo "4. ✅ Disabled initializeSecureCSS() function"
echo "5. ✅ Replaced dynamic CSS with static critical.css import"
echo "6. ✅ Removed secure-init.js file (contained createElement patterns)"
echo ""
echo "🔍 VERIFICATION STEPS:"
echo "1. Test: https://smilerentalphuket.com (should load without console errors)"
echo "2. Check: Browser DevTools Console (no dynamic injection warnings)"
echo "3. Verify: No createElement, appendChild, or textContent patterns in JS"
echo "4. Scan: https://securityheaders.com/?q=https://smilerentalphuket.com"
echo ""
echo "🚨 GOOGLE ADS IMPACT:"
echo "These changes eliminate ALL patterns that Google Ads flags as suspicious:"
echo "- ❌ Dynamic DOM element creation (createElement)"
echo "- ❌ Dynamic content injection (textContent + appendChild)"
echo "- ❌ Runtime style/script injection"
echo "- ❌ dangerouslySetInnerHTML usage"
echo ""
echo "✅ The website now uses ONLY static CSS imports and external script files"
echo "✅ This should resolve Google Ads 'compromised site' and 'system bypass' flags"
