const { chromium } = require('playwright');
const fs = require('fs');

async function validateOptimizations() {
  console.log('✅ OPTIMIZATION VALIDATION SUITE');
  console.log('=' .repeat(50));

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Performance monitoring
    await page.addInitScript(() => {
      window.validationMetrics = {
        lcp: null,
        fcp: null,
        cls: null,
        ttfb: null,
        renderDelay: null,
        fontLoadTime: null,
        criticalResourcesLoaded: 0,
        totalResources: 0
      };

      // Track LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.validationMetrics.lcp = lastEntry.startTime;
        window.validationMetrics.renderDelay = lastEntry.renderTime - lastEntry.loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Track FCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          window.validationMetrics.fcp = fcpEntry.startTime;
        }
      }).observe({ entryTypes: ['paint'] });

      // Track TTFB
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries[0].name === location.href) {
          window.validationMetrics.ttfb = entries[0].responseStart;
        }
      }).observe({ entryTypes: ['navigation'] });

      // Track resource loading
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          window.validationMetrics.totalResources++;
          if (entry.name.includes('font') || entry.name.includes('css') || entry.name.includes('js')) {
            window.validationMetrics.criticalResourcesLoaded++;
          }
        });
      }).observe({ entryTypes: ['resource'] });

      // Track CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.validationMetrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    });

    console.log('\n🔍 Loading page and collecting metrics...');
    
    const startTime = Date.now();
    await page.goto('http://localhost:3001', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Wait for metrics collection
    await page.waitForTimeout(3000);

    const metrics = await page.evaluate(() => window.validationMetrics);
    const loadTime = Date.now() - startTime;

    console.log('\n📊 PERFORMANCE VALIDATION RESULTS');
    console.log('=' .repeat(40));

    // Core Web Vitals Validation
    const lcpScore = validateLCP(metrics.lcp);
    const fcpScore = validateFCP(metrics.fcp);
    const clsScore = validateCLS(metrics.cls);

    console.log(`LCP (Largest Contentful Paint): ${Math.round(metrics.lcp || 0)}ms ${lcpScore.status}`);
    console.log(`FCP (First Contentful Paint): ${Math.round(metrics.fcp || 0)}ms ${fcpScore.status}`);
    console.log(`CLS (Cumulative Layout Shift): ${(metrics.cls || 0).toFixed(3)} ${clsScore.status}`);
    console.log(`TTFB (Time to First Byte): ${Math.round(metrics.ttfb)}ms`);
    console.log(`Render Delay: ${Math.round(metrics.renderDelay)}ms`);

    // Optimization Checks
    console.log('\n🎯 OPTIMIZATION VALIDATION');
    console.log('=' .repeat(30));

    const checks = await performOptimizationChecks(page);
    
    checks.forEach(check => {
      console.log(`${check.status} ${check.name}: ${check.result}`);
    });

    // Font Loading Validation
    console.log('\n🔤 FONT OPTIMIZATION VALIDATION');
    console.log('=' .repeat(35));

    const fontChecks = await validateFontOptimizations(page);
    fontChecks.forEach(check => {
      console.log(`${check.status} ${check.name}: ${check.result}`);
    });

    // Critical CSS Validation
    console.log('\n🎨 CRITICAL CSS VALIDATION');
    console.log('=' .repeat(30));

    const cssChecks = await validateCriticalCSS(page);
    cssChecks.forEach(check => {
      console.log(`${check.status} ${check.name}: ${check.result}`);
    });

    // Overall Score Calculation
    const overallScore = calculateOverallScore(lcpScore, fcpScore, clsScore, checks, fontChecks, cssChecks);
    
    console.log('\n🏆 OVERALL OPTIMIZATION SCORE');
    console.log('=' .repeat(35));
    console.log(`Score: ${overallScore.score}/100 (${overallScore.grade})`);
    
    if (overallScore.improvements.length > 0) {
      console.log('\n💡 REMAINING IMPROVEMENTS:');
      overallScore.improvements.forEach((improvement, index) => {
        console.log(`   ${index + 1}. ${improvement}`);
      });
    }

    // Save validation report
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {
        lcp: Math.round(metrics.lcp),
        fcp: Math.round(metrics.fcp),
        cls: metrics.cls,
        ttfb: Math.round(metrics.ttfb),
        renderDelay: Math.round(metrics.renderDelay),
        totalLoadTime: loadTime
      },
      scores: { lcpScore, fcpScore, clsScore },
      checks,
      fontChecks,
      cssChecks,
      overallScore
    };

    const reportPath = `optimization-validation-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Validation report saved to: ${reportPath}`);

    return report;

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

function validateLCP(lcp) {
  lcp = lcp || 0;
  if (lcp <= 1200) return { score: 100, status: '✅ EXCELLENT' };
  if (lcp <= 2500) return { score: 75, status: '⚠️ GOOD' };
  return { score: 25, status: '❌ POOR' };
}

function validateFCP(fcp) {
  fcp = fcp || 0;
  if (fcp <= 900) return { score: 100, status: '✅ EXCELLENT' };
  if (fcp <= 1800) return { score: 75, status: '⚠️ GOOD' };
  return { score: 25, status: '❌ POOR' };
}

function validateCLS(cls) {
  cls = cls || 0;
  if (cls <= 0.1) return { score: 100, status: '✅ EXCELLENT' };
  if (cls <= 0.25) return { score: 75, status: '⚠️ GOOD' };
  return { score: 25, status: '❌ POOR' };
}

async function performOptimizationChecks(page) {
  const checks = [];

  // Check if FadeInView animations were removed from critical elements
  const animationElements = await page.$$('[class*="motion"]');
  checks.push({
    name: 'Critical animations removed',
    status: animationElements.length === 0 ? '✅' : '❌',
    result: animationElements.length === 0 ? 'No motion elements detected' : `${animationElements.length} motion elements found`
  });

  // Check if main heading is immediately visible
  const headingVisible = await page.isVisible('h1:has-text("№1 Scooter Rental for")');
  checks.push({
    name: 'Main heading immediately visible',
    status: headingVisible ? '✅' : '❌',
    result: headingVisible ? 'Heading renders immediately' : 'Heading not visible'
  });

  // Check for critical CSS inlining
  const inlinedCSS = await page.evaluate(() => {
    const styleElements = document.querySelectorAll('style');
    return Array.from(styleElements).some(style => 
      style.innerHTML.includes('Critical CSS for above-the-fold content')
    );
  });
  checks.push({
    name: 'Critical CSS inlined',
    status: inlinedCSS ? '✅' : '❌',
    result: inlinedCSS ? 'Critical CSS found in head' : 'No critical CSS detected'
  });

  // Check for resource hints
  const resourceHints = await page.evaluate(() => {
    const preconnects = document.querySelectorAll('link[rel="preconnect"]').length;
    const preloads = document.querySelectorAll('link[rel="preload"]').length;
    return { preconnects, preloads };
  });
  checks.push({
    name: 'Resource hints implemented',
    status: resourceHints.preconnects > 0 && resourceHints.preloads > 0 ? '✅' : '❌',
    result: `${resourceHints.preconnects} preconnects, ${resourceHints.preloads} preloads`
  });

  return checks;
}

async function validateFontOptimizations(page) {
  const checks = [];

  // Check font-display: swap
  const fontDisplay = await page.evaluate(() => {
    return Array.from(document.fonts).map(font => ({
      family: font.family,
      display: font.display,
      status: font.status
    }));
  });

  const swapFonts = fontDisplay.filter(font => font.display === 'swap').length;
  checks.push({
    name: 'Font display swap enabled',
    status: swapFonts > 0 ? '✅' : '❌',
    result: `${swapFonts}/${fontDisplay.length} fonts use display: swap`
  });

  // Check for font preloading
  const fontPreloads = await page.evaluate(() => {
    return document.querySelectorAll('link[rel="preload"][as="font"]').length;
  });
  checks.push({
    name: 'Critical fonts preloaded',
    status: fontPreloads > 0 ? '✅' : '❌',
    result: `${fontPreloads} fonts preloaded`
  });

  return checks;
}

async function validateCriticalCSS(page) {
  const checks = [];

  // Check for async CSS loading script
  const asyncCSSScript = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script');
    return Array.from(scripts).some(script => 
      script.innerHTML.includes('loadCSS') || script.innerHTML.includes('non-critical CSS')
    );
  });
  checks.push({
    name: 'Async CSS loading implemented',
    status: asyncCSSScript ? '✅' : '❌',
    result: asyncCSSScript ? 'Async CSS loader found' : 'No async CSS loading detected'
  });

  // Check for CSS containment
  const containmentCSS = await page.evaluate(() => {
    const styleElements = document.querySelectorAll('style');
    return Array.from(styleElements).some(style => 
      style.innerHTML.includes('contain:layout') || style.innerHTML.includes('CSS Containment')
    );
  });
  checks.push({
    name: 'CSS containment applied',
    status: containmentCSS ? '✅' : '❌',
    result: containmentCSS ? 'CSS containment rules found' : 'No CSS containment detected'
  });

  return checks;
}

function calculateOverallScore(lcpScore, fcpScore, clsScore, checks, fontChecks, cssChecks) {
  const coreWebVitalsScore = (lcpScore.score + fcpScore.score + clsScore.score) / 3;
  const optimizationScore = [...checks, ...fontChecks, ...cssChecks]
    .reduce((sum, check) => sum + (check.status === '✅' ? 100 : 0), 0) / (checks.length + fontChecks.length + cssChecks.length);
  
  const overallScore = Math.round((coreWebVitalsScore * 0.7) + (optimizationScore * 0.3));
  
  let grade;
  if (overallScore >= 90) grade = 'A+ (Excellent)';
  else if (overallScore >= 80) grade = 'A (Very Good)';
  else if (overallScore >= 70) grade = 'B (Good)';
  else if (overallScore >= 60) grade = 'C (Fair)';
  else grade = 'D (Needs Work)';

  const improvements = [];
  if (lcpScore.score < 100) improvements.push('Further optimize LCP through image optimization');
  if (fcpScore.score < 100) improvements.push('Optimize FCP with additional critical CSS inlining');
  if (clsScore.score < 100) improvements.push('Reduce layout shifts with proper sizing');

  return { score: overallScore, grade, improvements };
}

// Run validation
validateOptimizations().catch(console.error);
