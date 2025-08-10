# Manual Node.js Deployment Fix - Step by Step Guide

## Problem Analysis
Based on commit history analysis, the issue appears to be related to:
- **Memory issues and SIGKILL failures** (from commit ca9ba9c999ae30e593ff4b90095d669d3eb5d872)
- **Build failures and PM2 restart loops** (multiple recent commits)
- **System-level resource constraints** causing Node.js startup failures

## Confirmed Working SSH Method
Use **SSH Method 6.1** (Manual password entry):
```bash
ssh root@38.180.122.239 "command"
# Wait for password prompt, then enter: 925LudK9Bv
```

## Step-by-Step Fix Procedure

### Phase 1: System Cleanup (Address Memory Issues)

1. **Kill hanging processes:**
```bash
ssh root@38.180.122.239 "pkill -f node"
# Password: 925LudK9Bv
```

2. **Kill hanging NPM processes:**
```bash
ssh root@38.180.122.239 "pkill -f npm"
# Password: 925LudK9Bv
```

3. **Clean PM2 completely:**
```bash
ssh root@38.180.122.239 "pm2 kill"
# Password: 925LudK9Bv
```

4. **Clear system caches (from emergency memory fix):**
```bash
ssh root@38.180.122.239 "sync && echo 3 > /proc/sys/vm/drop_caches"
# Password: 925LudK9Bv
```

5. **Clear NPM cache:**
```bash
ssh root@38.180.122.239 "npm cache clean --force"
# Password: 925LudK9Bv
```

### Phase 2: Project Cleanup

6. **Remove corrupted build artifacts:**
```bash
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next"
# Password: 925LudK9Bv
```

7. **Remove node_modules cache:**
```bash
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf node_modules/.cache"
# Password: 925LudK9Bv
```

8. **Remove backup directories:**
```bash
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next.backup.*"
# Password: 925LudK9Bv
```

### Phase 3: Node.js Verification

9. **Test Node.js version:**
```bash
ssh root@38.180.122.239 "node --version"
# Password: 925LudK9Bv
# Expected: v18.x.x or similar
```

10. **Test NPM version:**
```bash
ssh root@38.180.122.239 "npm --version"
# Password: 925LudK9Bv
# Expected: 9.x.x or similar
```

11. **Test basic Node.js execution:**
```bash
ssh root@38.180.122.239 "node -e 'console.log(\"Node.js is working\")'"
# Password: 925LudK9Bv
# Expected: "Node.js is working"
```

### Phase 4: Memory-Optimized Dependency Installation

12. **Install dependencies with memory limit:**
```bash
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' npm install"
# Password: 925LudK9Bv
```

### Phase 5: PM2 Restoration

13. **Verify PM2 installation:**
```bash
ssh root@38.180.122.239 "pm2 --version"
# Password: 925LudK9Bv
```

14. **Check PM2 status:**
```bash
ssh root@38.180.122.239 "pm2 list"
# Password: 925LudK9Bv
```

### Phase 6: Application Startup Test

15. **Start application in development mode (safer):**
```bash
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=2048' pm2 start npm --name smile-rental-dev -- run dev"
# Password: 925LudK9Bv
```

16. **Save PM2 configuration:**
```bash
ssh root@38.180.122.239 "pm2 save"
# Password: 925LudK9Bv
```

17. **Check application status:**
```bash
ssh root@38.180.122.239 "pm2 list"
# Password: 925LudK9Bv
```

18. **Test local connectivity:**
```bash
ssh root@38.180.122.239 "curl -I http://localhost:3000"
# Password: 925LudK9Bv
```

### Phase 7: Nginx and Domain Verification

19. **Restart Nginx:**
```bash
ssh root@38.180.122.239 "systemctl reload nginx"
# Password: 925LudK9Bv
```

20. **Test domain access:**
```bash
ssh root@38.180.122.239 "curl -I https://smilerentalphuket.com"
# Password: 925LudK9Bv
```

## Expected Results

- **If Node.js tests fail**: Node.js installation is corrupted and needs reinstallation
- **If dependency installation fails**: Memory constraints require further optimization
- **If PM2 startup fails**: Application code issues or remaining memory problems
- **If domain access fails**: Nginx configuration or DNS issues

## Troubleshooting Decision Tree

1. **Node.js version command fails** → Reinstall Node.js
2. **NPM install fails with SIGKILL** → Increase memory limits or use swap
3. **PM2 start fails** → Check application logs and memory usage
4. **Local curl fails** → Application startup issues
5. **Domain curl fails** → Nginx configuration problems

## Next Actions Based on Results

- **Success**: Website should be accessible at https://smilerentalphuket.com/
- **Partial Success**: Identify which phase failed and focus troubleshooting there
- **Complete Failure**: Node.js installation corruption - requires reinstallation
