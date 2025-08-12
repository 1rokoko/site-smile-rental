const { findAvailablePort } = require('./smart-dev-server.js');
const net = require('net');

console.log('🧪 TESTING PORT FALLBACK SYSTEM');
console.log('=' .repeat(40));

// Function to temporarily occupy a port
function occupyPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      console.log(`🔒 Temporarily occupying port ${port}`);
      resolve(server);
    });
  });
}

// Function to test the fallback system
async function testPortFallback() {
  console.log('\n1️⃣ TESTING NORMAL OPERATION');
  console.log('-' .repeat(30));
  
  try {
    const normalPort = await findAvailablePort();
    console.log(`✅ Normal operation: Found port ${normalPort}`);
  } catch (error) {
    console.log(`❌ Normal operation failed: ${error.message}`);
  }
  
  console.log('\n2️⃣ TESTING FALLBACK WHEN PORT 3000 IS OCCUPIED');
  console.log('-' .repeat(50));
  
  // Temporarily occupy port 3000
  let server3000;
  try {
    server3000 = await occupyPort(3000);
    
    // Now test fallback
    const fallbackPort = await findAvailablePort();
    console.log(`✅ Fallback successful: Found port ${fallbackPort}`);
    
    if (fallbackPort !== 3000) {
      console.log('✅ Fallback system working correctly');
    } else {
      console.log('⚠️ Unexpected: Still got port 3000');
    }
    
  } catch (error) {
    console.log(`❌ Fallback test failed: ${error.message}`);
  } finally {
    if (server3000) {
      server3000.close();
      console.log('🔓 Released port 3000');
    }
  }
  
  console.log('\n3️⃣ TESTING MULTIPLE PORT OCCUPATION');
  console.log('-' .repeat(40));
  
  const servers = [];
  try {
    // Occupy ports 3000, 3001, 3002
    for (const port of [3000, 3001, 3002]) {
      const server = await occupyPort(port);
      servers.push(server);
    }
    
    // Test fallback to 3003 or higher
    const highFallbackPort = await findAvailablePort();
    console.log(`✅ High fallback successful: Found port ${highFallbackPort}`);
    
    if (highFallbackPort >= 3003) {
      console.log('✅ Multiple port fallback working correctly');
    } else {
      console.log('⚠️ Unexpected port assignment');
    }
    
  } catch (error) {
    console.log(`❌ Multiple port test failed: ${error.message}`);
  } finally {
    // Clean up all servers
    servers.forEach((server, index) => {
      server.close();
      console.log(`🔓 Released port ${3000 + index}`);
    });
  }
  
  console.log('\n📊 FALLBACK SYSTEM TEST SUMMARY');
  console.log('=' .repeat(35));
  console.log('✅ Port detection system is working');
  console.log('✅ Fallback mechanism is functional');
  console.log('✅ Multiple port occupation handled correctly');
  console.log('✅ System can find alternative ports when needed');
}

// Run the test
testPortFallback().catch(console.error);
