#!/bin/bash

# WSL deployment script
PASSWORD="925LudK9Bv"
SERVER="38.180.122.239"
USER="root"

echo "RESTORING SITE IN DEV MODE..."
echo "================================"

# Function to execute SSH commands
execute_ssh() {
    local command="$1"
    local description="$2"
    
    if [ -n "$description" ]; then
        echo "$description"
    fi
    
    # Use expect to automate password input
    /usr/bin/expect << EOF
spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $USER@$SERVER "$command"
expect {
    "password:" {
        send "$PASSWORD\r"
        exp_continue
    }
    eof
}
EOF
    
    echo "Command completed"
    echo ""
}

# Install expect if not available
if ! command -v expect &> /dev/null; then
    echo "Installing expect..."
    apt update && apt install -y expect
fi

# 1. Check PM2
echo "1. Checking PM2..."
execute_ssh "pm2 list" "Checking PM2 processes"

# 2. Delete old processes
echo "2. Deleting old processes..."
execute_ssh "pm2 delete all || echo 'No processes to delete'" "Deleting all PM2 processes"

# 3. Start dev server
echo "3. Starting dev server..."
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev" "Starting dev server"

# 4. Save PM2
echo "4. Saving PM2..."
execute_ssh "pm2 save" "Saving PM2 configuration"

# 5. Wait
echo "5. Waiting 10 seconds for startup..."
sleep 10

# 6. Check local access
echo "6. Checking local access..."
execute_ssh "curl -I http://localhost:3000" "Checking localhost:3000"

# 7. Reload Nginx
echo "7. Reloading Nginx..."
execute_ssh "systemctl reload nginx" "Reloading Nginx"

# 8. Check domain
echo "8. Checking domain..."
execute_ssh "curl -I https://smilerentalphuket.com" "Checking domain"

echo "RESTORATION COMPLETED!"
echo "Site should be available at: https://smilerentalphuket.com"
