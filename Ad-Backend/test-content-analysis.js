const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testContent = {
  text: "This is a sample advertisement for our new product. It's amazing and everyone should buy it!",
  url: "https://example.com/sample-ad",
  imageUrl: "https://via.placeholder.com/300x200",
  metadata: {
    title: "Sample Ad",
    description: "A test advertisement",
    category: "electronics"
  }
};

const testCampaignId = "550e8400-e29b-41d4-a716-446655440000"; // Replace with actual campaign ID

async function testContentAnalysis() {
  console.log('🧪 Testing Content Analysis System\n');

  try {
    // Test 1: Analyze text content
    console.log('1. Testing Text Content Analysis...');
    const textAnalysis = await axios.post(`${BASE_URL}/content-analysis/analyze-text`, {
      text: testContent.text,
      campaignId: testCampaignId
    });
    console.log('✅ Text Analysis Result:', JSON.stringify(textAnalysis.data, null, 2));

    // Test 2: Analyze URL content
    console.log('\n2. Testing URL Content Analysis...');
    const urlAnalysis = await axios.post(`${BASE_URL}/content-analysis/analyze-url`, {
      url: testContent.url,
      campaignId: testCampaignId
    });
    console.log('✅ URL Analysis Result:', JSON.stringify(urlAnalysis.data, null, 2));

    // Test 3: Analyze image content
    console.log('\n3. Testing Image Content Analysis...');
    const imageAnalysis = await axios.post(`${BASE_URL}/content-analysis/analyze-image`, {
      imageUrl: testContent.imageUrl,
      campaignId: testCampaignId
    });
    console.log('✅ Image Analysis Result:', JSON.stringify(imageAnalysis.data, null, 2));

    // Test 4: Bulk content analysis
    console.log('\n4. Testing Bulk Content Analysis...');
    const bulkAnalysis = await axios.post(`${BASE_URL}/content-analysis/bulk-analyze`, {
      contents: [
        { type: 'text', data: testContent.text },
        { type: 'url', data: testContent.url },
        { type: 'image', data: testContent.imageUrl }
      ],
      campaignId: testCampaignId
    });
    console.log('✅ Bulk Analysis Result:', JSON.stringify(bulkAnalysis.data, null, 2));

    // Test 5: Get analysis history
    console.log('\n5. Testing Analysis History...');
    const history = await axios.get(`${BASE_URL}/content-analysis/history?campaignId=${testCampaignId}`);
    console.log('✅ Analysis History:', JSON.stringify(history.data, null, 2));

    // Test 6: Get analysis by ID
    if (history.data.analyses && history.data.analyses.length > 0) {
      const analysisId = history.data.analyses[0].id;
      console.log('\n6. Testing Get Analysis by ID...');
      const analysisById = await axios.get(`${BASE_URL}/content-analysis/${analysisId}`);
      console.log('✅ Analysis by ID:', JSON.stringify(analysisById.data, null, 2));
    }

    // Test 7: Get analysis insights
    console.log('\n7. Testing Analysis Insights...');
    const insights = await axios.get(`${BASE_URL}/content-analysis/insights?campaignId=${testCampaignId}`);
    console.log('✅ Analysis Insights:', JSON.stringify(insights.data, null, 2));

    // Test 8: Clear analysis cache
    console.log('\n8. Testing Cache Clear...');
    const cacheClear = await axios.delete(`${BASE_URL}/content-analysis/cache?campaignId=${testCampaignId}`);
    console.log('✅ Cache Clear Result:', JSON.stringify(cacheClear.data, null, 2));

    console.log('\n🎉 All Content Analysis Tests Completed Successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test specific analysis types
async function testSpecificAnalyses() {
  console.log('\n🔍 Testing Specific Analysis Types\n');

  try {
    // Test sentiment analysis
    console.log('1. Testing Sentiment Analysis...');
    const sentiment = await axios.post(`${BASE_URL}/content-analysis/sentiment`, {
      text: "I love this product! It's absolutely fantastic and works perfectly.",
      campaignId: testCampaignId
    });
    console.log('✅ Sentiment Result:', JSON.stringify(sentiment.data, null, 2));

    // Test keyword extraction
    console.log('\n2. Testing Keyword Extraction...');
    const keywords = await axios.post(`${BASE_URL}/content-analysis/keywords`, {
      text: "Our new smartphone features advanced AI capabilities, 5G connectivity, and a stunning display.",
      campaignId: testCampaignId
    });
    console.log('✅ Keywords Result:', JSON.stringify(keywords.data, null, 2));

    // Test content classification
    console.log('\n3. Testing Content Classification...');
    const classification = await axios.post(`${BASE_URL}/content-analysis/classify`, {
      text: "This is a promotional advertisement for our latest product launch.",
      campaignId: testCampaignId
    });
    console.log('✅ Classification Result:', JSON.stringify(classification.data, null, 2));

    // Test readability analysis
    console.log('\n4. Testing Readability Analysis...');
    const readability = await axios.post(`${BASE_URL}/content-analysis/readability`, {
      text: "The product offers exceptional value through its innovative design and superior functionality.",
      campaignId: testCampaignId
    });
    console.log('✅ Readability Result:', JSON.stringify(readability.data, null, 2));

    console.log('\n🎉 Specific Analysis Tests Completed Successfully!');

  } catch (error) {
    console.error('❌ Specific test failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Content Analysis System Tests\n');
  
  await testContentAnalysis();
  await testSpecificAnalyses();
  
  console.log('\n✨ All tests completed!');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm start');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
}

main().catch(console.error); 