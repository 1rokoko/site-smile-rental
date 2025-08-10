const { chromium } = require('playwright');

(async () => {
  console.log('🖼️ ТЕСТИРОВАНИЕ ИСПРАВЛЕННЫХ ИЗОБРАЖЕНИЙ');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Переходим на https://smilerentalphuket.com...');
    await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    const title = await page.title();
    console.log('✅ Сайт загружен:', title);
    
    // Ждем загрузки контента
    await page.waitForTimeout(5000);
    
    // Проверяем все изображения на странице
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        alt: img.alt || 'no alt',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        tagName: img.tagName,
        className: img.className
      }))
    );
    
    console.log('\n🖼️ АНАЛИЗ ИЗОБРАЖЕНИЙ (' + images.length + ' найдено):');
    
    let workingImages = 0;
    let brokenImages = 0;
    
    images.forEach((img, index) => {
      const isWorking = img.complete && img.naturalWidth > 0;
      const status = isWorking ? '✅' : '❌';
      
      if (isWorking) workingImages++;
      else brokenImages++;
      
      console.log(`  ${index + 1}. ${status} ${img.src}`);
      console.log(`     Alt: "${img.alt}", Размер: ${img.naturalWidth}x${img.naturalHeight}`);
      console.log(`     Тег: ${img.tagName}, Класс: ${img.className}`);
    });
    
    // Проверяем конкретно изображения скутеров
    const scooterImages = images.filter(img => 
      img.alt.toLowerCase().includes('scooter') || 
      img.src.includes('/scooters/') ||
      img.alt.toLowerCase().includes('nmax') ||
      img.alt.toLowerCase().includes('filano') ||
      img.alt.toLowerCase().includes('gpx')
    );
    
    console.log('\n🛵 ИЗОБРАЖЕНИЯ СКУТЕРОВ (' + scooterImages.length + '):');
    scooterImages.forEach((img, index) => {
      const isWorking = img.complete && img.naturalWidth > 0;
      const status = isWorking ? '✅ РАБОТАЕТ' : '❌ НЕ РАБОТАЕТ';
      console.log(`  ${index + 1}. ${status}`);
      console.log(`     URL: ${img.src}`);
      console.log(`     Alt: "${img.alt}"`);
    });
    
    // Проверяем прямой доступ к изображениям
    console.log('\n🔗 ПРОВЕРКА ПРЯМОГО ДОСТУПА К ИЗОБРАЖЕНИЯМ:');
    const testImages = [
      '/images/scooters/nmax.jpg',
      '/images/scooters/filano.jpg',
      '/images/scooters/gpx150.jpg',
      '/images/trustpilot-reviews.png'
    ];
    
    for (const imagePath of testImages) {
      try {
        const response = await page.goto(`https://smilerentalphuket.com${imagePath}`, { timeout: 10000 });
        const status = response.status();
        console.log(`  ${status === 200 ? '✅' : '❌'} ${imagePath} - HTTP ${status}`);
      } catch (error) {
        console.log(`  ❌ ${imagePath} - Ошибка: ${error.message}`);
      }
    }
    
    // Возвращаемся на главную страницу
    await page.goto('https://smilerentalphuket.com', { waitUntil: 'domcontentloaded' });
    
    // Делаем скриншот для задачи 2
    await page.screenshot({ 
      path: 'production-images-restored.png', 
      fullPage: true 
    });
    console.log('\n📸 СКРИНШОТ СОЗДАН: production-images-restored.png');
    
    // Итоговая оценка
    console.log('\n🎯 РЕЗУЛЬТАТ ЗАДАЧИ 2:');
    console.log('📊 Статистика изображений:');
    console.log('  - Всего изображений:', images.length);
    console.log('  - Работающих:', workingImages);
    console.log('  - Сломанных:', brokenImages);
    console.log('  - Изображений скутеров:', scooterImages.length);
    
    const successRate = Math.round((workingImages / images.length) * 100);
    console.log('📈 Процент успеха:', successRate + '%');
    
    if (workingImages > 0) {
      console.log('🎉 ЗАДАЧА 2 ЧАСТИЧНО ВЫПОЛНЕНА!');
      console.log('✅ Сайт работает');
      console.log('✅ Скриншот создан');
      if (workingImages === images.length) {
        console.log('🎉 ВСЕ ИЗОБРАЖЕНИЯ ВОССТАНОВЛЕНЫ!');
      } else {
        console.log('⚠️ Некоторые изображения все еще не работают');
      }
    } else {
      console.log('⚠️ Изображения все еще не работают, но сайт функционален');
    }
    
  } catch (error) {
    console.log('❌ Ошибка тестирования:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 ТЕСТИРОВАНИЕ ИЗОБРАЖЕНИЙ ЗАВЕРШЕНО');
})().catch(console.error);
