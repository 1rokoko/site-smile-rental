const http = require('http');

console.log('Testing website...');

// Test smilerentalphuket.com
const options1 = {
  hostname: 'smilerentalphuket.com',
  port: 80,
  path: '/',
  method: 'GET',
  timeout: 10000
};

console.log('Testing http://smilerentalphuket.com...');
const req1 = http.request(options1, (res) => {
  console.log(`✅ SUCCESS: smilerentalphuket.com responded with status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  res.on('data', (chunk) => {
    console.log(`Response body (first 200 chars): ${chunk.toString().substring(0, 200)}`);
  });
});

req1.on('error', (err) => {
  console.log(`❌ FAILED: smilerentalphuket.com - ${err.message}`);
});

req1.on('timeout', () => {
  console.log(`❌ TIMEOUT: smilerentalphuket.com`);
  req1.destroy();
});

req1.end();

// Test direct IP
const options2 = {
  hostname: '38.180.122.239',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 10000
};

console.log('Testing http://38.180.122.239:3000...');
const req2 = http.request(options2, (res) => {
  console.log(`✅ SUCCESS: 38.180.122.239:3000 responded with status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  res.on('data', (chunk) => {
    console.log(`Response body (first 200 chars): ${chunk.toString().substring(0, 200)}`);
  });
});

req2.on('error', (err) => {
  console.log(`❌ FAILED: 38.180.122.239:3000 - ${err.message}`);
});

req2.on('timeout', () => {
  console.log(`❌ TIMEOUT: 38.180.122.239:3000`);
  req2.destroy();
});

req2.end();

console.log('Test requests sent. Waiting for responses...');
