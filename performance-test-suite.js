const { chromium } = require('playwright');
const fs = require('fs');

class PerformanceTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {}
    };
  }

  async runFullSuite() {
    console.log('🚀 COMPREHENSIVE PERFORMANCE TEST SUITE');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      // Test different scenarios
      await this.testDesktop(browser);
      await this.testMobile(browser);
      await this.testSlowConnection(browser);
      
      this.generateSummary();
      this.saveResults();
      this.displayResults();

    } finally {
      await browser.close();
    }
  }

  async testDesktop(browser) {
    console.log('\n📊 Testing Desktop Performance...');
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const result = await this.runPerformanceTest(context, 'Desktop');
    this.results.tests.push(result);
    await context.close();
  }

  async testMobile(browser) {
    console.log('\n📱 Testing Mobile Performance...');
    
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });

    const result = await this.runPerformanceTest(context, 'Mobile');
    this.results.tests.push(result);
    await context.close();
  }

  async testSlowConnection(browser) {
    console.log('\n🐌 Testing Slow Connection Performance...');
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    // Simulate slow 3G connection
    const page = await context.newPage();
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 kbps
      uploadThroughput: 500 * 1024 / 8,
      latency: 400
    });

    const result = await this.runPerformanceTest(context, 'Slow 3G', page);
    this.results.tests.push(result);
    await context.close();
  }

  async runPerformanceTest(context, testName, existingPage = null) {
    const page = existingPage || await context.newPage();
    
    // Performance monitoring setup
    await page.addInitScript(() => {
      window.performanceMetrics = {
        lcp: null,
        fcp: null,
        cls: null,
        fid: null,
        ttfb: null,
        renderDelay: null,
        navigationStart: performance.timeOrigin
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
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          window.performanceMetrics.fcp = fcpEntry.startTime;
        }
      }).observe({ entryTypes: ['paint'] });

      // Capture TTFB
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries[0].name === location.href) {
          window.performanceMetrics.ttfb = entries[0].responseStart;
        }
      }).observe({ entryTypes: ['navigation'] });

      // Capture CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.performanceMetrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    });

    const startTime = Date.now();
    
    try {
      await page.goto('http://localhost:3001', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      // Wait for metrics to be captured
      await page.waitForTimeout(3000);

      const metrics = await page.evaluate(() => window.performanceMetrics);
      const loadTime = Date.now() - startTime;

      // Additional checks
      const headingVisible = await page.isVisible('h1:has-text("№1 Scooter Rental for")');
      const headingText = await page.textContent('h1:has-text("№1 Scooter Rental for")');
      const animationElements = await page.$$('[class*="motion"]');
      
      // Font analysis
      const fontFaces = await page.evaluate(() => {
        return Array.from(document.fonts).map(font => ({
          family: font.family,
          status: font.status,
          display: font.display
        }));
      });

      // Resource timing
      const resourceTiming = await page.evaluate(() => {
        return performance.getEntriesByType('resource').map(entry => ({
          name: entry.name,
          duration: entry.duration,
          transferSize: entry.transferSize,
          type: entry.initiatorType
        }));
      });

      const result = {
        testName,
        timestamp: new Date().toISOString(),
        metrics: {
          totalLoadTime: loadTime,
          ttfb: metrics.ttfb ? Math.round(metrics.ttfb) : null,
          fcp: metrics.fcp ? Math.round(metrics.fcp) : null,
          lcp: metrics.lcp ? Math.round(metrics.lcp) : null,
          renderDelay: metrics.renderDelay ? Math.round(metrics.renderDelay) : null,
          cls: metrics.cls ? Math.round(metrics.cls * 1000) / 1000 : null
        },
        checks: {
          headingVisible,
          headingText: headingText || 'Not found',
          animationElements: animationElements.length,
          fontsLoaded: fontFaces.filter(f => f.status === 'loaded').length,
          totalFonts: fontFaces.length
        },
        resources: {
          totalResources: resourceTiming.length,
          totalTransferSize: resourceTiming.reduce((sum, r) => sum + (r.transferSize || 0), 0),
          slowestResource: resourceTiming.reduce((slowest, r) => 
            r.duration > (slowest?.duration || 0) ? r : slowest, null)
        },
        score: this.calculateScore(metrics)
      };

      console.log(`   ${testName}: LCP ${result.metrics.lcp}ms, Score ${result.score}/100`);
      return result;

    } catch (error) {
      console.error(`   ❌ ${testName} failed:`, error.message);
      return {
        testName,
        error: error.message,
        score: 0
      };
    }
  }

  calculateScore(metrics) {
    let score = 100;
    
    // LCP scoring
    if (metrics.lcp > 2500) score -= 40;
    else if (metrics.lcp > 1200) score -= 20;
    
    // FCP scoring
    if (metrics.fcp > 1800) score -= 25;
    else if (metrics.fcp > 900) score -= 10;
    
    // Render delay scoring
    if (metrics.renderDelay > 1000) score -= 25;
    else if (metrics.renderDelay > 500) score -= 10;
    
    // CLS scoring
    if (metrics.cls > 0.25) score -= 10;
    else if (metrics.cls > 0.1) score -= 5;

    return Math.max(0, score);
  }

  generateSummary() {
    const validTests = this.results.tests.filter(t => !t.error);
    
    if (validTests.length === 0) {
      this.results.summary = { error: 'No valid test results' };
      return;
    }

    this.results.summary = {
      averageScore: Math.round(validTests.reduce((sum, t) => sum + t.score, 0) / validTests.length),
      averageLCP: Math.round(validTests.reduce((sum, t) => sum + (t.metrics?.lcp || 0), 0) / validTests.length),
      averageFCP: Math.round(validTests.reduce((sum, t) => sum + (t.metrics?.fcp || 0), 0) / validTests.length),
      bestTest: validTests.reduce((best, t) => t.score > best.score ? t : best),
      worstTest: validTests.reduce((worst, t) => t.score < worst.score ? t : worst),
      improvements: this.getImprovementSuggestions(validTests)
    };
  }

  getImprovementSuggestions(tests) {
    const suggestions = [];
    const avgLCP = tests.reduce((sum, t) => sum + (t.metrics?.lcp || 0), 0) / tests.length;
    const avgRenderDelay = tests.reduce((sum, t) => sum + (t.metrics?.renderDelay || 0), 0) / tests.length;

    if (avgLCP > 2500) {
      suggestions.push('LCP is poor (>2.5s). Consider further image optimization and critical resource prioritization.');
    } else if (avgLCP > 1200) {
      suggestions.push('LCP needs improvement (1.2s-2.5s). Consider preloading critical resources.');
    }

    if (avgRenderDelay > 500) {
      suggestions.push('High render delay detected. Consider removing animations from critical elements.');
    }

    return suggestions;
  }

  saveResults() {
    const filename = `performance-results-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results saved to: ${filename}`);
  }

  displayResults() {
    console.log('\n🏆 PERFORMANCE TEST SUMMARY');
    console.log('=' .repeat(40));
    console.log(`Average Score: ${this.results.summary.averageScore}/100`);
    console.log(`Average LCP: ${this.results.summary.averageLCP}ms`);
    console.log(`Average FCP: ${this.results.summary.averageFCP}ms`);
    
    if (this.results.summary.improvements?.length > 0) {
      console.log('\n💡 Improvement Suggestions:');
      this.results.summary.improvements.forEach(suggestion => {
        console.log(`   • ${suggestion}`);
      });
    }
  }
}

// Run the test suite
const testSuite = new PerformanceTestSuite();
testSuite.runFullSuite().catch(console.error);
