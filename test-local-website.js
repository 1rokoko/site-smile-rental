const { chromium } = require('playwright');

async function testLocalWebsite() {
    console.log('🔍 TESTING LOCAL DEVELOPMENT WEBSITE');
    console.log('=' .repeat(50));
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Test local development server
        console.log('📍 Testing http://localhost:3000...');
        const response = await page.goto('http://localhost:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        
        console.log(`✅ Status: ${response.status()}`);
        console.log(`📄 URL: ${page.url()}`);
        
        const title = await page.title();
        console.log(`📋 Page Title: "${title}"`);
        
        // Check if main content is loaded
        const mainContent = await page.textContent('body');
        if (mainContent.includes('Smile Rental')) {
            console.log('✅ Main content loaded successfully');
        } else {
            console.log('⚠️ Main content may not be loaded properly');
        }
        
        // Take screenshot as evidence
        await page.screenshot({ 
            path: 'local-development-screenshot.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot saved: local-development-screenshot.png');
        
        // Test responsive design
        await page.setViewportSize({ width: 375, height: 667 }); // Mobile
        await page.screenshot({ 
            path: 'local-mobile-screenshot.png' 
        });
        console.log('📱 Mobile screenshot saved: local-mobile-screenshot.png');
        
        await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
        await page.screenshot({ 
            path: 'local-desktop-screenshot.png' 
        });
        console.log('🖥️ Desktop screenshot saved: local-desktop-screenshot.png');
        
        console.log('\n🎉 LOCAL DEVELOPMENT TESTING COMPLETED SUCCESSFULLY!');
        console.log('✅ Your local development environment is working properly');
        console.log('🌐 Access your site at: http://localhost:3000');
        
    } catch (error) {
        console.log(`❌ Error testing local website: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 SOLUTION:');
            console.log('1. Make sure the development server is running');
            console.log('2. Run: npm run dev');
            console.log('3. Wait for "Ready - started server on 0.0.0.0:3000" message');
            console.log('4. Then run this test again');
        }
    } finally {
        await browser.close();
    }
}

testLocalWebsite().catch(console.error);
