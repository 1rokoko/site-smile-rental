# СРОЧНОЕ РАЗВЕРТЫВАНИЕ С АВТОМАТИЧЕСКИМ ПАРОЛЕМ
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "[REMOVED]"
$SERVER_PATH = "/var/www/smilerentalphuket.com/site-smile-rental"

Write-Host "🚨 СРОЧНОЕ РАЗВЕРТЫВАНИЕ" -ForegroundColor Red
Write-Host "🎯 Сервер: $SERVER_IP" -ForegroundColor Yellow
Write-Host ""

# Используем plink для Windows с автоматическим паролем
Write-Host "Шаг 1: Останавливаем PM2..." -ForegroundColor Cyan
& echo $SERVER_PASSWORD | plink -ssh -batch -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "pm2 stop all; pm2 delete all"

Write-Host ""
Write-Host "Шаг 2: Проверяем директорию..." -ForegroundColor Cyan
& echo $SERVER_PASSWORD | plink -ssh -batch -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "cd $SERVER_PATH; ls -la"

Write-Host ""
Write-Host "Шаг 3: Пересобираем приложение..." -ForegroundColor Cyan
& echo $SERVER_PASSWORD | plink -ssh -batch -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "cd $SERVER_PATH; npm run build"

Write-Host ""
Write-Host "Шаг 4: Запускаем PM2..." -ForegroundColor Cyan
& echo $SERVER_PASSWORD | plink -ssh -batch -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "cd $SERVER_PATH; pm2 start npm --name smile-rental -- start"

Write-Host ""
Write-Host "Шаг 5: Проверяем статус..." -ForegroundColor Cyan
& echo $SERVER_PASSWORD | plink -ssh -batch -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "pm2 status"

Write-Host ""
Write-Host "Шаг 6: Тестируем сайт..." -ForegroundColor Cyan
& echo $SERVER_PASSWORD | plink -ssh -batch -pw $SERVER_PASSWORD $SERVER_USER@$SERVER_IP "curl -I http://localhost:3000"

Write-Host ""
Write-Host "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host "🌐 Сайт: http://smilerentalphuket.com" -ForegroundColor Yellow
