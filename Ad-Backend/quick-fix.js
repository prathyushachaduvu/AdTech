const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function quickFix() {
  try {
    console.log('🚀 Quick Fix: Creating test campaign for analytics...\n');
    
    // Step 1: Register user (skip email verification)
    console.log('1️⃣ Registering test user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'analytics@test.com',
      password: 'Test123!',
      firstName: 'Analytics',
      lastName: 'Test'
    });
    console.log('✅ User registered');
    
    // Step 2: Login (this will work even without email verification in dev mode)
    console.log('2️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'analytics@test.com',
      password: 'Test123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 3: Create campaign
    console.log('3️⃣ Creating test campaign...');
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
    
    // Step 4: Test analytics event
    console.log('4️⃣ Testing analytics event...');
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
    console.log('\n📋 Use these credentials for testing:');
    console.log('   Email: analytics@test.com');
    console.log('   Password: Test123!');
    console.log('   Campaign ID:', campaignId);
    console.log('   Token:', token);
    
    console.log('\n📝 Example API call:');
    console.log(`POST ${BASE_URL}/api/analytics/events`);
    console.log('Headers: Authorization: Bearer ' + token);
    console.log('Body:');
    console.log(JSON.stringify({
      eventType: 'impression',
      campaignId: campaignId,
      metadata: {
        source: 'test',
        userAgent: 'Test Browser',
        ipAddress: '127.0.0.1'
      }
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n💡 Tip: The user might need email verification. Check the server logs for verification token.');
    }
  }
}

quickFix(); 