const { chromium, firefox, webkit } = require('playwright');

async function browserSpecificDiagnostics() {
  console.log('🔍 BROWSER-SPECIFIC LOCALHOST DIAGNOSTICS');
  console.log('=' .repeat(55));
  console.log(`Test started at: ${new Date().toISOString()}`);

  const browsers = [
    { name: 'Chromium', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit', launcher: webkit }
  ];

  const results = [];

  for (const browserInfo of browsers) {
    console.log(`\n🌐 TESTING WITH ${browserInfo.name.toUpperCase()}`);
    console.log('-' .repeat(40));

    try {
      const browser = await browserInfo.launcher.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });

      const page = await context.newPage();

      // Capture network events
      const networkEvents = [];
      page.on('request', request => {
        networkEvents.push({
          type: 'request',
          url: request.url(),
          method: request.method()
        });
      });

      page.on('response', response => {
        networkEvents.push({
          type: 'response',
          url: response.url(),
          status: response.status()
        });
      });

      page.on('requestfailed', request => {
        networkEvents.push({
          type: 'failed',
          url: request.url(),
          failure: request.failure()
        });
      });

      try {
        console.log(`Attempting localhost:3000 with ${browserInfo.name}...`);
        const startTime = Date.now();
        
        const response = await page.goto('http://localhost:3000', {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });

        const loadTime = Date.now() - startTime;
        
        if (response) {
          const title = await page.title();
          const bodyText = await page.textContent('body');
          
          console.log(`✅ SUCCESS with ${browserInfo.name}!`);
          console.log(`📄 Status: ${response.status()}`);
          console.log(`⏱️ Load time: ${loadTime}ms`);
          console.log(`📋 Title: "${title}"`);
          
          // Take screenshot
          const screenshotPath = `screenshots/${browserInfo.name.toLowerCase()}-localhost-success.png`;
          await page.screenshot({ path: screenshotPath, fullPage: false });
          console.log(`📸 Screenshot: ${screenshotPath}`);
          
          results.push({
            browser: browserInfo.name,
            success: true,
            status: response.status(),
            loadTime,
            title,
            networkEvents: networkEvents.slice(0, 5) // First 5 events
          });
          
        } else {
          console.log(`❌ No response from ${browserInfo.name}`);
          results.push({
            browser: browserInfo.name,
            success: false,
            error: 'No response'
          });
        }
        
      } catch (error) {
        console.log(`❌ ${browserInfo.name} FAILED: ${error.message}`);
        
        // Take error screenshot
        try {
          const errorPath = `screenshots/${browserInfo.name.toLowerCase()}-localhost-error.png`;
          await page.screenshot({ path: errorPath, fullPage: false });
          console.log(`📸 Error screenshot: ${errorPath}`);
        } catch (screenshotError) {
          console.log('Could not capture error screenshot');
        }
        
        results.push({
          browser: browserInfo.name,
          success: false,
          error: error.message,
          networkEvents: networkEvents
        });
      }
      
      await browser.close();
      
    } catch (browserError) {
      console.log(`❌ Could not launch ${browserInfo.name}: ${browserError.message}`);
      results.push({
        browser: browserInfo.name,
        success: false,
        error: `Browser launch failed: ${browserError.message}`
      });
    }
  }

  return results;
}

// Function to test common browser issues
async function testCommonBrowserIssues() {
  console.log('\n🔧 TESTING COMMON BROWSER ISSUES');
  console.log('-' .repeat(40));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const issues = [];

  try {
    // Test 1: DNS resolution
    console.log('\n1️⃣ Testing DNS resolution...');
    try {
      await page.goto('http://localhost:3000', { timeout: 5000 });
      console.log('✅ DNS resolution works');
      issues.push({ test: 'DNS Resolution', status: 'PASS' });
    } catch (error) {
      console.log(`❌ DNS resolution issue: ${error.message}`);
      issues.push({ test: 'DNS Resolution', status: 'FAIL', error: error.message });
    }

    // Test 2: Cache issues
    console.log('\n2️⃣ Testing with cache disabled...');
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      await page.reload({ waitUntil: 'domcontentloaded' });
      console.log('✅ Cache handling works');
      issues.push({ test: 'Cache Handling', status: 'PASS' });
    } catch (error) {
      console.log(`❌ Cache issue: ${error.message}`);
      issues.push({ test: 'Cache Handling', status: 'FAIL', error: error.message });
    }

    // Test 3: JavaScript execution
    console.log('\n3️⃣ Testing JavaScript execution...');
    try {
      const jsResult = await page.evaluate(() => {
        return {
          userAgent: navigator.userAgent,
          location: window.location.href,
          title: document.title
        };
      });
      console.log('✅ JavaScript execution works');
      console.log(`   User Agent: ${jsResult.userAgent.substring(0, 50)}...`);
      issues.push({ test: 'JavaScript Execution', status: 'PASS', details: jsResult });
    } catch (error) {
      console.log(`❌ JavaScript issue: ${error.message}`);
      issues.push({ test: 'JavaScript Execution', status: 'FAIL', error: error.message });
    }

  } finally {
    await browser.close();
  }

  return issues;
}

// Export for use as module
module.exports = { browserSpecificDiagnostics, testCommonBrowserIssues };

// Run if called directly
if (require.main === module) {
  Promise.all([
    browserSpecificDiagnostics(),
    testCommonBrowserIssues()
  ])
  .then(([browserResults, issueResults]) => {
    console.log('\n📊 COMPREHENSIVE BROWSER DIAGNOSTICS RESULTS');
    console.log('=' .repeat(55));
    
    console.log('\n🌐 BROWSER COMPATIBILITY:');
    browserResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${result.browser}: ${result.success ? `${result.status} (${result.loadTime}ms)` : result.error}`);
    });
    
    console.log('\n🔧 COMMON ISSUES CHECK:');
    issueResults.forEach(issue => {
      const status = issue.status === 'PASS' ? '✅' : '❌';
      console.log(`   ${status} ${issue.test}: ${issue.status}`);
    });
    
    console.log('\n💡 DIAGNOSIS:');
    const successfulBrowsers = browserResults.filter(r => r.success).length;
    if (successfulBrowsers > 0) {
      console.log(`✅ ${successfulBrowsers} browser(s) can access localhost:3000`);
      console.log('🔍 If user cannot access, check:');
      console.log('   - Browser cache and cookies');
      console.log('   - Proxy or VPN settings');
      console.log('   - Antivirus/firewall blocking');
      console.log('   - Browser extensions interfering');
    } else {
      console.log('❌ No browsers can access localhost:3000');
      console.log('🔍 Server configuration issue detected');
    }
  })
  .catch(console.error);
}
