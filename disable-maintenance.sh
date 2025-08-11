#!/bin/bash
# ПРОСТОЕ ОТКЛЮЧЕНИЕ MAINTENANCE PAGE

echo "🔧 ОТКЛЮЧЕНИЕ MAINTENANCE PAGE..."

# Удаляем основные maintenance файлы
echo "🗑️ Удаляем maintenance файлы..."
rm -f /var/www/html/maintenance.html
rm -f /var/www/smilerentalphuket.com/maintenance.html
rm -f /var/www/smilerentalphuket.com/site-smile-rental/public/maintenance.html

# Проверяем nginx конфигурацию
echo "🔍 Проверяем nginx..."
if nginx -t; then
    echo "✅ Nginx конфигурация корректна"
    echo "🔄 Перезагружаем nginx..."
    systemctl reload nginx
else
    echo "⚠️ Проблемы с nginx, перезапускаем..."
    systemctl restart nginx
fi

# Ждем применения изменений
sleep 3

# Проверяем статус nginx
echo "📊 Статус nginx:"
systemctl is-active nginx

# Проверяем что maintenance файлы удалены
echo "🔍 Проверяем что maintenance файлы удалены..."
if find /var/www -name "maintenance.html" -type f 2>/dev/null | grep -q .; then
    echo "⚠️ Найдены maintenance файлы!"
else
    echo "✅ Maintenance файлы удалены"
fi

# Тестируем сайт
echo "🧪 Тестируем сайт..."
if curl -f -s http://localhost > /dev/null; then
    echo "✅ Localhost отвечает"
else
    echo "⚠️ Localhost не отвечает"
fi

echo "✅ MAINTENANCE PAGE ОТКЛЮЧЕНА!"
