#!/bin/bash

echo "🔑 Creating SSH keys for GitHub Actions..."

# Create SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@smilerentalphuket.com" -f ~/.ssh/github_actions_key -N ""

# Add public key to authorized_keys
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo ""
echo "✅ SSH keys created successfully!"
echo ""
echo "🔐 GitHub Secrets Values:"
echo "========================="
echo ""
echo "VPS_HOST:"
echo "38.180.122.239"
echo ""
echo "VPS_USERNAME:"
echo "root"
echo ""
echo "VPS_PORT:"
echo "22"
echo ""
echo "VPS_SSH_KEY:"
echo "Copy the ENTIRE content below (including BEGIN/END lines):"
echo "================================================================"
cat ~/.ssh/github_actions_key
echo "================================================================"
echo ""
echo "✅ Now add these 4 secrets to GitHub:"
echo "https://github.com/1rokoko/site-smile-rental/settings/secrets/actions"
