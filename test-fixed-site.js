const { chromium } = require('playwright');

(async () => {
  console.log('🔧 ТЕСТИРОВАНИЕ ИСПРАВЛЕННОГО ПРОДАКШН САЙТА');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Собираем ошибки
  const consoleErrors = [];
  const failedRequests = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('response', response => {
    if (!response.ok()) {
      failedRequests.push({
        url: response.url(),
        status: response.status()
      });
    }
  });
  
  try {
    console.log('🌐 Переходим на https://smilerentalphuket.com...');
    await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'networkidle', 
      timeout: 25000 
    });
    
    // Базовая информация
    const title = await page.title();
    console.log('✅ Заголовок:', title);
    
    // Проверяем видимый контент
    const bodyText = await page.textContent('body');
    const visibleText = bodyText.replace(/\s+/g, ' ').trim();
    console.log('\n📝 Длина видимого текста:', visibleText.length, 'символов');
    
    // Проверяем ключевые элементы
    const hasMainHeading = await page.locator('h1').count();
    const hasScooterImages = await page.locator('img[alt*="scooter"]').count();
    const hasSocialButtons = await page.locator('a[href*="whatsapp"], a[href*="telegram"]').count();
    const hasContactInfo = await page.locator('text=+66').count();
    
    console.log('\n🔍 ПРОВЕРКА КЛЮЧЕВЫХ ЭЛЕМЕНТОВ:');
    console.log('  - Главные заголовки (h1):', hasMainHeading);
    console.log('  - Изображения скутеров:', hasScooterImages);
    console.log('  - Кнопки соц. сетей:', hasSocialButtons);
    console.log('  - Контактная информация:', hasContactInfo);
    
    // Проверяем стили
    const hasStyles = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const hasCustomFont = computedStyle.fontFamily !== 'Times New Roman';
      const hasBackground = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
      return {
        fontFamily: computedStyle.fontFamily,
        backgroundColor: computedStyle.backgroundColor,
        hasCustomFont,
        hasBackground
      };
    });
    
    console.log('\n🎨 СТИЛИ:');
    console.log('  - Шрифт:', hasStyles.fontFamily);
    console.log('  - Фон:', hasStyles.backgroundColor);
    console.log('  - Кастомные стили применены:', hasStyles.hasCustomFont || hasStyles.hasBackground);
    
    // Ошибки
    console.log('\n❌ ОШИБКИ КОНСОЛИ:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      consoleErrors.slice(0, 5).forEach(error => console.log('  -', error));
    }
    
    console.log('\n🚫 НЕУДАЧНЫЕ ЗАПРОСЫ:', failedRequests.length);
    if (failedRequests.length > 0) {
      failedRequests.slice(0, 5).forEach(req => 
        console.log('  -', req.status, req.url.substring(0, 80))
      );
    }
    
    // Скриншот после исправлений
    await page.screenshot({ 
      path: 'site-after-fixes.png', 
      fullPage: true 
    });
    console.log('\n📸 Скриншот после исправлений: site-after-fixes.png');
    
    // Итоговая оценка
    const isWorking = visibleText.length > 1000 && hasMainHeading > 0 && hasScooterImages > 0;
    console.log('\n🎯 ИТОГОВАЯ ОЦЕНКА:');
    console.log('  - Сайт функционален:', isWorking ? '✅ ДА' : '❌ НЕТ');
    console.log('  - Контент загружен:', visibleText.length > 1000 ? '✅ ДА' : '❌ НЕТ');
    console.log('  - Изображения есть:', hasScooterImages > 0 ? '✅ ДА' : '❌ НЕТ');
    console.log('  - Соц. кнопки есть:', hasSocialButtons > 0 ? '✅ ДА' : '❌ НЕТ');
    
  } catch (error) {
    console.log('❌ Ошибка тестирования:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
})().catch(console.error);
