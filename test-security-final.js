const { chromium } = require('playwright');

(async () => {
  console.log('🔒 ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ БЕЗОПАСНОСТИ');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🎯 Переходим на SecurityHeaders.com...');
    await page.goto('https://securityheaders.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });
    
    console.log('✅ SecurityHeaders.com загружен');
    
    // Вводим URL для анализа
    console.log('📝 Вводим домен smilerentalphuket.com...');
    await page.fill('input[name="q"]', 'smilerentalphuket.com');
    await page.click('button[type="submit"]');
    
    console.log('⏳ Ожидание результатов анализа...');
    
    // Ждем результатов (увеличиваем время ожидания)
    await page.waitForTimeout(15000);
    
    try {
      // Пытаемся получить рейтинг
      const rating = await page.locator('.grade').first().textContent({ timeout: 5000 });
      console.log('🏆 РЕЙТИНГ SecurityHeaders.com:', rating);
      
      // Проверяем присутствующие заголовки
      const presentHeaders = await page.locator('.present').allTextContents();
      if (presentHeaders.length > 0) {
        console.log('\n✅ ПРИСУТСТВУЮЩИЕ ЗАГОЛОВКИ (' + presentHeaders.length + '):');
        presentHeaders.forEach((header, index) => {
          console.log(`  ${index + 1}. ${header}`);
        });
      }
      
      // Проверяем отсутствующие заголовки
      const missingHeaders = await page.locator('.missing').allTextContents();
      if (missingHeaders.length > 0) {
        console.log('\n⚠️ ОТСУТСТВУЮЩИЕ ЗАГОЛОВКИ (' + missingHeaders.length + '):');
        missingHeaders.forEach((header, index) => {
          console.log(`  ${index + 1}. ${header}`);
        });
      }
      
      // Создаем скриншот для задачи 3
      await page.screenshot({ 
        path: 'security-headers-a-b-rating.png', 
        fullPage: true 
      });
      console.log('\n📸 СКРИНШОТ СОЗДАН: security-headers-a-b-rating.png');
      
      // Оценка результата
      const isAorB = rating && (rating.includes('A') || rating.includes('B'));
      
      console.log('\n🎯 РЕЗУЛЬТАТ ЗАДАЧИ 3:');
      console.log('✅ SecurityHeaders.com протестирован');
      console.log('📊 Рейтинг:', rating || 'Не определен');
      console.log('📸 Скриншот создан: security-headers-a-b-rating.png');
      
      if (isAorB) {
        console.log('🎉 ЗАДАЧА 3 ВЫПОЛНЕНА НА 100%!');
        console.log('🏆 Достигнут рейтинг A/B');
      } else {
        console.log('⚠️ Рейтинг не достиг A/B уровня');
        console.log('💡 Возможно, требуются дополнительные заголовки');
      }
      
    } catch (error) {
      console.log('⚠️ Не удалось получить детальную информацию');
      console.log('💡 Возможно, сайт еще анализируется');
      
      // Все равно делаем скриншот
      await page.screenshot({ 
        path: 'security-headers-a-b-rating.png', 
        fullPage: true 
      });
      console.log('📸 Скриншот создан: security-headers-a-b-rating.png');
      
      console.log('\n🎯 РЕЗУЛЬТАТ ЗАДАЧИ 3:');
      console.log('✅ SecurityHeaders.com протестирован');
      console.log('📸 Скриншот создан');
      console.log('⚠️ Детальные результаты недоступны');
    }
    
  } catch (error) {
    console.log('❌ Ошибка тестирования безопасности:', error.message);
    
    // Попробуем создать скриншот текущего состояния
    try {
      await page.screenshot({ 
        path: 'security-headers-error.png', 
        fullPage: true 
      });
      console.log('📸 Скриншот ошибки: security-headers-error.png');
    } catch (screenshotError) {
      console.log('❌ Не удалось создать скриншот');
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 ТЕСТИРОВАНИЕ БЕЗОПАСНОСТИ ЗАВЕРШЕНО');
})().catch(console.error);
