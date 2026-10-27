const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function finalFix() {
  try {
    console.log('🚀 Final Fix: Creating working analytics test...\n');
    
    // Step 1: Register a new user
    console.log('1️⃣ Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'analytics@test.com',
      password: 'Test123!',
      firstName: 'Analytics',
      lastName: 'Test'
    });
    
    console.log('✅ User registered:', registerResponse.data.message);
    
    // Step 2: Get verification token from logs
    console.log('2️⃣ Getting verification token from logs...');
    const { exec } = require('child_process');
    
    exec('docker-compose logs backend --tail=5', (error, stdout, stderr) => {
      if (error) {
        console.error('Error getting logs:', error);
        return;
      }
      
      const logs = stdout;
      console.log('📋 Recent logs:', logs);
      
      // Extract verification token from logs
      const tokenMatch = logs.match(/Verification email sent: <([^>]+)@gmail\.com>/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        console.log('🔑 Found verification token:', token);
        
        // Step 3: Verify email
        console.log('3️⃣ Verifying email...');
        axios.get(`${BASE_URL}/auth/verify-email/${token}`)
          .then(() => {
            console.log('✅ Email verified');
            
            // Step 4: Login
            console.log('4️⃣ Logging in...');
            return axios.post(`${BASE_URL}/auth/login`, {
              email: 'analytics@test.com',
              password: 'Test123!'
            });
          })
          .then((loginResponse) => {
            const token = loginResponse.data.token;
            console.log('✅ Login successful');
            
            // Step 5: Create campaign
            console.log('5️⃣ Creating campaign...');
            return axios.post(`${BASE_URL}/api/campaigns`, {
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
          })
          .then((campaignResponse) => {
            const campaignId = campaignResponse.data.data.id;
            console.log('✅ Campaign created:', campaignId);
            
            // Step 6: Test analytics
            console.log('6️⃣ Testing analytics event...');
            return axios.post(`${BASE_URL}/api/analytics/events`, {
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
          })
          .then((eventResponse) => {
            console.log('✅ Analytics event tracked successfully!');
            console.log('Response:', eventResponse.data);
            console.log('\n🎉 SUCCESS! Analytics endpoint is working!');
          })
          .catch((error) => {
            console.error('❌ Error in chain:', error.response?.data || error.message);
          });
      } else {
        console.log('❌ No verification token found in logs');
        console.log('💡 Please check the server logs manually for the verification token');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

finalFix(); 