#!/bin/bash
echo "Fixing server via WSL..."

# Install sshpass if not available
if ! command -v sshpass &> /dev/null; then
    echo "Installing sshpass..."
    sudo apt-get update -qq
    sudo apt-get install -y sshpass
fi

echo "Connecting to server and executing recovery commands..."

sshpass -p "925LudK9Bv" ssh -o StrictHostKeyChecking=no root@38.180.122.239 << 'EOF'
echo "=== Connected to server ==="
echo "Current directory: $(pwd)"

echo "=== PM2 Status ==="
pm2 status

echo "=== Stopping all PM2 processes ==="
pm2 stop all

echo "=== Killing all PM2 processes ==="
pm2 kill

echo "=== Checking port 3000 ==="
netstat -tlnp | grep :3000 || echo "Nothing on port 3000"

echo "=== Killing processes on port 3000 ==="
fuser -k 3000/tcp 2>/dev/null || echo "No processes to kill on port 3000"

echo "=== Checking directories ==="
ls -la /var/www/

echo "=== Navigating to project directory ==="
if [ -d "/var/www/smile-rental" ]; then
    cd /var/www/smile-rental
    echo "Using /var/www/smile-rental"
elif [ -d "/var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" ]; then
    cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
    echo "Using /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern"
else
    echo "Project directory not found!"
    exit 1
fi

echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Starting PM2 processes ==="
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
    echo "Started with ecosystem.config.js"
elif [ -f "package.json" ]; then
    pm2 start npm --name "smile-rental" -- start
    echo "Started with npm start"
else
    echo "No ecosystem.config.js or package.json found!"
    exit 1
fi

echo "=== PM2 Status after restart ==="
pm2 status

echo "=== Setting up PM2 startup ==="
pm2 startup

echo "=== Saving PM2 configuration ==="
pm2 save

echo "=== Restarting Nginx ==="
systemctl restart nginx

echo "=== Testing localhost ==="
curl -I http://localhost

echo "=== Server recovery completed ==="
exit
EOF

echo "Recovery script completed!"
