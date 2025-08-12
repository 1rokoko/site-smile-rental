const fs = require('fs');
const path = require('path');

// Files to clean up after optimization
const filesToCleanup = [
  // Performance testing files (keep the main ones, remove temporary)
  'performance-results-1754936153369.json',
  'optimization-validation-1754936426961.json',
  'lcp-test-screenshot.png',
  
  // Temporary testing scripts (keep the main ones for future use)
  // 'test-lcp-performance.js', // Keep this
  // 'performance-test-suite.js', // Keep this
  // 'validate-optimizations.js', // Keep this
  // 'extract-critical-css.js', // Keep this
  
  // Lighthouse files
  'lighthouse-audit.js', // Keep for future use but note it has import issues
  
  // Critical CSS file (already inlined, so external file not needed)
  'public/critical.css'
];

// Directories to check for cleanup (but be careful not to remove important files)
const directoriesToCheck = [
  './logs',
  './backup'
];

function cleanupOptimizationFiles() {
  console.log('🧹 CLEANING UP OPTIMIZATION FILES');
  console.log('=' .repeat(40));

  let cleanedCount = 0;
  let keptCount = 0;

  filesToCleanup.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed: ${filePath}`);
        cleanedCount++;
      } catch (error) {
        console.log(`❌ Failed to remove: ${filePath} - ${error.message}`);
      }
    } else {
      console.log(`⚠️ Not found: ${filePath}`);
    }
  });

  // List important files to keep
  const importantFiles = [
    'LCP-OPTIMIZATION-GUIDE.md',
    'test-lcp-performance.js',
    'performance-test-suite.js',
    'validate-optimizations.js',
    'extract-critical-css.js',
    'cleanup-optimization-files.js'
  ];

  console.log('\n📋 IMPORTANT FILES KEPT:');
  importantFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Kept: ${file}`);
      keptCount++;
    }
  });

  console.log('\n📊 CLEANUP SUMMARY:');
  console.log(`Files cleaned: ${cleanedCount}`);
  console.log(`Important files kept: ${keptCount}`);
  
  console.log('\n💡 OPTIMIZATION FILES ORGANIZATION:');
  console.log('📁 Performance Testing Tools:');
  console.log('   - test-lcp-performance.js (Basic LCP testing)');
  console.log('   - performance-test-suite.js (Comprehensive testing)');
  console.log('   - validate-optimizations.js (Validation suite)');
  console.log('📁 Optimization Tools:');
  console.log('   - extract-critical-css.js (Critical CSS extraction)');
  console.log('   - cleanup-optimization-files.js (This cleanup script)');
  console.log('📁 Documentation:');
  console.log('   - LCP-OPTIMIZATION-GUIDE.md (Complete optimization guide)');

  console.log('\n✅ Cleanup completed successfully!');
}

// Run cleanup
cleanupOptimizationFiles();
