const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testBackup() {
  try {
    console.log('🚀 Testing Backup Endpoint...\n');
    
    // Step 1: Register a new user
    console.log('1️⃣ Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'backup@test.com',
      password: 'Test123!',
      firstName: 'Backup',
      lastName: 'Test'
    });
    
    console.log('✅ User registered:', registerResponse.data.message);
    
    // Step 2: Login to get token
    console.log('2️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'backup@test.com',
      password: 'Test123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 3: Test backup creation
    console.log('3️⃣ Creating backup...');
    const backupResponse = await axios.post(`${BASE_URL}/api/backup/create`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Backup created successfully!');
    console.log('Response:', backupResponse.data);
    
    // Step 4: List backups
    console.log('4️⃣ Listing backups...');
    const listResponse = await axios.get(`${BASE_URL}/api/backup/list`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Backup listing successful!');
    console.log('Backups:', listResponse.data.data.backups);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 User might need email verification. Check server logs for verification token.');
    }
  }
}

testBackup(); 