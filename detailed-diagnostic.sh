#!/bin/bash
# Detailed Diagnostic Script for Site Smile Rental
# Method 6.1 SSH approach

echo "=== DETAILED SITE SMILE RENTAL DIAGNOSTIC ==="
echo "Timestamp: $(date)"
echo ""

echo "=== PM2 DETAILED STATUS ==="
pm2 list
echo ""
echo "PM2 processes info:"
pm2 info all 2>/dev/null || echo "No PM2 processes running"
echo ""
echo "PM2 logs (last 30 lines):"
pm2 logs --lines 30 2>/dev/null || echo "No PM2 logs available"
echo ""

echo "=== NETWORK ANALYSIS ==="
echo "All listening ports:"
netstat -tlnp | grep LISTEN
echo ""
echo "Specifically checking port 3000:"
netstat -tlnp | grep :3000 || echo "Port 3000 not listening"
echo ""
echo "Node.js processes:"
ps aux | grep node | grep -v grep || echo "No Node.js processes found"
echo ""

echo "=== PROJECT CONFIGURATION ==="
cd /var/www/smilerentalphuket.com/site-smile-rental || exit 1
echo "Current directory: $(pwd)"
echo ""
echo "Package.json scripts section:"
if [ -f package.json ]; then
    cat package.json | jq '.scripts' 2>/dev/null || grep -A 10 '"scripts"' package.json
else
    echo "package.json not found!"
fi
echo ""

echo "Next.js configuration:"
if [ -f next.config.js ]; then
    echo "next.config.js exists:"
    cat next.config.js
else
    echo "next.config.js not found"
fi
echo ""

echo "=== TESTING LOCAL CONNECTIVITY ==="
echo "Testing localhost:3000:"
curl -I http://localhost:3000 2>/dev/null || echo "localhost:3000 not responding"
echo ""
echo "Testing 127.0.0.1:3000:"
curl -I http://127.0.0.1:3000 2>/dev/null || echo "127.0.0.1:3000 not responding"
echo ""

echo "=== NGINX CONFIGURATION ==="
echo "Nginx status:"
systemctl status nginx --no-pager | head -10
echo ""
echo "Nginx configuration for smilerentalphuket.com:"
if [ -f /etc/nginx/sites-available/smilerentalphuket.com ]; then
    cat /etc/nginx/sites-available/smilerentalphuket.com
else
    echo "Nginx config not found!"
fi
echo ""

echo "=== SYSTEM RESOURCES ==="
echo "Memory usage:"
free -h
echo ""
echo "Disk space:"
df -h /var/www
echo ""

echo "=== DIAGNOSTIC COMPLETE ==="
