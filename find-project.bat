@echo off
echo Finding project directory on server...
echo.

echo Checking common locations...
ssh root@38.180.122.239 "find / -name 'site-smile-rental' -type d 2>/dev/null"

echo.
echo Checking PM2 process details...
ssh root@38.180.122.239 "pm2 show smile-rental"

echo.
echo Checking current working directory...
ssh root@38.180.122.239 "pwd && ls -la"

pause
