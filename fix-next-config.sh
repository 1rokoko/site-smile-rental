#!/bin/bash

# Fix Next.js configuration to remove output: 'export'
echo "Fixing Next.js configuration..."

# Navigate to the project directory
cd /var/www/smilerentalphuket.com

# Create backup of current config
cp next.config.ts next.config.ts.backup

# Remove the output: 'export' line from next.config.ts
sed -i "/output: 'export'/d" next.config.ts

echo "Next.js configuration fixed!"
echo "Restarting PM2 processes..."

# Restart PM2 processes
pm2 restart all

echo "Done!"
