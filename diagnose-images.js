const { chromium } = require('playwright');

(async () => {
  console.log('🖼️ ДИАГНОСТИКА ИЗОБРАЖЕНИЙ НА ПРОДАКШН САЙТЕ');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Собираем ошибки изображений
  const imageErrors = [];
  const imageRequests = [];
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/images/') || url.includes('/_next/image')) {
      imageRequests.push({
        url: url,
        status: response.status(),
        ok: response.ok()
      });
      
      if (!response.ok()) {
        imageErrors.push({
          url: url,
          status: response.status(),
          statusText: response.statusText()
        });
      }
    }
  });
  
  try {
    console.log('🌐 Переходим на https://smilerentalphuket.com...');
    await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'networkidle', 
      timeout: 25000 
    });
    
    const title = await page.title();
    console.log('✅ Заголовок:', title);
    
    // Проверяем все изображения на странице
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        alt: img.alt || 'no alt',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        loading: img.loading || 'eager'
      }))
    );
    
    console.log('\n🖼️ АНАЛИЗ ИЗОБРАЖЕНИЙ (' + images.length + ' найдено):');
    images.forEach((img, index) => {
      const status = img.complete && img.naturalWidth > 0 ? '✅' : '❌';
      console.log(`  ${index + 1}. ${status} ${img.src}`);
      console.log(`     Alt: "${img.alt}", Размер: ${img.naturalWidth}x${img.naturalHeight}`);
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
      const status = img.complete && img.naturalWidth > 0 ? '✅ ЗАГРУЖЕНО' : '❌ НЕ ЗАГРУЖЕНО';
      console.log(`  ${index + 1}. ${status}`);
      console.log(`     URL: ${img.src}`);
      console.log(`     Alt: "${img.alt}"`);
    });
    
    // Проверяем Trustpilot изображения
    const trustpilotImages = images.filter(img => 
      img.alt.toLowerCase().includes('trustpilot') || 
      img.src.includes('trustpilot')
    );
    
    console.log('\n⭐ TRUSTPILOT ИЗОБРАЖЕНИЯ (' + trustpilotImages.length + '):');
    trustpilotImages.forEach((img, index) => {
      const status = img.complete && img.naturalWidth > 0 ? '✅ ЗАГРУЖЕНО' : '❌ НЕ ЗАГРУЖЕНО';
      console.log(`  ${index + 1}. ${status}`);
      console.log(`     URL: ${img.src}`);
      console.log(`     Alt: "${img.alt}"`);
    });
    
    // Анализ запросов изображений
    console.log('\n📡 ЗАПРОСЫ ИЗОБРАЖЕНИЙ (' + imageRequests.length + '):');
    imageRequests.forEach((req, index) => {
      const status = req.ok ? '✅' : '❌';
      console.log(`  ${index + 1}. ${status} ${req.status} ${req.url}`);
    });
    
    // Ошибки изображений
    if (imageErrors.length > 0) {
      console.log('\n❌ ОШИБКИ ЗАГРУЗКИ ИЗОБРАЖЕНИЙ (' + imageErrors.length + '):');
      imageErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.status} ${error.url}`);
      });
    }
    
    // Делаем скриншот для анализа
    await page.screenshot({ 
      path: 'production-images-diagnosis.png', 
      fullPage: true 
    });
    console.log('\n📸 Скриншот диагностики: production-images-diagnosis.png');
    
    // Итоговая статистика
    const workingImages = images.filter(img => img.complete && img.naturalWidth > 0).length;
    const brokenImages = images.length - workingImages;
    
    console.log('\n📊 СТАТИСТИКА:');
    console.log('  - Всего изображений:', images.length);
    console.log('  - Работающих:', workingImages);
    console.log('  - Сломанных:', brokenImages);
    console.log('  - Изображений скутеров:', scooterImages.length);
    console.log('  - Trustpilot изображений:', trustpilotImages.length);
    
  } catch (error) {
    console.log('❌ Ошибка диагностики:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 ДИАГНОСТИКА ИЗОБРАЖЕНИЙ ЗАВЕРШЕНА');
})().catch(console.error);
