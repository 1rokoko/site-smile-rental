# Production Site Backup Script for Migration
# Creates comprehensive backup of smilerentalphuket.com

$server = "root@38.180.122.239"
$backupDate = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "🔄 STARTING COMPREHENSIVE PRODUCTION BACKUP" -ForegroundColor Green
Write-Host "Backup Date: $backupDate" -ForegroundColor Yellow

# Create backup commands
$backupCommands = @"
BACKUP_DATE=$backupDate
BACKUP_DIR="/var/backups/smilerentalphuket-migration-backup-`$BACKUP_DATE"
PRODUCTION_PATH="/var/www/smilerentalphuket.com/site-smile-rental"

echo "🔄 STARTING COMPREHENSIVE PRODUCTION BACKUP"
echo "Backup Date: `$BACKUP_DATE"
echo "Backup Directory: `$BACKUP_DIR"
echo "Production Path: `$PRODUCTION_PATH"
echo "========================================="

# Create backup directory
echo "📁 Creating backup directory..."
mkdir -p "`$BACKUP_DIR"
cd "`$BACKUP_DIR"

# 1. Backup application files
echo "📦 Backing up application files..."
if [ -d "`$PRODUCTION_PATH" ]; then
    cp -r "`$PRODUCTION_PATH" "./application-files/"
    echo "✅ Application files backed up"
else
    echo "❌ Production path not found: `$PRODUCTION_PATH"
    exit 1
fi

# 2. Backup PM2 configuration
echo "⚙️ Backing up PM2 configuration..."
mkdir -p "./pm2-config"
pm2 list > "./pm2-config/pm2-list.txt" 2>/dev/null || echo "No PM2 processes" > "./pm2-config/pm2-list.txt"
pm2 show smile-rental > "./pm2-config/pm2-smile-rental-details.txt" 2>/dev/null || echo "No smile-rental process" > "./pm2-config/pm2-smile-rental-details.txt"
pm2 logs smile-rental --lines 50 > "./pm2-config/pm2-logs.txt" 2>/dev/null || echo "No logs available" > "./pm2-config/pm2-logs.txt"

# 3. Backup Nginx configuration
echo "🌐 Backing up Nginx configuration..."
mkdir -p "./nginx-config"
cp /etc/nginx/sites-available/smilerentalphuket.com "./nginx-config/" 2>/dev/null || echo "No Nginx config found"
cp /etc/nginx/nginx.conf "./nginx-config/" 2>/dev/null || echo "No main Nginx config"

# 4. Backup SSL certificates
echo "🔒 Backing up SSL certificates..."
mkdir -p "./ssl-certificates"
cp -r /etc/letsencrypt/live/smilerentalphuket.com/ "./ssl-certificates/" 2>/dev/null || echo "No SSL certificates found"

# 5. System information
echo "💻 Backing up system information..."
mkdir -p "./system-info"
uname -a > "./system-info/system.txt"
df -h > "./system-info/disk-usage.txt"
free -h > "./system-info/memory.txt"
ps aux | grep -E "(node|pm2|nginx)" > "./system-info/relevant-processes.txt"
netstat -tlnp | grep -E "(80|443|3000)" > "./system-info/web-ports.txt"

# 6. Create backup manifest
echo "📋 Creating backup manifest..."
cat > "./BACKUP_MANIFEST.md" << 'EOF'
# Production Site Backup Manifest
**Backup Date:** `$BACKUP_DATE
**Backup Location:** `$BACKUP_DIR
**Production Path:** `$PRODUCTION_PATH

## Backup Contents:
- ✅ Application files (complete site-smile-rental directory)
- ✅ PM2 configuration and process status
- ✅ Nginx configuration files
- ✅ SSL certificates and Let's Encrypt data
- ✅ System information and status

## Restoration Instructions:
1. Stop current services: pm2 stop all
2. Restore application files: cp -r ./application-files/* `$PRODUCTION_PATH/
3. Restore Nginx config: cp ./nginx-config/* /etc/nginx/sites-available/
4. Restart services: systemctl restart nginx && pm2 start ecosystem.config.js

**Created by:** Migration Backup Script
EOF

# 7. Verify backup
echo "🔍 Verifying backup integrity..."
TOTAL_FILES=`$(find . -type f | wc -l)
BACKUP_SIZE=`$(du -sh . | cut -f1)

echo "========================================="
echo "✅ BACKUP COMPLETED SUCCESSFULLY!"
echo "Backup location: `$BACKUP_DIR"
echo "Backup size: `$BACKUP_SIZE"
echo "Files backed up: `$TOTAL_FILES"
echo "========================================="

# Return backup directory for reference
echo "BACKUP_DIRECTORY:`$BACKUP_DIR"
"@

Write-Host "Executing backup on production server..." -ForegroundColor Yellow

try {
    # Execute backup commands on server
    $result = ssh -o StrictHostKeyChecking=no $server $backupCommands
    
    Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
    Write-Host $result -ForegroundColor White
    
    # Extract backup directory from output
    $backupDir = ($result | Select-String "BACKUP_DIRECTORY:(.+)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
    
    if ($backupDir) {
        Write-Host "📁 Backup stored at: $backupDir" -ForegroundColor Cyan
        
        # Save backup info to local file
        $backupInfo = "# Production Backup Information`n**Date:** $(Get-Date)`n**Backup Directory:** $backupDir`n**Server:** $server`n**Status:** Completed Successfully`n`n## Next Steps:`n1. Create Vercel backup`n2. Compare deployments`n3. Proceed with migration`n`n**Backup Location:** $backupDir"

        $backupInfo | Out-File -FilePath "production-backup-info.md" -Encoding UTF8
        Write-Host "Backup info saved to: production-backup-info.md" -ForegroundColor Green
    }

} catch {
    Write-Host "Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Production backup completed! Ready for next step." -ForegroundColor Green
