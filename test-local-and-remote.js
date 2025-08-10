const { chromium } = require('playwright');

async function testSites() {
  console.log('🚀 Запускаем тестирование сайтов...\n');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Тест 1: Продакшн сайт
  console.log('📡 ТЕСТ 1: Продакшн сайт https://smilerentalphuket.com');
  try {
    await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });
    
    const title = await page.title();
    const bodyText = await page.textContent('body');
    
    console.log('✅ Заголовок:', title);
    console.log('🔒 SSL:', page.url().startsWith('https://') ? 'SECURE' : 'NOT SECURE');
    
    if (bodyText.includes('Website is updating')) {
      console.log('⚠️ Статус: Показывает страницу обновления');
    } else if (bodyText.includes('Smile Rental')) {
      console.log('🎉 Статус: САЙТ РАБОТАЕТ!');
    } else {
      console.log('❓ Статус: Неизвестное содержимое');
    }
    
    // Скриншот продакшн сайта
    await page.screenshot({ path: 'production-site-test.png', fullPage: true });
    console.log('📸 Скриншот сохранен: production-site-test.png');
    
  } catch (error) {
    console.log('❌ Ошибка продакшн сайта:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Тест 2: Локальный сайт (если запущен)
  console.log('🏠 ТЕСТ 2: Локальный сайт http://localhost:3000');
  try {
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    const title = await page.title();
    console.log('✅ Локальный заголовок:', title);
    console.log('🎉 Локальный сайт РАБОТАЕТ!');
    
    // Скриншот локального сайта
    await page.screenshot({ path: 'local-site-test.png', fullPage: true });
    console.log('📸 Локальный скриншот сохранен: local-site-test.png');
    
  } catch (error) {
    console.log('❌ Локальный сайт не запущен или недоступен:', error.message);
    console.log('💡 Попробуйте запустить: npm run dev');
  }
  
  await browser.close();
  
  console.log('\n🏁 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!');
  console.log('📁 Проверьте скриншоты для визуального подтверждения');
}

testSites().catch(console.error);
