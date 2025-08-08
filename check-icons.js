const fs = require('fs');
const path = require('path');

console.log('🔍 Checking PWA icons...');

const icons = [
  { file: 'public/android-chrome-192x192.png', expectedSize: '192x192' },
  { file: 'public/android-chrome-512x512.png', expectedSize: '512x512' },
  { file: 'public/apple-touch-icon.png', expectedSize: '180x180' },
  { file: 'public/favicon-32x32.png', expectedSize: '32x32' },
  { file: 'public/favicon-16x16.png', expectedSize: '16x16' }
];

let allGood = true;

icons.forEach(icon => {
  if (fs.existsSync(icon.file)) {
    const stats = fs.statSync(icon.file);
    console.log(`✅ ${icon.file} exists (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${icon.file} missing`);
    allGood = false;
  }
});

// Check manifest
if (fs.existsSync('public/site.webmanifest')) {
  console.log('✅ site.webmanifest exists');
} else {
  console.log('❌ site.webmanifest missing');
  allGood = false;
}

if (allGood) {
  console.log('🎉 All PWA icons are present!');
} else {
  console.log('⚠️ Some icons are missing');
}
