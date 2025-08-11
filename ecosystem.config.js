module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',
    
    // Cluster configuration for better performance
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    
    // Memory and performance settings
    max_memory_restart: '512M', // Reduced from 1G to prevent memory bloat
    node_args: '--max-old-space-size=512',
    
    // Auto-restart configuration
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NODE_OPTIONS: '--max-old-space-size=512'
    },
    
    // Logging configuration
    log_file: '/var/log/pm2/smile-rental.log',
    out_file: '/var/log/pm2/smile-rental-out.log',
    error_file: '/var/log/pm2/smile-rental-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Performance monitoring
    pmx: true,
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 8000,
    
    // Health monitoring
    health_check_grace_period: 3000,
    
    // Advanced settings for better performance
    instance_var: 'INSTANCE_ID',
    combine_logs: true,
    
    // Restart delay to prevent rapid restarts
    restart_delay: 4000,
    
    // Exponential backoff restart delay
    exp_backoff_restart_delay: 100
  }]
};
