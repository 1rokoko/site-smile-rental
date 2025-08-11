#!/bin/bash
# Принудительное отключение maintenance page

echo "🔧 ПРИНУДИТЕЛЬНОЕ ОТКЛЮЧЕНИЕ MAINTENANCE PAGE..."

# Удаляем все возможные maintenance файлы
echo "🗑️ Удаляем maintenance файлы..."
rm -f /var/www/smilerentalphuket.com/site-smile-rental/public/maintenance.html
rm -f /var/www/smilerentalphuket.com/site-smile-rental/maintenance.html
rm -f /var/www/html/maintenance.html
rm -f /usr/share/nginx/html/maintenance.html

# Проверяем что файлы удалены
echo "🔍 Проверяем что maintenance файлы удалены..."
find /var/www -name "maintenance.html" -type f 2>/dev/null || echo "Maintenance файлы не найдены"

# Перезагружаем nginx
echo "🔄 Перезагружаем nginx..."
systemctl reload nginx

# Проверяем статус nginx
echo "📊 Статус nginx:"
systemctl status nginx --no-pager -l

echo "✅ Maintenance page принудительно отключена!"
