const { exec } = require('child_process');

console.log('🔍 Testing server connection and status...');

// Test if we can reach the server
exec('ping -n 1 38.180.122.239', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Cannot ping server:', error.message);
    return;
  }
  console.log('✅ Server is reachable');
  
  // Test if we can connect via SSH (this will require password)
  console.log('🔐 Testing SSH connection...');
  exec('ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@38.180.122.239 "echo SSH connection successful"', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ SSH connection failed:', error.message);
      console.log('💡 You need to manually connect with password: [REMOVED]');
    } else {
      console.log('✅ SSH connection successful');
      console.log('Output:', stdout);
    }
  });
});

// Test the website directly
console.log('🌐 Testing website response...');
const https = require('https');

const req = https.get('https://smilerentalphuket.com', (res) => {
  console.log(`📊 Website status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  if (res.statusCode === 502) {
    console.log('❌ 502 Bad Gateway - Backend application is not running');
    console.log('🔧 Need to manually fix PM2 on server');
  } else if (res.statusCode === 200) {
    console.log('✅ Website is working!');
  }
});

req.on('error', (err) => {
  console.log('❌ Website error:', err.message);
});

req.setTimeout(10000, () => {
  console.log('⏰ Website request timeout');
  req.destroy();
});
