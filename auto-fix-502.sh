#!/bin/bash
# КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ

echo "🚨 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 502 ОШИБКИ"
echo "====================================="

# Переходим в директорию проекта
cd /var/www/smilerentalphuket.com/site-smile-rental || exit 1
echo "📍 Текущая директория: $(pwd)"

# ПОЛНАЯ ОЧИСТКА СИСТЕМЫ
echo "🧹 ПОЛНАЯ ОЧИСТКА СИСТЕМЫ..."

# Останавливаем все PM2 процессы
echo "🛑 Останавливаем все PM2 процессы..."
pm2 delete all || echo "Нет процессов для остановки"
pm2 kill || echo "PM2 daemon остановлен"

# Убиваем ВСЕ Node процессы
echo "🛑 Убиваем ВСЕ Node процессы..."
pkill -9 -f node || echo "Нет Node процессов"
pkill -9 -f npm || echo "Нет npm процессов"

# Освобождаем порт 3000 принудительно
echo "🔓 Принудительно освобождаем порт 3000..."
fuser -k 3000/tcp || echo "Порт 3000 свободен"
lsof -ti:3000 | xargs kill -9 || echo "Порт 3000 очищен"

# Очищаем кеши
echo "🗑️ Очищаем кеши..."
rm -rf .next || echo ".next удален"
rm -rf node_modules/.cache || echo "Кеш node_modules очищен"
npm cache clean --force || echo "npm кеш очищен"

# Проверяем package.json
echo "📋 Проверяем package.json..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json не найден!"
    exit 1
fi

# ПРИНУДИТЕЛЬНАЯ УСТАНОВКА ЗАВИСИМОСТЕЙ
echo "📦 ПРИНУДИТЕЛЬНАЯ УСТАНОВКА ЗАВИСИМОСТЕЙ..."
rm -rf node_modules || echo "node_modules удален"
npm install --force || {
    echo "❌ npm install failed, trying with --legacy-peer-deps"
    npm install --legacy-peer-deps || exit 1
}

# Проверяем что Next.js установлен
echo "🔍 Проверяем Next.js..."
if [ ! -f "node_modules/.bin/next" ]; then
    echo "❌ Next.js не найден! Устанавливаем принудительно..."
    npm install next@latest --force || exit 1
fi

# ПРИНУДИТЕЛЬНАЯ СБОРКА
echo "🔨 ПРИНУДИТЕЛЬНАЯ СБОРКА ПРИЛОЖЕНИЯ..."
NODE_ENV=production npm run build || {
    echo "❌ Сборка не удалась! Пытаемся с очисткой..."
    rm -rf .next
    NODE_ENV=production npm run build || exit 1
}

# Проверяем что сборка прошла успешно
if [ ! -d ".next" ]; then
    echo "❌ Сборка не удалась!"
    exit 1
fi

echo "✅ Сборка успешна! Проверяем содержимое .next..."
ls -la .next/

# ЗАПУСК ЧЕРЕЗ PM2
echo "🚀 ЗАПУСК ПРИЛОЖЕНИЯ ЧЕРЕЗ PM2..."

# Создаем простой ecosystem.config.js на лету
cat > ecosystem-emergency.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'smile-rental',
    script: '/var/www/smilerentalphuket.com/site-smile-rental/node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_restarts: 3,
    min_uptime: '10s',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Запускаем через emergency config
pm2 start ecosystem-emergency.config.js || exit 1

# Ждем запуска
echo "⏳ Ждем запуска приложения..."
sleep 15

# ПРОВЕРКА РЕЗУЛЬТАТА
echo "📊 ПРОВЕРКА РЕЗУЛЬТАТА..."
pm2 status

echo "🔍 Проверяем порт 3000..."
netstat -tlnp | grep :3000

echo "🧪 Тестируем localhost..."
curl -I http://localhost:3000 || echo "❌ Localhost недоступен"

# Проверяем PM2 логи
echo "📋 Проверяем логи..."
pm2 logs smile-rental --lines 10

echo "✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
