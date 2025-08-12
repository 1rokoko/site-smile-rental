const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 STABLE LOCALHOST SERVER WITH AUTO-RESTART');
console.log('=' .repeat(55));

// Configuration
const CONFIG = {
  port: 3000,
  maxRestarts: 5,
  restartDelay: 3000,
  healthCheckInterval: 30000,
  logFile: 'server-stability.log'
};

let serverProcess = null;
let restartCount = 0;
let isShuttingDown = false;
let healthCheckTimer = null;

// Logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  // Also write to log file
  try {
    fs.appendFileSync(CONFIG.logFile, logMessage + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error.message);
  }
}

// Function to check if port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
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

// Function to kill processes on port
function killPort(port) {
  return new Promise((resolve) => {
    log(`🔍 Checking for processes on port ${port}...`);
    
    const killProcess = spawn('cmd', ['/c', `netstat -ano | findstr :${port}`], {
      stdio: 'pipe'
    });
    
    let output = '';
    killProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    killProcess.on('close', (code) => {
      if (output.trim()) {
        log(`⚠️ Found processes on port ${port}, attempting to kill...`);
        
        const lines = output.split('\n');
        const pids = [];
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            pids.push(match[1]);
          }
        });
        
        if (pids.length > 0) {
          log(`🔫 Killing PIDs: ${pids.join(', ')}`);
          
          const killCmd = spawn('cmd', ['/c', `taskkill /F /PID ${pids.join(' /PID ')}`], {
            stdio: 'inherit'
          });
          
          killCmd.on('close', () => {
            log(`✅ Port ${port} cleared`);
            setTimeout(resolve, 2000);
          });
        } else {
          resolve();
        }
      } else {
        log(`✅ Port ${port} is available`);
        resolve();
      }
    });
  });
}

// Function to start the development server
function startServer() {
  return new Promise((resolve, reject) => {
    log('\n🌐 Starting Next.js development server...');
    log(`📍 Target: http://localhost:${CONFIG.port}`);
    log('⏳ Please wait for server startup...\n');
    
    serverProcess = spawn('npx', ['next', 'dev', '--port', CONFIG.port.toString(), '--hostname', 'localhost'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    });
    
    let serverStarted = false;
    let startupOutput = '';
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      startupOutput += output;
      console.log(output);
      
      if ((output.includes('Local:') && output.includes(`localhost:${CONFIG.port}`)) || 
          output.includes('ready - started server on') ||
          output.includes('Ready in')) {
        if (!serverStarted) {
          serverStarted = true;
          log('\n🎉 SERVER SUCCESSFULLY STARTED!');
          log(`🔗 Access your website at: http://localhost:${CONFIG.port}`);
          log('🔄 Hot reload is enabled');
          log('🛡️ Auto-restart monitoring active');
          log('🛑 Press Ctrl+C to stop the server\n');
          
          // Start health monitoring
          startHealthMonitoring();
          resolve(serverProcess);
        }
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      log(`❌ Error: ${error}`);
      
      if (error.includes('EADDRINUSE')) {
        log(`💡 Port ${CONFIG.port} is still in use. Retrying port cleanup...`);
        serverProcess.kill();
        setTimeout(() => {
          killPort(CONFIG.port).then(() => startServer()).then(resolve).catch(reject);
        }, 3000);
        return;
      }
    });
    
    serverProcess.on('error', (error) => {
      log(`❌ Failed to start server: ${error.message}`);
      reject(error);
    });
    
    serverProcess.on('close', (code) => {
      log(`🔄 Server process exited with code ${code}`);
      
      if (!isShuttingDown && restartCount < CONFIG.maxRestarts) {
        log(`🔄 Attempting automatic restart (${restartCount + 1}/${CONFIG.maxRestarts})...`);
        restartCount++;
        
        setTimeout(() => {
          restartServer();
        }, CONFIG.restartDelay);
      } else if (restartCount >= CONFIG.maxRestarts) {
        log(`❌ Maximum restart attempts (${CONFIG.maxRestarts}) reached. Manual intervention required.`);
      }
    });
    
    // Timeout after 60 seconds
    setTimeout(() => {
      if (!serverStarted) {
        log('⏰ Server startup timeout. Checking status...');
        if (serverProcess) {
          serverProcess.kill();
        }
        reject(new Error('Server startup timeout'));
      }
    }, 60000);
  });
}

// Health monitoring function
function startHealthMonitoring() {
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer);
  }
  
  healthCheckTimer = setInterval(async () => {
    try {
      const portAvailable = await checkPort(CONFIG.port);
      if (portAvailable) {
        log('⚠️ Health check failed: Server appears to be down');
        if (!isShuttingDown) {
          log('🔄 Triggering automatic restart...');
          restartServer();
        }
      } else {
        log('✅ Health check passed: Server is running');
      }
    } catch (error) {
      log(`❌ Health check error: ${error.message}`);
    }
  }, CONFIG.healthCheckInterval);
}

// Function to restart the server
async function restartServer() {
  try {
    if (serverProcess) {
      serverProcess.kill();
    }
    
    await killPort(CONFIG.port);
    
    const portAvailable = await checkPort(CONFIG.port);
    if (!portAvailable) {
      log('⚠️ Port still occupied, forcing cleanup...');
      await killPort(CONFIG.port);
    }
    
    await startServer();
    
  } catch (error) {
    log(`❌ Failed to restart server: ${error.message}`);
  }
}

// Main execution
async function main() {
  try {
    log('🚀 Initializing stable localhost server...');
    
    // Clear log file
    try {
      fs.writeFileSync(CONFIG.logFile, '');
    } catch (error) {
      // Ignore if file doesn't exist
    }
    
    // Step 1: Clear port
    await killPort(CONFIG.port);
    
    // Step 2: Verify port is available
    const portAvailable = await checkPort(CONFIG.port);
    if (!portAvailable) {
      log(`⚠️ Port ${CONFIG.port} still occupied, forcing cleanup...`);
      await killPort(CONFIG.port);
    }
    
    // Step 3: Start development server
    await startServer();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down development server...');
      isShuttingDown = true;
      
      if (healthCheckTimer) {
        clearInterval(healthCheckTimer);
      }
      
      if (serverProcess) {
        serverProcess.kill();
      }
      
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });
    
    process.on('SIGTERM', () => {
      log('\n🛑 Shutting down development server...');
      isShuttingDown = true;
      
      if (healthCheckTimer) {
        clearInterval(healthCheckTimer);
      }
      
      if (serverProcess) {
        serverProcess.kill();
      }
      
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });
    
  } catch (error) {
    log(`❌ Failed to start development server: ${error.message}`);
    log('\n💡 Troubleshooting tips:');
    log('1. Make sure no other applications are using port 3000');
    log('2. Try restarting your computer');
    log('3. Check Windows Firewall settings');
    log('4. Run: npm install to ensure dependencies are installed');
    process.exit(1);
  }
}

// Run the main function
main();
