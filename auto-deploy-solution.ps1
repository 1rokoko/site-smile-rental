# Автоматическое решение для развертывания сайта
Write-Host "=== АВТОМАТИЧЕСКОЕ РАЗВЕРТЫВАНИЕ САЙТА ===" -ForegroundColor Green
Write-Host ""

# Проверяем статус сайта
Write-Host "1. Проверяем текущий статус сайта..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Сайт доступен (HTTP $($response.StatusCode))" -ForegroundColor Green
    $siteWorking = $true
} catch {
    Write-Host "❌ Сайт недоступен: $($_.Exception.Message)" -ForegroundColor Red
    $siteWorking = $false
}

Write-Host ""

if ($siteWorking) {
    Write-Host "🎉 САЙТ УЖЕ РАБОТАЕТ!" -ForegroundColor Green
    Write-Host "Развертывание не требуется" -ForegroundColor Cyan
} else {
    Write-Host "🔧 ТРЕБУЕТСЯ РАЗВЕРТЫВАНИЕ" -ForegroundColor Yellow
    Write-Host ""
    
    # Создаем простой SSH скрипт для выполнения
    $deployScript = @"
#!/bin/bash
echo "=== АВТОМАТИЧЕСКОЕ РАЗВЕРТЫВАНИЕ ==="
echo ""

echo "1. Проверяем статус PM2..."
pm2 list

echo ""
echo "2. Переходим в директорию проекта..."
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern

echo ""
echo "3. Обновляем код из GitHub..."
git pull origin main

echo ""
echo "4. Устанавливаем зависимости..."
npm install

echo ""
echo "5. Собираем проект..."
npm run build

echo ""
echo "6. Перезапускаем приложение..."
pm2 stop smile-rental || echo "Приложение не было запущено"
pm2 start npm --name smile-rental -- start
pm2 save

echo ""
echo "7. Проверяем статус..."
pm2 list

echo ""
echo "8. Тестируем сайт..."
sleep 5
curl -I http://localhost:3000

echo ""
echo "=== РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО ==="
"@

    # Сохраняем скрипт
    $deployScript | Out-File -FilePath "deploy-on-server.sh" -Encoding UTF8
    
    Write-Host "📝 Создан скрипт развертывания: deploy-on-server.sh" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🚀 ДЛЯ РАЗВЕРТЫВАНИЯ ВЫПОЛНИТЕ:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Подключитесь к серверу:" -ForegroundColor White
    Write-Host "   ssh root@38.180.122.239" -ForegroundColor Cyan
    Write-Host "   (пароль: 925LudK9Bv)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Скопируйте и выполните команды:" -ForegroundColor White
    Write-Host "   cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern" -ForegroundColor Cyan
    Write-Host "   ./update-site.sh" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ИЛИ выполните команды по одной:" -ForegroundColor White
    Write-Host "   pm2 list" -ForegroundColor Cyan
    Write-Host "   git pull origin main" -ForegroundColor Cyan
    Write-Host "   npm install" -ForegroundColor Cyan
    Write-Host "   npm run build" -ForegroundColor Cyan
    Write-Host "   pm2 restart smile-rental" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "📋 ПОСЛЕ РАЗВЕРТЫВАНИЯ:" -ForegroundColor Yellow
Write-Host "1. Проверьте сайт: http://smilerentalphuket.com" -ForegroundColor Cyan
Write-Host "2. Запустите тестирование браузером" -ForegroundColor Cyan
Write-Host ""

# Создаем скрипт для тестирования
Write-Host "📝 Создаю скрипт для тестирования..." -ForegroundColor Cyan

$testScript = @"
# Тестирование сайта после развертывания
Write-Host "Тестирование сайта..." -ForegroundColor Green

try {
    `$response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "✅ Сайт работает (HTTP `$(`$response.StatusCode))" -ForegroundColor Green
    Write-Host "📄 Размер ответа: `$(`$response.Content.Length) байт" -ForegroundColor White
    
    # Запускаем браузер для визуальной проверки
    Write-Host "🌐 Открываем сайт в браузере..." -ForegroundColor Cyan
    Start-Process "http://smilerentalphuket.com"
    
} catch {
    Write-Host "❌ Сайт не работает: `$(`$_.Exception.Message)" -ForegroundColor Red
}
"@

$testScript | Out-File -FilePath "test-site.ps1" -Encoding UTF8

Write-Host "✅ Создан скрипт тестирования: test-site.ps1" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Green
Write-Host "1. Выполните развертывание на сервере (инструкции выше)" -ForegroundColor White
Write-Host "2. Запустите: powershell -ExecutionPolicy Bypass -File test-site.ps1" -ForegroundColor Cyan
Write-Host "3. Проверьте сайт в браузере" -ForegroundColor White
