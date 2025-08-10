const { chromium } = require('playwright');
const https = require('https');
const http = require('http');

async function realVerificationTest() {
    console.log('🔍 REAL VERIFICATION TEST - ACTUAL STATUS CHECK');
    console.log('=' .repeat(60));
    
    // Test 1: Direct HTTP request to domain
    console.log('\n📍 Test 1: HTTP request to smilerentalphuket.com');
    try {
        const response = await fetch('http://smilerentalphuket.com', { 
            method: 'GET',
            timeout: 15000,
            redirect: 'follow'
        });
        console.log(`✅ Status: ${response.status}`);
        console.log(`📄 URL after redirects: ${response.url}`);
        console.log(`📋 Headers:`, Object.fromEntries(response.headers));
        
        const text = await response.text();
        console.log(`📝 Content preview: ${text.substring(0, 200)}...`);
    } catch (error) {
        console.log(`❌ HTTP Error: ${error.message}`);
    }
    
    // Test 2: HTTPS request to domain
    console.log('\n📍 Test 2: HTTPS request to smilerentalphuket.com');
    try {
        const response = await fetch('https://smilerentalphuket.com', { 
            method: 'GET',
            timeout: 15000,
            redirect: 'follow'
        });
        console.log(`✅ HTTPS Status: ${response.status}`);
        console.log(`📄 HTTPS URL: ${response.url}`);
    } catch (error) {
        console.log(`❌ HTTPS Error: ${error.message}`);
    }
    
    // Test 3: Direct IP test
    console.log('\n📍 Test 3: Direct IP test (38.180.122.239)');
    try {
        const response = await fetch('http://38.180.122.239', { 
            method: 'GET',
            timeout: 15000 
        });
        console.log(`✅ IP Status: ${response.status}`);
        console.log(`📄 IP Headers:`, Object.fromEntries(response.headers));
    } catch (error) {
        console.log(`❌ IP Error: ${error.message}`);
    }
    
    // Test 4: Port 3000 test
    console.log('\n📍 Test 4: Port 3000 test');
    try {
        const response = await fetch('http://38.180.122.239:3000', { 
            method: 'GET',
            timeout: 15000 
        });
        console.log(`✅ Port 3000 Status: ${response.status}`);
    } catch (error) {
        console.log(`❌ Port 3000 Error: ${error.message}`);
    }
    
    // Test 5: Browser test with screenshot
    console.log('\n📍 Test 5: Browser test with screenshot evidence');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Test HTTP version
        console.log('Testing HTTP version...');
        const response = await page.goto('http://smilerentalphuket.com', { 
            waitUntil: 'domcontentloaded',
            timeout: 20000 
        });
        
        console.log(`✅ Browser HTTP Status: ${response.status()}`);
        console.log(`📄 Final URL: ${page.url()}`);
        
        const title = await page.title();
        console.log(`📋 Page Title: "${title}"`);
        
        // Take screenshot as evidence
        await page.screenshot({ 
            path: 'actual-website-status.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot saved: actual-website-status.png');
        
        // Get page content preview
        const bodyText = await page.textContent('body');
        console.log(`📝 Page content preview: ${bodyText.substring(0, 300)}...`);
        
    } catch (error) {
        console.log(`❌ Browser Error: ${error.message}`);
        
        // Try to take screenshot of error page
        try {
            await page.screenshot({ path: 'error-page-screenshot.png' });
            console.log('📸 Error screenshot saved: error-page-screenshot.png');
        } catch (screenshotError) {
            console.log('❌ Could not take error screenshot');
        }
    }
    
    // Test HTTPS in browser
    try {
        console.log('\nTesting HTTPS version in browser...');
        await page.goto('https://smilerentalphuket.com', { 
            waitUntil: 'domcontentloaded',
            timeout: 20000 
        });
        
        console.log(`✅ HTTPS Browser access successful`);
        await page.screenshot({ path: 'https-website-status.png' });
        console.log('📸 HTTPS Screenshot saved: https-website-status.png');
        
    } catch (httpsError) {
        console.log(`❌ HTTPS Browser Error: ${httpsError.message}`);
    }
    
    await browser.close();
    
    console.log('\n🎯 REAL VERIFICATION COMPLETED');
    console.log('Check the screenshot files for visual evidence of actual status');
}

realVerificationTest().catch(console.error);
