const { chromium } = require('playwright');

(async () => {
  console.log('🔍 ГЛУБОКАЯ ДИАГНОСТИКА ПРОДАКШН САЙТА');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Собираем все ошибки
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
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  try {
    console.log('🌐 Переходим на https://smilerentalphuket.com...');
    await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'networkidle', 
      timeout: 20000 
    });
    
    // Базовая информация
    const title = await page.title();
    const url = page.url();
    console.log('✅ Заголовок:', title);
    console.log('🔗 URL:', url);
    
    // Проверяем загрузку CSS
    const cssLinks = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => link.href)
    );
    console.log('\n🎨 CSS файлы (' + cssLinks.length + '):');
    cssLinks.forEach(css => console.log('  -', css));
    
    // Проверяем загрузку JS
    const jsScripts = await page.$$eval('script[src]', scripts => 
      scripts.map(script => script.src)
    );
    console.log('\n⚡ JavaScript файлы (' + jsScripts.length + '):');
    jsScripts.forEach(js => console.log('  -', js));
    
    // Проверяем изображения
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({ src: img.src, alt: img.alt || 'no alt' }))
    );
    console.log('\n🖼️ Изображения (' + images.length + '):');
    images.slice(0, 5).forEach(img => console.log('  -', img.src, '(' + img.alt + ')'));
    if (images.length > 5) console.log('  ... и еще', images.length - 5, 'изображений');
    
    // Проверяем видимый контент
    const bodyText = await page.textContent('body');
    const visibleText = bodyText.replace(/\s+/g, ' ').trim();
    console.log('\n📝 Длина видимого текста:', visibleText.length, 'символов');
    console.log('📄 Первые 200 символов:');
    console.log('"' + visibleText.substring(0, 200) + '..."');
    
    // Проверяем кнопки социальных сетей
    const socialButtons = await page.$$eval('a[href*="telegram"], a[href*="whatsapp"], a[href*="instagram"], a[href*="facebook"]', 
      links => links.map(link => ({ href: link.href, text: link.textContent.trim() }))
    );
    console.log('\n📱 Кнопки социальных сетей (' + socialButtons.length + '):');
    socialButtons.forEach(btn => console.log('  -', btn.href, '"' + btn.text + '"'));
    
    // Ошибки консоли
    if (consoleErrors.length > 0) {
      console.log('\n❌ ОШИБКИ КОНСОЛИ (' + consoleErrors.length + '):');
      consoleErrors.slice(0, 10).forEach(error => console.log('  -', error));
    }
    
    // Неудачные запросы
    if (failedRequests.length > 0) {
      console.log('\n🚫 НЕУДАЧНЫЕ ЗАПРОСЫ (' + failedRequests.length + '):');
      failedRequests.slice(0, 10).forEach(req => 
        console.log('  -', req.status, req.url)
      );
    }
    
    // Делаем скриншот для диагностики
    await page.screenshot({ 
      path: 'diagnosis-full-page.png', 
      fullPage: true 
    });
    console.log('\n📸 Скриншот диагностики: diagnosis-full-page.png');
    
    // Проверяем стили
    const hasStyles = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily
      };
    });
    console.log('\n🎨 Применённые стили:');
    console.log('  - Фон:', hasStyles.backgroundColor);
    console.log('  - Шрифт:', hasStyles.fontSize, hasStyles.fontFamily);
    
  } catch (error) {
    console.log('❌ Ошибка диагностики:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 ДИАГНОСТИКА ЗАВЕРШЕНА');
})().catch(console.error);
