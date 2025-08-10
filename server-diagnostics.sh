#!/bin/bash

# Comprehensive Server Diagnostics Script for Node.js Deployment Issues
# Created to troubleshoot sudden Node.js startup failures on VPS

echo "🔍 COMPREHENSIVE SERVER DIAGNOSTICS"
echo "=================================="
echo "📅 Timestamp: $(date)"
echo "🖥️  Hostname: $(hostname)"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo "📋 $1"
    echo "$(printf '=%.0s' {1..50})"
}

# Function to run command with error handling
run_cmd() {
    local cmd="$1"
    local desc="$2"
    echo "🔸 $desc"
    echo "Command: $cmd"
    if eval "$cmd"; then
        echo "✅ Success"
    else
        echo "❌ Failed (Exit code: $?)"
    fi
    echo ""
}

# 1. SYSTEM OVERVIEW
print_section "SYSTEM OVERVIEW"
run_cmd "uname -a" "System information"
run_cmd "uptime" "System uptime and load"
run_cmd "whoami" "Current user"
run_cmd "pwd" "Current directory"

# 2. DISK SPACE ANALYSIS
print_section "DISK SPACE ANALYSIS"
run_cmd "df -h" "Disk space usage"
run_cmd "du -sh /var/www/* 2>/dev/null || echo 'No /var/www directory'" "Web directory sizes"
run_cmd "du -sh /tmp/* 2>/dev/null | head -10 || echo 'Temp directory check'" "Temp directory usage"
run_cmd "find /var/log -name '*.log' -size +100M 2>/dev/null || echo 'No large log files found'" "Large log files"

# 3. MEMORY ANALYSIS
print_section "MEMORY ANALYSIS"
run_cmd "free -h" "Memory usage"
run_cmd "cat /proc/meminfo | grep -E 'MemTotal|MemFree|MemAvailable|SwapTotal|SwapFree'" "Detailed memory info"
run_cmd "ps aux --sort=-%mem | head -10" "Top memory-consuming processes"

# 4. NODE.JS ENVIRONMENT
print_section "NODE.JS ENVIRONMENT"
run_cmd "which node" "Node.js location"
run_cmd "node --version" "Node.js version"
run_cmd "which npm" "NPM location"
run_cmd "npm --version" "NPM version"
run_cmd "which pm2" "PM2 location"
run_cmd "pm2 --version" "PM2 version"
run_cmd "echo \$NODE_ENV" "NODE_ENV variable"
run_cmd "echo \$PATH" "PATH variable"

# 5. PM2 STATUS
print_section "PM2 STATUS"
run_cmd "pm2 list" "PM2 process list"
run_cmd "pm2 info smile-rental 2>/dev/null || echo 'smile-rental process not found'" "Smile-rental process info"
run_cmd "pm2 logs --lines 20 2>/dev/null || echo 'No PM2 logs available'" "Recent PM2 logs"

# 6. NETWORK AND PORTS
print_section "NETWORK AND PORTS"
run_cmd "netstat -tlnp | grep -E ':80|:443|:3000'" "Port usage check"
run_cmd "ss -tlnp | grep -E ':80|:443|:3000'" "Socket statistics"
run_cmd "curl -I http://localhost:3000 2>/dev/null || echo 'Port 3000 not responding'" "Local port 3000 test"

# 7. NGINX STATUS
print_section "NGINX STATUS"
run_cmd "systemctl status nginx --no-pager" "Nginx service status"
run_cmd "nginx -t" "Nginx configuration test"
run_cmd "curl -I http://localhost 2>/dev/null || echo 'Nginx not responding'" "Local Nginx test"

# 8. PROJECT DIRECTORY STATUS
print_section "PROJECT DIRECTORY STATUS"
run_cmd "ls -la /var/www/smilerentalphuket.com/site-smile-rental/ 2>/dev/null || echo 'Project directory not found'" "Project directory listing"
run_cmd "ls -la /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern/ 2>/dev/null || echo 'App directory not found'" "App directory listing"
run_cmd "ls -la /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern/.next/ 2>/dev/null || echo 'Build directory not found'" "Build directory check"

# 9. SYSTEM LOGS
print_section "RECENT SYSTEM LOGS"
run_cmd "journalctl --since '2 days ago' --no-pager | grep -i -E 'error|fail|kill' | tail -20 || echo 'No recent error logs'" "Recent system errors"
run_cmd "dmesg | grep -i -E 'oom|kill|memory' | tail -10 || echo 'No OOM killer logs'" "OOM killer logs"

# 10. PROCESS ANALYSIS
print_section "PROCESS ANALYSIS"
run_cmd "ps aux | grep -E 'node|npm|pm2' | grep -v grep" "Node.js related processes"
run_cmd "pgrep -f node" "Node process IDs"

echo ""
echo "🏁 DIAGNOSTICS COMPLETED"
echo "========================"
echo "📅 Completed at: $(date)"
echo ""
echo "💡 NEXT STEPS:"
echo "1. Review disk space - if <10% free, clean up logs/cache"
echo "2. Check memory usage - if >90% used, investigate memory leaks"
echo "3. Verify Node.js installation - reinstall if version commands fail"
echo "4. Check PM2 status - restart PM2 daemon if needed"
echo "5. Test basic Node.js functionality with simple commands"
