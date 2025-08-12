const { spawn } = require('child_process');

async function checkWindowsNetwork() {
  console.log('🔍 CHECKING WINDOWS NETWORK CONFIGURATION');
  console.log('=' .repeat(55));
  console.log(`Check started at: ${new Date().toISOString()}`);

  const results = {
    dnsResolution: {},
    hostsFile: {},
    networkConfig: {},
    proxySettings: {}
  };

  // Test 1: DNS Resolution
  console.log('\n1️⃣ TESTING DNS RESOLUTION');
  console.log('-' .repeat(30));

  const dnsTests = [
    { name: 'localhost', address: 'localhost' },
    { name: '127.0.0.1', address: '127.0.0.1' },
    { name: 'google.com', address: 'google.com' }
  ];

  for (const test of dnsTests) {
    try {
      console.log(`Testing DNS resolution for ${test.name}...`);
      const dnsResult = await testDNSResolution(test.address);
      results.dnsResolution[test.name] = dnsResult;
      
      if (dnsResult.success) {
        console.log(`   ✅ ${test.name} resolves to: ${dnsResult.addresses.join(', ')}`);
      } else {
        console.log(`   ❌ ${test.name} failed: ${dnsResult.error}`);
      }
    } catch (error) {
      console.log(`   ❌ ${test.name} error: ${error.message}`);
      results.dnsResolution[test.name] = { success: false, error: error.message };
    }
  }

  // Test 2: Check hosts file
  console.log('\n2️⃣ CHECKING HOSTS FILE');
  console.log('-' .repeat(25));

  try {
    const hostsInfo = await checkHostsFile();
    results.hostsFile = hostsInfo;
    
    console.log('Hosts file entries:');
    hostsInfo.entries.forEach(entry => {
      console.log(`   ${entry.ip} -> ${entry.hostname}`);
    });
    
    const localhostEntry = hostsInfo.entries.find(e => e.hostname === 'localhost');
    if (localhostEntry) {
      console.log(`✅ localhost maps to: ${localhostEntry.ip}`);
    } else {
      console.log('⚠️ No explicit localhost entry found (using default)');
    }
  } catch (error) {
    console.log(`❌ Hosts file check failed: ${error.message}`);
    results.hostsFile = { success: false, error: error.message };
  }

  // Test 3: Network configuration
  console.log('\n3️⃣ CHECKING NETWORK CONFIGURATION');
  console.log('-' .repeat(35));

  try {
    const networkInfo = await getNetworkConfiguration();
    results.networkConfig = networkInfo;
    
    console.log('Network adapters:');
    networkInfo.adapters.forEach(adapter => {
      console.log(`   ${adapter.name}: ${adapter.status}`);
      if (adapter.ipv4) {
        console.log(`      IPv4: ${adapter.ipv4}`);
      }
      if (adapter.ipv6) {
        console.log(`      IPv6: ${adapter.ipv6}`);
      }
    });
  } catch (error) {
    console.log(`❌ Network config check failed: ${error.message}`);
    results.networkConfig = { success: false, error: error.message };
  }

  // Test 4: Check proxy settings
  console.log('\n4️⃣ CHECKING PROXY SETTINGS');
  console.log('-' .repeat(30));

  try {
    const proxyInfo = await checkProxySettings();
    results.proxySettings = proxyInfo;
    
    if (proxyInfo.enabled) {
      console.log(`⚠️ Proxy is enabled: ${proxyInfo.server}`);
      console.log(`   Bypass list: ${proxyInfo.bypass.join(', ')}`);
    } else {
      console.log('✅ No proxy configured');
    }
  } catch (error) {
    console.log(`❌ Proxy check failed: ${error.message}`);
    results.proxySettings = { success: false, error: error.message };
  }

  return results;
}

// Helper function to test DNS resolution
function testDNSResolution(hostname) {
  return new Promise((resolve) => {
    const dns = require('dns');
    
    dns.lookup(hostname, { all: true }, (err, addresses) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ 
          success: true, 
          addresses: addresses.map(addr => `${addr.address} (${addr.family})`)
        });
      }
    });
  });
}

// Helper function to check hosts file
function checkHostsFile() {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    
    try {
      const content = fs.readFileSync(hostsPath, 'utf8');
      const lines = content.split('\n');
      const entries = [];
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 2) {
            const ip = parts[0];
            const hostnames = parts.slice(1);
            hostnames.forEach(hostname => {
              entries.push({ ip, hostname });
            });
          }
        }
      });
      
      resolve({ success: true, entries });
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to get network configuration
function getNetworkConfiguration() {
  return new Promise((resolve, reject) => {
    const ipconfig = spawn('ipconfig', ['/all'], { stdio: 'pipe' });
    
    let output = '';
    ipconfig.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ipconfig.on('close', (code) => {
      if (code === 0) {
        const adapters = [];
        const sections = output.split('\n\n');
        
        sections.forEach(section => {
          const lines = section.split('\n');
          const adapter = { name: '', status: '', ipv4: '', ipv6: '' };
          
          lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.includes('adapter')) {
              adapter.name = trimmed;
            } else if (trimmed.includes('IPv4 Address')) {
              const match = trimmed.match(/:\s*([0-9.]+)/);
              if (match) adapter.ipv4 = match[1];
            } else if (trimmed.includes('IPv6 Address')) {
              const match = trimmed.match(/:\s*([a-f0-9:]+)/i);
              if (match) adapter.ipv6 = match[1];
            }
          });
          
          if (adapter.name) {
            adapters.push(adapter);
          }
        });
        
        resolve({ success: true, adapters });
      } else {
        reject(new Error(`ipconfig failed with code ${code}`));
      }
    });
  });
}

// Helper function to check proxy settings
function checkProxySettings() {
  return new Promise((resolve, reject) => {
    const netsh = spawn('netsh', ['winhttp', 'show', 'proxy'], { stdio: 'pipe' });
    
    let output = '';
    netsh.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netsh.on('close', (code) => {
      if (code === 0) {
        const proxyEnabled = !output.includes('Direct access (no proxy server)');
        const serverMatch = output.match(/Proxy Server\(s\)\s*:\s*(.+)/);
        const bypassMatch = output.match(/Bypass List\s*:\s*(.+)/);
        
        resolve({
          success: true,
          enabled: proxyEnabled,
          server: serverMatch ? serverMatch[1].trim() : '',
          bypass: bypassMatch ? bypassMatch[1].split(';').map(s => s.trim()) : []
        });
      } else {
        reject(new Error(`netsh failed with code ${code}`));
      }
    });
  });
}

// Export for use as module
module.exports = checkWindowsNetwork;

// Run if called directly
if (require.main === module) {
  checkWindowsNetwork()
    .then(results => {
      console.log('\n📊 WINDOWS NETWORK ANALYSIS SUMMARY');
      console.log('=' .repeat(45));
      
      console.log('\n🔍 POTENTIAL ISSUES DETECTED:');
      
      // Check for DNS issues
      const localhostDNS = results.dnsResolution?.localhost;
      if (!localhostDNS?.success) {
        console.log('❌ localhost DNS resolution failed');
      } else {
        console.log('✅ localhost DNS resolution works');
      }
      
      // Check for proxy issues
      if (results.proxySettings?.enabled) {
        console.log('⚠️ Proxy is enabled - may interfere with localhost');
      } else {
        console.log('✅ No proxy interference');
      }
      
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('1. Ensure localhost resolves to 127.0.0.1');
      console.log('2. Check browser proxy settings');
      console.log('3. Verify no VPN is interfering');
      console.log('4. Clear browser DNS cache');
      
      console.log('\n📋 DETAILED RESULTS:');
      console.log(JSON.stringify(results, null, 2));
    })
    .catch(console.error);
}
