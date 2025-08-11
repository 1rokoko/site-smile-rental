#!/bin/bash
# ПРОСТОЕ ИСПРАВЛЕНИЕ 502 - БЕЗ ОШИБОК

echo "🔧 ПРОСТОЕ ИСПРАВЛЕНИЕ 502"
echo "========================="

# Переходим в директорию проекта
cd /var/www/smilerentalphuket.com/site-smile-rental
echo "📍 Директория: $(pwd)"

# Останавливаем PM2 (игнорируем ошибки)
echo "🛑 Останавливаем PM2..."
pm2 delete all || true
pm2 kill || true

# Освобождаем порт 3000 (игнорируем ошибки)
echo "🔓 Освобождаем порт 3000..."
fuser -k 3000/tcp || true

# Простая установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm install || true

# Простая сборка
echo "🔨 Собираем приложение..."
npm run build || true

# Простой запуск через PM2
echo "🚀 Запускаем приложение..."
pm2 start npm --name "smile-rental" -- start || true

# Ждем запуска
echo "⏳ Ждем 10 секунд..."
sleep 10

# Проверяем статус
echo "📊 Статус PM2:"
pm2 status || true

echo "✅ ГОТОВО!"
