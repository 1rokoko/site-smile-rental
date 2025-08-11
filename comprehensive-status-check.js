const https = require('https');
const http = require('http');

console.log('🔍 COMPREHENSIVE STATUS CHECK');
console.log('==============================');

async function checkSite(url, name, timeout = 10000) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = protocol.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`\n📊 ${name}:`);
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Response Time: ${responseTime}ms`);
      console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ ${name} is working!`);
          console.log(`   Content length: ${data.length} bytes`);
        } else if (res.statusCode === 502) {
          console.log(`   ❌ ${name} has 502 Bad Gateway error`);
          console.log(`   Error content: ${data.substring(0, 200)}...`);
        } else {
          console.log(`   ⚠️ ${name} returned status ${res.statusCode}`);
          console.log(`   Content: ${data.substring(0, 200)}...`);
        }
        resolve({ status: res.statusCode, responseTime, data });
      });
    });
    
    req.on('error', (err) => {
      console.log(`\n❌ ${name} error:`);
      console.log(`   Error: ${err.message}`);
      console.log(`   Code: ${err.code}`);
      resolve({ error: err.message, code: err.code });
    });
    
    req.setTimeout(timeout, () => {
      console.log(`\n⏰ ${name} timeout (${timeout}ms)`);
      req.destroy();
      resolve({ timeout: true });
    });
  });
}

async function runComprehensiveCheck() {
  console.log('Starting comprehensive site check...\n');
  
  // Test production site
  console.log('🌐 Testing Production Site:');
  const httpsResult = await checkSite('https://smilerentalphuket.com', 'HTTPS Production');
  const httpResult = await checkSite('http://smilerentalphuket.com', 'HTTP Production');
  
  // Summary
  console.log('\n📋 SUMMARY:');
  console.log('===========');
  
  if (httpsResult.status === 200) {
    console.log('✅ HTTPS site is working correctly');
  } else if (httpsResult.status === 502) {
    console.log('❌ HTTPS site has 502 Bad Gateway error');
    console.log('   This indicates the backend application is not running');
  } else {
    console.log(`⚠️ HTTPS site returned unexpected status: ${httpsResult.status || 'Error'}`);
  }
  
  if (httpResult.status === 200) {
    console.log('✅ HTTP site is working correctly');
  } else if (httpResult.status === 502) {
    console.log('❌ HTTP site has 502 Bad Gateway error');
  } else {
    console.log(`⚠️ HTTP site returned unexpected status: ${httpResult.status || 'Error'}`);
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('===================');
  
  if (httpsResult.status === 502 || httpResult.status === 502) {
    console.log('🔧 502 Error detected - Backend application is not running');
    console.log('   Recommended actions:');
    console.log('   1. Check PM2 process status on server');
    console.log('   2. Restart the Node.js application');
    console.log('   3. Check application logs for errors');
    console.log('   4. Verify ecosystem.config.js configuration');
    console.log('   5. Ensure .next build directory exists');
  }
  
  if (httpsResult.responseTime > 2000) {
    console.log('⚡ Slow response time detected');
    console.log('   Consider optimizing application performance');
  }
  
  console.log('\n🎯 Next Steps:');
  if (httpsResult.status === 502) {
    console.log('   - GitHub Actions deployment may still be in progress');
    console.log('   - Wait 2-3 minutes and run this check again');
    console.log('   - If issue persists, manual server intervention needed');
  } else if (httpsResult.status === 200) {
    console.log('   - Site is working correctly!');
    console.log('   - Monitor performance and stability');
  }
  
  console.log('\nCheck completed!');
}

runComprehensiveCheck().catch(console.error);
