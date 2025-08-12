const { spawn } = require('child_process');

console.log('🔥 CHECKING WINDOWS FIREWALL SETTINGS');
console.log('=' .repeat(50));

// Function to run PowerShell commands
function runPowerShell(command, description) {
  return new Promise((resolve) => {
    console.log(`\n🔍 ${description}`);
    console.log(`Command: ${command}`);
    console.log('-' .repeat(40));
    
    const ps = spawn('powershell', ['-Command', command], {
      stdio: 'pipe'
    });
    
    let output = '';
    let error = '';
    
    ps.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ps.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    ps.on('close', (code) => {
      if (output) {
        console.log(output);
      }
      if (error) {
        console.log('Error:', error);
      }
      console.log(`Exit code: ${code}`);
      resolve({ code, output, error });
    });
  });
}

// Function to check if Node.js is allowed through firewall
function checkNodeFirewallRules() {
  return runPowerShell(
    'Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*" -or $_.DisplayName -like "*node*"} | Select-Object DisplayName, Direction, Action, Enabled',
    'Checking Node.js firewall rules'
  );
}

// Function to check firewall profile status
function checkFirewallProfiles() {
  return runPowerShell(
    'Get-NetFirewallProfile | Select-Object Name, Enabled',
    'Checking Windows Firewall profiles'
  );
}

// Function to check localhost connectivity
function checkLocalhostConnectivity() {
  return runPowerShell(
    'Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Detailed',
    'Testing localhost:3000 connectivity'
  );
}

// Function to check if port 3000 is blocked
function checkPort3000Rules() {
  return runPowerShell(
    'Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*3000*"} | Select-Object DisplayName, Direction, Action, Enabled',
    'Checking port 3000 specific rules'
  );
}

// Function to check network adapters
function checkNetworkAdapters() {
  return runPowerShell(
    'Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object Name, InterfaceDescription, LinkSpeed',
    'Checking active network adapters'
  );
}

// Function to create firewall rule for Node.js if needed
function createNodeFirewallRule() {
  console.log('\n🛡️ CREATING FIREWALL RULE FOR NODE.JS');
  console.log('This will allow Node.js through Windows Firewall...');
  
  const nodePath = process.execPath;
  console.log(`Node.js path: ${nodePath}`);
  
  return runPowerShell(
    `New-NetFirewallRule -DisplayName "Node.js Development Server" -Direction Inbound -Program "${nodePath}" -Action Allow -Protocol TCP -LocalPort 3000`,
    'Creating inbound firewall rule for Node.js on port 3000'
  );
}

// Function to check hosts file
function checkHostsFile() {
  return runPowerShell(
    'Get-Content C:\\Windows\\System32\\drivers\\etc\\hosts | Select-String -Pattern "localhost|127.0.0.1"',
    'Checking hosts file for localhost entries'
  );
}

// Main execution
async function main() {
  try {
    console.log('Starting comprehensive firewall and network diagnostics...\n');
    
    // Check firewall profiles
    await checkFirewallProfiles();
    
    // Check existing Node.js firewall rules
    const nodeRules = await checkNodeFirewallRules();
    
    // Check port 3000 specific rules
    await checkPort3000Rules();
    
    // Check network adapters
    await checkNetworkAdapters();
    
    // Check hosts file
    await checkHostsFile();
    
    // Test localhost connectivity (this will fail if server isn't running, but shows firewall status)
    await checkLocalhostConnectivity();
    
    console.log('\n📊 FIREWALL ANALYSIS SUMMARY');
    console.log('=' .repeat(40));
    
    if (nodeRules.output.trim() === '') {
      console.log('⚠️ No specific Node.js firewall rules found');
      console.log('💡 This might cause connection issues');
      
      console.log('\n🔧 ATTEMPTING TO CREATE FIREWALL RULE...');
      await createNodeFirewallRule();
    } else {
      console.log('✅ Node.js firewall rules exist');
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Ensure Windows Firewall allows Node.js applications');
    console.log('2. Check that localhost (127.0.0.1) is properly configured');
    console.log('3. Verify no antivirus software is blocking localhost connections');
    console.log('4. Try running as administrator if issues persist');
    
  } catch (error) {
    console.error('❌ Error during firewall check:', error.message);
  }
}

// Run the diagnostics
main();
