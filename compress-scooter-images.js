const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Функция для сжатия изображений
async function compressImage(inputPath, quality = 80) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    // Создаем временный файл
    const tempPath = inputPath + '.temp';

    await sharp(inputPath)
      .jpeg({ quality: quality, progressive: true })
      .toFile(tempPath);

    // Заменяем оригинал сжатым файлом
    fs.renameSync(tempPath, inputPath);

    const newStats = fs.statSync(inputPath);
    const newSize = newStats.size;
    const savings = originalSize - newSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)}: ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (экономия: ${(savings/1024).toFixed(1)}KB, ${savingsPercent}%)`);

    return savings;
  } catch (error) {
    console.error(`❌ Ошибка при сжатии ${inputPath}:`, error.message);
    return 0;
  }
}

// Функция для обработки всех изображений скутеров
async function compressScooterImages() {
  const scootersDir = path.join(__dirname, 'public', 'images', 'scooters');
  
  if (!fs.existsSync(scootersDir)) {
    console.error('❌ Директория public/images/scooters не найдена');
    return;
  }
  
  const files = fs.readdirSync(scootersDir);
  const imageFiles = files.filter(file => 
    file.endsWith('.jpg') && !file.includes('placeholder')
  );
  
  console.log(`🔧 Начинаем сжатие ${imageFiles.length} изображений скутеров...`);
  console.log('='.repeat(80));
  
  let totalSavings = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(scootersDir, file);

    const savings = await compressImage(inputPath, 50); // Качество 50% для максимальной экономии
    totalSavings += savings;
  }
  
  console.log('='.repeat(80));
  console.log(`🎉 ГОТОВО! Общая экономия: ${(totalSavings/1024).toFixed(1)}KB`);
  console.log(`📊 Обработано файлов: ${imageFiles.length}`);
}

// Запуск сжатия
compressScooterImages().catch(console.error);
