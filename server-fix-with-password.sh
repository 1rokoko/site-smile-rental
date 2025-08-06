#!/bin/bash
echo "Connecting to server and fixing PM2 processes..."

# Use sshpass to automatically provide password
sshpass -p "925LudK9Bv" ssh -o StrictHostKeyChecking=no root@38.180.122.239 << 'EOF'
echo "=== Connected to server ==="
echo "Current directory: $(pwd)"

echo "=== Checking /var/www directories ==="
ls -la /var/www/

echo "=== PM2 Status ==="
pm2 status

echo "=== Stopping all PM2 processes ==="
pm2 stop all

echo "=== Killing all PM2 processes ==="
pm2 kill

echo "=== Checking what's running on port 3000 ==="
netstat -tlnp | grep :3000

echo "=== Killing processes on port 3000 ==="
fuser -k 3000/tcp

echo "=== Checking smile-rental directory ==="
if [ -d "/var/www/smile-rental" ]; then
    echo "Directory /var/www/smile-rental exists"
    cd /var/www/smile-rental
    echo "Contents:"
    ls -la
    
    if [ -f "ecosystem.config.js" ]; then
        echo "=== Starting PM2 processes ==="
        pm2 start ecosystem.config.js
    else
        echo "ecosystem.config.js not found, checking for package.json"
        if [ -f "package.json" ]; then
            echo "=== Starting with npm start ==="
            pm2 start npm --name "smile-rental" -- start
        else
            echo "No package.json found either"
        fi
    fi
else
    echo "Directory /var/www/smile-rental does not exist"
    echo "Checking alternative locations..."
    
    if [ -d "/var/www/smilerentalphuket.com" ]; then
        echo "Found /var/www/smilerentalphuket.com"
        cd /var/www/smilerentalphuket.com
        ls -la
        
        # Look for the project directory
        if [ -d "site-smile-rental/smile-rental-modern" ]; then
            echo "Found project in site-smile-rental/smile-rental-modern"
            cd site-smile-rental/smile-rental-modern
            ls -la
            
            if [ -f "ecosystem.config.js" ]; then
                echo "=== Starting PM2 processes ==="
                pm2 start ecosystem.config.js
            elif [ -f "package.json" ]; then
                echo "=== Starting with npm start ==="
                pm2 start npm --name "smile-rental" -- start
            fi
        fi
    fi
fi

echo "=== PM2 Status after restart ==="
pm2 status

echo "=== Setting up PM2 startup ==="
pm2 startup

echo "=== Saving PM2 configuration ==="
pm2 save

echo "=== Nginx status ==="
systemctl status nginx --no-pager

echo "=== Restarting Nginx ==="
systemctl restart nginx

echo "=== Final status check ==="
curl -I http://localhost

echo "=== Testing external access ==="
curl -I http://smilerentalphuket.com

exit
EOF

echo "Server fix completed!"
