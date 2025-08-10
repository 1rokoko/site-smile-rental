#!/bin/bash
# Diagnostic Script for Site Smile Rental
# Using Method 6.1 SSH approach

echo "=== SITE SMILE RENTAL DIAGNOSTIC ==="
echo "Timestamp: $(date)"
echo "Server: $(hostname)"
echo ""

echo "=== SYSTEM RESOURCES ==="
echo "Memory usage:"
free -h
echo ""
echo "Disk usage:"
df -h /
echo ""
echo "Top memory consumers:"
ps aux --sort=-%mem | head -10
echo ""

echo "=== PM2 STATUS ==="
pm2 list
echo ""
echo "PM2 processes details:"
pm2 show all 2>/dev/null || echo "No PM2 processes found"
echo ""

echo "=== NODE.JS PROCESSES ==="
ps aux | grep node | grep -v grep
echo ""

echo "=== NETWORK PORTS ==="
echo "Listening ports:"
netstat -tlnp | grep LISTEN
echo ""
echo "Port 3000 specifically:"
netstat -tlnp | grep :3000 || echo "Port 3000 not listening"
echo ""

echo "=== PROJECT DIRECTORY ==="
cd /var/www/smilerentalphuket.com/site-smile-rental
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la
echo ""
echo "Package.json scripts:"
cat package.json | grep -A 10 '"scripts"' || echo "No package.json found"
echo ""

echo "=== NGINX STATUS ==="
systemctl status nginx --no-pager
echo ""
echo "Nginx configuration test:"
nginx -t
echo ""

echo "=== RECENT LOGS ==="
echo "PM2 logs (last 20 lines):"
pm2 logs --lines 20 2>/dev/null || echo "No PM2 logs available"
echo ""
echo "System logs (last 10 lines):"
tail -10 /var/log/syslog | grep -E "(node|npm|pm2)" || echo "No relevant system logs"
echo ""

echo "=== DIAGNOSTIC COMPLETE ==="
