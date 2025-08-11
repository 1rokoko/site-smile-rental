@echo off
echo 🚨 ЭКСТРЕННАЯ ОЧИСТКА СЕРВЕРА - ДИСК ЗАПОЛНЕН НА 99%%
echo.

echo Шаг 1: Очищаем Docker...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "docker system prune -af"

echo.
echo Шаг 2: Удаляем старые бэкапы...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next.backup.*"

echo.
echo Шаг 3: Очищаем логи...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "journalctl --vacuum-time=7d"

echo.
echo Шаг 4: Очищаем apt cache...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "apt clean && apt autoremove -y"

echo.
echo Шаг 5: Проверяем место после очистки...
echo [REMOVED] | ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h"

echo.
echo ✅ ЭКСТРЕННАЯ ОЧИСТКА ЗАВЕРШЕНА
pause
