# 🚀 Smile Rental Automated Deployment Guide

## Overview

This guide documents the complete automated deployment system for Smile Rental Phuket website. **No more manual server commands!** Just push to GitHub and watch your changes deploy automatically.

## 🎯 What This System Does

✅ **Automatic deployment** when you push to the main branch
✅ **Domain issue resolution** (fixes 403 Forbidden errors)
✅ **Health checks** to ensure everything works
✅ **Automatic backups** before each deployment
✅ **Rollback capabilities** if something goes wrong
✅ **Monitoring and notifications** for deployment status
✅ **Zero downtime deployments** with PM2

## 📁 Files Created

### Core Deployment Files
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `smile-rental-modern/fix-nginx-and-deploy.sh` - Fixes domain issues
- `smile-rental-modern/update-site.sh` - Enhanced manual deployment
- `smile-rental-modern/setup-ssh-keys.sh` - SSH key setup automation

### Monitoring & Management
- `smile-rental-modern/deployment-status.sh` - Comprehensive status checker
- `smile-rental-modern/test-domain.sh` - Quick domain testing
- `smile-rental-modern/rollback.sh` - Rollback to previous version
- `smile-rental-modern/notify-deployment.sh` - Notification system

### Documentation
- `setup-github-actions.md` - Setup instructions
- `DOMAIN_FIX_INSTRUCTIONS.md` - Domain troubleshooting
- `AUTOMATED_DEPLOYMENT_TESTING.md` - Testing procedures
- `AUTOMATED_DEPLOYMENT_GUIDE.md` - This file

## 🚀 Quick Start (First Time Setup)

### 1. Fix Current Domain Issues
```bash
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo ./fix-nginx-and-deploy.sh
```

### 2. Set Up SSH Keys for GitHub Actions
```bash
sudo ./setup-ssh-keys.sh
```

### 3. Configure GitHub Secrets
Go to: https://github.com/1rokoko/site-smile-rental/settings/secrets/actions

Add these secrets (values provided by setup-ssh-keys.sh):
- `VPS_HOST`: 38.180.122.239
- `VPS_USERNAME`: root
- `VPS_PORT`: 22
- `VPS_SSH_KEY`: (private key content)

### 4. Test the System
```bash
# Make a small change
echo "Test deployment $(date)" >> README.md

# Commit and push
git add .
git commit -m "Test automated deployment"
git push origin main

# Watch it deploy automatically!
```

## 🔄 Daily Usage

### Making Changes
1. Edit your code locally or on GitHub
2. Commit and push to the main branch
3. Watch GitHub Actions deploy automatically
4. Verify at http://smilerentalphuket.com

### Monitoring
```bash
# Check overall status
sudo ./deployment-status.sh

# Test domain specifically
sudo ./test-domain.sh

# View application logs
sudo pm2 logs smile-rental
```

## 🛠️ Troubleshooting

### Domain Returns 403 Forbidden
```bash
sudo ./fix-nginx-and-deploy.sh
```

### Deployment Failed in GitHub Actions
1. Check the Actions tab for error details
2. Verify SSH connection: `ssh -i ~/.ssh/github_actions_key root@38.180.122.239`
3. Check GitHub Secrets are set correctly

### Application Not Starting
```bash
# Check status
sudo pm2 status

# Restart manually
sudo pm2 restart smile-rental

# Rebuild if needed
sudo npm run build
```

### Need to Rollback
```bash
sudo ./rollback.sh
```

## 📊 Monitoring Commands

```bash
# Comprehensive status check
sudo ./deployment-status.sh

# Quick domain test
sudo ./test-domain.sh

# PM2 application status
sudo pm2 status

# View recent logs
sudo pm2 logs smile-rental --lines 20

# Nginx status
sudo systemctl status nginx

# Test notifications
sudo ./notify-deployment.sh test
```

## 🔧 Manual Deployment (Backup Method)

If automated deployment fails, you can still deploy manually:

```bash
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo ./update-site.sh
```

## 🎯 Advanced Features

### Notifications
Set environment variables for notifications:
```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
export DEPLOYMENT_WEBHOOK_URL="your_webhook_url"
```

### Health Monitoring
```bash
# Run health check with notifications
sudo ./notify-deployment.sh health
```

### Backup Management
```bash
# List available backups
ls -la smile-rental-modern.backup.*

# Rollback to specific backup
sudo ./rollback.sh
```

## 🔒 Security Features

- SSH key-based authentication
- GitHub Secrets for sensitive data
- Automatic backup before deployment
- Health checks prevent broken deployments
- Rollback capabilities for quick recovery

## 📈 Performance

- **Deployment time**: 2-5 minutes
- **Zero downtime**: PM2 handles restarts seamlessly
- **Automatic cleanup**: Old backups are removed
- **Change detection**: Only deploys when files change

## 🆘 Emergency Procedures

### Complete System Restart
```bash
sudo pm2 restart smile-rental
sudo systemctl restart nginx
```

### Emergency Rollback
```bash
sudo ./rollback.sh
```

### Manual Recovery
```bash
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo npm install
sudo npm run build
sudo pm2 restart smile-rental
```

## 📞 Support

### Check These First
1. GitHub Actions logs: https://github.com/1rokoko/site-smile-rental/actions
2. Server status: `sudo ./deployment-status.sh`
3. Application logs: `sudo pm2 logs smile-rental`
4. Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Common Solutions
- **403 Forbidden**: Run `sudo ./fix-nginx-and-deploy.sh`
- **App not starting**: Run `sudo pm2 restart smile-rental`
- **Build failed**: Check GitHub Actions logs
- **SSH issues**: Regenerate keys with `sudo ./setup-ssh-keys.sh`

## 🎉 Benefits

✅ **No more manual commands** - Just push to GitHub
✅ **Consistent deployments** - Same process every time
✅ **Automatic backups** - Never lose your work
✅ **Health monitoring** - Know when something's wrong
✅ **Quick rollbacks** - Fix issues fast
✅ **Professional workflow** - Industry standard practices

---

**Congratulations!** You now have a professional, automated deployment system. No more typing commands on the server - just code, commit, and deploy! 🚀
