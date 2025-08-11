#!/bin/bash
# Автоматическое исправление развертывания
echo "🔧 Исправляем развертывание..."

# Создаем команды для выполнения на сервере
COMMANDS="
cd /var/www/smilerentalphuket.com/site-smile-rental
echo '📋 Текущая директория:'
pwd
echo '📋 Проверяем PM2 статус:'
pm2 status
echo '📋 Очищаем PM2 процессы:'
pm2 delete all || echo 'Нет процессов для удаления'
echo '📋 Проверяем package.json:'
ls -la package.json
echo '📋 Проверяем .next директорию:'
ls -la .next/
echo '🔨 Пересобираем приложение:'
npm run build
echo '🚀 Запускаем PM2:'
pm2 start npm --name smile-rental -- start
echo '✅ Проверяем статус:'
pm2 status
curl -I http://localhost:3000
echo '🎉 Готово!'
"

echo "Подключаемся к серверу..."
ssh -o StrictHostKeyChecking=no root@38.180.122.239 "$COMMANDS"
