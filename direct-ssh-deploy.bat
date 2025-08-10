@echo off
echo Manual deployment to server...

REM Load credentials
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="SERVER_IP" set SERVER_IP=%%b
    if "%%a"=="SERVER_USER" set SERVER_USER=%%b
    if "%%a"=="SERVER_PASSWORD" set SERVER_PASSWORD=%%b
)

echo Connecting to %SERVER_USER%@%SERVER_IP%
echo Password: %SERVER_PASSWORD%
echo.

echo Creating deployment script...
echo cd /var/www/site-smile-rental > deploy.sh
echo git fetch origin >> deploy.sh
echo git reset --hard origin/main >> deploy.sh
echo rm -rf .next >> deploy.sh
echo npm ci --production >> deploy.sh
echo export NODE_OPTIONS="--max-old-space-size=4096" >> deploy.sh
echo npm run build >> deploy.sh
echo pm2 stop smile-rental 2^>/dev/null ^|^| echo "App stopped" >> deploy.sh
echo pm2 delete smile-rental 2^>/dev/null ^|^| echo "App deleted" >> deploy.sh
echo NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "smile-rental" -- start >> deploy.sh
echo pm2 save >> deploy.sh
echo pm2 status >> deploy.sh

echo.
echo Script created. Now you need to:
echo 1. Copy deploy.sh to server
echo 2. Execute it on server
echo.
echo Commands to run manually:
echo scp deploy.sh %SERVER_USER%@%SERVER_IP%:/tmp/
echo ssh %SERVER_USER%@%SERVER_IP% "chmod +x /tmp/deploy.sh; /tmp/deploy.sh"
echo.
echo Password for both commands: %SERVER_PASSWORD%
echo.

pause
