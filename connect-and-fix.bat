@echo off
echo Connecting to server and fixing 502 error...

ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && echo '=== PM2 LOGS ===' && pm2 logs smile-rental --lines 10 && echo '=== CHECKING BUILD ===' && ls -la .next && echo '=== REBUILDING ===' && npm run build && echo '=== RESTARTING PM2 ===' && pm2 restart smile-rental && echo '=== CHECKING PORT ===' && netstat -tlnp | grep :3000 && echo '=== TESTING LOCALHOST ===' && curl -I http://localhost:3000"

pause
