const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function simpleTest() {
  try {
    console.log('🚀 Simple Test: Using existing verified user...\n');
    
    // Step 1: Login with the user that was already verified
    console.log('1️⃣ Logging in with existing user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@example.com', // This user was already verified
      password: 'SecurePassword123!'
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
    console.log('   Token:', token);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 The user might not exist. Let me try a different approach...');
      
      // Try to register a new user
      console.log('\n🔄 Trying to register a new user...');
      try {
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
          email: 'test@example.com',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User'
        });
        console.log('✅ User registered:', registerResponse.data.message);
        console.log('📧 Check the server logs for email verification token');
      } catch (regError) {
        console.error('❌ Registration failed:', regError.response?.data || regError.message);
      }
    }
  }
}

simpleTest(); 