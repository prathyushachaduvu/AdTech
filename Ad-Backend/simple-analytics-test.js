const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function simpleAnalyticsTest() {
  try {
    console.log('🚀 Simple Analytics Test...\n');
    
    // Step 1: Login with known working credentials
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'analytics@test.com',
      password: 'Test123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Create campaign
    console.log('2️⃣ Creating test campaign...');
    const campaignResponse = await axios.post(`${BASE_URL}/api/campaigns`, {
      name: 'Analytics Test Campaign',
      description: 'Campaign for testing analytics events',
      type: 'display',
      objective: 'awareness',
      budgetType: 'daily',
      budgetAmount: 100,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      timezone: 'America/New_York',
      tags: ['test', 'analytics']
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const campaignId = campaignResponse.data.data.id;
    console.log('✅ Campaign created with ID:', campaignId);
    
    // Step 3: Test analytics event
    console.log('3️⃣ Testing analytics event...');
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
    
    console.log('✅ Analytics event tracked successfully!');
    console.log('Response:', eventResponse.data);
    
    console.log('\n🎉 SUCCESS! Your analytics endpoint is now working.');
    console.log('\n📋 Use this campaign ID for your analytics requests:');
    console.log('   Campaign ID:', campaignId);
    console.log('   Email: analytics@test.com');
    console.log('   Password: Test123!');
    console.log('   Token:', token);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

simpleAnalyticsTest(); 