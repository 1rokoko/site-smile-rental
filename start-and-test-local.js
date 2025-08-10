const { spawn } = require('child_process');
const { chromium } = require('playwright');
const path = require('path');

console.log('🚀 ЗАПУСК ЛОКАЛЬНОГО NEXT.JS СЕРВЕРА');
console.log('='.repeat(50));

// Запускаем Next.js сервер
console.log('⚡ Запуск сервера...');
const server = spawn('npx', ['next', 'dev'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let serverReady = false;
let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Local:') || output.includes('localhost:3000') || output.includes('Ready in')) {
    if (!serverStarted) {
      serverStarted = true;
      console.log('\n🎉 СЕРВЕР ЗАПУЩЕН!');
      console.log('🔗 ССЫЛКА: http://localhost:3000');
      console.log('='.repeat(50));
      
      // Тестируем через 5 секунд
      setTimeout(testLocalSite, 5000);
    }
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('Лог:', output);
  
  if (output.includes('Local:') || output.includes('localhost:3000') || output.includes('Ready in')) {
    if (!serverStarted) {
      serverStarted = true;
      console.log('\n🎉 СЕРВЕР ЗАПУЩЕН!');
      console.log('🔗 ССЫЛКА: http://localhost:3000');
      console.log('='.repeat(50));
      
      // Тестируем через 5 секунд
      setTimeout(testLocalSite, 5000);
    }
  }
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
    
    console.log('✅ Заголовок:', title);
    console.log('📝 Длина текста:', visibleText.length, 'символов');
    console.log('📄 Первые 100 символов:', visibleText.substring(0, 100));
    
    // Проверяем ключевые элементы
    const hasScooters = await page.locator('img[alt*="scooter"]').count();
    const hasSocial = await page.locator('a[href*="whatsapp"]').count();
    
    console.log('🛵 Изображения скутеров:', hasScooters);
    console.log('📱 Кнопки соц. сетей:', hasSocial);
    
    // Делаем скриншот
    await page.screenshot({ path: 'localhost-working.png', fullPage: true });
    console.log('📸 Скриншот локального сайта: localhost-working.png');
    
    console.log('\n🎯 РЕЗУЛЬТАТ ЛОКАЛЬНОГО ТЕСТИРОВАНИЯ:');
    console.log('✅ Локальный сервер: РАБОТАЕТ');
    console.log('🔗 Ссылка для пользователя: http://localhost:3000');
    console.log('📸 Скриншот: localhost-working.png');
    console.log('📊 Функциональность:', visibleText.length > 1000 ? 'ПОЛНАЯ' : 'ОГРАНИЧЕННАЯ');
    
  } catch (error) {
    console.log('❌ Ошибка тестирования локального сайта:', error.message);
    console.log('💡 Возможно, сервер еще запускается...');
  }
  
  await browser.close();
}

// Обработка завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  server.kill();
  process.exit();
});

// Если сервер не запустился через 30 секунд
setTimeout(() => {
  if (!serverStarted) {
    console.log('\n⚠️ Сервер не запустился за 30 секунд');
    console.log('💡 Попробуйте запустить вручную: npm run dev');
  }
}, 30000);

console.log('⏳ Ожидание запуска сервера...');
console.log('💡 Нажмите Ctrl+C для остановки');
