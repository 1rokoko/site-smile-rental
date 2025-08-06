#!/bin/bash
echo "Fixing server using expect..."

# Create expect script
cat > /tmp/ssh_fix.exp << 'EXPECT_EOF'
#!/usr/bin/expect -f
set timeout 30

spawn ssh -o StrictHostKeyChecking=no root@38.180.122.239

expect "password:"
send "925LudK9Bv\r"

expect "# "
send "echo '=== Connected to server ==='\r"

expect "# "
send "pm2 status\r"

expect "# "
send "pm2 stop all\r"

expect "# "
send "pm2 kill\r"

expect "# "
send "fuser -k 3000/tcp\r"

expect "# "
send "cd /var/www/smile-rental || cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern\r"

expect "# "
send "pwd\r"

expect "# "
send "ls -la\r"

expect "# "
send "pm2 start ecosystem.config.js || pm2 start npm --name 'smile-rental' -- start\r"

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
send "exit\r"

expect eof
EXPECT_EOF

chmod +x /tmp/ssh_fix.exp

echo "Running expect script..."
/tmp/ssh_fix.exp

echo "Server fix completed!"
