module.exports = {
  apps: [{
    name: 'smile-rental',
    script: '/var/www/smilerentalphuket.com/site-smile-rental/node_modules/.bin/next',
    args: 'start -p 3000',
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
    }
  }]
};
