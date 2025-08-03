#!/bin/bash

# Простая установка сайта Smile Rental
echo "🚀 Начинаем установку сайта Smile Rental..."

# Переходим в папку проекта
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
sudo npm install

# Собираем проект
echo "🔨 Собираем проект..."
sudo npm run build

# Создаем конфигурацию Nginx
echo "⚙️ Настраиваем Nginx..."
sudo tee /etc/nginx/sites-available/smile-rental > /dev/null <<EOF
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Активируем конфигурацию
sudo ln -sf /etc/nginx/sites-available/smile-rental /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию Nginx
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx

# Создаем конфигурацию PM2
sudo tee /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Запускаем приложение через PM2
echo "🚀 Запускаем сайт..."
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup

echo "✅ Установка завершена!"
echo "🌐 Сайт доступен по адресу: http://smilerentalphuket.com"
echo ""
echo "📋 Полезные команды:"
echo "   Проверить статус: sudo pm2 status"
echo "   Посмотреть логи: sudo pm2 logs smile-rental"
echo "   Перезапустить: sudo pm2 restart smile-rental"
