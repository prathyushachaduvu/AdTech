const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function workingSolution() {
  try {
    console.log('🚀 Working Solution: Using existing user...\n');
    
    // Try different common passwords for the existing user
    const passwords = ['Test123!', 'TestPassword123!', 'SecurePassword123!', 'password', '123456'];
    let token = null;
    let email = 'analytics@test.com';
    
    console.log('1️⃣ Trying to login with existing user...');
    
    for (const password of passwords) {
      try {
        console.log(`   Trying password: ${password}`);
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: email,
          password: password
        });
        
        token = loginResponse.data.token;
        console.log('✅ Login successful with password:', password);
        break;
      } catch (error) {
        console.log(`   ❌ Failed with password: ${password}`);
      }
    }
    
    if (!token) {
      console.log('❌ Could not login with any password');
      console.log('💡 Let me try to reset the password...');
      
      // Try to reset password
      try {
        await axios.post(`${BASE_URL}/auth/forgot-password`, {
          email: email
        });
        console.log('✅ Password reset email sent');
        console.log('📧 Check server logs for reset token');
        return;
      } catch (error) {
        console.log('❌ Password reset failed:', error.response?.data || error.message);
        return;
      }
    }
    
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
    console.log('   Email:', email);
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
  }
}

workingSolution(); 