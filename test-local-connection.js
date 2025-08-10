const { chromium } = require('playwright');
const http = require('http');

async function testLocalConnection() {
    console.log('🔍 ДИАГНОСТИКА ЛОКАЛЬНОГО ДОСТУПА К САЙТУ');
    console.log('=' .repeat(50));
    
    // Тест 1: HTTP запрос к IP
    console.log('📍 Тест 1: HTTP запрос к 38.180.122.239...');
    try {
        const response = await fetch('http://38.180.122.239', { 
            method: 'HEAD',
            timeout: 10000 
        });
        console.log(`✅ Статус: ${response.status}`);
        console.log(`📄 Headers:`, Object.fromEntries(response.headers));
    } catch (error) {
        console.log(`❌ Ошибка: ${error.message}`);
    }
    
    // Тест 2: HTTP запрос к домену
    console.log('\n📍 Тест 2: HTTP запрос к smilerentalphuket.com...');
    try {
        const response = await fetch('http://smilerentalphuket.com', { 
            method: 'HEAD',
            timeout: 10000 
        });
        console.log(`✅ Статус: ${response.status}`);
        console.log(`📄 Headers:`, Object.fromEntries(response.headers));
    } catch (error) {
        console.log(`❌ Ошибка: ${error.message}`);
    }
    
    // Тест 3: Браузерный тест
    console.log('\n📍 Тест 3: Браузерный доступ...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        const response = await page.goto('http://38.180.122.239', { 
            waitUntil: 'domcontentloaded',
            timeout: 15000 
        });
        console.log(`✅ Браузер статус: ${response.status()}`);
        console.log(`📄 URL: ${page.url()}`);
        
        const title = await page.title();
        console.log(`📋 Заголовок: ${title}`);
        
        // Скриншот для диагностики
        await page.screenshot({ path: 'local-test-screenshot.png' });
        console.log('📸 Скриншот сохранен: local-test-screenshot.png');
        
    } catch (error) {
        console.log(`❌ Браузер ошибка: ${error.message}`);
    } finally {
        await browser.close();
    }
    
    // Тест 4: Проверка портов
    console.log('\n📍 Тест 4: Проверка доступности портов...');
    const ports = [80, 3000, 443];
    
    for (const port of ports) {
        try {
            const response = await fetch(`http://38.180.122.239:${port}`, { 
                method: 'HEAD',
                timeout: 5000 
            });
            console.log(`✅ Порт ${port}: доступен (статус ${response.status})`);
        } catch (error) {
            console.log(`❌ Порт ${port}: недоступен (${error.message})`);
        }
    }
    
    console.log('\n🎯 ДИАГНОСТИКА ЗАВЕРШЕНА');
}

testLocalConnection();
