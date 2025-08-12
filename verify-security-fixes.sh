#!/bin/bash

# Security Verification Script for Google Ads Compliance
echo "🔍 Verifying security fixes for Google Ads compliance..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Test HTTPS redirect
print_check "Testing HTTPS redirect..."
http_response=$(curl -s -I http://smilerentalphuket.com | head -1)
if echo "$http_response" | grep -q "301\|302"; then
    print_pass "HTTP to HTTPS redirect is working"
else
    print_fail "HTTP to HTTPS redirect not working"
fi

# Test HTTPS availability
print_check "Testing HTTPS availability..."
https_response=$(curl -s -I https://smilerentalphuket.com | head -1)
if echo "$https_response" | grep -q "200"; then
    print_pass "HTTPS is working"
else
    print_fail "HTTPS is not working"
fi

# Test security headers
print_check "Testing security headers..."
headers=$(curl -s -I https://smilerentalphuket.com)

# Check HSTS
if echo "$headers" | grep -qi "strict-transport-security"; then
    print_pass "HSTS header present"
else
    print_fail "HSTS header missing"
fi

# Check X-Frame-Options
if echo "$headers" | grep -qi "x-frame-options"; then
    print_pass "X-Frame-Options header present"
else
    print_fail "X-Frame-Options header missing"
fi

# Check X-Content-Type-Options
if echo "$headers" | grep -qi "x-content-type-options"; then
    print_pass "X-Content-Type-Options header present"
else
    print_fail "X-Content-Type-Options header missing"
fi

# Check Referrer-Policy
if echo "$headers" | grep -qi "referrer-policy"; then
    print_pass "Referrer-Policy header present"
else
    print_fail "Referrer-Policy header missing"
fi

# Check Permissions-Policy
if echo "$headers" | grep -qi "permissions-policy"; then
    print_pass "Permissions-Policy header present"
else
    print_fail "Permissions-Policy header missing"
fi

# Test SSL certificate
print_check "Testing SSL certificate..."
ssl_info=$(echo | openssl s_client -servername smilerentalphuket.com -connect smilerentalphuket.com:443 2>/dev/null | openssl x509 -noout -dates)
if [ $? -eq 0 ]; then
    print_pass "SSL certificate is valid"
    echo "$ssl_info"
else
    print_fail "SSL certificate issues detected"
fi

# Test for 404 errors
print_check "Testing for 404 errors..."
ga_init_response=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/js/ga-init.js)
if [ "$ga_init_response" = "404" ]; then
    print_warning "ga-init.js returns 404 (this should be fixed in the code)"
else
    print_pass "No 404 errors for ga-init.js"
fi

# Test Google Analytics loading
print_check "Testing Google Analytics..."
ga_response=$(curl -s -o /dev/null -w "%{http_code}" https://www.googletagmanager.com/gtag/js?id=G-XQYEJ26C2J)
if [ "$ga_response" = "200" ]; then
    print_pass "Google Analytics script loads successfully"
else
    print_fail "Google Analytics script loading issues"
fi

# Test page load
print_check "Testing main page load..."
page_response=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/)
if [ "$page_response" = "200" ]; then
    print_pass "Main page loads successfully"
else
    print_fail "Main page loading issues"
fi

echo ""
echo "🔍 External Security Scans:"
echo "   - SecurityHeaders.com: https://securityheaders.com/?q=smilerentalphuket.com"
echo "   - SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=smilerentalphuket.com"
echo "   - Google Safe Browsing: https://transparencyreport.google.com/safe-browsing/search?url=smilerentalphuket.com"
echo ""
echo "✅ Verification completed!"
