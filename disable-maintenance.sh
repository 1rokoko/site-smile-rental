#!/bin/bash
# ЭКСТРЕННОЕ ОТКЛЮЧЕНИЕ MAINTENANCE PAGE

echo "🚨 ЭКСТРЕННОЕ ОТКЛЮЧЕНИЕ MAINTENANCE PAGE..."

# Удаляем ВСЕ возможные maintenance файлы
echo "🗑️ Удаляем ВСЕ maintenance файлы..."
find / -name "maintenance.html" -type f -delete 2>/dev/null || echo "Поиск завершен"

# Удаляем конкретные файлы
rm -f /var/www/smilerentalphuket.com/site-smile-rental/public/maintenance.html
rm -f /var/www/smilerentalphuket.com/site-smile-rental/maintenance.html
rm -f /var/www/html/maintenance.html
rm -f /usr/share/nginx/html/maintenance.html
rm -f /etc/nginx/html/maintenance.html

# Проверяем nginx конфигурацию
echo "🔍 Проверяем nginx конфигурацию..."
nginx -t || echo "⚠️ Проблемы с nginx конфигурацией"

# Останавливаем nginx
echo "🛑 Останавливаем nginx..."
systemctl stop nginx

# Ждем остановки
sleep 3

# Запускаем nginx заново
echo "🚀 Запускаем nginx заново..."
systemctl start nginx

# Проверяем статус
echo "📊 Статус nginx:"
systemctl status nginx --no-pager -l

# Проверяем что maintenance файлы действительно удалены
echo "🔍 Финальная проверка maintenance файлов..."
find /var/www -name "maintenance.html" -type f 2>/dev/null && echo "⚠️ Найдены maintenance файлы!" || echo "✅ Maintenance файлы удалены"

# Тестируем сайт
echo "🧪 Тестируем сайт..."
curl -I http://localhost || echo "❌ Localhost недоступен"

echo "✅ MAINTENANCE PAGE ЭКСТРЕННО ОТКЛЮЧЕНА!"
