# Автоматическое восстановление сайта в dev-режиме
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "🚀 ВОССТАНОВЛЕНИЕ САЙТА В DEV-РЕЖИМЕ..." -ForegroundColor Green
Write-Host "Server: $SERVER_IP" -ForegroundColor Cyan
Write-Host ""

# Функция для выполнения SSH команд
function Execute-SSH {
    param(
        [string]$Command,
        [string]$Description
    )

    if ($Description) {
        Write-Host "📋 $Description" -ForegroundColor Yellow
    }

    # Используем echo для передачи пароля через SSH
    $result = echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $Command

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Успешно" -ForegroundColor Green
        if ($result) {
            Write-Host $result -ForegroundColor White
        }
    } else {
        Write-Host "❌ Ошибка" -ForegroundColor Red
        if ($result) {
            Write-Host $result -ForegroundColor Red
        }
    }
    Write-Host ""
    return $result
}

# 1. Проверка текущего состояния
Write-Host "1️⃣ ПРОВЕРКА ТЕКУЩЕГО СОСТОЯНИЯ" -ForegroundColor Cyan
Execute-SSH "pm2 list" "Проверяем PM2 процессы"
Execute-SSH "curl -sI http://localhost:3000 | head -n 1" "Проверяем локальный порт 3000"

# 2. Переход в директорию проекта
Write-Host "2️⃣ ПЕРЕХОД В ДИРЕКТОРИЮ ПРОЕКТА" -ForegroundColor Cyan
Execute-SSH "cd /var/www/smilerentalphuket.com/site-smile-rental; pwd" "Переходим в директорию"

# 3. Остановка старых процессов
Write-Host "3️⃣ ОЧИСТКА СТАРЫХ ПРОЦЕССОВ" -ForegroundColor Cyan
Execute-SSH "pm2 delete all; echo 'Процессы удалены'" "Удаляем все PM2 процессы"

# 4. Запуск в dev-режиме
Write-Host "4️⃣ ЗАПУСК В DEV-РЕЖИМЕ" -ForegroundColor Cyan
Execute-SSH "cd /var/www/smilerentalphuket.com/site-smile-rental; pm2 start npm --name smile-rental-dev -- run dev" "Запускаем dev-сервер"
Execute-SSH "pm2 save" "Сохраняем конфигурацию PM2"

# 5. Проверка запуска
Write-Host "5️⃣ ПРОВЕРКА ЗАПУСКА" -ForegroundColor Cyan
Write-Host "Ждем 10 секунд для запуска..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Execute-SSH "pm2 list" "Статус PM2"
Execute-SSH "curl -sI http://127.0.0.1:3000 | head -n 3" "Проверяем локальный доступ"

# 6. Перезагрузка Nginx
Write-Host "6️⃣ ПЕРЕЗАГРУЗКА NGINX" -ForegroundColor Cyan
Execute-SSH "nginx -t" "Проверяем конфигурацию Nginx"
Execute-SSH "systemctl reload nginx" "Перезагружаем Nginx"

# 7. Финальная проверка
Write-Host "7️⃣ ФИНАЛЬНАЯ ПРОВЕРКА" -ForegroundColor Cyan
Execute-SSH "curl -sI https://smilerentalphuket.com | head -n 3" "Проверяем домен HTTPS"
Execute-SSH "curl -sI http://smilerentalphuket.com | head -n 3" "Проверяем домен HTTP"

Write-Host ""
Write-Host "🎉 ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host "Сайт должен быть доступен по адресу: https://smilerentalphuket.com" -ForegroundColor White
Write-Host ""
