#!/bin/bash

# Простой скрипт развертывания с автоматическим вводом пароля
PASSWORD="[REMOVED]"
SERVER="38.180.122.239"
USER="root"

echo "🚀 АВТОМАТИЧЕСКОЕ РАЗВЕРТЫВАНИЕ САЙТА"
echo "===================================="
echo ""

# Функция для выполнения SSH команд с автоматическим вводом пароля
execute_ssh() {
    local command="$1"
    local description="$2"
    
    if [ -n "$description" ]; then
        echo "📋 $description"
    fi
    
    # Используем sshpass для автоматического ввода пароля
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$USER@$SERVER" "$command"
    else
        # Если sshpass недоступен, используем expect
        expect -c "
            spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $USER@$SERVER \"$command\"
            expect \"password:\"
            send \"$PASSWORD\r\"
            expect eof
        "
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Успешно выполнено"
    else
        echo "❌ Ошибка выполнения"
    fi
    echo ""
}

# 1. Проверка места на диске
echo "1️⃣ ПРОВЕРКА МЕСТА НА ДИСКЕ"
execute_ssh "df -h" "Проверяем свободное место"

# 2. Проверка статуса сервисов
echo "2️⃣ ПРОВЕРКА СТАТУСА СЕРВИСОВ"
execute_ssh "systemctl status nginx --no-pager -l | head -10" "Проверяем Nginx"
execute_ssh "pm2 list" "Проверяем PM2 приложения"

# 3. Переход в директорию проекта и обновление
echo "3️⃣ ОБНОВЛЕНИЕ ПРОЕКТА"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental && pwd" "Переходим в директорию проекта"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental && git status" "Проверяем статус Git"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main" "Обновляем код из GitHub"

# 4. Запуск в dev режиме
echo "4️⃣ ЗАПУСК В DEV РЕЖИМЕ"
execute_ssh "pm2 delete all || echo 'Нет процессов для удаления'" "Удаляем все процессы"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start 'npm run dev' --name smile-rental-dev" "Запускаем dev сервер"
execute_ssh "pm2 save" "Сохраняем конфигурацию PM2"

# 5. Проверка работы
echo "5️⃣ ПРОВЕРКА РАБОТЫ"
echo "Ждем 10 секунд для запуска приложения..."
sleep 10
execute_ssh "curl -I http://localhost:3000" "Проверяем локальный доступ"
execute_ssh "systemctl reload nginx" "Перезагружаем Nginx"
execute_ssh "curl -I https://smilerentalphuket.com" "Проверяем доступ по домену"

# 6. Финальный статус
echo "6️⃣ ФИНАЛЬНЫЙ СТАТУС"
execute_ssh "pm2 list" "Статус PM2"
execute_ssh "systemctl status nginx --no-pager -l | head -5" "Статус Nginx"

echo "🎉 DEV СЕРВЕР ЗАПУЩЕН!"
echo "Сайт должен быть доступен по адресу: https://smilerentalphuket.com"
echo ""
