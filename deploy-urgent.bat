@echo off
echo 🚨 СРОЧНОЕ РАЗВЕРТЫВАНИЕ САЙТА
echo 🎯 Сервер: 38.180.122.239
echo.

echo Шаг 1: Останавливаем PM2...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 stop all; pm2 delete all"

echo.
echo Шаг 2: Проверяем директорию...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && ls -la"

echo.
echo Шаг 3: Пересобираем приложение...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

echo.
echo Шаг 4: Запускаем PM2...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

echo.
echo Шаг 5: Проверяем статус...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 status"

echo.
echo Шаг 6: Тестируем сайт...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "curl -I http://localhost:3000"

echo.
echo 🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!
echo 🌐 Сайт: http://smilerentalphuket.com
pause
