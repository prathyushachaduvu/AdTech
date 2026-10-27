const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function finalWorkingSolution() {
  try {
    console.log('🚀 Final Working Solution...\n');
    
    // Step 1: Use the password reset token from logs
    console.log('1️⃣ Using password reset token...');
    const resetToken = '9a3f9aa9-83c4-f635-4ba5-f43777c2f229'; // From logs
    
    const resetResponse = await axios.post(`${BASE_URL}/auth/reset-password`, {
      token: resetToken,
      password: 'NewPassword123!'
    });
    
    console.log('✅ Password reset successful');
    
    // Step 2: Login with new password
    console.log('2️⃣ Logging in with new password...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'analytics@test.com',
      password: 'NewPassword123!'
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
    console.log('\n📋 Use this campaign ID for your analytics requests:');
    console.log('   Campaign ID:', campaignId);
    console.log('   Email: analytics@test.com');
    console.log('   Password: NewPassword123!');
    console.log('   Token:', token);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 Password reset token might be expired. Let me try a different approach...');
      
      // Try to create a new user with a different email
      console.log('\n🔄 Creating new user with different email...');
      try {
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
          email: 'test2@example.com',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        });
        console.log('✅ New user registered:', registerResponse.data.message);
        console.log('📧 Check server logs for verification token');
      } catch (regError) {
        console.error('❌ Registration failed:', regError.response?.data || regError.message);
      }
    }
  }
}

finalWorkingSolution(); 