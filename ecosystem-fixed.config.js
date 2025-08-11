module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'run start',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_restarts: 5,
    min_uptime: '5s',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Ensure npm can find next
    interpreter: 'none',
    // Add PATH to find local node_modules
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      PATH: '/var/www/smilerentalphuket.com/site-smile-rental/node_modules/.bin:' + process.env.PATH
    }
  }]
};
