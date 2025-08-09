# Простая проверка статуса сайта
Write-Host "🌐 ПРОВЕРКА СТАТУСА САЙТА" -ForegroundColor Green
Write-Host ""

# Проверяем основной сайт
Write-Host "🔍 Проверяем: http://smilerentalphuket.com" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "✅ Сайт доступен (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host "📄 Размер ответа: $($response.Content.Length) байт" -ForegroundColor White
} catch {
    Write-Host "❌ Сайт недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Проверяем HTTPS версию
Write-Host "🔍 Проверяем: https://smilerentalphuket.com" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "✅ HTTPS сайт доступен (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTPS сайт недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Проверяем доступность сервера
Write-Host "🔧 Проверяем доступность сервера 38.180.122.239..." -ForegroundColor Cyan
$pingResult = Test-Connection -ComputerName "38.180.122.239" -Count 2 -Quiet
if ($pingResult) {
    Write-Host "✅ Сервер доступен по ping" -ForegroundColor Green
} else {
    Write-Host "❌ Сервер недоступен по ping" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Следующий шаг: подключение к серверу для диагностики" -ForegroundColor Yellow
