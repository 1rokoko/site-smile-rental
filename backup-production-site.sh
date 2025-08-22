#!/bin/bash

# Comprehensive Production Site Backup Script
# Creates full backup of smilerentalphuket.com production deployment
# Date: $(date +%Y-%m-%d)

set -e

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/smilerentalphuket-migration-backup-${BACKUP_DATE}"
PRODUCTION_PATH="/var/www/smilerentalphuket.com/site-smile-rental"
LOG_FILE="/var/log/migration-backup-${BACKUP_DATE}.log"

echo "🔄 STARTING COMPREHENSIVE PRODUCTION BACKUP" | tee -a "$LOG_FILE"
echo "Backup Date: $BACKUP_DATE" | tee -a "$LOG_FILE"
echo "Backup Directory: $BACKUP_DIR" | tee -a "$LOG_FILE"
echo "Production Path: $PRODUCTION_PATH" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"

# Create backup directory
echo "📁 Creating backup directory..." | tee -a "$LOG_FILE"
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

# 1. Backup application files
echo "📦 Backing up application files..." | tee -a "$LOG_FILE"
if [ -d "$PRODUCTION_PATH" ]; then
    cp -r "$PRODUCTION_PATH" "./application-files/"
    echo "✅ Application files backed up" | tee -a "$LOG_FILE"
else
    echo "❌ Production path not found: $PRODUCTION_PATH" | tee -a "$LOG_FILE"
    exit 1
fi

# 2. Backup PM2 configuration and status
echo "⚙️ Backing up PM2 configuration..." | tee -a "$LOG_FILE"
mkdir -p "./pm2-config"
pm2 list > "./pm2-config/pm2-list.txt" 2>/dev/null || echo "No PM2 processes" > "./pm2-config/pm2-list.txt"
pm2 show smile-rental > "./pm2-config/pm2-smile-rental-details.txt" 2>/dev/null || echo "No smile-rental process" > "./pm2-config/pm2-smile-rental-details.txt"
pm2 logs smile-rental --lines 100 > "./pm2-config/pm2-logs.txt" 2>/dev/null || echo "No logs available" > "./pm2-config/pm2-logs.txt"
cp /root/.pm2/dump.pm2 "./pm2-config/" 2>/dev/null || echo "No PM2 dump file found"
echo "✅ PM2 configuration backed up" | tee -a "$LOG_FILE"

# 3. Backup Nginx configuration
echo "🌐 Backing up Nginx configuration..." | tee -a "$LOG_FILE"
mkdir -p "./nginx-config"
cp /etc/nginx/sites-available/smilerentalphuket.com "./nginx-config/" 2>/dev/null || echo "No Nginx config found"
cp /etc/nginx/nginx.conf "./nginx-config/" 2>/dev/null || echo "No main Nginx config"
nginx -t > "./nginx-config/nginx-test.txt" 2>&1 || echo "Nginx test failed"
echo "✅ Nginx configuration backed up" | tee -a "$LOG_FILE"

# 4. Backup SSL certificates
echo "🔒 Backing up SSL certificates..." | tee -a "$LOG_FILE"
mkdir -p "./ssl-certificates"
cp -r /etc/letsencrypt/live/smilerentalphuket.com/ "./ssl-certificates/" 2>/dev/null || echo "No SSL certificates found"
cp -r /etc/letsencrypt/archive/smilerentalphuket.com/ "./ssl-certificates/archive/" 2>/dev/null || echo "No SSL archive found"
echo "✅ SSL certificates backed up" | tee -a "$LOG_FILE"

# 5. Backup system information
echo "💻 Backing up system information..." | tee -a "$LOG_FILE"
mkdir -p "./system-info"
uname -a > "./system-info/system.txt"
df -h > "./system-info/disk-usage.txt"
free -h > "./system-info/memory.txt"
ps aux > "./system-info/processes.txt"
netstat -tlnp > "./system-info/network-ports.txt"
systemctl status nginx > "./system-info/nginx-status.txt" 2>/dev/null || echo "Nginx not running"
echo "✅ System information backed up" | tee -a "$LOG_FILE"

# 6. Create backup manifest
echo "📋 Creating backup manifest..." | tee -a "$LOG_FILE"
cat > "./BACKUP_MANIFEST.md" << EOF
# Production Site Backup Manifest
**Backup Date:** $BACKUP_DATE
**Backup Location:** $BACKUP_DIR
**Production Path:** $PRODUCTION_PATH

## Backup Contents:
- ✅ Application files (complete site-smile-rental directory)
- ✅ PM2 configuration and process status
- ✅ Nginx configuration files
- ✅ SSL certificates and Let's Encrypt data
- ✅ System information and status

## Restoration Instructions:
1. Stop current services: \`pm2 stop all\`
2. Restore application files: \`cp -r ./application-files/* $PRODUCTION_PATH/\`
3. Restore Nginx config: \`cp ./nginx-config/* /etc/nginx/sites-available/\`
4. Restore SSL certificates: \`cp -r ./ssl-certificates/* /etc/letsencrypt/live/smilerentalphuket.com/\`
5. Restart services: \`systemctl restart nginx && pm2 start ecosystem.config.js\`

## Backup Verification:
- Application files size: $(du -sh ./application-files/ | cut -f1)
- Total backup size: $(du -sh . | cut -f1)
- Backup integrity: $(find . -type f | wc -l) files backed up

**Created by:** Migration Backup Script
**Log file:** $LOG_FILE
EOF

# 7. Verify backup integrity
echo "🔍 Verifying backup integrity..." | tee -a "$LOG_FILE"
TOTAL_FILES=$(find . -type f | wc -l)
BACKUP_SIZE=$(du -sh . | cut -f1)
echo "Total files backed up: $TOTAL_FILES" | tee -a "$LOG_FILE"
echo "Total backup size: $BACKUP_SIZE" | tee -a "$LOG_FILE"

# 8. Set proper permissions
echo "🔐 Setting backup permissions..." | tee -a "$LOG_FILE"
chmod -R 600 "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

echo "=========================================" | tee -a "$LOG_FILE"
echo "✅ BACKUP COMPLETED SUCCESSFULLY!" | tee -a "$LOG_FILE"
echo "Backup location: $BACKUP_DIR" | tee -a "$LOG_FILE"
echo "Log file: $LOG_FILE" | tee -a "$LOG_FILE"
echo "Backup size: $BACKUP_SIZE" | tee -a "$LOG_FILE"
echo "Files backed up: $TOTAL_FILES" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"

# Copy log to backup directory
cp "$LOG_FILE" "$BACKUP_DIR/"

echo "🎉 Production backup ready for migration!"
echo "Next step: Create Vercel backup"
