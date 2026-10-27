const axios = require('axios');

async function testAnalytics() {
  try {
    console.log('Testing analytics endpoint...');
    
    // First test if the route exists by checking the response
    const response = await axios.post('http://localhost:3000/api/analytics/events', {
      eventType: 'test',
      campaignId: 'test'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('✅ Analytics endpoint working:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Analytics endpoint error:', error.response.data);
      console.log('Status:', error.response.status);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testAnalytics(); 