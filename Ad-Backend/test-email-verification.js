const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

// Read the latest log file to find verification token
function findVerificationToken() {
  try {
    const logDir = './logs';
    const files = fs.readdirSync(logDir);
    const logFiles = files.filter(file => file.endsWith('.log')).sort().reverse();
    
    if (logFiles.length === 0) {
      console.log('No log files found');
      return null;
    }
    
    const latestLog = fs.readFileSync(`${logDir}/${logFiles[0]}`, 'utf8');
    const lines = latestLog.split('\n').reverse();
    
    for (const line of lines) {
      if (line.includes('verification token:') || line.includes('Email verification token:')) {
        const match = line.match(/token:\s*([a-zA-Z0-9-]+)/);
        if (match) {
          return match[1];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error reading logs:', error.message);
    return null;
  }
}

async function verifyEmail() {
  console.log('🔍 Looking for verification token in logs...');
  
  const token = findVerificationToken();
  
  if (!token) {
    console.log('❌ No verification token found in logs');
    console.log('💡 Please check the server logs manually for the verification token');
    return false;
  }
  
  console.log('✅ Found verification token:', token);
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/verify-email/${token}`);
    console.log('✅ Email verification successful:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Email verification failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testLoginAfterVerification() {
  console.log('\n🔐 Testing login after verification...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    console.log('✅ Login successful after verification');
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    return response.data.token;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Email Verification Test\n');
  
  const verified = await verifyEmail();
  
  if (verified) {
    const token = await testLoginAfterVerification();
    if (token) {
      console.log('\n🎉 Email verification and login test completed successfully!');
      console.log('You can now run the complete system test.');
    }
  } else {
    console.log('\n⚠️ Email verification failed. Please check the logs manually.');
  }
}

main().catch(console.error); 