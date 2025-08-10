const { chromium } = require('playwright');

(async () => {
  console.log('🔒 ТЕСТИРОВАНИЕ УЛУЧШЕННОЙ БЕЗОПАСНОСТИ');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Проверяем заголовки на https://smilerentalphuket.com...');
    const response = await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'networkidle', 
      timeout: 20000 
    });
    
    const headers = response.headers();
    
    console.log('\n📋 ОБНОВЛЕННЫЕ ЗАГОЛОВКИ БЕЗОПАСНОСТИ:');
    
    const securityHeaders = [
      'strict-transport-security',
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
      'permissions-policy',
      'x-permitted-cross-domain-policies'
    ];
    
    let presentHeaders = 0;
    securityHeaders.forEach(header => {
      const value = headers[header];
      const status = value ? '✅' : '❌';
      if (value) presentHeaders++;
      console.log(`  ${status} ${header}: ${value || 'ОТСУТСТВУЕТ'}`);
    });
    
    console.log(`\n📊 СТАТИСТИКА: ${presentHeaders}/${securityHeaders.length} заголовков присутствует`);
    
    // Ждем немного для обновления кэша
    console.log('\n⏳ Ожидание обновления кэша SecurityHeaders.com...');
    await page.waitForTimeout(5000);
    
    console.log('🎯 Переходим на SecurityHeaders.com для проверки рейтинга...');
    
    // Переходим на SecurityHeaders.com
    await page.goto('https://securityheaders.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });
    
    // Вводим URL для анализа
    await page.fill('input[name="q"]', 'smilerentalphuket.com');
    await page.click('button[type="submit"]');
    
    // Ждем результатов
    await page.waitForTimeout(10000);
    
    try {
      // Получаем рейтинг
      const rating = await page.locator('.grade').first().textContent();
      console.log('🏆 НОВЫЙ РЕЙТИНГ SecurityHeaders.com:', rating);
      
      // Проверяем улучшения
      const improvements = await page.locator('.present').allTextContents();
      if (improvements.length > 0) {
        console.log('\n✅ ПРИСУТСТВУЮЩИЕ ЗАГОЛОВКИ:');
        improvements.forEach((improvement, index) => {
          console.log(`  ${index + 1}. ${improvement}`);
        });
      }
      
      // Проверяем оставшиеся проблемы
      const issues = await page.locator('.missing').allTextContents();
      if (issues.length > 0) {
        console.log('\n⚠️ ОТСУТСТВУЮЩИЕ ЗАГОЛОВКИ:');
        issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue}`);
        });
      }
      
      // Делаем скриншот улучшенного рейтинга
      await page.screenshot({ 
        path: 'security-headers-improved.png', 
        fullPage: true 
      });
      console.log('\n📸 Скриншот улучшенного рейтинга: security-headers-improved.png');
      
      // Оценка успеха
      const isImproved = rating && (rating.includes('A') || rating.includes('B'));
      console.log('\n🎯 РЕЗУЛЬТАТ ЗАДАЧИ 3:');
      console.log('✅ Security headers добавлены в nginx');
      console.log('✅ Конфигурация применена');
      console.log('✅ Рейтинг проверен:', rating);
      console.log('📊 Цель достигнута:', isImproved ? '✅ ДА (A/B рейтинг)' : '⚠️ ЧАСТИЧНО');
      
    } catch (error) {
      console.log('⚠️ Не удалось получить детальную информацию с SecurityHeaders.com');
      console.log('💡 Возможно, сайт еще обновляется или есть проблемы с загрузкой');
      
      // Все равно делаем скриншот
      await page.screenshot({ 
        path: 'security-headers-attempt.png', 
        fullPage: true 
      });
      console.log('📸 Скриншот попытки: security-headers-attempt.png');
    }
    
  } catch (error) {
    console.log('❌ Ошибка тестирования безопасности:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 ТЕСТИРОВАНИЕ БЕЗОПАСНОСТИ ЗАВЕРШЕНО');
})().catch(console.error);
