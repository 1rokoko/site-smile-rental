#!/bin/bash

# Простой скрипт развертывания с автоматическим вводом пароля
PASSWORD="925LudK9Bv"
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

# 4. Переход в папку приложения и сборка
echo "4️⃣ СБОРКА ПРИЛОЖЕНИЯ"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm install" "Устанавливаем зависимости"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm run build" "Собираем проект"

# 5. Запуск приложения
echo "5️⃣ ЗАПУСК ПРИЛОЖЕНИЯ"
execute_ssh "pm2 stop smile-rental || echo 'Приложение не было запущено'" "Останавливаем старое приложение"
execute_ssh "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pm2 start npm --name smile-rental -- start" "Запускаем новое приложение"
execute_ssh "pm2 save" "Сохраняем конфигурацию PM2"

# 6. Проверка работы
echo "6️⃣ ПРОВЕРКА РАБОТЫ"
echo "Ждем 5 секунд для запуска приложения..."
sleep 5
execute_ssh "curl -I http://localhost:3000" "Проверяем локальный доступ"
execute_ssh "curl -I http://smilerentalphuket.com" "Проверяем доступ по домену"

# 7. Финальный статус
echo "7️⃣ ФИНАЛЬНЫЙ СТАТУС"
execute_ssh "pm2 list" "Статус PM2"
execute_ssh "systemctl status nginx --no-pager -l | head -5" "Статус Nginx"

echo "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!"
echo "Сайт должен быть доступен по адресу: http://smilerentalphuket.com"
echo ""
