#!/bin/bash
# Автоматическое исправление 502 ошибки

echo "🔧 АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ"
echo "========================================"

# Переходим в директорию проекта
cd /var/www/smilerentalphuket.com/site-smile-rental
echo "📍 Текущая директория: $(pwd)"

# Проверяем PM2 логи для диагностики
echo "🔍 Проверяем PM2 логи..."
pm2 logs smile-rental --lines 10 || echo "Нет логов PM2"

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

# Проверяем существующую сборку
echo "🔍 Проверяем существующую сборку..."
if [ ! -d ".next" ]; then
    echo "⚠️ Директория .next не найдена, нужна пересборка"
fi

# Собираем приложение
echo "🔨 Собираем приложение..."
npm run build

# Проверяем что сборка прошла успешно
if [ ! -d ".next" ]; then
    echo "❌ Сборка не удалась!"
    exit 1
fi

# Запускаем через PM2 с абсолютным путем
echo "🚀 Запускаем приложение через PM2..."
pm2 start /var/www/smilerentalphuket.com/site-smile-rental/node_modules/.bin/next --name smile-rental -- start -p 3000

# Ждем запуска
echo "⏳ Ждем запуска приложения..."
sleep 10

# Проверяем результат
echo "📊 Проверяем результат..."
pm2 status

echo "🔍 Проверяем порт 3000..."
netstat -tlnp | grep :3000

echo "🧪 Тестируем localhost..."
curl -I http://localhost:3000

# Проверяем PM2 логи после запуска
echo "📋 Проверяем логи после запуска..."
pm2 logs smile-rental --lines 5

echo "✅ Автоматическое исправление завершено!"
