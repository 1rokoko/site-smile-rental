const { chromium } = require('playwright');

(async () => {
  console.log('🔍 ПРОВЕРКА ЛОКАЛЬНОГО СЕРВЕРА НА ПОРТУ 3001');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Переходим на http://localhost:3001...');
    await page.goto('http://localhost:3001', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    const title = await page.title();
    const bodyText = await page.textContent('body');
    const visibleText = bodyText.replace(/\s+/g, ' ').trim();
    
    console.log('✅ ЛОКАЛЬНЫЙ СЕРВЕР РАБОТАЕТ НА ПОРТУ 3001!');
    console.log('📄 Заголовок:', title);
    console.log('📝 Длина текста:', visibleText.length, 'символов');
    console.log('📄 Первые 150 символов:', visibleText.substring(0, 150));
    
    // Проверяем ключевые элементы
    const hasScooters = await page.locator('img[alt*="scooter"]').count();
    const hasSocial = await page.locator('a[href*="whatsapp"]').count();
    const hasHeadings = await page.locator('h1').count();
    
    console.log('🛵 Изображения скутеров:', hasScooters);
    console.log('📱 Кнопки соц. сетей:', hasSocial);
    console.log('📰 Заголовки H1:', hasHeadings);
    
    // Делаем скриншот
    await page.screenshot({ 
      path: 'localhost-3001-working.png', 
      fullPage: true 
    });
    console.log('📸 Скриншот локального сайта: localhost-3001-working.png');
    
    console.log('\n🎯 РЕЗУЛЬТАТ:');
    console.log('✅ Локальный сервер: РАБОТАЕТ');
    console.log('🔗 URL: http://localhost:3001');
    console.log('📊 Функциональность:', visibleText.length > 1000 ? 'ПОЛНАЯ' : 'БАЗОВАЯ');
    
  } catch (error) {
    console.log('❌ Локальный сервер на порту 3001 недоступен:', error.message);
  }
  
  await browser.close();
})().catch(console.error);
