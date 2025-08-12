const { chromium } = require('playwright');

async function finalValidationTest() {
  console.log('🎯 FINAL VALIDATION TEST');
  console.log('=' .repeat(50));
  console.log('Testing localhost:3000 accessibility after proxy fix');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  const results = {
    serverStatus: {},
    proxyConfig: {},
    browserTest: {},
    networkTest: {},
    finalStatus: 'UNKNOWN'
  };

  // Test 1: Verify server is still running
  console.log('1️⃣ VERIFYING SERVER STATUS');
  console.log('-' .repeat(30));
  
  try {
    const serverCheck = await checkServerRunning();
    results.serverStatus = serverCheck;
    
    if (serverCheck.running) {
      console.log('✅ Development server is running');
      console.log(`   Process: ${serverCheck.process}`);
    } else {
      console.log('❌ Development server is NOT running');
      console.log('🚨 CRITICAL: Server must be running for localhost access');
    }
  } catch (error) {
    console.log(`❌ Server check failed: ${error.message}`);
    results.serverStatus = { running: false, error: error.message };
  }

  // Test 2: Verify proxy configuration
  console.log('\n2️⃣ VERIFYING PROXY CONFIGURATION');
  console.log('-' .repeat(35));
  
  try {
    const proxyCheck = await checkProxyBypass();
    results.proxyConfig = proxyCheck;
    
    if (proxyCheck.bypassesLocalhost) {
      console.log('✅ Localhost is in proxy bypass list');
      console.log(`   Bypass list: ${proxyCheck.bypassList}`);
    } else {
      console.log('❌ Localhost is NOT in proxy bypass list');
      console.log('⚠️ This may cause browser access issues');
    }
  } catch (error) {
    console.log(`❌ Proxy check failed: ${error.message}`);
    results.proxyConfig = { error: error.message };
  }

  // Test 3: Test browser accessibility
  console.log('\n3️⃣ TESTING BROWSER ACCESSIBILITY');
  console.log('-' .repeat(35));
  
  try {
    const browserTest = await testBrowserAccess();
    results.browserTest = browserTest;
    
    if (browserTest.success) {
      console.log('✅ Browser can access localhost:3000');
      console.log(`   Status: ${browserTest.status}`);
      console.log(`   Load time: ${browserTest.loadTime}ms`);
      console.log(`   Title: "${browserTest.title}"`);
    } else {
      console.log('❌ Browser cannot access localhost:3000');
      console.log(`   Error: ${browserTest.error}`);
    }
  } catch (error) {
    console.log(`❌ Browser test failed: ${error.message}`);
    results.browserTest = { success: false, error: error.message };
  }

  // Test 4: Network connectivity test
  console.log('\n4️⃣ TESTING NETWORK CONNECTIVITY');
  console.log('-' .repeat(35));
  
  try {
    const networkTest = await testNetworkConnectivity();
    results.networkTest = networkTest;
    
    console.log(`DNS Resolution: ${networkTest.dns ? '✅' : '❌'}`);
    console.log(`Port Accessible: ${networkTest.port ? '✅' : '❌'}`);
    console.log(`Response Time: ${networkTest.responseTime}ms`);
  } catch (error) {
    console.log(`❌ Network test failed: ${error.message}`);
    results.networkTest = { error: error.message };
  }

  // Final assessment
  console.log('\n🎯 FINAL ASSESSMENT');
  console.log('-' .repeat(25));
  
  const allTestsPassed = results.serverStatus.running && 
                        results.proxyConfig.bypassesLocalhost && 
                        results.browserTest.success && 
                        results.networkTest.dns && 
                        results.networkTest.port;
  
  if (allTestsPassed) {
    results.finalStatus = 'SUCCESS';
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ localhost:3000 is fully accessible');
    console.log('✅ Proxy configuration is correct');
    console.log('✅ Development server is running');
    console.log('✅ Network connectivity is working');
    
    console.log('\n🌐 USER INSTRUCTIONS:');
    console.log('1. Open your regular browser');
    console.log('2. Navigate to: http://localhost:3000');
    console.log('3. The Smile Rental website should load');
    console.log('4. Development server will auto-reload on changes');
  } else {
    results.finalStatus = 'ISSUES_DETECTED';
    console.log('⚠️ SOME ISSUES DETECTED');
    
    if (!results.serverStatus.running) {
      console.log('❌ Server not running - Run: node start-localhost-3000.js');
    }
    if (!results.proxyConfig.bypassesLocalhost) {
      console.log('❌ Proxy not configured - Run: node fix-localhost-proxy.js');
    }
    if (!results.browserTest.success) {
      console.log('❌ Browser access failed - Check proxy settings');
    }
    if (!results.networkTest.dns || !results.networkTest.port) {
      console.log('❌ Network issues - Check DNS and port accessibility');
    }
  }

  return results;
}

// Helper function to check if server is running
function checkServerRunning() {
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const netstat = spawn('netstat', ['-ano'], { stdio: 'pipe' });
    
    let output = '';
    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstat.on('close', () => {
      const port3000Lines = output.split('\n').filter(line => 
        line.includes(':3000') && line.includes('LISTENING')
      );
      
      if (port3000Lines.length > 0) {
        const pidMatch = port3000Lines[0].match(/\s+(\d+)\s*$/);
        resolve({
          running: true,
          process: `PID ${pidMatch ? pidMatch[1] : 'Unknown'}`
        });
      } else {
        resolve({ running: false });
      }
    });
  });
}

// Helper function to check proxy bypass
function checkProxyBypass() {
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const netsh = spawn('netsh', ['winhttp', 'show', 'proxy'], { stdio: 'pipe' });
    
    let output = '';
    netsh.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netsh.on('close', () => {
      const bypassMatch = output.match(/Bypass List\s*:\s*(.+)/);
      const bypassList = bypassMatch ? bypassMatch[1].trim() : '';
      const bypassesLocalhost = bypassList.toLowerCase().includes('localhost') || 
                               bypassList.toLowerCase().includes('127.0.0.1');
      
      resolve({
        bypassList: bypassList,
        bypassesLocalhost: bypassesLocalhost
      });
    });
  });
}

// Helper function to test browser access
function testBrowserAccess() {
  return new Promise(async (resolve) => {
    const browser = await chromium.launch({ headless: true });
    
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const startTime = Date.now();
      const response = await page.goto('http://localhost:3000', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      const loadTime = Date.now() - startTime;
      
      const title = await page.title();
      
      resolve({
        success: true,
        status: response.status(),
        loadTime: loadTime,
        title: title
      });
      
    } catch (error) {
      resolve({
        success: false,
        error: error.message
      });
    } finally {
      await browser.close();
    }
  });
}

// Helper function to test network connectivity
function testNetworkConnectivity() {
  return new Promise((resolve) => {
    const dns = require('dns');
    const net = require('net');
    
    // Test DNS
    dns.lookup('localhost', (dnsErr, address) => {
      const dnsWorks = !dnsErr;
      
      // Test port
      const socket = new net.Socket();
      const startTime = Date.now();
      
      socket.setTimeout(3000);
      
      socket.on('connect', () => {
        const responseTime = Date.now() - startTime;
        socket.destroy();
        resolve({
          dns: dnsWorks,
          port: true,
          responseTime: responseTime
        });
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          dns: dnsWorks,
          port: false,
          responseTime: 3000
        });
      });
      
      socket.on('error', () => {
        socket.destroy();
        resolve({
          dns: dnsWorks,
          port: false,
          responseTime: -1
        });
      });
      
      socket.connect(3000, 'localhost');
    });
  });
}

// Export for use as module
module.exports = finalValidationTest;

// Run if called directly
if (require.main === module) {
  finalValidationTest()
    .then(results => {
      console.log('\n📊 VALIDATION SUMMARY');
      console.log('=' .repeat(30));
      console.log(`Final Status: ${results.finalStatus}`);
      
      if (results.finalStatus === 'SUCCESS') {
        console.log('\n🎉 MISSION ACCOMPLISHED!');
        console.log('localhost:3000 is now fully accessible in your regular browser');
      } else {
        console.log('\n⚠️ Additional work needed');
        console.log('Check the issues above and follow the recommended actions');
      }
      
      console.log('\n📋 DETAILED RESULTS:');
      console.log(JSON.stringify(results, null, 2));
    })
    .catch(console.error);
}
