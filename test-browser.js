const { chromium } = require('playwright');

async function testWebsite() {
  console.log('🚀 Starting browser test...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('📡 Testing http://smilerentalphuket.com...');
    
    // Set timeout
    page.setDefaultTimeout(30000);
    
    // Navigate to the website
    const response = await page.goto('http://smilerentalphuket.com', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    console.log(`✅ Response status: ${response.status()}`);
    console.log(`📄 Response URL: ${response.url()}`);
    
    // Get page title
    const title = await page.title();
    console.log(`📝 Page title: ${title}`);
    
    // Take screenshot
    await page.screenshot({ path: 'website-test.png', fullPage: true });
    console.log('📸 Screenshot saved as website-test.png');
    
    // Get page content
    const content = await page.content();
    console.log(`📊 Page content length: ${content.length} characters`);
    
    if (content.includes('error') || content.includes('Error')) {
      console.log('❌ Page contains error content');
    } else {
      console.log('✅ Page loaded successfully');
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
  
  try {
    console.log('📡 Testing http://38.180.122.239:3000...');
    
    const response2 = await page.goto('http://38.180.122.239:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    console.log(`✅ Direct IP Response status: ${response2.status()}`);
    console.log(`📄 Direct IP Response URL: ${response2.url()}`);
    
  } catch (error) {
    console.log(`❌ Direct IP FAILED: ${error.message}`);
  }
  
  await browser.close();
  console.log('🏁 Browser test completed');
}

testWebsite().catch(console.error);
