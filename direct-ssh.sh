#!/bin/bash

# Direct SSH with password - no expect needed
PASSWORD="925LudK9Bv"
SERVER="38.180.122.239"
USER="root"

echo "DIRECT SSH AUTOMATION..."

# Function to execute SSH commands with sshpass fallback
ssh_cmd() {
    local command="$1"
    local description="$2"
    
    echo "$description"
    
    # Try sshpass first, then fallback to manual
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$USER@$SERVER" "$command"
    else
        # Fallback: try to pipe password (may not work but worth trying)
        echo "$PASSWORD" | ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -o PasswordAuthentication=yes "$USER@$SERVER" "$command" 2>/dev/null || echo "Command failed - no sshpass available"
    fi
    
    echo ""
}

# Execute commands
ssh_cmd "pm2 list" "1. Checking PM2..."
ssh_cmd "pm2 delete all" "2. Deleting processes..."
ssh_cmd "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev" "3. Starting dev server..."
ssh_cmd "pm2 save" "4. Saving PM2..."

echo "5. Waiting 10 seconds..."
sleep 10

ssh_cmd "curl -I http://localhost:3000" "6. Checking local server..."
ssh_cmd "systemctl reload nginx" "7. Reloading Nginx..."
ssh_cmd "curl -I https://smilerentalphuket.com" "8. Checking domain..."

echo "DIRECT SSH COMPLETED!"
