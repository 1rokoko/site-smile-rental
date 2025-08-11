@echo off
echo 🚀 РАЗВЕРТЫВАНИЕ С ОГРАНИЧЕНИЕМ ПАМЯТИ
echo.

echo Останавливаем PM2...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop all; pm2 delete all"

echo.
echo Собираем с ограничением памяти...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && NODE_OPTIONS='--max-old-space-size=512' npm run build"

echo.
echo Запускаем PM2...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

echo.
echo Проверяем статус...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 status"

echo.
echo 🎉 ГОТОВО!
pause
