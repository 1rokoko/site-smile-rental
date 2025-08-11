@echo off
echo 🔍 ПРОВЕРКА СЕРВЕРА И ОЧИСТКА МЕСТА
echo.

echo Проверяем место на диске...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h"

echo.
echo Проверяем размер директорий...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "du -sh /var/www/smilerentalphuket.com/site-smile-rental/.next.backup.*"

echo.
echo Удаляем старые бэкапы...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next.backup.*"

echo.
echo Очищаем npm cache...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "npm cache clean --force"

echo.
echo Проверяем место после очистки...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h"

echo.
echo ✅ ОЧИСТКА ЗАВЕРШЕНА
pause
