@echo off
chcp 65001 > nul
echo ========================================
echo 🚨 АКТИВНОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ
echo ========================================
echo.

echo 🔍 Шаг 1: Проверяем текущий статус сайта...
curl -I https://smilerentalphuket.com
echo.

echo 🔧 Шаг 2: Подключаемся к серверу для исправления...
echo Пароль: 925LudK9Bv
echo.

echo Выполняем команды исправления...
ssh root@38.180.122.239 "echo '=== НАЧАЛО ИСПРАВЛЕНИЯ ===' && cd /var/www/smilerentalphuket.com/site-smile-rental && pwd && echo '=== ТЕКУЩИЙ СТАТУС PM2 ===' && pm2 status && echo '=== ОЧИСТКА PM2 ===' && pm2 delete all || echo 'Нет процессов для удаления' && echo '=== ПРОВЕРКА ФАЙЛОВ ===' && ls -la package.json ecosystem.config.js && echo '=== УСТАНОВКА ЗАВИСИМОСТЕЙ ===' && npm install && echo '=== СБОРКА ПРИЛОЖЕНИЯ ===' && npm run build && echo '=== ЗАПУСК PM2 ===' && pm2 start ecosystem.config.js && echo '=== ФИНАЛЬНЫЙ СТАТУС ===' && pm2 status && echo '=== ТЕСТ LOCALHOST ===' && curl -I http://localhost:3000 && echo '=== ИСПРАВЛЕНИЕ ЗАВЕРШЕНО ==="

echo.
echo ⏳ Ждем 10 секунд для стабилизации...
timeout /t 10 /nobreak > nul

echo.
echo 🧪 Шаг 3: Проверяем результат...
curl -I https://smilerentalphuket.com

echo.
echo ========================================
echo 🎯 РЕЗУЛЬТАТ ИСПРАВЛЕНИЯ
echo ========================================
pause
