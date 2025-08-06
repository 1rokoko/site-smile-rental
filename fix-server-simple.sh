#!/bin/bash
echo "Connecting to server to fix PM2 processes..."

# Try using expect if available, otherwise manual SSH
if command -v expect &> /dev/null; then
    echo "Using expect for automated SSH..."
    
    expect << 'EOF'
set timeout 30
spawn ssh -o StrictHostKeyChecking=no root@38.180.122.239

expect "password:"
send "925LudK9Bv\r"

expect "# "
send "echo '=== Server Recovery Started ==='\r"

expect "# "
send "pm2 status\r"

expect "# "
send "pm2 stop all\r"

expect "# "
send "pm2 kill\r"

expect "# "
send "fuser -k 3000/tcp\r"

expect "# "
send "ls -la /var/www/\r"

expect "# "
send "cd /var/www/smile-rental 2>/dev/null || cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern\r"

expect "# "
send "pwd && ls -la\r"

expect "# "
send "pm2 start ecosystem.config.js 2>/dev/null || pm2 start npm --name 'smile-rental' -- start\r"

expect "# "
send "pm2 status\r"

expect "# "
send "pm2 startup\r"

expect "# "
send "pm2 save\r"

expect "# "
send "systemctl restart nginx\r"

expect "# "
send "curl -I http://localhost\r"

expect "# "
send "echo '=== Recovery Complete ==='\r"

expect "# "
send "exit\r"

expect eof
EOF

else
    echo "Expect not available. Opening manual SSH session..."
    echo "Please run these commands after connecting:"
    echo "1. pm2 status"
    echo "2. pm2 stop all && pm2 kill"
    echo "3. cd /var/www/smile-rental || cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern"
    echo "4. pm2 start ecosystem.config.js || pm2 start npm --name 'smile-rental' -- start"
    echo "5. pm2 startup && pm2 save"
    echo "6. systemctl restart nginx"
    
    ssh -o StrictHostKeyChecking=no root@38.180.122.239
fi

echo "Done!"
