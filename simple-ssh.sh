#!/bin/bash
# Simple SSH script for Site Smile Rental

echo "=== CONNECTING TO SERVER ==="
echo "Server: root@38.180.122.239"
echo "Password will be entered automatically"

# Execute commands via SSH
sshpass -p '925LudK9Bv' ssh -o StrictHostKeyChecking=no root@38.180.122.239 << 'EOF'
echo "=== CONNECTED TO SERVER ==="
echo "=== CHECKING PM2 STATUS ==="
pm2 list

echo "=== STOPPING ALL PM2 PROCESSES ==="
pm2 delete all

echo "=== NAVIGATING TO PROJECT DIRECTORY ==="
cd /var/www/smilerentalphuket.com/site-smile-rental
pwd

echo "=== STARTING NEW PM2 PROCESS ==="
pm2 start 'npm run dev' --name smile-rental-dev

echo "=== SAVING PM2 CONFIGURATION ==="
pm2 save

echo "=== CHECKING PM2 STATUS AFTER RESTART ==="
pm2 list

echo "=== TESTING NGINX CONFIGURATION ==="
nginx -t

echo "=== RESTARTING NGINX ==="
systemctl restart nginx

echo "=== TESTING LOCAL CONNECTION ==="
curl -I http://localhost:3000

echo "=== TESTING DOMAIN CONNECTION ==="
curl -I http://smilerentalphuket.com

echo "=== ALL COMMANDS COMPLETED ==="
EOF

echo "=== SSH SESSION COMPLETED ==="
