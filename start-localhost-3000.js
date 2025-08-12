const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 STARTING LOCALHOST:3000 DEVELOPMENT SERVER');
console.log('=' .repeat(50));

// Function to check if port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const socket = new net.Socket();
    
    socket.setTimeout(1000);
    
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

// Function to kill processes on port 3000
function killPort3000() {
  return new Promise((resolve) => {
    console.log('🔍 Checking for processes on port 3000...');
    
    const killProcess = spawn('cmd', ['/c', 'netstat -ano | findstr :3000'], {
      stdio: 'pipe'
    });
    
    let output = '';
    killProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    killProcess.on('close', (code) => {
      if (output.trim()) {
        console.log('⚠️ Found processes on port 3000, attempting to kill...');
        
        // Extract PIDs and kill them
        const lines = output.split('\n');
        const pids = [];
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            pids.push(match[1]);
          }
        });
        
        if (pids.length > 0) {
          console.log(`🔫 Killing PIDs: ${pids.join(', ')}`);
          
          const killCmd = spawn('cmd', ['/c', `taskkill /F /PID ${pids.join(' /PID ')}`], {
            stdio: 'inherit'
          });
          
          killCmd.on('close', () => {
            console.log('✅ Port 3000 cleared');
            setTimeout(resolve, 2000); // Wait 2 seconds for cleanup
          });
        } else {
          resolve();
        }
      } else {
        console.log('✅ Port 3000 is available');
        resolve();
      }
    });
  });
}

// Function to start Next.js development server
function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('\n🌐 Starting Next.js development server...');
    console.log('📍 Target: http://localhost:3000');
    console.log('⏳ Please wait for server startup...\n');
    
    // Use explicit port and host configuration
    const devServer = spawn('npx', ['next', 'dev', '--port', '3000', '--hostname', 'localhost'], {
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
      
      // Check for successful startup messages
      if ((output.includes('Local:') && output.includes('localhost:3000')) || 
          output.includes('ready - started server on') ||
          output.includes('Ready in')) {
        if (!serverStarted) {
          serverStarted = true;
          console.log('\n🎉 SERVER SUCCESSFULLY STARTED!');
          console.log('🔗 Access your website at: http://localhost:3000');
          console.log('🔄 Hot reload is enabled');
          console.log('🛑 Press Ctrl+C to stop the server\n');
          resolve(devServer);
        }
      }
    });
    
    devServer.stderr.on('data', (data) => {
      const error = data.toString();
      console.error('❌ Error:', error);
      
      // Check for common errors
      if (error.includes('EADDRINUSE')) {
        console.log('💡 Port 3000 is still in use. Retrying port cleanup...');
        devServer.kill();
        setTimeout(() => {
          killPort3000().then(() => startDevServer()).then(resolve).catch(reject);
        }, 3000);
        return;
      }
    });
    
    devServer.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message);
      reject(error);
    });
    
    devServer.on('close', (code) => {
      if (!serverStarted) {
        console.log(`❌ Server process exited with code ${code}`);
        if (startupOutput.includes('EADDRINUSE')) {
          console.log('💡 Retrying with port cleanup...');
          killPort3000().then(() => startDevServer()).then(resolve).catch(reject);
        } else {
          reject(new Error(`Server failed to start (exit code: ${code})`));
        }
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        console.log('⏰ Server startup timeout. Checking status...');
        devServer.kill();
        reject(new Error('Server startup timeout'));
      }
    }, 30000);
  });
}

// Main execution
async function main() {
  try {
    // Step 1: Clear port 3000
    await killPort3000();
    
    // Step 2: Verify port is available
    const portAvailable = await checkPort(3000);
    if (!portAvailable) {
      console.log('⚠️ Port 3000 still occupied, forcing cleanup...');
      await killPort3000();
    }
    
    // Step 3: Start development server
    const server = await startDevServer();
    
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
    
  } catch (error) {
    console.error('❌ Failed to start development server:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure no other applications are using port 3000');
    console.log('2. Try restarting your computer');
    console.log('3. Check Windows Firewall settings');
    console.log('4. Run: npm install to ensure dependencies are installed');
    process.exit(1);
  }
}

// Run the main function
main();
