const fs = require('fs');
const path = require('path');

// Пароль для удаления
const PASSWORD = '[REMOVED]';

// Функция для рекурсивного поиска файлов
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Пропускаем определенные директории
      if (!['node_modules', '.git', '.next', 'out', 'backup'].includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      // Пропускаем .env файлы и бинарные файлы
      if (!file.includes('.env') && 
          !file.endsWith('.jpg') && 
          !file.endsWith('.png') && 
          !file.endsWith('.svg') && 
          !file.endsWith('.ico') && 
          !file.endsWith('.woff') && 
          !file.endsWith('.woff2') && 
          !file.endsWith('.ttf') && 
          !file.endsWith('.eot')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Функция для очистки файла от пароля
function cleanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(PASSWORD)) {
      console.log(`🔍 Найден пароль в: ${filePath}`);
      
      // Заменяем пароль на [REMOVED]
      const cleanedContent = content.replace(new RegExp(PASSWORD, 'g'), '[REMOVED]');
      
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      console.log(`✅ Пароль удален из: ${filePath}`);
      
      return true;
    }
    
    return false;
  } catch (error) {
    // Игнорируем ошибки чтения бинарных файлов
    return false;
  }
}

// Основная функция
function removePasswordFromFiles() {
  console.log('🔧 Начинаем поиск и удаление пароля из всех файлов...');
  console.log(`🔍 Ищем пароль: ${PASSWORD}`);
  console.log('='.repeat(80));
  
  const allFiles = getAllFiles(__dirname);
  let filesWithPassword = 0;
  
  allFiles.forEach(filePath => {
    if (cleanFile(filePath)) {
      filesWithPassword++;
    }
  });
  
  console.log('='.repeat(80));
  console.log(`🎉 ГОТОВО! Обработано файлов: ${allFiles.length}`);
  console.log(`🔒 Файлов с паролем найдено и очищено: ${filesWithPassword}`);
  
  if (filesWithPassword === 0) {
    console.log('✅ Пароль не найден ни в одном файле - безопасность соблюдена!');
  }
}

// Запуск очистки
removePasswordFromFiles();
