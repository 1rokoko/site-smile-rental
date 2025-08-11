#!/bin/bash
# ПРОСТОЕ ОТКЛЮЧЕНИЕ MAINTENANCE - БЕЗ ОШИБОК

echo "🔧 ОТКЛЮЧЕНИЕ MAINTENANCE..."

# Удаляем maintenance файлы (игнорируем ошибки)
echo "🗑️ Удаляем maintenance файлы..."
rm -f /var/www/html/maintenance.html || true
rm -f /var/www/smilerentalphuket.com/maintenance.html || true
rm -f /var/www/smilerentalphuket.com/site-smile-rental/public/maintenance.html || true

# Перезагружаем nginx (игнорируем ошибки)
echo "🔄 Перезагружаем nginx..."
systemctl reload nginx || true

# Ждем
echo "⏳ Ждем 3 секунды..."
sleep 3

echo "✅ ГОТОВО!"
