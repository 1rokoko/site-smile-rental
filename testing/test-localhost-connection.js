const { chromium } = require('playwright');
const net = require('net');

async function testLocalhostConnection() {
  console.log('🔍 TESTING LOCALHOST:3000 CONNECTION STATUS');
  console.log('=' .repeat(50));

  // Test 1: Basic port connectivity
  console.log('\n1️⃣ TESTING PORT CONNECTIVITY');
  console.log('-' .repeat(30));
  
  const portTest = await testPort(3000);
  console.log(`Port 3000 status: ${portTest.status}`);
  if (portTest.error) {
    console.log(`Error: ${portTest.error}`);
  }

  // Test 2: HTTP connection test
  console.log('\n2️⃣ TESTING HTTP CONNECTION');
  console.log('-' .repeat(30));
  
  const httpTest = await testHTTPConnection('http://localhost:3000');
  console.log(`HTTP status: ${httpTest.status}`);
  if (httpTest.error) {
    console.log(`Error: ${httpTest.error}`);
  }

  // Test 3: Alternative localhost addresses
  console.log('\n3️⃣ TESTING ALTERNATIVE ADDRESSES');
  console.log('-' .repeat(30));
  
  const alternatives = [
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    'http://localhost:3001'
  ];

  for (const url of alternatives) {
    const test = await testHTTPConnection(url);
    console.log(`${url}: ${test.status}`);
    if (test.error && !test.error.includes('ECONNREFUSED')) {
      console.log(`  Error: ${test.error}`);
    }
  }

  // Test 4: Browser-based test
  console.log('\n4️⃣ TESTING WITH BROWSER');
  console.log('-' .repeat(30));
  
  const browserTest = await testWithBrowser();
  console.log(`Browser test: ${browserTest.status}`);
  if (browserTest.error) {
    console.log(`Error: ${browserTest.error}`);
  }

  // Test 5: Check for running development servers
  console.log('\n5️⃣ CHECKING FOR RUNNING SERVERS');
  console.log('-' .repeat(30));
  
  const serverCheck = await checkRunningServers();
  console.log(`Server check: ${serverCheck.status}`);
  if (serverCheck.details) {
    console.log(`Details: ${serverCheck.details}`);
  }

  // Summary
  console.log('\n📊 CONNECTION DIAGNOSIS SUMMARY');
  console.log('=' .repeat(40));
  
  if (httpTest.status === 'SUCCESS') {
    console.log('✅ localhost:3000 is WORKING');
    console.log('🎉 Development server is accessible');
  } else if (portTest.status === 'OCCUPIED') {
    console.log('⚠️ Port 3000 is OCCUPIED by another process');
    console.log('💡 Need to kill the process or use alternative port');
  } else {
    console.log('❌ localhost:3000 is NOT ACCESSIBLE');
    console.log('🔧 Development server needs to be started');
  }

  return {
    portTest,
    httpTest,
    browserTest,
    serverCheck,
    working: httpTest.status === 'SUCCESS'
  };
}

function testPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(3000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve({ status: 'OCCUPIED', message: 'Port is in use' });
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ status: 'TIMEOUT', error: 'Connection timeout' });
    });
    
    socket.on('error', (err) => {
      socket.destroy();
      if (err.code === 'ECONNREFUSED') {
        resolve({ status: 'AVAILABLE', message: 'Port is available' });
      } else {
        resolve({ status: 'ERROR', error: err.message });
      }
    });
    
    socket.connect(port, 'localhost');
  });
}

async function testHTTPConnection(url) {
  try {
    const response = await fetch(url, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    return {
      status: 'SUCCESS',
      statusCode: response.status,
      message: `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      status: 'FAILED',
      error: error.message
    };
  }
}

async function testWithBrowser() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const response = await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    const title = await page.title();
    
    return {
      status: 'SUCCESS',
      statusCode: response.status(),
      title: title
    };
  } catch (error) {
    return {
      status: 'FAILED',
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function checkRunningServers() {
  try {
    // This is a simplified check - in a real scenario, we'd use system commands
    // to check for running Node.js processes
    const portTest = await testPort(3000);
    
    if (portTest.status === 'OCCUPIED') {
      return {
        status: 'FOUND',
        details: 'Process detected on port 3000'
      };
    } else {
      return {
        status: 'NONE',
        details: 'No server detected on port 3000'
      };
    }
  } catch (error) {
    return {
      status: 'ERROR',
      details: error.message
    };
  }
}

// Run the test
testLocalhostConnection().catch(console.error);
