const { chromium } = require('playwright');

async function debugJSErrors() {
  console.log('🔍 Debugging JavaScript errors causing white screen...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Collect all errors
  const errors = [];
  const consoleMessages = [];
  
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`🚫 Failed Request: ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    console.log('📍 Loading https://smilerentalphuket.com with error tracking...');
    
    // Take screenshot before page loads
    await page.goto('https://smilerentalphuket.com', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    console.log('📸 Taking screenshot after initial load...');
    await page.screenshot({ path: 'debug-after-load.png' });
    
    // Wait a bit to see if JS breaks it
    console.log('⏳ Waiting 3 seconds to see if JS breaks the page...');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking screenshot after JS execution...');
    await page.screenshot({ path: 'debug-after-js.png' });
    
    // Check if page is blank
    const bodyText = await page.$eval('body', body => body.innerText).catch(() => '');
    const bodyHTML = await page.$eval('body', body => body.innerHTML).catch(() => '');
    
    console.log('📊 Body text length:', bodyText.length);
    console.log('📊 Body HTML length:', bodyHTML.length);
    
    if (bodyText.length < 100) {
      console.log('❌ Page appears to be blank after JS execution!');
    } else {
      console.log('✅ Page has content after JS execution');
    }
    
    // Check for specific errors
    const hasReactErrors = consoleMessages.some(msg => 
      msg.includes('React') || msg.includes('Hydration') || msg.includes('Warning')
    );
    
    const hasSecurityErrors = consoleMessages.some(msg => 
      msg.includes('CSP') || msg.includes('Content Security Policy') || msg.includes('blocked')
    );
    
    console.log('🔍 Analysis:');
    console.log('  - Total console messages:', consoleMessages.length);
    console.log('  - Total page errors:', errors.length);
    console.log('  - Has React errors:', hasReactErrors);
    console.log('  - Has security errors:', hasSecurityErrors);
    
    if (errors.length > 0) {
      console.log('\n❌ PAGE ERRORS:');
      errors.forEach((error, i) => console.log(`  ${i+1}. ${error}`));
    }
    
    if (consoleMessages.length > 0) {
      console.log('\n📝 CONSOLE MESSAGES:');
      consoleMessages.slice(0, 10).forEach((msg, i) => console.log(`  ${i+1}. ${msg}`));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugJSErrors();
