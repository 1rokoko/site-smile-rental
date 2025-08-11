@echo off
echo ========================================
echo 🚨 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ СЕРВЕРА
echo ========================================
echo.
echo Сайт показывает только подвал из-за поврежденной сборки Next.js
echo Нужно вручную очистить сервер и пересобрать проект
echo.
echo Сервер: 38.180.122.239
echo Проект: /var/www/smilerentalphuket.com/site-smile-rental
echo.
echo КОМАНДЫ ДЛЯ РУЧНОГО ВЫПОЛНЕНИЯ:
echo.
echo 1. ssh root@38.180.122.239
echo 2. cd /var/www/smilerentalphuket.com/site-smile-rental
echo 3. pm2 stop all ^&^& pm2 delete all
echo 4. rm -rf .next out node_modules package-lock.json
echo 5. npm cache clean --force
echo 6. git fetch origin main ^&^& git reset --hard origin/main
echo 7. npm install
echo 8. NODE_ENV=production npm run build
echo 9. NODE_ENV=production pm2 start npm --name "smile-rental" -- start
echo 10. pm2 save
echo.
echo ========================================
echo После выполнения проверьте:
echo https://smilerentalphuket.com
echo ========================================
echo.
pause

echo.
echo Попытка автоматического подключения...
echo (Потребуется ввести пароль)
echo.

ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && echo 'Подключение успешно!' && echo 'Текущая папка:' && pwd && echo 'Статус PM2:' && pm2 status && echo 'Содержимое .next:' && ls -la .next/ | head -10"

echo.
echo ========================================
echo Если подключение не удалось, выполните
echo команды вручную через SSH клиент
echo ========================================
pause
