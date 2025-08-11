module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',

    // Simple single instance mode (no cluster for Next.js)
    instances: 1,
    exec_mode: 'fork',

    // Memory and performance settings
    max_memory_restart: '1G',

    // Auto-restart configuration
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',

    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },

    // Logging configuration
    log_file: '/var/log/pm2/smile-rental.log',
    out_file: '/var/log/pm2/smile-rental-out.log',
    error_file: '/var/log/pm2/smile-rental-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
