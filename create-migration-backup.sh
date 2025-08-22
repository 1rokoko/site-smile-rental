#!/bin/bash

# Migration Backup Script - Creates comprehensive backup before Vercel migration
# This script will be executed on the production server

set -e

echo "🔄 CREATING MIGRATION BACKUP FOR VERCEL DEPLOYMENT"
echo "=================================================="

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/migration-backup-${BACKUP_DATE}"
PRODUCTION_PATH="/var/www/smilerentalphuket.com/site-smile-rental"

echo "📅 Backup Date: $BACKUP_DATE"
echo "📁 Backup Directory: $BACKUP_DIR"
echo "🏠 Production Path: $PRODUCTION_PATH"
echo ""

# Create backup directory
echo "📁 Creating backup directory..."
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

# 1. Backup entire application directory
echo "📦 Backing up application files..."
if [ -d "$PRODUCTION_PATH" ]; then
    cp -r "$PRODUCTION_PATH" "./application-backup/"
    echo "✅ Application files backed up to ./application-backup/"
else
    echo "❌ Production path not found: $PRODUCTION_PATH"
    exit 1
fi

# 2. Backup PM2 configuration and status
echo "⚙️ Backing up PM2 configuration..."
mkdir -p "./pm2-backup"
pm2 list > "./pm2-backup/pm2-list.txt" 2>/dev/null || echo "No PM2 processes found"
pm2 show smile-rental > "./pm2-backup/pm2-smile-rental.txt" 2>/dev/null || echo "No smile-rental process"
pm2 logs smile-rental --lines 50 > "./pm2-backup/pm2-logs.txt" 2>/dev/null || echo "No logs available"
echo "✅ PM2 configuration backed up"

# 3. Backup Nginx configuration
echo "🌐 Backing up Nginx configuration..."
mkdir -p "./nginx-backup"
cp /etc/nginx/sites-available/smilerentalphuket.com "./nginx-backup/" 2>/dev/null || echo "No Nginx site config"
cp /etc/nginx/nginx.conf "./nginx-backup/" 2>/dev/null || echo "No main Nginx config"
echo "✅ Nginx configuration backed up"

# 4. Backup SSL certificates
echo "🔒 Backing up SSL certificates..."
mkdir -p "./ssl-backup"
cp -r /etc/letsencrypt/live/smilerentalphuket.com/ "./ssl-backup/" 2>/dev/null || echo "No SSL certificates"
echo "✅ SSL certificates backed up"

# 5. Create system snapshot
echo "💻 Creating system snapshot..."
mkdir -p "./system-snapshot"
echo "System: $(uname -a)" > "./system-snapshot/system-info.txt"
echo "Date: $(date)" >> "./system-snapshot/system-info.txt"
df -h > "./system-snapshot/disk-usage.txt"
free -h > "./system-snapshot/memory-usage.txt"
ps aux | grep -E "(node|pm2|nginx)" > "./system-snapshot/web-processes.txt"
netstat -tlnp | grep -E "(80|443|3000)" > "./system-snapshot/web-ports.txt"
echo "✅ System snapshot created"

# 6. Create backup manifest
echo "📋 Creating backup manifest..."
cat > "./BACKUP_MANIFEST.txt" << EOF
MIGRATION BACKUP MANIFEST
========================
Backup Date: $BACKUP_DATE
Backup Location: $BACKUP_DIR
Production Path: $PRODUCTION_PATH
Purpose: Pre-migration backup before Vercel deployment

CONTENTS:
- application-backup/     : Complete application files
- pm2-backup/            : PM2 process configuration and logs
- nginx-backup/          : Nginx configuration files
- ssl-backup/            : SSL certificates
- system-snapshot/       : System information

RESTORATION COMMANDS:
1. Stop services: pm2 stop all && systemctl stop nginx
2. Restore app: cp -r ./application-backup/* $PRODUCTION_PATH/
3. Restore nginx: cp ./nginx-backup/* /etc/nginx/sites-available/
4. Restore SSL: cp -r ./ssl-backup/* /etc/letsencrypt/live/smilerentalphuket.com/
5. Start services: systemctl start nginx && pm2 start ecosystem.config.js

Created by: Migration Backup Script
EOF

# 7. Calculate backup size and file count
echo "🔍 Calculating backup statistics..."
BACKUP_SIZE=$(du -sh . | cut -f1)
FILE_COUNT=$(find . -type f | wc -l)

echo ""
echo "=========================================="
echo "✅ MIGRATION BACKUP COMPLETED SUCCESSFULLY"
echo "=========================================="
echo "📁 Backup Location: $BACKUP_DIR"
echo "📊 Backup Size: $BACKUP_SIZE"
echo "📄 Files Backed Up: $FILE_COUNT"
echo "🕒 Backup Time: $(date)"
echo ""
echo "🎯 Next Steps:"
echo "1. Create Vercel backup"
echo "2. Compare deployments"
echo "3. Execute migration"
echo ""
echo "📋 Backup manifest: $BACKUP_DIR/BACKUP_MANIFEST.txt"
echo "=========================================="

# Set secure permissions
chmod -R 600 "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

echo "🔐 Backup secured with proper permissions"
echo "🎉 Ready for migration process!"

# Output backup directory for scripts
echo "BACKUP_CREATED:$BACKUP_DIR"
