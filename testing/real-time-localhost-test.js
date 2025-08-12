const { chromium } = require('playwright');

async function realTimeLocalhostTest() {
  console.log('🔍 REAL-TIME LOCALHOST:3000 ACCESSIBILITY TEST');
  console.log('=' .repeat(60));
  console.log(`Test started at: ${new Date().toISOString()}`);

  const browser = await chromium.launch({ 
    headless: false, // Show browser for visual confirmation
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    // Enable console logging
    page.on('console', msg => console.log(`🖥️ Browser Console: ${msg.text()}`));
    page.on('pageerror', error => console.log(`❌ Page Error: ${error.message}`));

    console.log('\n1️⃣ TESTING LOCALHOST:3000 DIRECT ACCESS');
    console.log('-' .repeat(45));
    
    try {
      console.log('Attempting to navigate to http://localhost:3000...');
      const startTime = Date.now();
      
      const response = await page.goto('http://localhost:3000', {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      const loadTime = Date.now() - startTime;
      
      if (response) {
        console.log(`✅ SUCCESS! Connection established`);
        console.log(`📄 Status: ${response.status()}`);
        console.log(`⏱️ Load time: ${loadTime}ms`);
        console.log(`🔗 Final URL: ${page.url()}`);
        
        // Get page content
        const title = await page.title();
        console.log(`📋 Page title: "${title}"`);
        
        const bodyText = await page.textContent('body');
        const hasContent = bodyText && bodyText.length > 100;
        console.log(`📝 Content loaded: ${hasContent ? '✅ YES' : '❌ NO'} (${bodyText ? bodyText.length : 0} chars)`);
        
        // Take screenshot as proof
        await page.screenshot({ 
          path: 'screenshots/real-time-localhost-test.png',
          fullPage: false
        });
        console.log('📸 Screenshot saved: screenshots/real-time-localhost-test.png');
        
        return {
          success: true,
          status: response.status(),
          loadTime,
          title,
          hasContent,
          url: page.url()
        };
        
      } else {
        console.log('❌ No response received');
        return { success: false, error: 'No response' };
      }
      
    } catch (error) {
      console.log('❌ FAILED to connect to localhost:3000');
      console.log(`Error type: ${error.name}`);
      console.log(`Error message: ${error.message}`);
      
      // Take screenshot of error page
      try {
        await page.screenshot({ 
          path: 'screenshots/localhost-error.png',
          fullPage: false
        });
        console.log('📸 Error screenshot saved: screenshots/localhost-error.png');
      } catch (screenshotError) {
        console.log('Could not take error screenshot');
      }
      
      return {
        success: false,
        error: error.message,
        errorType: error.name
      };
    }
    
  } finally {
    await browser.close();
  }
}

// Export for use as module
module.exports = realTimeLocalhostTest;

// Run if called directly
if (require.main === module) {
  realTimeLocalhostTest()
    .then(result => {
      console.log('\n📊 TEST RESULT SUMMARY');
      console.log('=' .repeat(30));
      console.log(JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('\n🎉 LOCALHOST:3000 IS ACCESSIBLE!');
      } else {
        console.log('\n❌ LOCALHOST:3000 IS NOT ACCESSIBLE');
        console.log('This confirms the user\'s report of connection issues.');
      }
    })
    .catch(console.error);
}
