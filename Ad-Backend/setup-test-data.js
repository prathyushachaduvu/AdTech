const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function setupTestData() {
  try {
    console.log('🚀 Setting up test data...');
    
    // Step 1: Register a test user
    console.log('📝 Registering test user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('✅ User registered:', registerResponse.data.message);
    
    // Step 2: Login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 3: Create a test campaign
    console.log('📊 Creating test campaign...');
    const campaignResponse = await axios.post(`${BASE_URL}/api/campaigns`, {
      name: 'Test Analytics Campaign',
      description: 'Campaign for testing analytics events',
      type: 'display',
      objective: 'awareness',
      budgetType: 'daily',
      budgetAmount: 100,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      timezone: 'America/New_York',
      tags: ['test', 'analytics'],
      settings: {
        bidStrategy: 'manual',
        targetCPA: 10
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const campaignId = campaignResponse.data.data.id;
    console.log('✅ Campaign created with ID:', campaignId);
    
    // Step 4: Test analytics event tracking
    console.log('📈 Testing analytics event tracking...');
    const eventResponse = await axios.post(`${BASE_URL}/api/analytics/events`, {
      eventType: 'impression',
      campaignId: campaignId,
      metadata: {
        source: 'test',
        userAgent: 'Test Browser',
        ipAddress: '127.0.0.1'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Analytics event tracked successfully:', eventResponse.data);
    
    console.log('\n🎉 Test data setup complete!');
    console.log('📋 Test Credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: TestPassword123!');
    console.log('   Campaign ID:', campaignId);
    console.log('   Token:', token);
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error.response?.data || error.message);
  }
}

setupTestData(); 