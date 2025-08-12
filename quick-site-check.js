const { chromium } = require('playwright');

async function quickSiteCheck() {
  console.log('🔍 Quick site check...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📍 Checking https://smilerentalphuket.com');
    const response = await page.goto('https://smilerentalphuket.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    console.log('📄 Status:', response.status());
    
    // Quick content check
    const content = await page.content();
    console.log('📊 Content length:', content.length, 'characters');
    
    // Check for key elements
    const sections = await page.$$eval('section', sections => sections.length).catch(() => 0);
    const images = await page.$$eval('img', imgs => imgs.length).catch(() => 0);
    const links = await page.$$eval('a', links => links.length).catch(() => 0);
    
    console.log('📊 Sections:', sections);
    console.log('🖼️ Images:', images);
    console.log('🔗 Links:', links);
    
    // Check for specific content
    const hasTitle = content.includes('Smile Rental') || content.includes('scooter');
    console.log('📝 Has relevant content:', hasTitle ? 'YES' : 'NO');
    
    if (sections > 0 && images > 0 && links > 0 && content.length > 10000) {
      console.log('✅ SITE IS WORKING! All elements found.');
    } else if (content.length > 1000) {
      console.log('⚠️ Site partially working, may need more time to deploy');
    } else {
      console.log('❌ Site still broken or not deployed yet');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    await browser.close();
  }
}

quickSiteCheck();
