const { spawn } = require('child_process');
const net = require('net');

console.log('🚀 SMART DEVELOPMENT SERVER LAUNCHER');
console.log('=' .repeat(50));

// Configuration
const PREFERRED_PORTS = [3000, 3001, 3002, 3003, 3004];
const MAX_RETRIES = 3;

// Function to check if a port is available
function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(false); // Port is occupied
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(true); // Port is available
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(true); // Port is available
    });
    
    socket.connect(port, 'localhost');
  });
}

// Function to find the first available port
async function findAvailablePort() {
  console.log('\n🔍 SCANNING FOR AVAILABLE PORTS');
  console.log('-' .repeat(35));
  
  for (const port of PREFERRED_PORTS) {
    console.log(`Checking port ${port}...`);
    const available = await checkPortAvailable(port);
    
    if (available) {
      console.log(`✅ Port ${port} is available`);
      return port;
    } else {
      console.log(`❌ Port ${port} is occupied`);
    }
  }
  
  // If no preferred ports are available, find a random one
  console.log('\n🎲 Finding random available port...');
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => {
        console.log(`✅ Found available port: ${port}`);
        resolve(port);
      });
    });
    server.on('error', reject);
  });
}

// Function to kill processes on a specific port
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    console.log(`🔫 Attempting to kill processes on port ${port}...`);
    
    const killProcess = spawn('cmd', ['/c', `netstat -ano | findstr :${port}`], {
      stdio: 'pipe'
    });
    
    let output = '';
    killProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    killProcess.on('close', () => {
      if (output.trim()) {
        const lines = output.split('\n');
        const pids = [];
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            pids.push(match[1]);
          }
        });
        
        if (pids.length > 0) {
          console.log(`Killing PIDs: ${pids.join(', ')}`);
          
          const killCmd = spawn('cmd', ['/c', `taskkill /F /PID ${pids.join(' /PID ')}`], {
            stdio: 'inherit'
          });
          
          killCmd.on('close', () => {
            console.log(`✅ Cleared port ${port}`);
            setTimeout(resolve, 2000);
          });
        } else {
          resolve();
        }
      } else {
        console.log(`✅ Port ${port} is already clear`);
        resolve();
      }
    });
  });
}

// Function to start Next.js development server on a specific port
function startDevServer(port, retryCount = 0) {
  return new Promise((resolve, reject) => {
    console.log(`\n🌐 Starting Next.js server on port ${port}...`);
    console.log(`📍 URL: http://localhost:${port}`);
    
    const devServer = spawn('npx', ['next', 'dev', '--port', port.toString(), '--hostname', 'localhost'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    });
    
    let serverStarted = false;
    let startupOutput = '';
    
    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      startupOutput += output;
      console.log(output);
      
      if ((output.includes('Local:') && output.includes(`localhost:${port}`)) || 
          output.includes('ready - started server on') ||
          output.includes('Ready in')) {
        if (!serverStarted) {
          serverStarted = true;
          console.log(`\n🎉 SERVER STARTED SUCCESSFULLY ON PORT ${port}!`);
          console.log(`🔗 Access your website: http://localhost:${port}`);
          console.log('🔄 Hot reload is enabled');
          console.log('🛑 Press Ctrl+C to stop\n');
          resolve({ server: devServer, port });
        }
      }
    });
    
    devServer.stderr.on('data', (data) => {
      const error = data.toString();
      console.error('Error:', error);
      
      if (error.includes('EADDRINUSE')) {
        console.log(`⚠️ Port ${port} is still in use`);
        devServer.kill();
        
        if (retryCount < MAX_RETRIES) {
          console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(async () => {
            await killProcessOnPort(port);
            startDevServer(port, retryCount + 1).then(resolve).catch(reject);
          }, 3000);
        } else {
          console.log(`❌ Max retries reached for port ${port}`);
          reject(new Error(`Port ${port} unavailable after ${MAX_RETRIES} retries`));
        }
        return;
      }
    });
    
    devServer.on('error', (error) => {
      console.error(`❌ Failed to start server on port ${port}:`, error.message);
      reject(error);
    });
    
    devServer.on('close', (code) => {
      if (!serverStarted) {
        console.log(`❌ Server process exited with code ${code}`);
        reject(new Error(`Server failed to start on port ${port} (exit code: ${code})`));
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        console.log(`⏰ Timeout starting server on port ${port}`);
        devServer.kill();
        reject(new Error(`Server startup timeout on port ${port}`));
      }
    }, 30000);
  });
}

// Main execution function
async function main() {
  try {
    console.log('🎯 Smart port detection and server startup...\n');
    
    // First, try to find an available port
    const availablePort = await findAvailablePort();
    
    if (availablePort === 3000) {
      console.log('🎉 Preferred port 3000 is available!');
    } else {
      console.log(`⚠️ Port 3000 not available, using port ${availablePort}`);
    }
    
    // Start the development server
    const { server, port } = await startDevServer(availablePort);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development server...');
      server.kill();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down development server...');
      server.kill();
      process.exit(0);
    });
    
    // Keep the process alive
    console.log('✅ Server is running. Press Ctrl+C to stop.');
    
  } catch (error) {
    console.error('\n❌ Failed to start development server:', error.message);
    
    console.log('\n💡 TROUBLESHOOTING SUGGESTIONS:');
    console.log('1. Check if any applications are using ports 3000-3004');
    console.log('2. Try restarting your computer');
    console.log('3. Run as administrator if permission issues persist');
    console.log('4. Check Windows Firewall settings');
    
    process.exit(1);
  }
}

// Export for use as a module
module.exports = { findAvailablePort, startDevServer, killProcessOnPort };

// Run if called directly
if (require.main === module) {
  main();
}
