@echo off
echo 🚀 ФИНАЛЬНОЕ РАЗВЕРТЫВАНИЕ ПОСЛЕ ОЧИСТКИ
echo.

echo Проверяем свободное место...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h"

echo.
echo Останавливаем PM2...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop all; pm2 delete all"

echo.
echo Собираем приложение...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Запускаем PM2...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

echo.
echo Проверяем статус...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 status"

echo.
echo Тестируем сайт...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "curl -I http://localhost:3000"

echo.
echo 🎉 САЙТ ЗАПУЩЕН!
echo 🌐 http://smilerentalphuket.com
pause
