const http = require('http');
const { spawn } = require('child_process');

console.log('🔍 LOCALHOST STATUS CHECKER');
console.log('=' .repeat(30));

// Function to check if server is responding
function checkServerHealth(port = 3000) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: 'healthy',
          statusCode: res.statusCode,
          responseTime: Date.now() - startTime,
          contentLength: data.length
        });
      });
    });

    const startTime = Date.now();
    
    req.on('error', (error) => {
      resolve({
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'timeout',
        responseTime: Date.now() - startTime
      });
    });

    req.end();
  });
}

// Function to check port usage
function checkPortUsage(port = 3000) {
  return new Promise((resolve) => {
    const netstatProcess = spawn('cmd', ['/c', `netstat -ano | findstr :${port}`], {
      stdio: 'pipe'
    });
    
    let output = '';
    netstatProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstatProcess.on('close', (code) => {
      if (output.trim()) {
        const lines = output.split('\n').filter(line => line.trim());
        const processes = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          return {
            protocol: parts[0],
            localAddress: parts[1],
            foreignAddress: parts[2],
            state: parts[3],
            pid: parts[4]
          };
        });
        
        resolve({
          inUse: true,
          processes: processes
        });
      } else {
        resolve({
          inUse: false,
          processes: []
        });
      }
    });
  });
}

// Main status check function
async function checkStatus() {
  const port = 3000;
  
  console.log(`📊 Checking localhost:${port} status...`);
  console.log('-' .repeat(40));
  
  // Check port usage
  const portInfo = await checkPortUsage(port);
  
  if (portInfo.inUse) {
    console.log(`✅ Port ${port} is in use`);
    portInfo.processes.forEach((proc, index) => {
      console.log(`   Process ${index + 1}: PID ${proc.pid} (${proc.state})`);
    });
  } else {
    console.log(`❌ Port ${port} is not in use`);
    console.log('💡 Server may not be running');
    return;
  }
  
  // Check server health
  console.log('\n🏥 Checking server health...');
  const health = await checkServerHealth(port);
  
  if (health.status === 'healthy') {
    console.log(`✅ Server is healthy`);
    console.log(`   Status Code: ${health.statusCode}`);
    console.log(`   Response Time: ${health.responseTime}ms`);
    console.log(`   Content Length: ${health.contentLength} bytes`);
    
    if (health.responseTime < 1000) {
      console.log('🚀 Performance: Excellent');
    } else if (health.responseTime < 3000) {
      console.log('⚡ Performance: Good');
    } else {
      console.log('🐌 Performance: Slow');
    }
  } else if (health.status === 'timeout') {
    console.log(`⏰ Server timeout (${health.responseTime}ms)`);
    console.log('💡 Server may be overloaded or unresponsive');
  } else {
    console.log(`❌ Server is unhealthy`);
    console.log(`   Error: ${health.error}`);
  }
  
  console.log('\n📋 Summary:');
  console.log(`   Port Status: ${portInfo.inUse ? 'In Use' : 'Available'}`);
  console.log(`   Server Health: ${health.status}`);
  console.log(`   URL: http://localhost:${port}`);
  
  if (health.status === 'healthy') {
    console.log('\n🎉 Your localhost server is working perfectly!');
    console.log(`🔗 Open http://localhost:${port} in your browser`);
  } else {
    console.log('\n⚠️ Server issues detected. Consider restarting the server.');
    console.log('💡 Run: node stable-localhost-server.js');
  }
}

// Run the status check
checkStatus().catch(error => {
  console.error('❌ Status check failed:', error.message);
});
