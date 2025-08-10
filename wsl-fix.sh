#!/bin/bash

# WSL automated fix
PASSWORD="925LudK9Bv"
SERVER="38.180.122.239"
USER="root"

echo "WSL AUTOMATED SSH FIX..."

# Function to execute SSH with timeout
ssh_exec() {
    local cmd="$1"
    local desc="$2"
    
    echo "$desc"
    
    # Use timeout and expect-like behavior
    timeout 10s bash -c "
        echo '$PASSWORD' | ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -o PasswordAuthentication=yes $USER@$SERVER '$cmd'
    " 2>/dev/null || echo "Command timed out or failed"
    
    echo ""
}

# Execute commands
ssh_exec "pm2 list" "1. Checking PM2..."
ssh_exec "pm2 delete all" "2. Deleting processes..."
ssh_exec "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev" "3. Starting dev server..."
ssh_exec "pm2 save" "4. Saving PM2..."

echo "5. Waiting 10 seconds..."
sleep 10

ssh_exec "curl -I http://localhost:3000" "6. Checking local server..."
ssh_exec "systemctl reload nginx" "7. Reloading Nginx..."
ssh_exec "curl -I https://smilerentalphuket.com" "8. Checking domain..."

echo "WSL FIX COMPLETED!"
