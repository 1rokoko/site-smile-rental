const { spawn } = require('child_process');
const { chromium } = require('playwright');

console.log('🚀 ЗАПУСК NEXT.JS DEV СЕРВЕРА');
console.log('='.repeat(50));

// Запускаем Next.js сервер
const server = spawn('npx', ['next', 'dev'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📤 STDOUT:', output);
  
  if ((output.includes('Local:') || output.includes('localhost:3000') || output.includes('Ready in')) && !serverStarted) {
    serverStarted = true;
    console.log('\n🎉 СЕРВЕР ЗАПУЩЕН!');
    console.log('🔗 ССЫЛКА: http://localhost:3000');
    console.log('='.repeat(50));
    
    // Тестируем через 3 секунды
    setTimeout(testLocalSite, 3000);
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('📤 STDERR:', output);
  
  if ((output.includes('Local:') || output.includes('localhost:3000') || output.includes('Ready in')) && !serverStarted) {
    serverStarted = true;
    console.log('\n🎉 СЕРВЕР ЗАПУЩЕН!');
    console.log('🔗 ССЫЛКА: http://localhost:3000');
    console.log('='.repeat(50));
    
    // Тестируем через 3 секунды
    setTimeout(testLocalSite, 3000);
  }
});

server.on('error', (error) => {
  console.log('❌ Ошибка запуска сервера:', error.message);
});

async function testLocalSite() {
  console.log('\n🧪 ТЕСТИРОВАНИЕ ЛОКАЛЬНОГО САЙТА...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });
    
    const title = await page.title();
    const bodyText = await page.textContent('body');
    const visibleText = bodyText.replace(/\s+/g, ' ').trim();
    
    console.log('✅ ЛОКАЛЬНЫЙ САЙТ РАБОТАЕТ!');
    console.log('📄 Заголовок:', title);
    console.log('📝 Длина текста:', visibleText.length, 'символов');
    console.log('📄 Первые 100 символов:', visibleText.substring(0, 100));
    
    // Проверяем ключевые элементы
    const hasScooters = await page.locator('img[alt*="scooter"]').count();
    const hasSocial = await page.locator('a[href*="whatsapp"]').count();
    
    console.log('🛵 Изображения скутеров:', hasScooters);
    console.log('📱 Кнопки соц. сетей:', hasSocial);
    
    // Делаем скриншот
    await page.screenshot({ path: 'localhost-success.png', fullPage: true });
    console.log('📸 Скриншот локального сайта: localhost-success.png');
    
    console.log('\n🎯 ЗАДАЧА 1 ВЫПОЛНЕНА:');
    console.log('✅ Локальный сервер: РАБОТАЕТ');
    console.log('🔗 URL: http://localhost:3000');
    console.log('📸 Скриншот: localhost-success.png');
    
  } catch (error) {
    console.log('❌ Ошибка тестирования:', error.message);
  }
  
  await browser.close();
}

// Если сервер не запустился через 20 секунд
setTimeout(() => {
  if (!serverStarted) {
    console.log('\n⚠️ Сервер не запустился за 20 секунд');
    console.log('💡 Проверим альтернативные способы...');
  }
}, 20000);

console.log('⏳ Ожидание запуска сервера...');
