@echo off
echo Starting manual deployment to server...

REM Load credentials from .env.local
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="VPS_HOST" set VPS_HOST=%%b
    if "%%a"=="VPS_USERNAME" set VPS_USERNAME=%%b
    if "%%a"=="VPS_SSH_KEY_PATH" set VPS_SSH_KEY_PATH=%%b
)

echo Connecting to %VPS_USERNAME%@%VPS_HOST%

REM Create deployment script
echo cd /var/www/site-smile-rental > deploy_temp.sh
echo echo "Starting deployment..." >> deploy_temp.sh
echo git fetch origin >> deploy_temp.sh
echo git reset --hard origin/main >> deploy_temp.sh
echo rm -rf .next >> deploy_temp.sh
echo npm ci --production >> deploy_temp.sh
echo export NODE_OPTIONS="--max-old-space-size=4096" >> deploy_temp.sh
echo npm run build >> deploy_temp.sh
echo pm2 stop smile-rental 2^>/dev/null ^|^| echo "App was not running" >> deploy_temp.sh
echo pm2 delete smile-rental 2^>/dev/null ^|^| echo "App was not in PM2" >> deploy_temp.sh
echo NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "smile-rental" -- start >> deploy_temp.sh
echo pm2 save >> deploy_temp.sh
echo pm2 status >> deploy_temp.sh
echo echo "Deployment completed!" >> deploy_temp.sh

REM Copy and execute script on server
scp -i "%VPS_SSH_KEY_PATH%" -o StrictHostKeyChecking=no deploy_temp.sh %VPS_USERNAME%@%VPS_HOST%:/tmp/
ssh -i "%VPS_SSH_KEY_PATH%" -o StrictHostKeyChecking=no %VPS_USERNAME%@%VPS_HOST% "chmod +x /tmp/deploy_temp.sh; /tmp/deploy_temp.sh"

REM Cleanup
del deploy_temp.sh

echo.
echo Deployment completed! Check site: http://smilerentalphuket.com
pause
