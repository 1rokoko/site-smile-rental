const { chromium } = require('playwright');

async function testAllLocalhostVariants() {
  console.log('🔍 TESTING ALL LOCALHOST ADDRESS VARIANTS');
  console.log('=' .repeat(55));
  console.log(`Test started at: ${new Date().toISOString()}`);

  const addresses = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000'
  ];

  const results = [];

  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--ignore-certificate-errors']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true
    });

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      console.log(`\n${i + 1}️⃣ TESTING: ${address}`);
      console.log('-' .repeat(40));

      const page = await context.newPage();
      
      try {
        console.log(`Attempting to connect to ${address}...`);
        const startTime = Date.now();
        
        const response = await page.goto(address, {
          waitUntil: 'domcontentloaded',
          timeout: 10000
        });

        const loadTime = Date.now() - startTime;
        
        if (response) {
          const title = await page.title();
          const bodyText = await page.textContent('body');
          const hasContent = bodyText && bodyText.length > 100;
          
          console.log(`✅ SUCCESS!`);
          console.log(`📄 Status: ${response.status()}`);
          console.log(`⏱️ Load time: ${loadTime}ms`);
          console.log(`📋 Title: "${title}"`);
          console.log(`📝 Content: ${hasContent ? '✅ YES' : '❌ NO'} (${bodyText ? bodyText.length : 0} chars)`);
          
          // Take screenshot
          const screenshotName = `screenshots/test-${address.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
          await page.screenshot({ path: screenshotName, fullPage: false });
          console.log(`📸 Screenshot: ${screenshotName}`);
          
          results.push({
            address,
            success: true,
            status: response.status(),
            loadTime,
            title,
            hasContent,
            contentLength: bodyText ? bodyText.length : 0
          });
          
        } else {
          console.log(`❌ No response received`);
          results.push({
            address,
            success: false,
            error: 'No response'
          });
        }
        
      } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
        
        // Try to take error screenshot
        try {
          const errorScreenshot = `screenshots/error-${address.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
          await page.screenshot({ path: errorScreenshot, fullPage: false });
          console.log(`📸 Error screenshot: ${errorScreenshot}`);
        } catch (screenshotError) {
          console.log('Could not capture error screenshot');
        }
        
        results.push({
          address,
          success: false,
          error: error.message,
          errorType: error.name
        });
      }
      
      await page.close();
    }
    
  } finally {
    await browser.close();
  }

  return results;
}

// Export for use as module
module.exports = testAllLocalhostVariants;

// Run if called directly
if (require.main === module) {
  testAllLocalhostVariants()
    .then(results => {
      console.log('\n📊 COMPREHENSIVE TEST RESULTS');
      console.log('=' .repeat(40));
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      console.log(`\n✅ SUCCESSFUL CONNECTIONS (${successful.length}):`);
      successful.forEach(result => {
        console.log(`   ${result.address} - Status: ${result.status}, Load: ${result.loadTime}ms`);
      });
      
      console.log(`\n❌ FAILED CONNECTIONS (${failed.length}):`);
      failed.forEach(result => {
        console.log(`   ${result.address} - Error: ${result.error}`);
      });
      
      console.log('\n🎯 ANALYSIS:');
      if (successful.length > 0) {
        console.log(`✅ ${successful.length} address(es) work - server is accessible`);
        console.log('💡 If user cannot access, issue is likely browser-specific');
      } else {
        console.log('❌ No addresses work - server has connectivity issues');
      }
      
      console.log('\n📋 DETAILED RESULTS:');
      console.log(JSON.stringify(results, null, 2));
    })
    .catch(console.error);
}
