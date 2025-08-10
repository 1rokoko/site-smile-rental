const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 ЗАПУСК NEXT.JS СЕРВЕРА');
console.log('='.repeat(50));

// Путь к Next.js
const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next.cmd');
const nextPathJs = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log('📁 Проверяем пути:');
console.log('  next.cmd:', require('fs').existsSync(nextPath));
console.log('  next.js:', require('fs').existsSync(nextPathJs));

// Запускаем сервер
const server = spawn('node', [nextPathJs, 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: false
});

server.on('error', (error) => {
  console.log('❌ Ошибка запуска:', error.message);
  
  // Пробуем альтернативный способ
  console.log('🔄 Пробуем альтернативный запуск...');
  const altServer = spawn('cmd', ['/c', 'npm', 'run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  altServer.on('error', (altError) => {
    console.log('❌ Альтернативный запуск тоже не удался:', altError.message);
  });
});

server.on('exit', (code) => {
  console.log('🛑 Сервер остановлен с кодом:', code);
});

// Обработка завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  server.kill();
  process.exit();
});

console.log('⏳ Сервер запускается...');
console.log('💡 Нажмите Ctrl+C для остановки');
