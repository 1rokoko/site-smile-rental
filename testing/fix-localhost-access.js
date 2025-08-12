const { spawn } = require('child_process');

async function fixLocalhostAccess() {
  console.log('🔧 FIXING LOCALHOST ACCESS ISSUES');
  console.log('=' .repeat(45));
  console.log(`Fix started at: ${new Date().toISOString()}`);

  const fixes = [];

  // Fix 1: Configure proxy bypass for localhost
  console.log('\n1️⃣ CONFIGURING PROXY BYPASS FOR LOCALHOST');
  console.log('-' .repeat(45));

  try {
    const proxyFix = await configureProxyBypass();
    fixes.push(proxyFix);
    
    if (proxyFix.success) {
      console.log('✅ Proxy bypass configured for localhost');
    } else {
      console.log(`❌ Proxy bypass failed: ${proxyFix.error}`);
    }
  } catch (error) {
    console.log(`❌ Proxy configuration error: ${error.message}`);
    fixes.push({ fix: 'Proxy Bypass', success: false, error: error.message });
  }

  // Fix 2: Add localhost to hosts file if needed
  console.log('\n2️⃣ ENSURING LOCALHOST HOSTS ENTRY');
  console.log('-' .repeat(35));

  try {
    const hostsFix = await ensureLocalhostHosts();
    fixes.push(hostsFix);
    
    if (hostsFix.success) {
      console.log('✅ Localhost hosts entry verified');
    } else {
      console.log(`❌ Hosts file fix failed: ${hostsFix.error}`);
    }
  } catch (error) {
    console.log(`❌ Hosts file error: ${error.message}`);
    fixes.push({ fix: 'Hosts File', success: false, error: error.message });
  }

  // Fix 3: Clear DNS cache
  console.log('\n3️⃣ CLEARING DNS CACHE');
  console.log('-' .repeat(25));

  try {
    const dnsFix = await clearDNSCache();
    fixes.push(dnsFix);
    
    if (dnsFix.success) {
      console.log('✅ DNS cache cleared');
    } else {
      console.log(`❌ DNS cache clear failed: ${dnsFix.error}`);
    }
  } catch (error) {
    console.log(`❌ DNS cache error: ${error.message}`);
    fixes.push({ fix: 'DNS Cache', success: false, error: error.message });
  }

  // Fix 4: Create browser-specific instructions
  console.log('\n4️⃣ GENERATING BROWSER-SPECIFIC INSTRUCTIONS');
  console.log('-' .repeat(45));

  const browserInstructions = generateBrowserInstructions();
  fixes.push({ fix: 'Browser Instructions', success: true, instructions: browserInstructions });
  
  console.log('✅ Browser instructions generated');

  return fixes;
}

// Helper function to configure proxy bypass
function configureProxyBypass() {
  return new Promise((resolve) => {
    console.log('Configuring Windows proxy to bypass localhost...');
    
    // Add localhost to proxy bypass list
    const netsh = spawn('netsh', ['winhttp', 'set', 'proxy', 'proxy-server="auto"', 'bypass-list="localhost;127.0.0.1;::1"'], {
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
          fix: 'Proxy Bypass',
          success: true,
          message: 'Localhost added to proxy bypass list',
          output: output
        });
      } else {
        resolve({
          fix: 'Proxy Bypass',
          success: false,
          error: `Command failed with code ${code}: ${error}`,
          note: 'May require administrator privileges'
        });
      }
    });
  });
}

// Helper function to ensure localhost hosts entry
function ensureLocalhostHosts() {
  return new Promise((resolve) => {
    const fs = require('fs');
    const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    
    try {
      // Read current hosts file
      let content = '';
      try {
        content = fs.readFileSync(hostsPath, 'utf8');
      } catch (readError) {
        resolve({
          fix: 'Hosts File',
          success: false,
          error: 'Cannot read hosts file - may require administrator privileges'
        });
        return;
      }
      
      // Check if localhost entries exist
      const hasIPv4 = content.includes('127.0.0.1\tlocalhost') || content.includes('127.0.0.1 localhost');
      const hasIPv6 = content.includes('::1\tlocalhost') || content.includes('::1 localhost');
      
      if (hasIPv4 && hasIPv6) {
        resolve({
          fix: 'Hosts File',
          success: true,
          message: 'Localhost entries already exist'
        });
        return;
      }
      
      // Add missing entries
      let additions = [];
      if (!hasIPv4) {
        additions.push('127.0.0.1\tlocalhost');
      }
      if (!hasIPv6) {
        additions.push('::1\tlocalhost');
      }
      
      const newContent = content + '\n# Added for localhost development\n' + additions.join('\n') + '\n';
      
      try {
        fs.writeFileSync(hostsPath, newContent, 'utf8');
        resolve({
          fix: 'Hosts File',
          success: true,
          message: `Added localhost entries: ${additions.join(', ')}`
        });
      } catch (writeError) {
        resolve({
          fix: 'Hosts File',
          success: false,
          error: 'Cannot write hosts file - requires administrator privileges',
          manualInstructions: `Add these lines to ${hostsPath}:\n${additions.join('\n')}`
        });
      }
      
    } catch (error) {
      resolve({
        fix: 'Hosts File',
        success: false,
        error: error.message
      });
    }
  });
}

// Helper function to clear DNS cache
function clearDNSCache() {
  return new Promise((resolve) => {
    console.log('Clearing Windows DNS cache...');
    
    const ipconfig = spawn('ipconfig', ['/flushdns'], {
      stdio: 'pipe'
    });
    
    let output = '';
    let error = '';
    
    ipconfig.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ipconfig.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    ipconfig.on('close', (code) => {
      if (code === 0) {
        resolve({
          fix: 'DNS Cache',
          success: true,
          message: 'DNS cache cleared successfully',
          output: output
        });
      } else {
        resolve({
          fix: 'DNS Cache',
          success: false,
          error: `Command failed with code ${code}: ${error}`,
          note: 'May require administrator privileges'
        });
      }
    });
  });
}

// Helper function to generate browser-specific instructions
function generateBrowserInstructions() {
  return {
    chrome: {
      title: 'Google Chrome / Edge',
      steps: [
        '1. Open Chrome/Edge settings',
        '2. Go to Advanced → System',
        '3. Click "Open your computer\'s proxy settings"',
        '4. In "Bypass proxy server for" add: localhost;127.0.0.1;::1',
        '5. Restart browser'
      ],
      alternative: [
        'Alternative: Use incognito mode',
        'Or disable proxy temporarily in browser settings'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        '1. Open Firefox settings',
        '2. Go to General → Network Settings',
        '3. Click "Settings" button',
        '4. Select "No proxy" or add localhost to bypass list',
        '5. Restart Firefox'
      ]
    },
    general: {
      title: 'General Solutions',
      steps: [
        '1. Try accessing http://localhost:3000 in incognito/private mode',
        '2. Disable VPN if running',
        '3. Temporarily disable antivirus web protection',
        '4. Clear browser cache and cookies',
        '5. Try different browser (Chrome, Firefox, Edge)'
      ]
    }
  };
}

// Export for use as module
module.exports = fixLocalhostAccess;

// Run if called directly
if (require.main === module) {
  fixLocalhostAccess()
    .then(fixes => {
      console.log('\n📊 LOCALHOST ACCESS FIX SUMMARY');
      console.log('=' .repeat(40));
      
      const successful = fixes.filter(f => f.success).length;
      const total = fixes.length - 1; // Exclude browser instructions
      
      console.log(`\n✅ Successful fixes: ${successful}/${total}`);
      
      fixes.forEach(fix => {
        if (fix.fix !== 'Browser Instructions') {
          const status = fix.success ? '✅' : '❌';
          console.log(`   ${status} ${fix.fix}: ${fix.success ? fix.message || 'Success' : fix.error}`);
        }
      });
      
      console.log('\n🌐 BROWSER-SPECIFIC INSTRUCTIONS:');
      const instructions = fixes.find(f => f.fix === 'Browser Instructions')?.instructions;
      
      if (instructions) {
        Object.entries(instructions).forEach(([browser, info]) => {
          console.log(`\n📱 ${info.title}:`);
          info.steps.forEach(step => console.log(`   ${step}`));
          if (info.alternative) {
            console.log('   Alternative options:');
            info.alternative.forEach(alt => console.log(`   ${alt}`));
          }
        });
      }
      
      console.log('\n💡 IMMEDIATE ACTIONS FOR USER:');
      console.log('1. Try opening http://localhost:3000 in incognito/private mode');
      console.log('2. If that works, the issue is browser proxy/cache related');
      console.log('3. Follow browser-specific instructions above');
      console.log('4. Restart browser after making changes');
      
      console.log('\n📋 DETAILED RESULTS:');
      console.log(JSON.stringify(fixes, null, 2));
    })
    .catch(console.error);
}
