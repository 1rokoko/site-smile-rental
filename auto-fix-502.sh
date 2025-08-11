#!/bin/bash
# НАДЕЖНОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ

echo "🔧 НАДЕЖНОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ"
echo "=================================="

# Переходим в директорию проекта
cd /var/www/smilerentalphuket.com/site-smile-rental || {
    echo "❌ Не удалось перейти в директорию проекта"
    exit 1
}
echo "📍 Текущая директория: $(pwd)"

# Останавливаем все PM2 процессы (без критических ошибок)
echo "🛑 Останавливаем PM2 процессы..."
pm2 delete all 2>/dev/null || echo "Нет процессов для остановки"

# Освобождаем порт 3000
echo "🔓 Освобождаем порт 3000..."
fuser -k 3000/tcp 2>/dev/null || echo "Порт 3000 свободен"

# Проверяем package.json
echo "📋 Проверяем package.json..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json не найден!"
    exit 1
fi

# Проверяем что зависимости установлены
echo "📦 Проверяем зависимости..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install || {
        echo "⚠️ npm install failed, trying alternative approach..."
        rm -rf node_modules package-lock.json
        npm install --legacy-peer-deps || exit 1
    }
fi

# Проверяем сборку
echo "🔨 Проверяем сборку..."
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
    echo "🔨 Собираем приложение..."
    rm -rf .next
    npm run build || {
        echo "❌ Сборка не удалась!"
        exit 1
    }
fi

echo "✅ Сборка готова! Проверяем содержимое .next..."
ls -la .next/ | head -5

# Запускаем через PM2 с простой конфигурацией
echo "🚀 Запускаем приложение через PM2..."

# Используем существующий ecosystem.config.js или создаем простой
if [ -f "ecosystem.config.js" ]; then
    echo "📝 Используем существующий ecosystem.config.js"
    pm2 start ecosystem.config.js || {
        echo "⚠️ Ошибка с ecosystem.config.js, используем простой запуск"
        pm2 start npm --name "smile-rental" -- start
    }
else
    echo "📝 Простой запуск через PM2"
    pm2 start npm --name "smile-rental" -- start
fi

# Ждем запуска
echo "⏳ Ждем запуска приложения..."
sleep 10

# Проверяем результат
echo "📊 Проверяем результат..."
pm2 status

echo "🔍 Проверяем порт 3000..."
if netstat -tlnp | grep :3000; then
    echo "✅ Порт 3000 занят приложением"
else
    echo "⚠️ Порт 3000 не занят"
fi

echo "🧪 Тестируем localhost..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Localhost отвечает"
else
    echo "⚠️ Localhost не отвечает"
    echo "📋 Проверяем логи PM2..."
    pm2 logs smile-rental --lines 5
fi

echo "✅ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
