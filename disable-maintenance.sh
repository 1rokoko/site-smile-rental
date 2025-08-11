#!/bin/bash
# Отключение maintenance page

echo "🔧 Отключение maintenance page..."

# Удаляем maintenance.html
rm -f /var/www/smilerentalphuket.com/site-smile-rental/public/maintenance.html

# Перезагружаем nginx
systemctl reload nginx

echo "✅ Maintenance page отключена!"
