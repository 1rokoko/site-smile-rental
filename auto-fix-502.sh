#!/bin/bash
# Автоматическое исправление 502 ошибки

echo "🔧 АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ"
echo "========================================"

# Переходим в директорию проекта
cd /var/www/smilerentalphuket.com/site-smile-rental
echo "📍 Текущая директория: $(pwd)"

# Останавливаем все PM2 процессы
echo "🛑 Останавливаем все PM2 процессы..."
pm2 delete all || echo "Нет процессов для остановки"

# Убиваем все Node процессы
echo "🛑 Убиваем все Node процессы..."
pkill -f node || echo "Нет Node процессов"

# Освобождаем порт 3000
echo "🔓 Освобождаем порт 3000..."
fuser -k 3000/tcp || echo "Порт 3000 свободен"

# Проверяем package.json
echo "📋 Проверяем package.json..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json не найден!"
    exit 1
fi

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Проверяем что Next.js установлен
echo "🔍 Проверяем Next.js..."
if [ ! -f "node_modules/.bin/next" ]; then
    echo "❌ Next.js не найден в node_modules!"
    echo "Пытаемся установить Next.js..."
    npm install next
fi

# Собираем приложение
echo "🔨 Собираем приложение..."
npm run build

# Запускаем через PM2 с правильным путем
echo "🚀 Запускаем приложение через PM2..."
pm2 start node_modules/.bin/next --name smile-rental -- start -p 3000

# Проверяем результат
echo "📊 Проверяем результат..."
sleep 5
pm2 status

echo "🔍 Проверяем порт 3000..."
netstat -tlnp | grep :3000

echo "🧪 Тестируем localhost..."
curl -I http://localhost:3000

echo "✅ Автоматическое исправление завершено!"
