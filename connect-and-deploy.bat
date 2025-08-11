@echo off
echo ========================================
echo ПОДКЛЮЧЕНИЕ К СЕРВЕРУ И РАЗВЕРТЫВАНИЕ
echo ========================================
echo.

echo Подключаемся к серверу...
echo Сервер: 38.180.122.239
echo Пользователь: root
echo Пароль: [REMOVED]
echo.

echo После подключения выполните команды:
echo.
echo cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
echo ./update-site.sh
echo.
echo ИЛИ по одной:
echo pm2 list
echo git pull origin main
echo npm install
echo npm run build
echo pm2 restart smile-rental
echo.

echo Подключение...
ssh root@38.180.122.239
