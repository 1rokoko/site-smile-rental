const https = require('https');
const http = require('http');

console.log('🧪 Testing site status...');

// Test HTTPS site
function testSite(url, name) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      console.log(`✅ ${name}: Status ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`🎉 ${name} is working!`);
      } else if (res.statusCode === 502) {
        console.log(`❌ ${name} has 502 Bad Gateway error`);
      } else {
        console.log(`⚠️ ${name} returned status ${res.statusCode}`);
      }
      resolve(res.statusCode);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name} error: ${err.message}`);
      resolve(null);
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${name} timeout`);
      req.destroy();
      resolve(null);
    });
  });
}

async function runTests() {
  console.log('Testing production site...');
  await testSite('https://smilerentalphuket.com', 'Production HTTPS');
  
  console.log('\nTesting complete!');
}

runTests();
