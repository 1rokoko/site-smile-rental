# GitHub Actions Automated Deployment Setup

This guide will help you set up automated deployment using GitHub Actions so you never have to manually run commands on the server again.

## Step 1: Generate SSH Key for GitHub Actions

Run these commands on your VPS server:

```bash
# Generate a new SSH key specifically for GitHub Actions
ssh-keygen -t rsa -b 4096 -C "github-actions@smilerentalphuket.com" -f ~/.ssh/github_actions_key -N ""

# Display the public key (you'll need this for the server)
cat ~/.ssh/github_actions_key.pub

# Display the private key (you'll need this for GitHub Secrets)
cat ~/.ssh/github_actions_key
```

## Step 2: Add Public Key to Server

Add the public key to the authorized_keys file:

```bash
# Add the public key to authorized_keys
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## Step 3: Configure GitHub Repository Secrets

Go to your GitHub repository: https://github.com/1rokoko/site-smile-rental

1. Click on **Settings** tab
2. Click on **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

### Required Secrets:

**VPS_HOST**
```
38.180.122.239
```

**VPS_USERNAME**
```
root
```

**VPS_PORT**
```
22
```

**VPS_SSH_KEY**
```
Copy the ENTIRE content from: cat ~/.ssh/github_actions_key
(This should start with -----BEGIN OPENSSH PRIVATE KEY----- and end with -----END OPENSSH PRIVATE KEY-----)
```

## Step 4: Fix Current Nginx Issues

Before enabling automated deployment, let's fix the current Nginx configuration issues:

```bash
# Download and run the fix script
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
wget https://raw.githubusercontent.com/1rokoko/site-smile-rental/main/smile-rental-modern/fix-nginx-and-deploy.sh
chmod +x fix-nginx-and-deploy.sh
sudo ./fix-nginx-and-deploy.sh
```

## Step 5: Test Automated Deployment

Once you've set up the GitHub secrets:

1. Make any small change to your code (like updating README.md)
2. Commit and push to the main branch:
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   ```
3. Go to your GitHub repository → **Actions** tab
4. Watch the deployment process in real-time!

## Step 6: Verify Everything Works

After the GitHub Action completes:

1. Check that your website is accessible: http://smilerentalphuket.com
2. Verify the changes are deployed
3. Check the deployment logs in GitHub Actions

## Benefits of This Setup

✅ **No more manual commands** - Just push to GitHub and deployment happens automatically
✅ **Consistent deployments** - Same process every time
✅ **Deployment history** - See all deployments in GitHub Actions
✅ **Rollback capability** - Easy to revert if something goes wrong
✅ **Build verification** - Code is tested before deployment
✅ **Secure** - Uses SSH keys, no passwords

## Troubleshooting

### If deployment fails:

1. Check GitHub Actions logs for error details
2. Verify SSH connection: `ssh -i ~/.ssh/github_actions_key root@38.180.122.239`
3. Check server logs: `sudo pm2 logs smile-rental`
4. Verify Nginx status: `sudo systemctl status nginx`

### If website is not accessible:

1. Check if application is running: `sudo pm2 status`
2. Check Nginx configuration: `sudo nginx -t`
3. Check server logs: `sudo tail -f /var/log/nginx/error.log`

## Manual Deployment (Backup Method)

If you ever need to deploy manually, you can still use:

```bash
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo ./update-site.sh
```

## Next Steps

Once this is working, you can:
- Add SSL certificates (Let's Encrypt)
- Set up monitoring and alerts
- Add staging environment
- Implement blue-green deployments
