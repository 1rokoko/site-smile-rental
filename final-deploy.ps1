# Финальное развертывание сайта
Write-Host "🚀 ФИНАЛЬНОЕ РАЗВЕРТЫВАНИЕ САЙТА" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$server = "38.180.122.239"
$user = "root"
$keyPath = "$env:USERPROFILE\.ssh\smile_rental_key"

# Проверяем SSH ключ
if (Test-Path $keyPath) {
    Write-Host "✅ SSH ключ найден" -ForegroundColor Green
    
    # Пробуем подключиться с ключом
    Write-Host "🔑 Пробуем подключение с SSH ключом..." -ForegroundColor Cyan
    
    $commands = @(
        "echo 'Подключение успешно'",
        "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern",
        "pwd",
        "pm2 list",
        "git pull origin main",
        "npm install --production",
        "npm run build",
        "pm2 stop smile-rental || echo 'Приложение не было запущено'",
        "pm2 start npm --name smile-rental -- start",
        "pm2 save",
        "sleep 3",
        "pm2 list",
        "curl -I http://localhost:3000 || echo 'Локальная проверка не удалась'",
        "echo 'Развертывание завершено'"
    )
    
    foreach ($cmd in $commands) {
        Write-Host "📋 Выполняем: $cmd" -ForegroundColor Yellow
        try {
            $result = & ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i $keyPath $user@$server $cmd 2>&1
            if ($result) {
                Write-Host $result -ForegroundColor White
            }
            Start-Sleep -Seconds 1
        } catch {
            Write-Host "❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
        }
        Write-Host ""
    }
    
} else {
    Write-Host "❌ SSH ключ не найден" -ForegroundColor Red
    Write-Host "Используйте ручное подключение:" -ForegroundColor Yellow
    Write-Host "ssh root@$server" -ForegroundColor Cyan
}

Write-Host "🌐 Проверяем сайт..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "✅ Сайт работает! (HTTP $($response.StatusCode))" -ForegroundColor Green
    
    # Открываем сайт в браузере
    Write-Host "🌐 Открываем сайт в браузере..." -ForegroundColor Cyan
    Start-Process "http://smilerentalphuket.com"
    
} catch {
    Write-Host "❌ Сайт все еще не работает: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Возможно, нужно подождать или проверить развертывание вручную" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 ИТОГ:" -ForegroundColor Green
Write-Host "1. Проверьте сайт: http://smilerentalphuket.com" -ForegroundColor Cyan
Write-Host "2. Если не работает, используйте: .\connect-and-deploy.bat" -ForegroundColor Cyan
Write-Host "3. Для тестирования: .\test-site.ps1" -ForegroundColor Cyan
