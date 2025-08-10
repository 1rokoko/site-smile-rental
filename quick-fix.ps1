# Быстрое восстановление сайта
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "🚀 БЫСТРОЕ ВОССТАНОВЛЕНИЕ САЙТА..." -ForegroundColor Green

# Команда 1: Проверка PM2
Write-Host "1. Проверяем PM2..." -ForegroundColor Cyan
$cmd1 = "pm2 list"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd1

# Команда 2: Удаление старых процессов
Write-Host "2. Удаляем старые процессы..." -ForegroundColor Cyan
$cmd2 = "pm2 delete all"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

# Команда 3: Переход в директорию и запуск dev
Write-Host "3. Запускаем dev-сервер..." -ForegroundColor Cyan
$cmd3 = "cd /var/www/smilerentalphuket.com/site-smile-rental && pm2 start npm --name smile-rental-dev -- run dev"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

# Команда 4: Сохранение PM2
Write-Host "4. Сохраняем PM2..." -ForegroundColor Cyan
$cmd4 = "pm2 save"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4

# Команда 5: Ждем и проверяем
Write-Host "5. Ждем 10 секунд..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "6. Проверяем локальный доступ..." -ForegroundColor Cyan
$cmd5 = "curl -I http://localhost:3000"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd5

# Команда 6: Перезагрузка Nginx
Write-Host "7. Перезагружаем Nginx..." -ForegroundColor Cyan
$cmd6 = "systemctl reload nginx"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd6

# Команда 7: Проверка домена
Write-Host "8. Проверяем домен..." -ForegroundColor Cyan
$cmd7 = "curl -I https://smilerentalphuket.com"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd7

Write-Host ""
Write-Host "✅ ГОТОВО!" -ForegroundColor Green
