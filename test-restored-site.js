const { chromium } = require('playwright');

async function testRestoredSite() {
  console.log('🚀 Testing restored site from commit 4f2da4e...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport for consistent screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('📍 Testing production site: https://smilerentalphuket.com');
    await page.goto('https://smilerentalphuket.com', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'restored-site-test.png', 
      fullPage: true
    });
    console.log('📸 Restored site screenshot saved: restored-site-test.png');
    
    // Check if content is visible
    const title = await page.textContent('h1').catch(() => 'No title found');
    console.log('📝 Page title:', title);
    
    // Check page content length
    const content = await page.content();
    console.log('📊 Page content length:', content.length, 'characters');
    
    // Check if it's working or broken
    if (content.includes('Application error') || content.includes('500') || content.length < 1000) {
      console.log('❌ Site appears to have errors or minimal content');
    } else {
      console.log('✅ Site appears to have full content');
    }
    
    // Check for specific elements
    const sections = await page.$$eval('section', sections => sections.length).catch(() => 0);
    console.log('📊 Number of sections found:', sections);
    
    const images = await page.$$eval('img', imgs => imgs.length).catch(() => 0);
    console.log('🖼️ Number of images found:', images);
    
    const buttons = await page.$$eval('button, a[href]', btns => btns.length).catch(() => 0);
    console.log('🔘 Number of buttons/links found:', buttons);
    
    // Check for specific content
    const hasScooters = await page.$eval('body', body => 
      body.textContent.includes('scooter') || body.textContent.includes('Scooter')
    ).catch(() => false);
    console.log('🛵 Contains scooter content:', hasScooters ? 'YES' : 'NO');
    
    const hasPrice = await page.$eval('body', body => 
      body.textContent.includes('100฿') || body.textContent.includes('price')
    ).catch(() => false);
    console.log('💰 Contains pricing info:', hasPrice ? 'YES' : 'NO');
    
    // Final assessment
    if (sections > 0 && images > 0 && buttons > 0 && hasScooters && content.length > 10000) {
      console.log('🎉 SUCCESS! Site appears to be fully restored and working!');
    } else {
      console.log('⚠️ Site may still have issues or be partially loaded');
    }
    
    console.log('✅ Restored site test completed!');
    console.log('📁 Check restored-site-test.png for visual proof');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Try to take screenshot even if there's an error
    try {
      await page.screenshot({ path: 'restored-site-error.png' });
      console.log('📸 Error screenshot saved: restored-site-error.png');
    } catch (screenshotError) {
      console.log('❌ Could not take error screenshot');
    }
  } finally {
    await browser.close();
  }
}

testRestoredSite();
