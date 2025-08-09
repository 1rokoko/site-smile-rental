# Проверка статуса сайта
Write-Host "🌐 ПРОВЕРКА СТАТУСА САЙТА" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

$sites = @(
    "http://smilerentalphuket.com",
    "http://www.smilerentalphuket.com",
    "https://smilerentalphuket.com",
    "https://www.smilerentalphuket.com"
)

foreach ($site in $sites) {
    Write-Host "🔍 Проверяем: $site" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $site -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            Write-Host "✅ Сайт доступен (HTTP $statusCode)" -ForegroundColor Green
            Write-Host "📄 Размер ответа: $($response.Content.Length) байт" -ForegroundColor White
            
            # Проверяем, содержит ли ответ ключевые слова
            if ($response.Content -match "Smile Rental|scooter|rental") {
                Write-Host "✅ Контент корректный - найдены ключевые слова" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Возможно неправильный контент" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠️ Сайт отвечает с кодом: $statusCode" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Сайт недоступен: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host "🔧 Проверяем SSH подключение к серверу..." -ForegroundColor Cyan
try {
    # Простая проверка доступности сервера через ping
    $pingResult = Test-Connection -ComputerName "38.180.122.239" -Count 2 -Quiet
    if ($pingResult) {
        Write-Host "✅ Сервер 38.180.122.239 доступен по ping" -ForegroundColor Green
    } else {
        Write-Host "❌ Сервер 38.180.122.239 недоступен по ping" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка проверки сервера: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 РЕЗУЛЬТАТ ПРОВЕРКИ:" -ForegroundColor Yellow
Write-Host "Если сайт доступен - развертывание не требуется" -ForegroundColor White
Write-Host "Если сайт недоступен - нужно выполнить развертывание" -ForegroundColor White
