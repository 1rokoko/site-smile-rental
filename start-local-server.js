const { spawn } = require('child_process');
const { chromium } = require('playwright');

console.log('🚀 ЗАПУСК ЛОКАЛЬНОГО СЕРВЕРА...');
console.log('='.repeat(50));

// Запускаем Next.js сервер
const server = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Local:') || output.includes('localhost:3000')) {
    serverReady = true;
    console.log('\n🎉 СЕРВЕР ЗАПУЩЕН!');
    console.log('🔗 ССЫЛКА ДЛЯ ПОЛЬЗОВАТЕЛЯ: http://localhost:3000');
    console.log('='.repeat(50));
    
    // Тестируем сайт через браузер
    setTimeout(testLocalSite, 3000);
  }
});

server.stderr.on('data', (data) => {
  console.log('Error:', data.toString());
});

async function testLocalSite() {
  console.log('\n🧪 ТЕСТИРОВАНИЕ ЛОКАЛЬНОГО САЙТА...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const title = await page.title();
    console.log('✅ Заголовок:', title);
    console.log('✅ Локальный сайт РАБОТАЕТ!');
    
    // Делаем скриншот
    await page.screenshot({ path: 'local-site-working.png', fullPage: true });
    console.log('📸 Скриншот локального сайта: local-site-working.png');
    
    console.log('\n🎯 РЕЗУЛЬТАТ:');
    console.log('✅ Локальный сервер: РАБОТАЕТ');
    console.log('🔗 Ссылка: http://localhost:3000');
    console.log('📸 Скриншот: local-site-working.png');
    
  } catch (error) {
    console.log('❌ Ошибка тестирования:', error.message);
  }
  
  await browser.close();
}

// Обработка завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  server.kill();
  process.exit();
});

console.log('⏳ Ожидание запуска сервера...');
console.log('💡 Нажмите Ctrl+C для остановки');
