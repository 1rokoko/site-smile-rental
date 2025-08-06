@echo off
echo Connecting to server...
echo.
echo Server: 38.180.122.239
echo Username: root
echo Password: 925LudK9Bv
echo.
echo Please run these commands manually after connecting:
echo.
echo 1. pm2 status
echo 2. pm2 stop all
echo 3. pm2 kill
echo 4. cd /var/www/smile-rental
echo 5. pm2 start ecosystem.config.js
echo 6. pm2 startup
echo 7. pm2 save
echo 8. systemctl restart nginx
echo.
ssh root@38.180.122.239
