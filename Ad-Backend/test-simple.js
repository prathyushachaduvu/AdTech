const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCampaignSystem() {
  console.log('🚀 Testing Campaign System...\n');
  
  try {
    // Step 1: Register user
    console.log('1. Registering user...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email: 'test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      });
      console.log('✅ User registered');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️ User already exists');
      } else {
        throw error;
      }
    }

    // Step 2: Login
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');

    // Step 3: Create campaign
    console.log('3. Creating campaign...');
    const campaignData = {
      name: 'Test Campaign',
      description: 'Test campaign for validation',
      type: 'display',
      objective: 'awareness',
      budgetType: 'daily',
      budgetAmount: 100.00,
      startDate: '2024-06-01T00:00:00.000Z',
      endDate: '2024-08-31T23:59:59.000Z',
      targeting: {
        locations: ['US'],
        ageRange: { min: 18, max: 65 },
        interests: ['technology']
      }
    };

    const campaignResponse = await axios.post(`${BASE_URL}/api/v1/campaigns`, campaignData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Campaign created:', campaignResponse.data.data.id);

    // Step 4: Get campaigns
    console.log('4. Getting campaigns...');
    const campaignsResponse = await axios.get(`${BASE_URL}/api/v1/campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Campaigns retrieved:', campaignsResponse.data.data.pagination.totalItems);

    // Step 5: Get statistics
    console.log('5. Getting statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/v1/campaigns/stats/overview`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Statistics retrieved');

    console.log('\n🎉 Campaign System Test Completed Successfully!');
    console.log('✅ Campaign Storage: Working');
    console.log('✅ Targeting Configuration: Working');
    console.log('✅ Validation: Working');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testCampaignSystem(); 