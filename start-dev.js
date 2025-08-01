const { spawn } = require('child_process');

console.log('Starting Next.js development server...');

const nextDev = spawn('npx', ['next', 'dev', '--port', '3000'], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (error) => {
  console.error('Failed to start server:', error);
});

nextDev.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  nextDev.kill();
  process.exit();
});
