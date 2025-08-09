# РўРµСЃС‚РёСЂРѕРІР°РЅРёРµ СЃР°Р№С‚Р° РїРѕСЃР»Рµ СЂР°Р·РІРµСЂС‚С‹РІР°РЅРёСЏ
Write-Host "РўРµСЃС‚РёСЂРѕРІР°РЅРёРµ СЃР°Р№С‚Р°..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://smilerentalphuket.com" -TimeoutSec 10
    Write-Host "вњ… РЎР°Р№С‚ СЂР°Р±РѕС‚Р°РµС‚ (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host "рџ“„ Р Р°Р·РјРµСЂ РѕС‚РІРµС‚Р°: $($response.Content.Length) Р±Р°Р№С‚" -ForegroundColor White
    
    # Р—Р°РїСѓСЃРєР°РµРј Р±СЂР°СѓР·РµСЂ РґР»СЏ РІРёР·СѓР°Р»СЊРЅРѕР№ РїСЂРѕРІРµСЂРєРё
    Write-Host "рџЊђ РћС‚РєСЂС‹РІР°РµРј СЃР°Р№С‚ РІ Р±СЂР°СѓР·РµСЂРµ..." -ForegroundColor Cyan
    Start-Process "http://smilerentalphuket.com"
    
} catch {
    Write-Host "вќЊ РЎР°Р№С‚ РЅРµ СЂР°Р±РѕС‚Р°РµС‚: $($_.Exception.Message)" -ForegroundColor Red
}
