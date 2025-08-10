const { exec } = require('child_process');
const path = require('path');

console.log('🚀 ЗАПУСК ЛОКАЛЬНОГО NEXT.JS СЕРВЕРА');
console.log('='.repeat(50));

const projectPath = process.cwd();
console.log('📁 Папка проекта:', projectPath);

// Запускаем Next.js сервер
const command = 'npx next dev';
console.log('⚡ Команда:', command);
console.log('⏳ Запуск...');

const server = exec(command, { cwd: projectPath });

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Local:') || output.includes('localhost:3000')) {
    console.log('\n🎉 СЕРВЕР ЗАПУЩЕН!');
    console.log('🔗 ССЫЛКА ДЛЯ ПОЛЬЗОВАТЕЛЯ: http://localhost:3000');
    console.log('✅ Откройте эту ссылку в браузере');
    console.log('='.repeat(50));
  }
});

server.stderr.on('data', (data) => {
  console.log('Лог:', data.toString());
});

server.on('close', (code) => {
  console.log(`Сервер остановлен с кодом ${code}`);
});

// Обработка завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  server.kill();
  process.exit();
});

console.log('💡 Нажмите Ctrl+C для остановки сервера');
