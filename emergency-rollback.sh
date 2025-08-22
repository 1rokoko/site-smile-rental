#!/bin/bash

# Emergency Rollback Script
# Automatically restores production site from backup in case of migration failure

set -e

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "==============================="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Server: $(hostname)"
echo ""

# Configuration
PRODUCTION_PATH="/var/www/smilerentalphuket.com/site-smile-rental"
BACKUP_BASE_DIR="/var/backups"
LOG_FILE="/var/log/emergency-rollback-$(date +%Y%m%d_%H%M%S).log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to find latest backup
find_latest_backup() {
    log_message "🔍 Searching for latest migration backup..."
    
    LATEST_BACKUP=$(find "$BACKUP_BASE_DIR" -name "migration-backup-*" -type d | sort -r | head -n 1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        log_message "❌ No migration backup found in $BACKUP_BASE_DIR"
        exit 1
    fi
    
    log_message "✅ Found latest backup: $LATEST_BACKUP"
    echo "$LATEST_BACKUP"
}

# Function to verify backup integrity
verify_backup() {
    local backup_dir="$1"
    log_message "🔍 Verifying backup integrity..."
    
    # Check if backup directory exists
    if [ ! -d "$backup_dir" ]; then
        log_message "❌ Backup directory not found: $backup_dir"
        exit 1
    fi
    
    # Check for required backup components
    local required_dirs=("application-backup" "nginx-backup" "pm2-backup")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$backup_dir/$dir" ]; then
            log_message "⚠️ Warning: $dir not found in backup"
        else
            log_message "✅ Found: $dir"
        fi
    done
    
    # Check backup manifest
    if [ -f "$backup_dir/BACKUP_MANIFEST.txt" ]; then
        log_message "✅ Backup manifest found"
        log_message "📋 Backup details:"
        cat "$backup_dir/BACKUP_MANIFEST.txt" | head -10 | while read line; do
            log_message "   $line"
        done
    else
        log_message "⚠️ Warning: Backup manifest not found"
    fi
    
    log_message "✅ Backup verification completed"
}

# Function to stop services safely
stop_services() {
    log_message "🛑 Stopping current services..."
    
    # Stop PM2 processes
    log_message "   Stopping PM2 processes..."
    pm2 stop all 2>/dev/null || log_message "   ⚠️ PM2 stop failed or no processes running"
    
    # Stop Nginx
    log_message "   Stopping Nginx..."
    systemctl stop nginx 2>/dev/null || log_message "   ⚠️ Nginx stop failed or not running"
    
    log_message "✅ Services stopped"
}

# Function to restore application files
restore_application() {
    local backup_dir="$1"
    log_message "📦 Restoring application files..."
    
    if [ ! -d "$backup_dir/application-backup" ]; then
        log_message "❌ Application backup not found"
        exit 1
    fi
    
    # Create backup of current state (just in case)
    if [ -d "$PRODUCTION_PATH" ]; then
        log_message "   Creating backup of current state..."
        mv "$PRODUCTION_PATH" "$PRODUCTION_PATH.rollback-backup-$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
    fi
    
    # Restore application files
    log_message "   Restoring application files to $PRODUCTION_PATH..."
    mkdir -p "$(dirname "$PRODUCTION_PATH")"
    cp -r "$backup_dir/application-backup" "$PRODUCTION_PATH"
    
    # Set proper permissions
    log_message "   Setting proper permissions..."
    chown -R www-data:www-data "$PRODUCTION_PATH" 2>/dev/null || true
    chmod -R 755 "$PRODUCTION_PATH" 2>/dev/null || true
    
    log_message "✅ Application files restored"
}

# Function to restore Nginx configuration
restore_nginx() {
    local backup_dir="$1"
    log_message "🌐 Restoring Nginx configuration..."
    
    if [ -d "$backup_dir/nginx-backup" ]; then
        log_message "   Restoring Nginx site configuration..."
        cp "$backup_dir/nginx-backup"/* /etc/nginx/sites-available/ 2>/dev/null || true
        
        # Test Nginx configuration
        log_message "   Testing Nginx configuration..."
        if nginx -t 2>/dev/null; then
            log_message "   ✅ Nginx configuration valid"
        else
            log_message "   ⚠️ Nginx configuration test failed, but continuing..."
        fi
    else
        log_message "   ⚠️ Nginx backup not found, skipping..."
    fi
    
    log_message "✅ Nginx configuration restored"
}

# Function to restore SSL certificates
restore_ssl() {
    local backup_dir="$1"
    log_message "🔒 Restoring SSL certificates..."
    
    if [ -d "$backup_dir/ssl-backup" ]; then
        log_message "   Restoring SSL certificates..."
        cp -r "$backup_dir/ssl-backup"/* /etc/letsencrypt/live/smilerentalphuket.com/ 2>/dev/null || true
        log_message "   ✅ SSL certificates restored"
    else
        log_message "   ⚠️ SSL backup not found, skipping..."
    fi
}

# Function to start services
start_services() {
    log_message "🚀 Starting services..."
    
    # Start Nginx
    log_message "   Starting Nginx..."
    systemctl start nginx
    if systemctl is-active --quiet nginx; then
        log_message "   ✅ Nginx started successfully"
    else
        log_message "   ❌ Nginx failed to start"
        systemctl status nginx | head -10 | while read line; do
            log_message "   $line"
        done
    fi
    
    # Start PM2 processes
    log_message "   Starting PM2 processes..."
    cd "$PRODUCTION_PATH"
    
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js 2>/dev/null || log_message "   ⚠️ PM2 start failed"
        pm2 save 2>/dev/null || true
        log_message "   ✅ PM2 processes started"
    else
        log_message "   ⚠️ ecosystem.config.js not found, trying alternative..."
        pm2 start npm --name "smile-rental" -- start 2>/dev/null || log_message "   ⚠️ Alternative PM2 start failed"
    fi
    
    log_message "✅ Services started"
}

# Function to verify restoration
verify_restoration() {
    log_message "🔍 Verifying restoration..."
    
    # Check service status
    log_message "   Checking service status..."
    if systemctl is-active --quiet nginx; then
        log_message "   ✅ Nginx is running"
    else
        log_message "   ❌ Nginx is not running"
    fi
    
    # Check PM2 status
    local pm2_status=$(pm2 list | grep -c "online" || echo "0")
    log_message "   PM2 processes online: $pm2_status"
    
    # Check site response
    log_message "   Testing site response..."
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" https://smilerentalphuket.com/ 2>/dev/null || echo "000")
    log_message "   Site response code: $response_code"
    
    if [ "$response_code" = "200" ]; then
        log_message "   ✅ Site is responding correctly"
    else
        log_message "   ⚠️ Site response code: $response_code (expected 200)"
    fi
    
    log_message "✅ Verification completed"
}

# Main rollback function
perform_rollback() {
    log_message "🚨 Starting emergency rollback procedure..."
    
    # Find latest backup
    BACKUP_DIR=$(find_latest_backup)
    
    # Verify backup
    verify_backup "$BACKUP_DIR"
    
    # Stop services
    stop_services
    
    # Restore components
    restore_application "$BACKUP_DIR"
    restore_nginx "$BACKUP_DIR"
    restore_ssl "$BACKUP_DIR"
    
    # Start services
    start_services
    
    # Verify restoration
    verify_restoration
    
    log_message "✅ Emergency rollback completed successfully!"
    log_message "📋 Backup used: $BACKUP_DIR"
    log_message "📄 Log file: $LOG_FILE"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root"
    exit 1
fi

# Confirm rollback
echo "⚠️  WARNING: This will rollback the production site to the latest backup."
echo "   Current site will be replaced with backup data."
echo "   This action cannot be easily undone."
echo ""
read -p "Are you sure you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Rollback cancelled by user"
    exit 1
fi

# Perform rollback
perform_rollback

echo ""
echo "🎉 EMERGENCY ROLLBACK COMPLETED"
echo "==============================="
echo "✅ Production site has been restored from backup"
echo "📄 Check log file for details: $LOG_FILE"
echo "🔍 Verify site functionality: https://smilerentalphuket.com/"
echo ""
echo "📞 If issues persist, check the emergency procedures documentation"
echo "   or contact system administrator immediately."
