# 🔧 Domain Fix Instructions

## Current Status ✅

✅ **DNS Resolution**: `smilerentalphuket.com` correctly resolves to `38.180.122.239`
✅ **Server Connectivity**: Server responds to ping and TCP connections
✅ **Application**: Next.js app is running perfectly on `http://38.180.122.239:3000`
❌ **Domain Access**: `http://smilerentalphuket.com` returns 403 Forbidden due to Nginx conflicts

## The Problem 🚨

Your Nginx has conflicting server name configurations:
```
nginx: [warn] conflicting server name "smilerentalphuket.com" on 0.0.0.0:80, ignored
nginx: [warn] conflicting server name "www.smilerentalphuket.com" on 0.0.0.0:80, ignored
```

This means multiple server blocks are trying to handle the same domain, causing Nginx to ignore the duplicates and serve a default 403 page.

## Quick Fix (2 Commands) 🚀

Run these commands on your server to fix the domain issue:

```bash
# 1. Download the fix script
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
wget https://raw.githubusercontent.com/1rokoko/site-smile-rental/main/smile-rental-modern/fix-nginx-and-deploy.sh
chmod +x fix-nginx-and-deploy.sh

# 2. Run the fix script
sudo ./fix-nginx-and-deploy.sh
```

## What the Fix Script Does 🔧

1. **Removes all conflicting Nginx configurations**
2. **Creates a single, clean server block**
3. **Adds security headers**
4. **Tests the configuration**
5. **Restarts Nginx**
6. **Verifies the application is running**
7. **Tests domain accessibility**

## After Running the Fix ✅

Your website will be accessible at:
- ✅ `http://smilerentalphuket.com`
- ✅ `http://www.smilerentalphuket.com`

## Set Up Automated Deployment 🤖

To never manually run server commands again, follow the [GitHub Actions setup guide](setup-github-actions.md):

1. **Generate SSH keys** for GitHub Actions
2. **Add secrets** to your GitHub repository
3. **Push code** and watch automatic deployment!

## Test Commands 🧪

After fixing, you can test with:

```bash
# Test domain accessibility
sudo ./test-domain.sh

# Check application status
sudo pm2 status

# View logs if needed
sudo pm2 logs smile-rental
```

## Emergency Rollback 🔄

If something goes wrong, you can always restart the application:

```bash
sudo pm2 restart smile-rental
sudo systemctl restart nginx
```

## Next Steps 📋

1. ✅ Fix the domain issue (run the commands above)
2. ⏳ Set up automated deployment (follow setup-github-actions.md)
3. ⏳ Test the automated deployment
4. ⏳ Enjoy never typing server commands again!

---

**Need help?** Check the deployment logs in GitHub Actions or run `sudo ./test-domain.sh` to diagnose issues.
