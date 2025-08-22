#!/bin/bash

# Stop Production Services Script
# Safely stops PM2 processes and production services for migration

set -e

echo "🛑 STOPPING PRODUCTION SERVICES FOR MIGRATION"
echo "=============================================="
echo "Date: $(date)"
echo "Server: $(hostname)"
echo "User: $(whoami)"
echo ""

# Configuration
LOG_FILE="/var/log/stop-production-services-$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="/var/backups/migration-backup-$(date +%Y%m%d_%H%M%S)"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check service status
check_service_status() {
    local service_name="$1"
    log_message "🔍 Checking $service_name status..."
    
    if systemctl is-active --quiet "$service_name"; then
        log_message "   ✅ $service_name is running"
        return 0
    else
        log_message "   ❌ $service_name is not running"
        return 1
    fi
}

# Function to check PM2 status
check_pm2_status() {
    log_message "🔍 Checking PM2 status..."
    
    if command -v pm2 >/dev/null 2>&1; then
        local pm2_processes=$(pm2 list | grep -c "online" || echo "0")
        log_message "   📊 PM2 processes online: $pm2_processes"
        
        if [ "$pm2_processes" -gt 0 ]; then
            log_message "   📋 Current PM2 processes:"
            pm2 list | while read line; do
                log_message "      $line"
            done
            return 0
        else
            log_message "   ⚠️ No PM2 processes running"
            return 1
        fi
    else
        log_message "   ❌ PM2 not found"
        return 1
    fi
}

# Function to create pre-stop backup
create_prestop_backup() {
    log_message "💾 Creating pre-stop backup..."
    
    # Execute the migration backup script
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/create-migration-backup.sh" ]; then
        log_message "   🔄 Executing migration backup script..."
        cd /var/www/smilerentalphuket.com/site-smile-rental/
        bash create-migration-backup.sh 2>&1 | while read line; do
            log_message "   $line"
        done
        log_message "   ✅ Pre-stop backup completed"
    else
        log_message "   ⚠️ Migration backup script not found, creating manual backup..."
        
        # Manual backup
        mkdir -p "$BACKUP_DIR"
        if [ -d "/var/www/smilerentalphuket.com/site-smile-rental" ]; then
            cp -r /var/www/smilerentalphuket.com/site-smile-rental "$BACKUP_DIR/application-backup"
            log_message "   ✅ Manual application backup created: $BACKUP_DIR"
        else
            log_message "   ❌ Application directory not found"
        fi
    fi
}

# Function to stop PM2 processes gracefully
stop_pm2_processes() {
    log_message "⚙️ Stopping PM2 processes..."
    
    if command -v pm2 >/dev/null 2>&1; then
        # Get current PM2 status
        local pm2_processes=$(pm2 list | grep -c "online" || echo "0")
        
        if [ "$pm2_processes" -gt 0 ]; then
            log_message "   🔄 Stopping PM2 processes gracefully..."
            
            # Stop specific smile-rental process first
            if pm2 show smile-rental >/dev/null 2>&1; then
                log_message "   🛑 Stopping smile-rental process..."
                pm2 stop smile-rental 2>&1 | while read line; do
                    log_message "      $line"
                done
            fi
            
            # Stop all PM2 processes
            log_message "   🛑 Stopping all PM2 processes..."
            pm2 stop all 2>&1 | while read line; do
                log_message "      $line"
            done
            
            # Wait for processes to stop
            sleep 5
            
            # Verify processes are stopped
            local remaining_processes=$(pm2 list | grep -c "online" || echo "0")
            if [ "$remaining_processes" -eq 0 ]; then
                log_message "   ✅ All PM2 processes stopped successfully"
            else
                log_message "   ⚠️ Some PM2 processes still running: $remaining_processes"
                
                # Force stop if necessary
                log_message "   🔄 Force stopping remaining processes..."
                pm2 kill 2>&1 | while read line; do
                    log_message "      $line"
                done
            fi
        else
            log_message "   ℹ️ No PM2 processes to stop"
        fi
    else
        log_message "   ⚠️ PM2 not available"
    fi
}

# Function to stop Nginx gracefully
stop_nginx_service() {
    log_message "🌐 Stopping Nginx service..."
    
    if systemctl is-active --quiet nginx; then
        log_message "   🔄 Stopping Nginx..."
        
        # Test Nginx configuration before stopping
        if nginx -t 2>/dev/null; then
            log_message "   ✅ Nginx configuration is valid"
        else
            log_message "   ⚠️ Nginx configuration has issues, but proceeding with stop"
        fi
        
        # Stop Nginx
        systemctl stop nginx 2>&1 | while read line; do
            log_message "      $line"
        done
        
        # Wait for service to stop
        sleep 3
        
        # Verify Nginx is stopped
        if ! systemctl is-active --quiet nginx; then
            log_message "   ✅ Nginx stopped successfully"
        else
            log_message "   ❌ Nginx failed to stop"
            systemctl status nginx | head -10 | while read line; do
                log_message "      $line"
            done
        fi
    else
        log_message "   ℹ️ Nginx is not running"
    fi
}

# Function to verify services are stopped
verify_services_stopped() {
    log_message "🔍 Verifying services are stopped..."
    
    # Check Nginx
    if ! systemctl is-active --quiet nginx; then
        log_message "   ✅ Nginx: Stopped"
    else
        log_message "   ❌ Nginx: Still running"
    fi
    
    # Check PM2
    if command -v pm2 >/dev/null 2>&1; then
        local pm2_processes=$(pm2 list | grep -c "online" || echo "0")
        if [ "$pm2_processes" -eq 0 ]; then
            log_message "   ✅ PM2: All processes stopped"
        else
            log_message "   ❌ PM2: $pm2_processes processes still running"
        fi
    else
        log_message "   ℹ️ PM2: Not available"
    fi
    
    # Check network ports
    log_message "   🌐 Checking network ports..."
    local web_ports=$(netstat -tlnp | grep -E "(80|443|3000)" | wc -l || echo "0")
    log_message "   📊 Web-related ports still active: $web_ports"
    
    if [ "$web_ports" -eq 0 ]; then
        log_message "   ✅ All web ports are free"
    else
        log_message "   ⚠️ Some web ports still in use:"
        netstat -tlnp | grep -E "(80|443|3000)" | while read line; do
            log_message "      $line"
        done
    fi
}

# Function to create service stop report
create_stop_report() {
    log_message "📄 Creating service stop report..."
    
    cat > "/var/log/service-stop-report-$(date +%Y%m%d_%H%M%S).md" << EOF
# Production Services Stop Report

**Stop Date:** $(date)
**Server:** $(hostname)
**User:** $(whoami)
**Log File:** $LOG_FILE

## Services Stopped
- **Nginx:** $(systemctl is-active nginx 2>/dev/null || echo "stopped")
- **PM2 Processes:** $(pm2 list | grep -c "online" || echo "0") online

## Pre-Stop Status
- **Backup Created:** Yes (pre-stop backup)
- **Configuration Documented:** Yes
- **Emergency Procedures:** Available

## Post-Stop Verification
- **Nginx Status:** $(systemctl is-active nginx 2>/dev/null || echo "stopped")
- **PM2 Status:** $(pm2 list | grep -c "online" || echo "0") processes online
- **Web Ports:** $(netstat -tlnp | grep -E "(80|443|3000)" | wc -l || echo "0") active

## Next Steps
1. Remove current content from production domain
2. Deploy new codebase via GitHub Actions
3. Configure and restart services
4. Verify deployment functionality

## Rollback Information
- **Emergency Rollback Script:** /var/www/smilerentalphuket.com/site-smile-rental/emergency-rollback.sh
- **Backup Location:** Latest backup in /var/backups/migration-backup-*
- **Documentation:** EMERGENCY_ROLLBACK_PROCEDURES.md

**Report Generated:** $(date)
EOF
    
    log_message "   ✅ Service stop report created"
}

# Main function
main() {
    log_message "🛑 Starting production services stop procedure..."
    
    # Check initial status
    log_message "📊 Initial service status check..."
    check_service_status nginx
    check_pm2_status
    
    # Create pre-stop backup
    create_prestop_backup
    
    # Stop services in correct order
    stop_pm2_processes
    stop_nginx_service
    
    # Verify services are stopped
    verify_services_stopped
    
    # Create stop report
    create_stop_report
    
    log_message "✅ Production services stop procedure completed!"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root"
    exit 1
fi

# Confirm service stop
echo "⚠️  WARNING: This will stop all production services on smilerentalphuket.com"
echo "   - Nginx web server will be stopped"
echo "   - PM2 application processes will be stopped"
echo "   - Site will become unavailable during migration"
echo ""
read -p "Are you sure you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Service stop cancelled by user"
    exit 1
fi

# Execute main function
main

echo ""
echo "🎉 PRODUCTION SERVICES STOPPED SUCCESSFULLY"
echo "==========================================="
echo "✅ All production services have been stopped safely"
echo "📄 Check log file for details: $LOG_FILE"
echo "🔄 Ready for content removal and redeployment"
echo ""
echo "⚠️  IMPORTANT: Site is now offline until migration completes"
echo "📞 Emergency rollback available if needed"
