# Comprehensive Node.js Deployment Solution

## Root Cause Analysis

Based on codebase analysis, commit history review, and diagnostic attempts, the issue is identified as:

**PRIMARY CAUSE**: Memory constraints causing Node.js processes to be killed by the OOM killer
- Recent commits show SIGKILL build failures and memory optimization attempts
- Timeline matches when memory-related fixes were implemented
- Disk space is adequate (57% usage, 21GB free)
- SSH access confirmed working (Method 6.1)

## Immediate Solution Steps

### Phase 1: Emergency Memory Cleanup
Execute these commands using SSH Method 6.1 (manual password entry):

```bash
# 1. Kill all hanging Node.js processes
ssh root@38.180.122.239 "pkill -f node; pkill -f npm"
# Password: 925LudK9Bv

# 2. Kill PM2 daemon completely
ssh root@38.180.122.239 "pm2 kill"
# Password: 925LudK9Bv

# 3. Clear system memory caches (from emergency memory fix commit)
ssh root@38.180.122.239 "sync && echo 3 > /proc/sys/vm/drop_caches"
# Password: 925LudK9Bv

# 4. Clear NPM cache
ssh root@38.180.122.239 "npm cache clean --force"
# Password: 925LudK9Bv
```

### Phase 2: Project Cleanup
```bash
# 5. Remove corrupted build artifacts
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next .next.backup.* node_modules/.cache"
# Password: 925LudK9Bv
```

### Phase 3: Memory-Optimized Restart
```bash
# 6. Test Node.js functionality
ssh root@38.180.122.239 "node -e 'console.log(\"Node.js working:\", process.version)'"
# Password: 925LudK9Bv

# 7. Install dependencies with memory limit (from memory fix commits)
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' npm install"
# Password: 925LudK9Bv

# 8. Start application in development mode with memory limit
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name smile-rental-dev -- run dev"
# Password: 925LudK9Bv

# 9. Save PM2 configuration
ssh root@38.180.122.239 "pm2 save"
# Password: 925LudK9Bv

# 10. Reload Nginx
ssh root@38.180.122.239 "systemctl reload nginx"
# Password: 925LudK9Bv
```

### Phase 4: Verification
```bash
# 11. Check PM2 status
ssh root@38.180.122.239 "pm2 list"
# Password: 925LudK9Bv

# 12. Test local connectivity
ssh root@38.180.122.239 "curl -I http://localhost:3000"
# Password: 925LudK9Bv

# 13. Test domain access
ssh root@38.180.122.239 "curl -I https://smilerentalphuket.com"
# Password: 925LudK9Bv
```

## Alternative Solutions if Primary Fails

### Option A: If Node.js is Corrupted
```bash
# Reinstall Node.js using NodeSource repository
ssh root@38.180.122.239 "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
# Password: 925LudK9Bv
```

### Option B: If Memory Issues Persist
```bash
# Create swap file for additional memory
ssh root@38.180.122.239 "fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile"
# Password: 925LudK9Bv
```

### Option C: If Build Process Fails
```bash
# Use pre-built static export
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build:static"
# Password: 925LudK9Bv
```

## Long-term Preventive Measures

1. **Memory Monitoring**: Implement memory usage monitoring
2. **Swap Configuration**: Add permanent swap file
3. **Build Optimization**: Use incremental builds
4. **Process Limits**: Configure PM2 memory limits
5. **Health Checks**: Implement automated health monitoring

## Expected Results

- **Success Indicators**:
  - PM2 shows "smile-rental-dev" process as "online"
  - `curl http://localhost:3000` returns HTTP 200
  - `curl https://smilerentalphuket.com` returns HTTP 200
  - Website accessible at https://smilerentalphuket.com/

- **Failure Indicators**:
  - Node.js version command fails → Node.js corruption
  - NPM install fails with SIGKILL → Insufficient memory
  - PM2 start fails → Application code issues
  - Domain access fails → Nginx configuration issues

## Troubleshooting Decision Tree

1. **Node.js test fails** → Execute Option A (Reinstall Node.js)
2. **NPM install fails** → Execute Option B (Add swap memory)
3. **PM2 start fails** → Check application logs and memory usage
4. **Local curl fails** → Application startup issues, check PM2 logs
5. **Domain curl fails** → Nginx configuration, check proxy settings

## Automation Script for Future Use

Once the issue is resolved, create an automated monitoring script:
```bash
#!/bin/bash
# health-check.sh
if ! curl -f http://localhost:3000 >/dev/null 2>&1; then
    pm2 restart smile-rental-dev
    sleep 30
    if ! curl -f http://localhost:3000 >/dev/null 2>&1; then
        # Send alert
        echo "Website down - manual intervention required" | mail -s "Site Alert" admin@example.com
    fi
fi
```

## Next Steps After Resolution

1. Verify website functionality at https://smilerentalphuket.com/
2. Test all major pages and features
3. Implement monitoring and alerting
4. Document the solution for future reference
5. Consider upgrading server resources if memory issues persist
