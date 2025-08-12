const { spawn } = require('child_process');
const net = require('net');

async function analyzeServerBinding() {
  console.log('🔍 ANALYZING NEXT.JS SERVER BINDING CONFIGURATION');
  console.log('=' .repeat(60));
  console.log(`Analysis started at: ${new Date().toISOString()}`);

  const results = {
    portStatus: {},
    networkInterfaces: {},
    serverProcesses: [],
    bindingAnalysis: {}
  };

  // Test 1: Check port 3000 on different interfaces
  console.log('\n1️⃣ TESTING PORT 3000 ON DIFFERENT INTERFACES');
  console.log('-' .repeat(50));

  const interfaces = [
    { name: 'localhost', address: 'localhost' },
    { name: '127.0.0.1', address: '127.0.0.1' },
    { name: '0.0.0.0', address: '0.0.0.0' },
    { name: '::1 (IPv6)', address: '::1' }
  ];

  for (const iface of interfaces) {
    console.log(`Testing ${iface.name} (${iface.address})...`);
    
    try {
      const isListening = await testPortBinding(iface.address, 3000);
      results.portStatus[iface.name] = {
        address: iface.address,
        listening: isListening,
        status: isListening ? 'LISTENING' : 'NOT_LISTENING'
      };
      console.log(`   ${isListening ? '✅' : '❌'} ${iface.name}: ${isListening ? 'LISTENING' : 'NOT LISTENING'}`);
    } catch (error) {
      results.portStatus[iface.name] = {
        address: iface.address,
        listening: false,
        status: 'ERROR',
        error: error.message
      };
      console.log(`   ❌ ${iface.name}: ERROR - ${error.message}`);
    }
  }

  // Test 2: Get network interface information
  console.log('\n2️⃣ ANALYZING NETWORK INTERFACES');
  console.log('-' .repeat(35));

  try {
    const networkInfo = await getNetworkInterfaces();
    results.networkInterfaces = networkInfo;
    
    Object.entries(networkInfo).forEach(([name, info]) => {
      console.log(`Interface: ${name}`);
      console.log(`   Address: ${info.address}`);
      console.log(`   Family: ${info.family}`);
      console.log(`   Internal: ${info.internal}`);
    });
  } catch (error) {
    console.log(`❌ Network interface analysis failed: ${error.message}`);
  }

  // Test 3: Check running Node.js processes
  console.log('\n3️⃣ ANALYZING RUNNING NODE.JS PROCESSES');
  console.log('-' .repeat(40));

  try {
    const processes = await getNodeProcesses();
    results.serverProcesses = processes;
    
    processes.forEach(proc => {
      console.log(`PID: ${proc.pid}`);
      console.log(`   Command: ${proc.command}`);
      console.log(`   Ports: ${proc.ports.join(', ') || 'None detected'}`);
    });
  } catch (error) {
    console.log(`❌ Process analysis failed: ${error.message}`);
  }

  // Test 4: Check netstat for port 3000
  console.log('\n4️⃣ NETSTAT ANALYSIS FOR PORT 3000');
  console.log('-' .repeat(35));

  try {
    const netstatInfo = await getNetstatInfo();
    results.bindingAnalysis = netstatInfo;
    
    console.log('Active connections on port 3000:');
    netstatInfo.connections.forEach(conn => {
      console.log(`   ${conn.protocol} ${conn.localAddress}:${conn.localPort} -> ${conn.foreignAddress}:${conn.foreignPort} [${conn.state}]`);
    });
    
    console.log('\nListening sockets on port 3000:');
    netstatInfo.listening.forEach(listen => {
      console.log(`   ${listen.protocol} ${listen.address}:${listen.port} [${listen.state}]`);
    });
  } catch (error) {
    console.log(`❌ Netstat analysis failed: ${error.message}`);
  }

  return results;
}

// Helper function to test if a port is listening on a specific interface
function testPortBinding(address, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true); // Port is listening
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false); // Port is not listening
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false); // Port is not listening
    });
    
    socket.connect(port, address);
  });
}

// Helper function to get network interfaces
function getNetworkInterfaces() {
  return new Promise((resolve) => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const result = {};
    
    Object.entries(interfaces).forEach(([name, addrs]) => {
      addrs.forEach((addr, index) => {
        const key = addrs.length > 1 ? `${name}_${index}` : name;
        result[key] = {
          address: addr.address,
          family: addr.family,
          internal: addr.internal,
          mac: addr.mac
        };
      });
    });
    
    resolve(result);
  });
}

// Helper function to get Node.js processes
function getNodeProcesses() {
  return new Promise((resolve, reject) => {
    const processes = [];
    
    const wmic = spawn('wmic', ['process', 'where', 'name="node.exe"', 'get', 'ProcessId,CommandLine'], {
      stdio: 'pipe'
    });
    
    let output = '';
    wmic.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    wmic.on('close', (code) => {
      if (code === 0) {
        const lines = output.split('\n').filter(line => line.trim() && !line.includes('CommandLine'));
        
        lines.forEach(line => {
          const match = line.match(/^(.+?)\s+(\d+)\s*$/);
          if (match) {
            processes.push({
              command: match[1].trim(),
              pid: match[2].trim(),
              ports: [] // We'll populate this separately if needed
            });
          }
        });
        
        resolve(processes);
      } else {
        reject(new Error(`WMIC failed with code ${code}`));
      }
    });
  });
}

// Helper function to get netstat information
function getNetstatInfo() {
  return new Promise((resolve, reject) => {
    const netstat = spawn('netstat', ['-ano'], {
      stdio: 'pipe'
    });
    
    let output = '';
    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstat.on('close', (code) => {
      if (code === 0) {
        const lines = output.split('\n');
        const connections = [];
        const listening = [];
        
        lines.forEach(line => {
          if (line.includes(':3000')) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 4) {
              const [protocol, localAddr, foreignAddr, state, pid] = parts;
              
              const connInfo = {
                protocol,
                localAddress: localAddr.split(':')[0],
                localPort: localAddr.split(':')[1],
                foreignAddress: foreignAddr.split(':')[0],
                foreignPort: foreignAddr.split(':')[1],
                state,
                pid: pid || 'Unknown'
              };
              
              if (state === 'LISTENING') {
                listening.push({
                  protocol,
                  address: connInfo.localAddress,
                  port: connInfo.localPort,
                  state,
                  pid: connInfo.pid
                });
              } else {
                connections.push(connInfo);
              }
            }
          }
        });
        
        resolve({ connections, listening });
      } else {
        reject(new Error(`Netstat failed with code ${code}`));
      }
    });
  });
}

// Export for use as module
module.exports = analyzeServerBinding;

// Run if called directly
if (require.main === module) {
  analyzeServerBinding()
    .then(results => {
      console.log('\n📊 SERVER BINDING ANALYSIS SUMMARY');
      console.log('=' .repeat(45));
      
      console.log('\n🔌 PORT BINDING STATUS:');
      Object.entries(results.portStatus).forEach(([name, status]) => {
        const icon = status.listening ? '✅' : '❌';
        console.log(`   ${icon} ${name} (${status.address}): ${status.status}`);
      });
      
      console.log('\n🔍 KEY FINDINGS:');
      const localhostWorks = results.portStatus['localhost']?.listening;
      const ipWorks = results.portStatus['127.0.0.1']?.listening;
      
      if (localhostWorks && !ipWorks) {
        console.log('⚠️ Server binds to "localhost" hostname but NOT to 127.0.0.1 IP');
        console.log('💡 This explains why localhost:3000 works but 127.0.0.1:3000 fails');
        console.log('🔧 Next.js is using hostname-specific binding');
      } else if (localhostWorks && ipWorks) {
        console.log('✅ Server properly binds to both localhost and 127.0.0.1');
      } else if (!localhostWorks && !ipWorks) {
        console.log('❌ Server is not listening on expected interfaces');
      }
      
      console.log('\n📋 DETAILED RESULTS:');
      console.log(JSON.stringify(results, null, 2));
    })
    .catch(console.error);
}
