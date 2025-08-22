#!/bin/bash

# Production Configuration Documentation Script
# Documents current production server configuration for migration reference

set -e

echo "📋 PRODUCTION CONFIGURATION DOCUMENTATION"
echo "=========================================="
echo "Date: $(date)"
echo "Server: $(hostname)"
echo "User: $(whoami)"
echo ""

# Configuration
DOC_DIR="./production-config-documentation"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$DOC_DIR/documentation-log-$TIMESTAMP.txt"

# Create documentation directory
mkdir -p "$DOC_DIR"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to document system information
document_system_info() {
    log_message "📊 Documenting system information..."
    
    cat > "$DOC_DIR/system-information.md" << EOF
# Production System Information

**Documentation Date:** $(date)
**Server Hostname:** $(hostname)
**Documentation User:** $(whoami)

## System Details
- **Operating System:** $(uname -a)
- **Kernel Version:** $(uname -r)
- **Architecture:** $(uname -m)
- **Uptime:** $(uptime)

## Hardware Information
- **CPU Info:** $(grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)
- **CPU Cores:** $(nproc)
- **Memory Total:** $(free -h | grep Mem | awk '{print $2}')
- **Memory Available:** $(free -h | grep Mem | awk '{print $7}')
- **Disk Usage:** $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')

## Network Configuration
- **IP Address:** $(hostname -I | awk '{print $1}')
- **DNS Servers:** $(cat /etc/resolv.conf | grep nameserver | awk '{print $2}' | tr '\n' ' ')

## Timezone
- **Current Timezone:** $(timedatectl | grep "Time zone" | awk '{print $3}')
- **Current Time:** $(date)

EOF
    
    log_message "✅ System information documented"
}

# Function to document Nginx configuration
document_nginx_config() {
    log_message "🌐 Documenting Nginx configuration..."
    
    cat > "$DOC_DIR/nginx-configuration.md" << EOF
# Nginx Configuration Documentation

**Documentation Date:** $(date)

## Nginx Version
$(nginx -v 2>&1)

## Nginx Status
- **Service Status:** $(systemctl is-active nginx 2>/dev/null || echo "unknown")
- **Service Enabled:** $(systemctl is-enabled nginx 2>/dev/null || echo "unknown")

## Configuration Files
EOF
    
    # Document main nginx.conf
    if [ -f "/etc/nginx/nginx.conf" ]; then
        echo "### Main Configuration (/etc/nginx/nginx.conf)" >> "$DOC_DIR/nginx-configuration.md"
        echo '```nginx' >> "$DOC_DIR/nginx-configuration.md"
        cat /etc/nginx/nginx.conf >> "$DOC_DIR/nginx-configuration.md"
        echo '```' >> "$DOC_DIR/nginx-configuration.md"
        echo "" >> "$DOC_DIR/nginx-configuration.md"
    fi
    
    # Document site configuration
    if [ -f "/etc/nginx/sites-available/smilerentalphuket.com" ]; then
        echo "### Site Configuration (/etc/nginx/sites-available/smilerentalphuket.com)" >> "$DOC_DIR/nginx-configuration.md"
        echo '```nginx' >> "$DOC_DIR/nginx-configuration.md"
        cat /etc/nginx/sites-available/smilerentalphuket.com >> "$DOC_DIR/nginx-configuration.md"
        echo '```' >> "$DOC_DIR/nginx-configuration.md"
        echo "" >> "$DOC_DIR/nginx-configuration.md"
    fi
    
    # Document enabled sites
    echo "## Enabled Sites" >> "$DOC_DIR/nginx-configuration.md"
    ls -la /etc/nginx/sites-enabled/ >> "$DOC_DIR/nginx-configuration.md" 2>/dev/null || echo "No enabled sites found" >> "$DOC_DIR/nginx-configuration.md"
    
    # Test configuration
    echo "## Configuration Test" >> "$DOC_DIR/nginx-configuration.md"
    echo '```' >> "$DOC_DIR/nginx-configuration.md"
    nginx -t >> "$DOC_DIR/nginx-configuration.md" 2>&1 || echo "Configuration test failed" >> "$DOC_DIR/nginx-configuration.md"
    echo '```' >> "$DOC_DIR/nginx-configuration.md"
    
    log_message "✅ Nginx configuration documented"
}

# Function to document PM2 configuration
document_pm2_config() {
    log_message "⚙️ Documenting PM2 configuration..."
    
    cat > "$DOC_DIR/pm2-configuration.md" << EOF
# PM2 Configuration Documentation

**Documentation Date:** $(date)

## PM2 Version
$(pm2 --version 2>/dev/null || echo "PM2 not found")

## Process List
\`\`\`
$(pm2 list 2>/dev/null || echo "No PM2 processes found")
\`\`\`

## Process Details
EOF
    
    # Document smile-rental process details
    if pm2 show smile-rental >/dev/null 2>&1; then
        echo "### Smile Rental Process Details" >> "$DOC_DIR/pm2-configuration.md"
        echo '```' >> "$DOC_DIR/pm2-configuration.md"
        pm2 show smile-rental >> "$DOC_DIR/pm2-configuration.md" 2>/dev/null
        echo '```' >> "$DOC_DIR/pm2-configuration.md"
        echo "" >> "$DOC_DIR/pm2-configuration.md"
    fi
    
    # Document ecosystem configuration
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/ecosystem.config.js" ]; then
        echo "### Ecosystem Configuration" >> "$DOC_DIR/pm2-configuration.md"
        echo '```javascript' >> "$DOC_DIR/pm2-configuration.md"
        cat /var/www/smilerentalphuket.com/site-smile-rental/ecosystem.config.js >> "$DOC_DIR/pm2-configuration.md"
        echo '```' >> "$DOC_DIR/pm2-configuration.md"
        echo "" >> "$DOC_DIR/pm2-configuration.md"
    fi
    
    # Document PM2 logs
    echo "## Recent Logs (Last 20 lines)" >> "$DOC_DIR/pm2-configuration.md"
    echo '```' >> "$DOC_DIR/pm2-configuration.md"
    pm2 logs smile-rental --lines 20 >> "$DOC_DIR/pm2-configuration.md" 2>/dev/null || echo "No logs available" >> "$DOC_DIR/pm2-configuration.md"
    echo '```' >> "$DOC_DIR/pm2-configuration.md"
    
    log_message "✅ PM2 configuration documented"
}

# Function to document SSL configuration
document_ssl_config() {
    log_message "🔒 Documenting SSL configuration..."
    
    cat > "$DOC_DIR/ssl-configuration.md" << EOF
# SSL Configuration Documentation

**Documentation Date:** $(date)

## SSL Certificate Information
EOF
    
    # Check SSL certificate
    if [ -d "/etc/letsencrypt/live/smilerentalphuket.com" ]; then
        echo "### Let's Encrypt Certificate" >> "$DOC_DIR/ssl-configuration.md"
        echo "- **Certificate Path:** /etc/letsencrypt/live/smilerentalphuket.com/" >> "$DOC_DIR/ssl-configuration.md"
        echo "- **Certificate Files:**" >> "$DOC_DIR/ssl-configuration.md"
        ls -la /etc/letsencrypt/live/smilerentalphuket.com/ >> "$DOC_DIR/ssl-configuration.md" 2>/dev/null
        echo "" >> "$DOC_DIR/ssl-configuration.md"
        
        # Certificate details
        echo "### Certificate Details" >> "$DOC_DIR/ssl-configuration.md"
        echo '```' >> "$DOC_DIR/ssl-configuration.md"
        openssl x509 -in /etc/letsencrypt/live/smilerentalphuket.com/cert.pem -text -noout | head -20 >> "$DOC_DIR/ssl-configuration.md" 2>/dev/null || echo "Could not read certificate details" >> "$DOC_DIR/ssl-configuration.md"
        echo '```' >> "$DOC_DIR/ssl-configuration.md"
    else
        echo "No Let's Encrypt certificate found for smilerentalphuket.com" >> "$DOC_DIR/ssl-configuration.md"
    fi
    
    # Test SSL
    echo "## SSL Test" >> "$DOC_DIR/ssl-configuration.md"
    echo '```' >> "$DOC_DIR/ssl-configuration.md"
    echo | openssl s_client -connect smilerentalphuket.com:443 -servername smilerentalphuket.com 2>/dev/null | openssl x509 -noout -dates >> "$DOC_DIR/ssl-configuration.md" 2>/dev/null || echo "SSL test failed" >> "$DOC_DIR/ssl-configuration.md"
    echo '```' >> "$DOC_DIR/ssl-configuration.md"
    
    log_message "✅ SSL configuration documented"
}

# Function to document application configuration
document_application_config() {
    log_message "📱 Documenting application configuration..."
    
    cat > "$DOC_DIR/application-configuration.md" << EOF
# Application Configuration Documentation

**Documentation Date:** $(date)

## Application Path
- **Production Path:** /var/www/smilerentalphuket.com/site-smile-rental

## Directory Structure
\`\`\`
$(ls -la /var/www/smilerentalphuket.com/site-smile-rental/ 2>/dev/null | head -20 || echo "Application directory not accessible")
\`\`\`

## Package Configuration
EOF
    
    # Document package.json
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/package.json" ]; then
        echo "### Package.json" >> "$DOC_DIR/application-configuration.md"
        echo '```json' >> "$DOC_DIR/application-configuration.md"
        cat /var/www/smilerentalphuket.com/site-smile-rental/package.json >> "$DOC_DIR/application-configuration.md"
        echo '```' >> "$DOC_DIR/application-configuration.md"
        echo "" >> "$DOC_DIR/application-configuration.md"
    fi
    
    # Document next.config.js if exists
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/next.config.js" ]; then
        echo "### Next.js Configuration" >> "$DOC_DIR/application-configuration.md"
        echo '```javascript' >> "$DOC_DIR/application-configuration.md"
        cat /var/www/smilerentalphuket.com/site-smile-rental/next.config.js >> "$DOC_DIR/application-configuration.md"
        echo '```' >> "$DOC_DIR/application-configuration.md"
        echo "" >> "$DOC_DIR/application-configuration.md"
    fi
    
    # Document environment variables (if any .env files exist)
    echo "## Environment Configuration" >> "$DOC_DIR/application-configuration.md"
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/.env" ]; then
        echo "- .env file exists (content not shown for security)" >> "$DOC_DIR/application-configuration.md"
    fi
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/.env.local" ]; then
        echo "- .env.local file exists (content not shown for security)" >> "$DOC_DIR/application-configuration.md"
    fi
    if [ -f "/var/www/smilerentalphuket.com/site-smile-rental/.env.production" ]; then
        echo "- .env.production file exists (content not shown for security)" >> "$DOC_DIR/application-configuration.md"
    fi
    
    log_message "✅ Application configuration documented"
}

# Function to document network and ports
document_network_config() {
    log_message "🌐 Documenting network configuration..."
    
    cat > "$DOC_DIR/network-configuration.md" << EOF
# Network Configuration Documentation

**Documentation Date:** $(date)

## Active Network Connections
\`\`\`
$(netstat -tlnp | grep -E "(80|443|3000)" 2>/dev/null || echo "No web-related ports found")
\`\`\`

## Firewall Status
\`\`\`
$(ufw status 2>/dev/null || echo "UFW not available")
\`\`\`

## Open Ports
\`\`\`
$(ss -tlnp | grep -E "(80|443|3000)" 2>/dev/null || echo "No web-related ports found")
\`\`\`

## DNS Configuration
\`\`\`
$(cat /etc/resolv.conf 2>/dev/null || echo "DNS configuration not accessible")
\`\`\`

EOF
    
    log_message "✅ Network configuration documented"
}

# Function to create summary document
create_summary_document() {
    log_message "📄 Creating configuration summary..."
    
    cat > "$DOC_DIR/CONFIGURATION_SUMMARY.md" << EOF
# Production Configuration Summary

**Documentation Date:** $(date)
**Server:** $(hostname)
**Documentation Location:** $DOC_DIR

## Overview
This documentation captures the complete production configuration of smilerentalphuket.com before migration to ensure accurate restoration if needed.

## Documentation Files Created
1. **system-information.md** - System hardware, OS, and basic configuration
2. **nginx-configuration.md** - Complete Nginx configuration and site setup
3. **pm2-configuration.md** - PM2 process management and application configuration
4. **ssl-configuration.md** - SSL certificate configuration and status
5. **application-configuration.md** - Application files, package.json, and environment setup
6. **network-configuration.md** - Network ports, firewall, and connectivity configuration

## Key Configuration Points
- **Application Path:** /var/www/smilerentalphuket.com/site-smile-rental
- **Web Server:** Nginx (reverse proxy)
- **Process Manager:** PM2
- **SSL Provider:** Let's Encrypt
- **Domain:** smilerentalphuket.com
- **Ports:** 80 (HTTP), 443 (HTTPS), 3000 (Application)

## Migration Reference
This documentation serves as the baseline configuration for:
1. Verifying post-migration configuration
2. Troubleshooting configuration issues
3. Emergency rollback procedures
4. Future maintenance and updates

## Security Note
Environment variables and sensitive configuration details are noted but not included in this documentation for security purposes.

**Documentation Generated:** $(date)
**Log File:** $LOG_FILE
EOF
    
    log_message "✅ Configuration summary created"
}

# Main documentation function
main() {
    log_message "📋 Starting production configuration documentation..."
    
    # Document all components
    document_system_info
    document_nginx_config
    document_pm2_config
    document_ssl_config
    document_application_config
    document_network_config
    
    # Create summary
    create_summary_document
    
    log_message "✅ Production configuration documentation completed!"
    log_message "📁 Documentation location: $DOC_DIR"
    log_message "📄 Summary file: $DOC_DIR/CONFIGURATION_SUMMARY.md"
}

# Execute documentation
main

echo ""
echo "🎉 PRODUCTION CONFIGURATION DOCUMENTED"
echo "======================================"
echo "📁 Documentation Directory: $DOC_DIR"
echo "📄 Summary: $DOC_DIR/CONFIGURATION_SUMMARY.md"
echo "📋 Log File: $LOG_FILE"
echo ""
echo "📋 Files Created:"
ls -la "$DOC_DIR"
echo ""
echo "✅ Configuration documentation ready for migration reference"
