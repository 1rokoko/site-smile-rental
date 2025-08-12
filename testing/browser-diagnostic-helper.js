const { spawn } = require('child_process');

async function browserDiagnosticHelper() {
  console.log('🔍 BROWSER DIAGNOSTIC HELPER');
  console.log('=' .repeat(50));
  console.log('This tool helps diagnose why localhost:3000 is not accessible in regular browsers');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  const diagnostics = {
    serverStatus: {},
    browserProxies: {},
    networkConfig: {},
    recommendations: []
  };

  // Check 1: Verify server is still running
  console.log('1️⃣ CHECKING SERVER STATUS');
  console.log('-' .repeat(30));
  
  try {
    const serverCheck = await checkServerStatus();
    diagnostics.serverStatus = serverCheck;
    
    if (serverCheck.running) {
      console.log('✅ Development server is running');
      console.log(`   Process: ${serverCheck.process}`);
      console.log(`   Port: ${serverCheck.port}`);
    } else {
      console.log('❌ Development server is NOT running');
      diagnostics.recommendations.push('CRITICAL: Start development server with: node start-localhost-3000.js');
    }
  } catch (error) {
    console.log(`❌ Server check failed: ${error.message}`);
    diagnostics.serverStatus = { running: false, error: error.message };
  }

  // Check 2: Analyze browser proxy configurations
  console.log('\n2️⃣ ANALYZING BROWSER PROXY SETTINGS');
  console.log('-' .repeat(40));
  
  try {
    const proxyInfo = await analyzeBrowserProxies();
    diagnostics.browserProxies = proxyInfo;
    
    if (proxyInfo.systemProxy.enabled) {
      console.log('⚠️ System proxy is enabled');
      console.log(`   Server: ${proxyInfo.systemProxy.server || 'Auto-detect'}`);
      
      if (!proxyInfo.systemProxy.bypassesLocalhost) {
        console.log('❌ Localhost is NOT in proxy bypass list');
        diagnostics.recommendations.push('HIGH: Add localhost to proxy bypass list');
      } else {
        console.log('✅ Localhost is in proxy bypass list');
      }
    } else {
      console.log('✅ No system proxy detected');
    }
  } catch (error) {
    console.log(`❌ Proxy analysis failed: ${error.message}`);
    diagnostics.browserProxies = { error: error.message };
  }

  // Check 3: Test network connectivity
  console.log('\n3️⃣ TESTING NETWORK CONNECTIVITY');
  console.log('-' .repeat(35));
  
  try {
    const networkTest = await testNetworkConnectivity();
    diagnostics.networkConfig = networkTest;
    
    console.log(`DNS Resolution: ${networkTest.dns.localhost ? '✅' : '❌'} localhost`);
    console.log(`Port Accessibility: ${networkTest.port.accessible ? '✅' : '❌'} port 3000`);
    console.log(`Loopback Interface: ${networkTest.loopback.active ? '✅' : '❌'} active`);
    
    if (!networkTest.dns.localhost) {
      diagnostics.recommendations.push('MEDIUM: DNS resolution issue for localhost');
    }
    if (!networkTest.port.accessible) {
      diagnostics.recommendations.push('HIGH: Port 3000 is not accessible');
    }
  } catch (error) {
    console.log(`❌ Network test failed: ${error.message}`);
    diagnostics.networkConfig = { error: error.message };
  }

  // Generate recommendations
  console.log('\n💡 DIAGNOSTIC RECOMMENDATIONS');
  console.log('-' .repeat(35));
  
  if (diagnostics.recommendations.length === 0) {
    console.log('🤔 No obvious issues detected. The problem may be browser-specific.');
    diagnostics.recommendations.push('Try incognito mode to test proxy bypass');
    diagnostics.recommendations.push('Check browser extensions that might block localhost');
    diagnostics.recommendations.push('Try a different browser (Chrome, Firefox, Edge)');
  }
  
  diagnostics.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });

  // Generate user instructions
  console.log('\n📋 INSTRUCTIONS FOR USER');
  console.log('-' .repeat(30));
  
  if (!diagnostics.serverStatus.running) {
    console.log('🚨 IMMEDIATE ACTION REQUIRED:');
    console.log('   Your development server is not running!');
    console.log('   Run this command: node start-localhost-3000.js');
  } else if (diagnostics.browserProxies.systemProxy?.enabled && !diagnostics.browserProxies.systemProxy?.bypassesLocalhost) {
    console.log('🔧 PROXY CONFIGURATION NEEDED:');
    console.log('   1. Open your browser settings');
    console.log('   2. Go to proxy settings');
    console.log('   3. Add "localhost;127.0.0.1;::1" to bypass list');
    console.log('   4. Restart browser');
  } else {
    console.log('🧪 TRY THESE STEPS:');
    console.log('   1. Test in incognito/private mode');
    console.log('   2. Clear browser cache and cookies');
    console.log('   3. Disable browser extensions temporarily');
    console.log('   4. Try a different browser');
  }

  return diagnostics;
}

// Helper function to check server status
function checkServerStatus() {
  return new Promise((resolve) => {
    const netstat = spawn('netstat', ['-ano'], { stdio: 'pipe' });
    
    let output = '';
    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstat.on('close', () => {
      const lines = output.split('\n');
      const port3000Lines = lines.filter(line => line.includes(':3000') && line.includes('LISTENING'));
      
      if (port3000Lines.length > 0) {
        const pidMatch = port3000Lines[0].match(/\s+(\d+)\s*$/);
        const pid = pidMatch ? pidMatch[1] : 'Unknown';
        
        resolve({
          running: true,
          port: '3000',
          process: `PID ${pid}`,
          details: port3000Lines[0].trim()
        });
      } else {
        resolve({
          running: false,
          port: '3000',
          process: 'None',
          details: 'No process listening on port 3000'
        });
      }
    });
  });
}

// Helper function to analyze browser proxies
function analyzeBrowserProxies() {
  return new Promise((resolve) => {
    const netsh = spawn('netsh', ['winhttp', 'show', 'proxy'], { stdio: 'pipe' });
    
    let output = '';
    netsh.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netsh.on('close', () => {
      const isDirect = output.includes('Direct access (no proxy server)');
      const serverMatch = output.match(/Proxy Server\(s\)\s*:\s*(.+)/);
      const bypassMatch = output.match(/Bypass List\s*:\s*(.+)/);
      
      const bypassList = bypassMatch ? bypassMatch[1].toLowerCase() : '';
      const bypassesLocalhost = bypassList.includes('localhost') || 
                               bypassList.includes('127.0.0.1') || 
                               bypassList.includes('::1');
      
      resolve({
        systemProxy: {
          enabled: !isDirect,
          server: serverMatch ? serverMatch[1].trim() : '',
          bypassList: bypassList,
          bypassesLocalhost: bypassesLocalhost
        }
      });
    });
  });
}

// Helper function to test network connectivity
function testNetworkConnectivity() {
  return new Promise((resolve) => {
    const dns = require('dns');
    const net = require('net');
    
    // Test DNS resolution
    dns.lookup('localhost', (err, address) => {
      const dnsWorks = !err && (address === '127.0.0.1' || address === '::1');
      
      // Test port accessibility
      const socket = new net.Socket();
      socket.setTimeout(2000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve({
          dns: { localhost: dnsWorks, address: address || 'Failed' },
          port: { accessible: true },
          loopback: { active: true }
        });
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          dns: { localhost: dnsWorks, address: address || 'Failed' },
          port: { accessible: false },
          loopback: { active: true }
        });
      });
      
      socket.on('error', () => {
        socket.destroy();
        resolve({
          dns: { localhost: dnsWorks, address: address || 'Failed' },
          port: { accessible: false },
          loopback: { active: false }
        });
      });
      
      socket.connect(3000, 'localhost');
    });
  });
}

// Export for use as module
module.exports = browserDiagnosticHelper;

// Run if called directly
if (require.main === module) {
  browserDiagnosticHelper()
    .then(results => {
      console.log('\n📊 DIAGNOSTIC SUMMARY');
      console.log('=' .repeat(30));
      console.log(JSON.stringify(results, null, 2));
      
      console.log('\n🎯 NEXT STEPS FOR USER:');
      console.log('1. Follow the instructions above');
      console.log('2. Test localhost:3000 in your browser');
      console.log('3. Report back with results');
    })
    .catch(console.error);
}
