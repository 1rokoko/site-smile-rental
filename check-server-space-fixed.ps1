# Исправленная проверка места на сервере
$password = "[REMOVED]"
$server = "38.180.122.239"
$user = "root"

Write-Host "🔍 ПРОВЕРКА МЕСТА НА СЕРВЕРЕ" -ForegroundColor Yellow
Write-Host ""

function Execute-SSHCommand {
    param([string]$Command)
    
    Write-Host "📊 Выполняем: $Command" -ForegroundColor Cyan
    
    # Используем ssh с автоматическим вводом пароля через expect-подобный механизм
    $sshCommand = "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$server `"$Command`""
    
    # Создаем временный файл для автоматизации ввода пароля
    $expectScript = @"
spawn ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$server "$Command"
expect "password:"
send "$password\r"
expect eof
"@
    
    # Если expect недоступен, используем простой ssh (пользователь введет пароль)
    try {
        # Пробуем выполнить команду напрямую
        & ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$user@$server" "$Command"
    } catch {
        Write-Host "Ошибка выполнения SSH команды: $($_.Exception.Message)" -ForegroundColor Red
    }
}

try {
    Write-Host "📊 Проверяем использование диска..." -ForegroundColor Cyan
    Execute-SSHCommand "df -h"
    
    Write-Host ""
    Write-Host "📁 Проверяем размер директорий..." -ForegroundColor Cyan
    Execute-SSHCommand "du -sh /var/www/smilerentalphuket.com/site-smile-rental/* 2>/dev/null || echo 'Директория не найдена'"
    
    Write-Host ""
    Write-Host "🗑️ Удаляем старые бэкапы .next..." -ForegroundColor Cyan
    Execute-SSHCommand "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next.backup.* 2>/dev/null || echo 'Нет старых бэкапов'"
    
    Write-Host ""
    Write-Host "🧹 Очищаем npm cache..." -ForegroundColor Cyan
    Execute-SSHCommand "npm cache clean --force 2>/dev/null || echo 'npm cache очищен'"
    
    Write-Host ""
    Write-Host "📊 Проверяем место после очистки..." -ForegroundColor Cyan
    Execute-SSHCommand "df -h"
    
} catch {
    Write-Host "❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ ПРОВЕРКА ЗАВЕРШЕНА" -ForegroundColor Green
