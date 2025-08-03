#!/bin/bash

# Простое обновление сайта из GitHub
echo "🔄 Обновляем сайт из GitHub..."

# Переходим в папку проекта
cd /var/www/smilerentalphuket.com/site-smile-rental

# Останавливаем сайт
echo "⏸️ Останавливаем сайт..."
sudo pm2 stop smile-rental

# Получаем последние изменения из GitHub
echo "📥 Загружаем изменения из GitHub..."
sudo git pull origin main

# Переходим в папку проекта
cd smile-rental-modern

# Устанавливаем новые зависимости (если есть)
echo "📦 Проверяем зависимости..."
sudo npm install

# Пересобираем проект
echo "🔨 Пересобираем проект..."
sudo npm run build

# Запускаем сайт
echo "🚀 Запускаем сайт..."
sudo pm2 start smile-rental

echo "✅ Обновление завершено!"
echo "🌐 Сайт обновлен и работает: http://smilerentalphuket.com"
echo ""
echo "📋 Проверить статус: sudo pm2 status"
