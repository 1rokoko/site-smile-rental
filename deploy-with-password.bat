@echo off
echo Starting manual deployment to server...

REM Load credentials from .env.local
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="SERVER_IP" set SERVER_IP=%%b
    if "%%a"=="SERVER_USER" set SERVER_USER=%%b
    if "%%a"=="SERVER_PASSWORD" set SERVER_PASSWORD=%%b
)

echo Connecting to %SERVER_USER%@%SERVER_IP%

REM Create deployment script
echo #!/bin/bash > deploy_temp.sh
echo set -e >> deploy_temp.sh
echo cd /var/www/site-smile-rental >> deploy_temp.sh
echo echo "Starting deployment..." >> deploy_temp.sh
echo git fetch origin >> deploy_temp.sh
echo git reset --hard origin/main >> deploy_temp.sh
echo echo "Cleaning old build..." >> deploy_temp.sh
echo rm -rf .next >> deploy_temp.sh
echo echo "Installing dependencies..." >> deploy_temp.sh
echo npm ci --production >> deploy_temp.sh
echo echo "Building with increased memory..." >> deploy_temp.sh
echo export NODE_OPTIONS="--max-old-space-size=4096" >> deploy_temp.sh
echo npm run build >> deploy_temp.sh
echo if [ $? -eq 0 ]; then >> deploy_temp.sh
echo   echo "Build successful!" >> deploy_temp.sh
echo   pm2 stop smile-rental 2^>/dev/null ^|^| echo "App was not running" >> deploy_temp.sh
echo   pm2 delete smile-rental 2^>/dev/null ^|^| echo "App was not in PM2" >> deploy_temp.sh
echo   NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "smile-rental" -- start >> deploy_temp.sh
echo   pm2 save >> deploy_temp.sh
echo   echo "PM2 Status:" >> deploy_temp.sh
echo   pm2 status >> deploy_temp.sh
echo   echo "Deployment completed successfully!" >> deploy_temp.sh
echo else >> deploy_temp.sh
echo   echo "Build failed!" >> deploy_temp.sh
echo   exit 1 >> deploy_temp.sh
echo fi >> deploy_temp.sh

echo.
echo Script created. Now we need to copy it to server and execute.
echo You will need to enter the password: %SERVER_PASSWORD%
echo.

REM Copy script to server using scp (will prompt for password)
echo Copying script to server...
scp -o StrictHostKeyChecking=no deploy_temp.sh %SERVER_USER%@%SERVER_IP%:/tmp/

REM Execute script on server (will prompt for password again)
echo Executing deployment script...
ssh -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "chmod +x /tmp/deploy_temp.sh; /tmp/deploy_temp.sh"

REM Cleanup
del deploy_temp.sh

echo.
echo Deployment completed! Check site: http://smilerentalphuket.com
pause
