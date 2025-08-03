# 🧪 Automated Deployment Testing Guide

## Pre-Testing Checklist ✅

Before testing the automated deployment, ensure you have completed:

1. ✅ **Fixed domain issues**: Run `sudo ./fix-nginx-and-deploy.sh`
2. ✅ **Set up SSH keys**: Run `sudo ./setup-ssh-keys.sh`
3. ✅ **Configured GitHub Secrets**: Added VPS_HOST, VPS_USERNAME, VPS_PORT, VPS_SSH_KEY
4. ✅ **Verified current status**: Run `sudo ./deployment-status.sh`

## Testing Steps 🚀

### Step 1: Verify Current Status

```bash
# Check current deployment status
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo ./deployment-status.sh
```

Expected: All or most checks should pass.

### Step 2: Make a Test Change

Create a small, visible change to test the deployment:

```bash
# Option A: Update README.md
echo "Last updated: $(date)" >> README.md

# Option B: Add a comment to a component file
echo "// Test deployment $(date)" >> src/app/page.tsx
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Test automated deployment - $(date)"
git push origin main
```

### Step 4: Monitor GitHub Actions

1. Go to: https://github.com/1rokoko/site-smile-rental/actions
2. Watch the "🚀 Deploy Smile Rental to VPS" workflow
3. Monitor each step in real-time

### Step 5: Verify Deployment

After GitHub Actions completes:

```bash
# Check deployment status
sudo ./deployment-status.sh

# Test domain accessibility
sudo ./test-domain.sh

# Check PM2 status
sudo pm2 status

# View recent logs
sudo pm2 logs smile-rental --lines 20
```

## Expected Results ✅

### GitHub Actions Should Show:
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies
- ✅ Build application
- ✅ Deploy to VPS
- ✅ Health checks pass
- ✅ Deployment summary

### Server Should Have:
- ✅ Application running via PM2
- ✅ Website accessible at http://smilerentalphuket.com
- ✅ New backup created
- ✅ Changes visible on the website

## Troubleshooting 🔧

### If GitHub Actions Fails:

1. **Check SSH connection**:
   ```bash
   ssh -i ~/.ssh/github_actions_key root@38.180.122.239 "echo 'SSH works'"
   ```

2. **Verify GitHub Secrets**:
   - Go to repository Settings → Secrets and variables → Actions
   - Ensure all 4 secrets are set correctly

3. **Check server logs**:
   ```bash
   sudo pm2 logs smile-rental
   sudo tail -f /var/log/nginx/error.log
   ```

### If Deployment Succeeds but Site Not Accessible:

1. **Fix Nginx issues**:
   ```bash
   sudo ./fix-nginx-and-deploy.sh
   ```

2. **Restart services**:
   ```bash
   sudo pm2 restart smile-rental
   sudo systemctl restart nginx
   ```

### If Application Won't Start:

1. **Check build**:
   ```bash
   cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
   sudo npm run build
   ```

2. **Manual restart**:
   ```bash
   sudo pm2 delete smile-rental
   sudo pm2 start npm --name "smile-rental" -- start
   sudo pm2 save
   ```

## Advanced Testing 🎯

### Test Rollback Functionality:

```bash
# Create a backup point
sudo ./deployment-status.sh

# Make a breaking change and deploy
echo "BREAKING CHANGE" > src/app/page.tsx
git add . && git commit -m "Test rollback" && git push origin main

# If deployment fails, rollback
sudo ./rollback.sh
```

### Test Health Monitoring:

```bash
# Test notification system
sudo ./notify-deployment.sh test

# Run health check
sudo ./notify-deployment.sh health
```

### Test Multiple Deployments:

1. Make small change → Push → Verify
2. Make another change → Push → Verify
3. Check that backups are created
4. Verify old backups are cleaned up

## Performance Testing 📊

### Deployment Speed:
- **Expected time**: 2-5 minutes
- **Acceptable time**: Under 10 minutes

### Zero Downtime:
- Website should remain accessible during deployment
- PM2 restart should be seamless

## Success Criteria ✅

The automated deployment is working correctly if:

1. ✅ **GitHub Actions completes successfully**
2. ✅ **Website is accessible after deployment**
3. ✅ **Changes are visible on the live site**
4. ✅ **No manual server commands needed**
5. ✅ **Backup is created automatically**
6. ✅ **Health checks pass**
7. ✅ **Rollback works if needed**

## Next Steps After Successful Testing 🎉

1. **Document the process** for team members
2. **Set up monitoring alerts** (optional)
3. **Configure SSL certificates** (recommended)
4. **Set up staging environment** (optional)
5. **Enjoy automated deployments!** 🚀

---

## Emergency Contacts 🆘

If something goes wrong and you need to restore service quickly:

```bash
# Emergency restart
sudo pm2 restart smile-rental
sudo systemctl restart nginx

# Emergency rollback
sudo ./rollback.sh

# Emergency rebuild
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo npm run build
sudo pm2 restart smile-rental
```

**Remember**: The old manual deployment method still works as a backup:
```bash
sudo ./update-site.sh
```
