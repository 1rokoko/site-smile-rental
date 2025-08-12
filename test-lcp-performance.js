const { chromium } = require('playwright');

async function testLCPPerformance() {
  console.log('🚀 LCP Performance Testing - Before/After Optimization');
  console.log('=' .repeat(60));

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Enable performance monitoring
  await page.addInitScript(() => {
    window.performanceMetrics = {
      lcp: null,
      fcp: null,
      cls: null,
      fid: null,
      ttfb: null,
      renderDelay: null
    };

    // Capture LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      window.performanceMetrics.lcp = lastEntry.startTime;
      window.performanceMetrics.renderDelay = lastEntry.renderTime - lastEntry.loadTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Capture FCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.performanceMetrics.fcp = entries[0].startTime;
    }).observe({ entryTypes: ['paint'] });

    // Capture TTFB
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries[0].name === location.href) {
        window.performanceMetrics.ttfb = entries[0].responseStart;
      }
    }).observe({ entryTypes: ['navigation'] });
  });

  try {
    console.log('\n📍 Testing local development server...');
    const startTime = Date.now();

    await page.goto('http://localhost:3001', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait for LCP to be captured
    await page.waitForTimeout(3000);

    const metrics = await page.evaluate(() => window.performanceMetrics);
    const loadTime = Date.now() - startTime;

    console.log('\n📊 Performance Metrics:');
    console.log(`   Total Load Time: ${loadTime}ms`);
    console.log(`   TTFB (Time to First Byte): ${metrics.ttfb ? Math.round(metrics.ttfb) : 'N/A'}ms`);
    console.log(`   FCP (First Contentful Paint): ${metrics.fcp ? Math.round(metrics.fcp) : 'N/A'}ms`);
    console.log(`   LCP (Largest Contentful Paint): ${metrics.lcp ? Math.round(metrics.lcp) : 'N/A'}ms`);
    console.log(`   LCP Render Delay: ${metrics.renderDelay ? Math.round(metrics.renderDelay) : 'N/A'}ms`);

    // Check if main heading is visible and rendered immediately
    const headingVisible = await page.isVisible('h1:has-text("№1 Scooter Rental for")');
    const headingText = await page.textContent('h1:has-text("№1 Scooter Rental for")');
    
    console.log('\n🎯 LCP Element Analysis:');
    console.log(`   Main heading visible: ${headingVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`   Heading text: "${headingText}"`);

    // Check if FadeInView animation was removed
    const fadeInElements = await page.$$('[class*="motion"]');
    console.log(`   Motion/Animation elements: ${fadeInElements.length}`);

    // Font loading analysis
    const fontFaces = await page.evaluate(() => {
      return Array.from(document.fonts).map(font => ({
        family: font.family,
        status: font.status,
        display: font.display
      }));
    });

    console.log('\n🔤 Font Loading Analysis:');
    fontFaces.forEach(font => {
      console.log(`   ${font.family}: ${font.status} (display: ${font.display || 'auto'})`);
    });

    // Performance score calculation
    let score = 100;
    if (metrics.lcp > 2500) score -= 30;
    else if (metrics.lcp > 1200) score -= 15;
    
    if (metrics.fcp > 1800) score -= 20;
    else if (metrics.fcp > 900) score -= 10;

    if (metrics.renderDelay > 1000) score -= 25;
    else if (metrics.renderDelay > 500) score -= 10;

    console.log('\n🏆 Performance Score:');
    console.log(`   Overall Score: ${Math.max(0, score)}/100`);
    
    if (metrics.lcp && metrics.lcp < 1200) {
      console.log('   ✅ LCP: EXCELLENT (< 1.2s)');
    } else if (metrics.lcp && metrics.lcp < 2500) {
      console.log('   ⚠️ LCP: NEEDS IMPROVEMENT (1.2s - 2.5s)');
    } else {
      console.log('   ❌ LCP: POOR (> 2.5s)');
    }

    if (metrics.renderDelay && metrics.renderDelay < 100) {
      console.log('   ✅ Render Delay: EXCELLENT (< 100ms)');
    } else if (metrics.renderDelay && metrics.renderDelay < 500) {
      console.log('   ⚠️ Render Delay: GOOD (100ms - 500ms)');
    } else {
      console.log('   ❌ Render Delay: POOR (> 500ms)');
    }

    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'lcp-test-screenshot.png',
      fullPage: false 
    });
    console.log('\n📸 Screenshot saved as: lcp-test-screenshot.png');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testLCPPerformance().catch(console.error);
