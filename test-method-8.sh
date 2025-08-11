#!/bin/bash

# Method 8: Git Bash with expect-like functionality
PASSWORD="[REMOVED]"
SERVER="38.180.122.239"
USER="root"

echo "Testing Method 8: Git Bash with expect-like functionality"

# Method 8.1: Check if expect is available
echo "8.1 Checking for expect..."
if command -v expect >/dev/null 2>&1; then
    echo "SUCCESS: expect found"
    
    # Method 8.2: Use expect for automation
    echo "8.2 Using expect for SSH automation..."
    expect << EOF
spawn ssh -o StrictHostKeyChecking=no $USER@$SERVER "pm2 list"
expect "password:"
send "$PASSWORD\r"
expect eof
EOF
    
else
    echo "FAILED: expect not found"
    
    # Method 8.3: Try alternative - timeout with background process
    echo "8.3 Trying timeout with background process..."
    
    # Create a named pipe for communication
    mkfifo /tmp/ssh_pipe 2>/dev/null || echo "Pipe already exists"
    
    # Start SSH in background and redirect to pipe
    (echo "$PASSWORD"; sleep 1) | ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 $USER@$SERVER "pm2 list" &
    SSH_PID=$!
    
    # Wait for completion with timeout
    sleep 15
    
    if kill -0 $SSH_PID 2>/dev/null; then
        echo "TIMEOUT: Killing SSH process"
        kill $SSH_PID
    else
        echo "SUCCESS: SSH completed"
    fi
    
    # Method 8.4: Try with here-document
    echo "8.4 Trying here-document approach..."
    ssh -o StrictHostKeyChecking=no $USER@$SERVER "pm2 list" << EOF
$PASSWORD
EOF
    
fi

echo "Method 8 testing completed."
