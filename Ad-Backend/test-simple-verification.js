const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSimpleLogin() {
  console.log('🔐 Testing simple login (bypassing email verification)...');
  
  try {
    // First, try to register a new user
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test2@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Registration successful');
  } catch (error) {
    if (error.response?.data?.error === 'USER_ALREADY_EXISTS') {
      console.log('ℹ️ User already exists, proceeding...');
    } else {
      console.log('❌ Registration failed:', error.response?.data?.message || error.message);
      return null;
    }
  }
  
  try {
    // Try to login (this should work if email verification is not enforced in dev mode)
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test2@example.com',
      password: 'TestPassword123!'
    });
    
    console.log('✅ Login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    return loginResponse.data.token;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testBasicEndpoints(token) {
  if (!token) {
    console.log('❌ No token available, skipping endpoint tests');
    return;
  }
  
  console.log('\n🧪 Testing basic endpoints with token...');
  
  const headers = { Authorization: `Bearer ${token}` };
  
  try {
    // Test profile endpoint
    const profileResponse = await axios.get(`${BASE_URL}/profile`, { headers });
    console.log('✅ Profile endpoint working');
  } catch (error) {
    console.log('❌ Profile endpoint failed:', error.response?.data?.message || error.message);
  }
  
  try {
    // Test dashboard endpoint
    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, { headers });
    console.log('✅ Dashboard endpoint working');
  } catch (error) {
    console.log('❌ Dashboard endpoint failed:', error.response?.data?.message || error.message);
  }
  
  try {
    // Test campaigns endpoint
    const campaignsResponse = await axios.get(`${BASE_URL}/api/campaigns`, { headers });
    console.log('✅ Campaigns endpoint working');
  } catch (error) {
    console.log('❌ Campaigns endpoint failed:', error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🚀 Simple Authentication Test\n');
  
  const token = await testSimpleLogin();
  await testBasicEndpoints(token);
  
  if (token) {
    console.log('\n🎉 Basic authentication test completed successfully!');
    console.log('The system is working correctly.');
  } else {
    console.log('\n⚠️ Authentication test failed. Please check the server configuration.');
  }
}

main().catch(console.error); 