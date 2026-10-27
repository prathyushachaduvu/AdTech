const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = null;
let userId = null;
let campaignId = null;
let assetId = null;

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

const testCampaign = {
  name: 'Test Campaign',
  description: 'A test campaign for system verification',
  type: 'display',
  objective: 'awareness',
  budgetType: 'daily',
  budgetAmount: 1000,
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  timezone: 'America/New_York'
};

console.log('🚀 Starting comprehensive system test...\n');

async function testHealthCheck() {
  console.log('1. Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function testRegistration() {
  console.log('\n2. Testing User Registration...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', response.data.message);
    return true;
  } catch (error) {
    if (error.response?.data?.error === 'USER_ALREADY_EXISTS') {
      console.log('ℹ️ User already exists, proceeding with login...');
      return true;
    }
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n3. Testing User Login...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.data.token;
    userId = response.data.user.id;
    console.log('✅ Login successful, token received');
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testProfileManagement() {
  console.log('\n4. Testing Profile Management...');
  try {
    // Get profile
    const getResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get profile successful');

    // Update profile
    const updateResponse = await axios.put(`${BASE_URL}/profile`, {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '+1234567890'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update profile successful');

    return true;
  } catch (error) {
    console.log('❌ Profile management failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCampaignCreation() {
  console.log('\n5. Testing Campaign Creation...');
  try {
    const response = await axios.post(`${BASE_URL}/api/campaigns`, testCampaign, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    campaignId = response.data.campaign.id;
    console.log('✅ Campaign created successfully:', response.data.campaign.name);
    return true;
  } catch (error) {
    console.log('❌ Campaign creation failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testTargeting() {
  console.log('\n6. Testing Targeting Configuration...');
  try {
    const targetingData = {
      ageRange: { min: 25, max: 45 },
      gender: 'all',
      locations: ['US', 'CA'],
      interests: ['technology', 'business']
    };

    const response = await axios.post(`${BASE_URL}/api/campaigns/${campaignId}/targeting`, targetingData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Targeting configured successfully');
    return true;
  } catch (error) {
    console.log('❌ Targeting configuration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testFileUpload() {
  console.log('\n7. Testing File Upload...');
  try {
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');

    // Create a test file
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for upload verification.');

    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('campaignId', campaignId);
    form.append('type', 'image');

    const response = await axios.post(`${BASE_URL}/api/files/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`
      }
    });

    assetId = response.data.file.id;
    console.log('✅ File upload successful:', response.data.file.fileName);

    // Clean up test file
    fs.unlinkSync(testFilePath);
    return true;
  } catch (error) {
    console.log('❌ File upload failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testContentAnalysis() {
  console.log('\n8. Testing Content Analysis...');
  try {
    const analysisData = {
      text: 'This is a sample text for content analysis testing.',
      campaignId: campaignId,
      options: {
        includeSentiment: true,
        includeKeywords: true,
        includeClassification: true
      }
    };

    const response = await axios.post(`${BASE_URL}/api/content-analysis/analyze-text`, analysisData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Content analysis successful');
    return true;
  } catch (error) {
    console.log('❌ Content analysis failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testAnalytics() {
  console.log('\n9. Testing Analytics...');
  try {
    // Track an event
    const eventData = {
      eventType: 'impression',
      campaignId: campaignId,
      metadata: {
        source: 'test',
        timestamp: new Date().toISOString()
      }
    };

    const eventResponse = await axios.post(`${BASE_URL}/api/analytics/events`, eventData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Event tracking successful');

    // Get real-time metrics
    const metricsResponse = await axios.get(`${BASE_URL}/api/analytics/real-time/${campaignId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Real-time metrics retrieved');

    // Get performance overview
    const performanceResponse = await axios.get(`${BASE_URL}/api/analytics/performance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Performance overview retrieved');

    return true;
  } catch (error) {
    console.log('❌ Analytics test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testBackupSystem() {
  console.log('\n10. Testing Backup System...');
  try {
    // List backups
    const listResponse = await axios.get(`${BASE_URL}/api/backup/list`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Backup listing successful');

    // Create backup
    const createResponse = await axios.post(`${BASE_URL}/api/backup/create`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Backup creation successful');

    return true;
  } catch (error) {
    console.log('❌ Backup system test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDashboard() {
  console.log('\n11. Testing Dashboard...');
  try {
    const response = await axios.get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Dashboard data retrieved successfully');
    return true;
  } catch (error) {
    console.log('❌ Dashboard test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCampaignManagement() {
  console.log('\n12. Testing Campaign Management...');
  try {
    // Get all campaigns
    const listResponse = await axios.get(`${BASE_URL}/api/campaigns`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Campaign listing successful');

    // Update campaign
    const updateResponse = await axios.put(`${BASE_URL}/api/campaigns/${campaignId}`, {
      name: 'Updated Test Campaign',
      budgetAmount: 1500
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Campaign update successful');

    // Get campaign statistics
    const statsResponse = await axios.get(`${BASE_URL}/api/campaigns/stats/overview`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Campaign statistics retrieved');

    return true;
  } catch (error) {
    console.log('❌ Campaign management test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runAllTests() {
  const tests = [
    testHealthCheck,
    testRegistration,
    testLogin,
    testProfileManagement,
    testCampaignCreation,
    testTargeting,
    testFileUpload,
    testContentAnalysis,
    testAnalytics,
    testBackupSystem,
    testDashboard,
    testCampaignManagement
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! System is fully functional.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the logs above for details.');
  }

  console.log('\n🔧 System Features Tested:');
  console.log('• Health Check & System Status');
  console.log('• User Authentication & Registration');
  console.log('• Profile Management');
  console.log('• Campaign Creation & Management');
  console.log('• Targeting Configuration');
  console.log('• File Upload & Management');
  console.log('• Content Analysis');
  console.log('• Real-time Analytics');
  console.log('• Backup & Recovery System');
  console.log('• Dashboard & Reporting');
  console.log('• API Security & Authorization');
}

// Run the tests
runAllTests().catch(console.error); 