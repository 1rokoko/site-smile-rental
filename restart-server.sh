#!/bin/bash
echo "Connecting to server and restarting services..."

# SSH commands to execute
ssh -o StrictHostKeyChecking=no root@38.180.122.239 << 'EOF'
echo "=== PM2 Status ==="
pm2 status

echo "=== Stopping all PM2 processes ==="
pm2 stop all

echo "=== Killing all PM2 processes ==="
pm2 kill

echo "=== Checking what's running on port 3000 ==="
lsof -i :3000

echo "=== Killing processes on port 3000 ==="
fuser -k 3000/tcp

echo "=== Starting PM2 processes ==="
cd /var/www/smile-rental
pm2 start ecosystem.config.js

echo "=== PM2 Status after restart ==="
pm2 status

echo "=== Nginx status ==="
systemctl status nginx

echo "=== Restarting Nginx ==="
systemctl restart nginx

echo "=== Final status check ==="
curl -I http://localhost

exit
EOF

echo "Server restart completed!"
