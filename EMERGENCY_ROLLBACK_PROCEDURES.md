# Emergency Rollback Procedures and Recovery Plans

## 🚨 EMERGENCY CONTACT INFORMATION
**Migration Date:** $(date)  
**Backup Location:** `/var/backups/migration-backup-[TIMESTAMP]/`  
**Repository:** https://github.com/1rokoko/site-smile-rental  
**Production Server:** root@38.180.122.239  

## ⚡ QUICK ROLLBACK (5-10 minutes)

### IMMEDIATE ACTIONS IF SITE IS DOWN:
```bash
# 1. Connect to server
ssh root@38.180.122.239

# 2. Find latest backup
ls -la /var/backups/migration-backup-*/

# 3. Quick restore (replace TIMESTAMP with actual backup timestamp)
cd /var/backups/migration-backup-[TIMESTAMP]/
cp -r ./application-backup/* /var/www/smilerentalphuket.com/site-smile-rental/

# 4. Restart services
pm2 restart all
systemctl restart nginx

# 5. Verify site is up
curl -I https://smilerentalphuket.com/
```

## 📋 DETAILED ROLLBACK PROCEDURES

### Phase 1: Assessment (2-3 minutes)
1. **Identify the Issue:**
   - Site not loading: Check Nginx/PM2 status
   - Partial functionality: Check application logs
   - Performance issues: Check system resources
   - SSL issues: Check certificate status

2. **Quick Diagnostics:**
   ```bash
   # Check services status
   systemctl status nginx
   pm2 status
   pm2 logs smile-rental --lines 20
   
   # Check system resources
   df -h
   free -h
   top -n 1
   
   # Check site response
   curl -I https://smilerentalphuket.com/
   ```

### Phase 2: Service Restoration (3-5 minutes)
1. **Stop Current Services:**
   ```bash
   pm2 stop all
   systemctl stop nginx
   ```

2. **Restore from Backup:**
   ```bash
   # Navigate to backup directory
   cd /var/backups/migration-backup-[TIMESTAMP]/
   
   # Restore application files
   cp -r ./application-backup/* /var/www/smilerentalphuket.com/site-smile-rental/
   
   # Restore Nginx configuration
   cp ./nginx-backup/* /etc/nginx/sites-available/
   
   # Restore SSL certificates (if needed)
   cp -r ./ssl-backup/* /etc/letsencrypt/live/smilerentalphuket.com/
   ```

3. **Restart Services:**
   ```bash
   # Test Nginx configuration
   nginx -t
   
   # Start services
   systemctl start nginx
   cd /var/www/smilerentalphuket.com/site-smile-rental/
   pm2 start ecosystem.config.js
   pm2 save
   ```

### Phase 3: Verification (2-3 minutes)
1. **Service Status Check:**
   ```bash
   systemctl status nginx
   pm2 status
   pm2 logs smile-rental --lines 10
   ```

2. **Site Functionality Check:**
   ```bash
   # Check main page
   curl -I https://smilerentalphuket.com/
   
   # Check SSL
   curl -I https://smilerentalphuket.com/ | grep -i ssl
   
   # Check response time
   time curl -s https://smilerentalphuket.com/ > /dev/null
   ```

## 🔧 EMERGENCY RECOVERY SCENARIOS

### Scenario 1: Site Completely Down
**Symptoms:** Site not loading, 502/503 errors  
**Cause:** Application crash, Nginx misconfiguration  
**Recovery Time:** 5-8 minutes  

**Actions:**
1. Execute Quick Rollback procedure above
2. Check PM2 logs for application errors
3. Verify Nginx configuration
4. Restart services in correct order

### Scenario 2: Partial Site Functionality
**Symptoms:** Some pages work, others don't  
**Cause:** Incomplete deployment, missing files  
**Recovery Time:** 8-12 minutes  

**Actions:**
1. Compare current files with backup
2. Restore missing/corrupted files
3. Clear application cache if applicable
4. Restart application services

### Scenario 3: SSL Certificate Issues
**Symptoms:** SSL warnings, certificate errors  
**Cause:** Certificate restoration issues  
**Recovery Time:** 10-15 minutes  

**Actions:**
1. Restore SSL certificates from backup
2. Verify certificate permissions
3. Restart Nginx
4. Test SSL functionality

### Scenario 4: Database/Data Issues
**Symptoms:** Data not loading, application errors  
**Cause:** Data corruption, connection issues  
**Recovery Time:** 15-20 minutes  

**Actions:**
1. Check application configuration
2. Verify file permissions
3. Restore application data from backup
4. Restart application with fresh configuration

## 📞 ESCALATION PROCEDURES

### Level 1: Automated Recovery (0-10 minutes)
- Execute automated rollback scripts
- Use documented quick recovery procedures
- Monitor system status and logs

### Level 2: Manual Intervention (10-30 minutes)
- Detailed system diagnosis
- Manual file restoration
- Service reconfiguration
- Performance optimization

### Level 3: Expert Support (30+ minutes)
- Contact system administrator
- Review backup integrity
- Consider alternative recovery methods
- Plan for extended maintenance window

## 🛡️ BACKUP VERIFICATION

### Pre-Migration Backup Checklist:
- [ ] Production backup created and verified
- [ ] Backup location documented and accessible
- [ ] Restoration procedures tested
- [ ] Service restart procedures verified
- [ ] Emergency contact information updated

### Backup Locations:
1. **Primary Backup:** `/var/backups/migration-backup-[TIMESTAMP]/`
2. **Local Backup:** `./vercel-deployment-backup/`
3. **Repository Backup:** GitHub commit history
4. **Documentation:** All procedures documented in repository

## 🔄 ROLLBACK TESTING

### Test Rollback Procedure (Dry Run):
```bash
# 1. Create test backup location
mkdir -p /tmp/rollback-test/

# 2. Copy current state
cp -r /var/www/smilerentalphuket.com/site-smile-rental/ /tmp/rollback-test/current/

# 3. Test restoration commands (without overwriting)
cd /var/backups/migration-backup-[TIMESTAMP]/
ls -la ./application-backup/

# 4. Verify backup integrity
diff -r /tmp/rollback-test/current/ ./application-backup/

# 5. Clean up test
rm -rf /tmp/rollback-test/
```

## 📊 MONITORING AND ALERTS

### Key Metrics to Monitor:
- Site response time (< 3 seconds)
- HTTP status codes (200 OK expected)
- SSL certificate validity
- PM2 process status
- Nginx service status
- System resource usage

### Alert Thresholds:
- Response time > 5 seconds: Warning
- HTTP errors > 5%: Critical
- Service down: Critical
- SSL expiry < 7 days: Warning

## 📝 POST-ROLLBACK ACTIONS

### Immediate Actions:
1. Document the issue and resolution
2. Update monitoring and alerting
3. Review and improve procedures
4. Communicate status to stakeholders

### Follow-up Actions:
1. Investigate root cause
2. Plan corrective measures
3. Update deployment procedures
4. Schedule maintenance window for fixes

## 🔐 SECURITY CONSIDERATIONS

### Access Control:
- Ensure backup files have proper permissions (600/700)
- Verify SSH access to production server
- Confirm SSL certificate integrity
- Check file ownership and permissions

### Data Protection:
- Backup files contain sensitive information
- Secure backup storage location
- Regular backup rotation and cleanup
- Encrypted communication channels

---

**Document Version:** 1.0  
**Last Updated:** $(date)  
**Next Review:** After migration completion  
**Approved By:** Migration Team  

**REMEMBER: In emergency situations, prioritize site restoration over perfect procedures. Document any deviations for post-incident review.**
