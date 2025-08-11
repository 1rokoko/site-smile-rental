module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
