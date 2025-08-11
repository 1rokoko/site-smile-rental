# Manual SSH Guide for Site Smile Rental

## Current Status
- ✅ Server is reachable (38.180.122.239)
- ✅ Port 3000 is open (Next.js should be running)
- ✅ Port 80 is open (Nginx is running)
- ❌ Domain returns 503 error (Nginx misconfiguration)
- ❌ HTTPS not working (port 443 closed)

## Manual SSH Commands to Execute

### Step 1: Connect to server
```bash
ssh root@38.180.122.239
# Enter password: [REMOVED]
```

### Step 2: Check and restart PM2
```bash
pm2 list
pm2 delete all
cd /var/www/smilerentalphuket.com/site-smile-rental
pm2 start 'npm run dev' --name smile-rental-dev
pm2 save
pm2 list
```

### Step 3: Check Nginx configuration
```bash
cat /etc/nginx/sites-available/smilerentalphuket.com
nginx -t
systemctl restart nginx
```

### Step 4: Test connections
```bash
curl -I http://localhost:3000
curl -I http://smilerentalphuket.com
```

### Step 5: Check logs if needed
```bash
pm2 logs smile-rental-dev --lines 20
tail -f /var/log/nginx/error.log
```

## Expected Results
- PM2 should show smile-rental-dev process running
- Nginx test should pass
- localhost:3000 should return 200 OK
- Domain should return 200 OK (not 503)

## Next Steps After Manual Fix
1. Test domain in browser
2. Create screenshots
3. Test responsive design
4. Verify all functionality
