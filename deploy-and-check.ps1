# Полный скрипт развертывания и проверки сайта
$password = "[REMOVED]"
$server = "38.180.122.239"
$user = "root"

Write-Host "🚀 АВТОМАТИЧЕСКОЕ РАЗВЕРТЫВАНИЕ САЙТА" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

function Execute-SSHCommand {
    param(
        [string]$Command,
        [string]$Description = ""
    )
    
    if ($Description) {
        Write-Host "📋 $Description" -ForegroundColor Cyan
    }
    
    # Создаем временный файл с паролем
    $tempFile = [System.IO.Path]::GetTempFileName()
    $password | Out-File -FilePath $tempFile -Encoding ASCII -NoNewline
    
    try {
        # Используем ssh с автоматическим вводом пароля
        $result = & cmd /c "type `"$tempFile`" | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=nul $user@$server `"$Command`" 2>&1"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Успешно выполнено" -ForegroundColor Green
            if ($result) {
                Write-Host $result -ForegroundColor White
            }
        } else {
            Write-Host "❌ Ошибка выполнения" -ForegroundColor Red
            if ($result) {
                Write-Host $result -ForegroundColor Yellow
            }
        }
        
        return $result
    } finally {
        Remove-Item -Path $tempFile -Force -ErrorAction SilentlyContinue
    }
}

# 1. Проверка места на диске
Write-Host "1️⃣ ПРОВЕРКА МЕСТА НА ДИСКЕ" -ForegroundColor Yellow
Execute-SSHCommand "df -h" "Проверяем свободное место"
Write-Host ""

# 2. Проверка статуса сервисов
Write-Host "2️⃣ ПРОВЕРКА СТАТУСА СЕРВИСОВ" -ForegroundColor Yellow
Execute-SSHCommand "systemctl status nginx --no-pager -l" "Проверяем Nginx"
Execute-SSHCommand "pm2 list" "Проверяем PM2 приложения"
Write-Host ""

# 3. Переход в директорию проекта и обновление
Write-Host "3️⃣ ОБНОВЛЕНИЕ ПРОЕКТА" -ForegroundColor Yellow
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && pwd" "Переходим в директорию проекта"
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && git status" "Проверяем статус Git"
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && git pull origin main" "Обновляем код из GitHub"
Write-Host ""

# 4. Переход в папку приложения и сборка
Write-Host "4️⃣ СБОРКА ПРИЛОЖЕНИЯ" -ForegroundColor Yellow
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm install" "Устанавливаем зависимости"
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && npm run build" "Собираем проект"
Write-Host ""

# 5. Запуск приложения
Write-Host "5️⃣ ЗАПУСК ПРИЛОЖЕНИЯ" -ForegroundColor Yellow
Execute-SSHCommand "pm2 stop smile-rental || echo 'Приложение не было запущено'" "Останавливаем старое приложение"
Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern && pm2 start npm --name smile-rental -- start" "Запускаем новое приложение"
Execute-SSHCommand "pm2 save" "Сохраняем конфигурацию PM2"
Write-Host ""

# 6. Проверка работы
Write-Host "6️⃣ ПРОВЕРКА РАБОТЫ" -ForegroundColor Yellow
Start-Sleep -Seconds 5
Execute-SSHCommand "curl -I http://localhost:3000" "Проверяем локальный доступ"
Execute-SSHCommand "curl -I http://smilerentalphuket.com" "Проверяем доступ по домену"
Write-Host ""

# 7. Финальный статус
Write-Host "7️⃣ ФИНАЛЬНЫЙ СТАТУС" -ForegroundColor Yellow
Execute-SSHCommand "pm2 list" "Статус PM2"
Execute-SSHCommand "systemctl status nginx --no-pager -l" "Статус Nginx"
Write-Host ""

Write-Host "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host "Сайт должен быть доступен по адресу: http://smilerentalphuket.com" -ForegroundColor Cyan
Write-Host ""
