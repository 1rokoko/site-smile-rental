# Проверка места на сервере и очистка
$password = "925LudK9Bv"

Write-Host "🔍 ПРОВЕРКА МЕСТА НА СЕРВЕРЕ" -ForegroundColor Yellow
Write-Host ""

# Создаем временный файл с паролем для автоматического ввода
$tempFile = [System.IO.Path]::GetTempFileName()
$password | Out-File -FilePath $tempFile -Encoding ASCII

try {
    Write-Host "📊 Проверяем использование диска..." -ForegroundColor Cyan
    & ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h" < $tempFile
    
    Write-Host ""
    Write-Host "📁 Проверяем размер директорий..." -ForegroundColor Cyan
    & ssh -o StrictHostKeyChecking=no root@38.180.122.239 "du -sh /var/www/smilerentalphuket.com/site-smile-rental/*" < $tempFile
    
    Write-Host ""
    Write-Host "🗑️ Удаляем старые бэкапы .next..." -ForegroundColor Cyan
    & ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf .next.backup.*" < $tempFile
    
    Write-Host ""
    Write-Host "🧹 Очищаем npm cache..." -ForegroundColor Cyan
    & ssh -o StrictHostKeyChecking=no root@38.180.122.239 "npm cache clean --force" < $tempFile
    
    Write-Host ""
    Write-Host "📊 Проверяем место после очистки..." -ForegroundColor Cyan
    & ssh -o StrictHostKeyChecking=no root@38.180.122.239 "df -h" < $tempFile
    
} finally {
    # Удаляем временный файл
    Remove-Item -Path $tempFile -Force
}

Write-Host ""
Write-Host "✅ ПРОВЕРКА ЗАВЕРШЕНА" -ForegroundColor Green
