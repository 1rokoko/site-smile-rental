const { spawn } = require('child_process');

async function fixLocalhostProxy() {
  console.log('🔧 LOCALHOST PROXY FIX TOOL');
  console.log('=' .repeat(50));
  console.log('This tool will help configure your system to allow localhost:3000 access');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  const results = {
    currentConfig: {},
    fixes: [],
    success: false
  };

  // Step 1: Check current proxy configuration
  console.log('1️⃣ CHECKING CURRENT PROXY CONFIGURATION');
  console.log('-' .repeat(45));
  
  try {
    const currentConfig = await getCurrentProxyConfig();
    results.currentConfig = currentConfig;
    
    console.log(`Proxy Status: ${currentConfig.enabled ? 'ENABLED' : 'DISABLED'}`);
    if (currentConfig.enabled) {
      console.log(`Proxy Server: ${currentConfig.server || 'Auto-detect'}`);
      console.log(`Bypass List: ${currentConfig.bypassList || 'Empty'}`);
      console.log(`Localhost Bypassed: ${currentConfig.bypassesLocalhost ? 'YES' : 'NO'}`);
    }
  } catch (error) {
    console.log(`❌ Failed to check proxy config: ${error.message}`);
    results.currentConfig = { error: error.message };
  }

  // Step 2: Attempt automated fix
  console.log('\n2️⃣ ATTEMPTING AUTOMATED PROXY FIX');
  console.log('-' .repeat(40));
  
  if (results.currentConfig.enabled && !results.currentConfig.bypassesLocalhost) {
    console.log('🔧 Proxy is enabled but localhost is not bypassed');
    console.log('Attempting to add localhost to bypass list...');
    
    try {
      const fixResult = await addLocalhostToBypass();
      results.fixes.push(fixResult);
      
      if (fixResult.success) {
        console.log('✅ Successfully added localhost to proxy bypass list');
        results.success = true;
      } else {
        console.log(`❌ Automated fix failed: ${fixResult.error}`);
        console.log('💡 Manual configuration required (see instructions below)');
      }
    } catch (error) {
      console.log(`❌ Automated fix error: ${error.message}`);
      results.fixes.push({ success: false, error: error.message });
    }
  } else if (!results.currentConfig.enabled) {
    console.log('✅ No proxy detected - localhost should work');
    results.success = true;
  } else if (results.currentConfig.bypassesLocalhost) {
    console.log('✅ Localhost is already in proxy bypass list');
    results.success = true;
  }

  // Step 3: Test localhost access
  console.log('\n3️⃣ TESTING LOCALHOST ACCESS');
  console.log('-' .repeat(30));
  
  try {
    const accessTest = await testLocalhostAccess();
    results.accessTest = accessTest;
    
    if (accessTest.accessible) {
      console.log('✅ localhost:3000 is accessible!');
      console.log(`Response time: ${accessTest.responseTime}ms`);
      results.success = true;
    } else {
      console.log('❌ localhost:3000 is still not accessible');
      console.log(`Error: ${accessTest.error}`);
    }
  } catch (error) {
    console.log(`❌ Access test failed: ${error.message}`);
    results.accessTest = { accessible: false, error: error.message };
  }

  // Step 4: Provide next steps
  console.log('\n4️⃣ NEXT STEPS');
  console.log('-' .repeat(15));
  
  if (results.success) {
    console.log('🎉 SUCCESS! localhost:3000 should now be accessible');
    console.log('\n📋 TO TEST:');
    console.log('1. Open your browser');
    console.log('2. Go to: http://localhost:3000');
    console.log('3. The Smile Rental website should load');
    
    console.log('\n💡 IF STILL NOT WORKING:');
    console.log('1. Restart your browser completely');
    console.log('2. Clear browser cache (Ctrl+Shift+Delete)');
    console.log('3. Try incognito/private mode');
  } else {
    console.log('⚠️ Automated fix was not successful');
    console.log('\n📋 MANUAL STEPS REQUIRED:');
    console.log('1. Open: BROWSER-PROXY-FIX-INSTRUCTIONS.md');
    console.log('2. Follow the step-by-step instructions');
    console.log('3. Add "localhost;127.0.0.1;::1" to proxy bypass list');
    console.log('4. Restart your browser');
    
    console.log('\n🚨 QUICK TEST:');
    console.log('Try opening localhost:3000 in incognito/private mode');
    console.log('If it works there, the issue is definitely proxy-related');
  }

  return results;
}

// Helper function to get current proxy configuration
function getCurrentProxyConfig() {
  return new Promise((resolve, reject) => {
    const netsh = spawn('netsh', ['winhttp', 'show', 'proxy'], { stdio: 'pipe' });
    
    let output = '';
    netsh.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netsh.on('close', (code) => {
      if (code === 0) {
        const isDirect = output.includes('Direct access (no proxy server)');
        const serverMatch = output.match(/Proxy Server\(s\)\s*:\s*(.+)/);
        const bypassMatch = output.match(/Bypass List\s*:\s*(.+)/);
        
        const bypassList = bypassMatch ? bypassMatch[1].trim() : '';
        const bypassesLocalhost = bypassList.toLowerCase().includes('localhost') || 
                                 bypassList.toLowerCase().includes('127.0.0.1') || 
                                 bypassList.toLowerCase().includes('::1');
        
        resolve({
          enabled: !isDirect,
          server: serverMatch ? serverMatch[1].trim() : '',
          bypassList: bypassList,
          bypassesLocalhost: bypassesLocalhost
        });
      } else {
        reject(new Error(`netsh command failed with code ${code}`));
      }
    });
  });
}

// Helper function to add localhost to proxy bypass
function addLocalhostToBypass() {
  return new Promise((resolve) => {
    console.log('Executing: netsh winhttp set proxy bypass-list="localhost;127.0.0.1;::1"');
    
    const netsh = spawn('netsh', ['winhttp', 'set', 'proxy', 'bypass-list=localhost;127.0.0.1;::1'], {
      stdio: 'pipe'
    });
    
    let output = '';
    let error = '';
    
    netsh.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netsh.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    netsh.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: 'Localhost added to proxy bypass list',
          output: output
        });
      } else {
        resolve({
          success: false,
          error: `Command failed (code ${code}): ${error}`,
          note: 'This command requires administrator privileges. Try running as administrator or use manual configuration.'
        });
      }
    });
  });
}

// Helper function to test localhost access
function testLocalhostAccess() {
  return new Promise((resolve) => {
    const net = require('net');
    const startTime = Date.now();
    
    const socket = new net.Socket();
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      const responseTime = Date.now() - startTime;
      socket.destroy();
      resolve({
        accessible: true,
        responseTime: responseTime
      });
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve({
        accessible: false,
        error: 'Connection timeout'
      });
    });
    
    socket.on('error', (error) => {
      socket.destroy();
      resolve({
        accessible: false,
        error: error.message
      });
    });
    
    socket.connect(3000, 'localhost');
  });
}

// Export for use as module
module.exports = fixLocalhostProxy;

// Run if called directly
if (require.main === module) {
  fixLocalhostProxy()
    .then(results => {
      console.log('\n📊 PROXY FIX SUMMARY');
      console.log('=' .repeat(30));
      
      if (results.success) {
        console.log('✅ LOCALHOST ACCESS FIXED!');
        console.log('🌐 Open your browser and go to: http://localhost:3000');
      } else {
        console.log('⚠️ MANUAL CONFIGURATION NEEDED');
        console.log('📖 See: BROWSER-PROXY-FIX-INSTRUCTIONS.md');
      }
      
      console.log('\n📋 DETAILED RESULTS:');
      console.log(JSON.stringify(results, null, 2));
      
      console.log('\n🔗 HELPFUL COMMANDS:');
      console.log('Test server: node testing/browser-diagnostic-helper.js');
      console.log('Check progress: open LOCALHOST-PROGRESS-TRACKER.md');
      console.log('Manual instructions: open BROWSER-PROXY-FIX-INSTRUCTIONS.md');
    })
    .catch(console.error);
}
