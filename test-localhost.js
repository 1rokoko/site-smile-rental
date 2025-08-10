const { chromium } = require('playwright');

(async () => {
  console.log('🔍 ПРОВЕРКА ЛОКАЛЬНОГО СЕРВЕРА');
  console.log('='.repeat(40));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Переходим на http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    const title = await page.title();
    const bodyText = await page.textContent('body');
    const visibleText = bodyText.replace(/\s+/g, ' ').trim();
    
    console.log('✅ ЛОКАЛЬНЫЙ СЕРВЕР РАБОТАЕТ!');
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
      path: 'localhost-working-confirmed.png', 
      fullPage: true 
    });
    console.log('📸 Скриншот локального сайта: localhost-working-confirmed.png');
    
    console.log('\n🎯 РЕЗУЛЬТАТ:');
    console.log('✅ Локальный сервер: РАБОТАЕТ');
    console.log('🔗 URL: http://localhost:3000');
    console.log('📊 Функциональность:', visibleText.length > 1000 ? 'ПОЛНАЯ' : 'БАЗОВАЯ');
    
  } catch (error) {
    console.log('❌ Локальный сервер недоступен:', error.message);
    console.log('🔧 Попробуем запустить сервер...');
    
    // Попробуем найти процесс на порту 3000
    const { execSync } = require('child_process');
    try {
      const result = execSync('netstat -ano | findstr :3000', { encoding: 'utf8' });
      console.log('🔍 Процессы на порту 3000:');
      console.log(result);
    } catch (e) {
      console.log('❌ Не удалось найти процессы на порту 3000');
    }
  }
  
  await browser.close();
})().catch(console.error);
