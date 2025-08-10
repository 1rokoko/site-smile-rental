const { chromium } = require('playwright');

(async () => {
  console.log('🔒 АНАЛИЗ БЕЗОПАСНОСТИ САЙТА');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Переходим на https://smilerentalphuket.com...');
    await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'networkidle', 
      timeout: 20000 
    });
    
    // Получаем заголовки ответа
    const response = await page.goto('https://smilerentalphuket.com');
    const headers = response.headers();
    
    console.log('\n📋 ТЕКУЩИЕ ЗАГОЛОВКИ БЕЗОПАСНОСТИ:');
    
    // Проверяем основные заголовки безопасности
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
    
    securityHeaders.forEach(header => {
      const value = headers[header];
      const status = value ? '✅' : '❌';
      console.log(`  ${status} ${header}: ${value || 'ОТСУТСТВУЕТ'}`);
    });
    
    console.log('\n🔍 АНАЛИЗ ПРОБЛЕМ:');
    
    // Анализируем каждый заголовок
    if (!headers['strict-transport-security']) {
      console.log('❌ HSTS (Strict-Transport-Security) отсутствует');
      console.log('   Рекомендация: add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;');
    }
    
    if (!headers['content-security-policy']) {
      console.log('❌ Content-Security-Policy отсутствует');
      console.log('   Рекомендация: add_header Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\';" always;');
    }
    
    if (!headers['x-frame-options']) {
      console.log('❌ X-Frame-Options отсутствует');
      console.log('   Рекомендация: add_header X-Frame-Options "SAMEORIGIN" always;');
    }
    
    if (!headers['x-content-type-options']) {
      console.log('❌ X-Content-Type-Options отсутствует');
      console.log('   Рекомендация: add_header X-Content-Type-Options "nosniff" always;');
    }
    
    if (!headers['x-xss-protection']) {
      console.log('❌ X-XSS-Protection отсутствует');
      console.log('   Рекомендация: add_header X-XSS-Protection "1; mode=block" always;');
    }
    
    if (!headers['referrer-policy']) {
      console.log('❌ Referrer-Policy отсутствует');
      console.log('   Рекомендация: add_header Referrer-Policy "strict-origin-when-cross-origin" always;');
    }
    
    if (!headers['permissions-policy']) {
      console.log('❌ Permissions-Policy отсутствует');
      console.log('   Рекомендация: add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;');
    }
    
    console.log('\n🎯 ПЕРЕХОДИМ НА SECURITYHEADERS.COM ДЛЯ АНАЛИЗА...');
    
    // Переходим на SecurityHeaders.com для анализа
    await page.goto('https://securityheaders.com/?q=smilerentalphuket.com', {
      waitUntil: 'networkidle',
      timeout: 20000
    });
    
    // Ждем загрузки результатов
    await page.waitForTimeout(5000);
    
    // Получаем рейтинг
    const rating = await page.locator('.grade').first().textContent().catch(() => 'Не найден');
    console.log('📊 Текущий рейтинг SecurityHeaders.com:', rating);
    
    // Получаем детали проблем
    const issues = await page.locator('.missing').allTextContents().catch(() => []);
    if (issues.length > 0) {
      console.log('\n❌ ОТСУТСТВУЮЩИЕ ЗАГОЛОВКИ:');
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    // Делаем скриншот SecurityHeaders.com
    await page.screenshot({ 
      path: 'security-headers-before.png', 
      fullPage: true 
    });
    console.log('\n📸 Скриншот SecurityHeaders.com (до): security-headers-before.png');
    
    console.log('\n📋 РЕКОМЕНДУЕМАЯ КОНФИГУРАЦИЯ NGINX:');
    console.log('# Security Headers');
    console.log('add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;');
    console.log('add_header Content-Security-Policy "default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: https:; font-src \'self\' data:; connect-src \'self\'; frame-ancestors \'self\';" always;');
    console.log('add_header X-Frame-Options "SAMEORIGIN" always;');
    console.log('add_header X-Content-Type-Options "nosniff" always;');
    console.log('add_header X-XSS-Protection "1; mode=block" always;');
    console.log('add_header Referrer-Policy "strict-origin-when-cross-origin" always;');
    console.log('add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()" always;');
    console.log('add_header X-Permitted-Cross-Domain-Policies "none" always;');
    
  } catch (error) {
    console.log('❌ Ошибка анализа безопасности:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 АНАЛИЗ БЕЗОПАСНОСТИ ЗАВЕРШЕН');
})().catch(console.error);
