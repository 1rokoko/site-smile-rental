#!/bin/bash
# Автоматическое исправление развертывания с паролем
export SSHPASS="925LudK9Bv"

echo "🔧 Исправляем развертывание..."

# Проверяем BUILD_ID
echo "📋 Проверяем сборку..."
sshpass -e ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && ls -la .next/ && cat .next/BUILD_ID 2>/dev/null || echo 'BUILD_ID не найден'"

# Пересобираем если нужно
echo "🔨 Пересобираем приложение..."
sshpass -e ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"

# Запускаем PM2 из правильной директории
echo "🚀 Запускаем PM2..."
sshpass -e ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental -- start"

# Проверяем статус
echo "✅ Проверяем статус..."
sshpass -e ssh -o StrictHostKeyChecking=no root@38.180.122.239 "pm2 status && curl -I http://localhost:3000"

echo "🎉 Готово!"
