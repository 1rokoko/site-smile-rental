const { chromium } = require('playwright');

async function testSite() {
    console.log('🚀 Запуск браузерного тестирования...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Тест 1: Основной домен
        console.log('📍 Тестирую http://smilerentalphuket.com...');
        const response1 = await page.goto('http://smilerentalphuket.com', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        console.log(`✅ Статус: ${response1.status()}`);
        console.log(`📄 URL: ${page.url()}`);
        
        // Тест 2: Прямой IP на порту 80
        console.log('📍 Тестирую http://38.180.122.239...');
        const response2 = await page.goto('http://38.180.122.239', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        console.log(`✅ Статус: ${response2.status()}`);
        console.log(`📄 URL: ${page.url()}`);
        
        // Проверка содержимого
        const title = await page.title();
        console.log(`📋 Заголовок: ${title}`);
        
        // Скриншот
        await page.screenshot({ path: 'site-test-screenshot.png', fullPage: true });
        console.log('📸 Скриншот сохранен: site-test-screenshot.png');
        
        console.log('🎉 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО УСПЕШНО!');
        
    } catch (error) {
        console.error('❌ ОШИБКА:', error.message);
    } finally {
        await browser.close();
    }
}

testSite();
