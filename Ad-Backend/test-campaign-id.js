const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const Campaign = require('./src/models/Campaign');

async function testCampaignId() {
  try {
    console.log('🎯 Testing Campaign ID retrieval...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Create a test user
    const testUser = await User.create({
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Test user created:', testUser.id);
    
    // Create a test campaign
    const testCampaign = await Campaign.create({
      name: 'Test Campaign for ID Demo',
      description: 'This campaign shows how to get campaign ID',
      type: 'display',
      objective: 'awareness',
      budgetType: 'daily',
      budgetAmount: 100.00,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: testUser.id
    });
    
    console.log('🎉 Campaign created successfully!');
    console.log('📋 Campaign Details:');
    console.log('   ID:', testCampaign.id);
    console.log('   Name:', testCampaign.name);
    console.log('   Status:', testCampaign.status);
    console.log('   Type:', testCampaign.type);
    console.log('   Objective:', testCampaign.objective);
    
    console.log('\n🔗 Now you can use this Campaign ID in your API calls:');
    console.log(`   GET /api/campaigns/${testCampaign.id}`);
    console.log(`   POST /api/campaigns/${testCampaign.id}/targeting`);
    console.log(`   POST /api/campaigns/${testCampaign.id}/assets`);
    
    // Get all campaigns to show multiple IDs
    const allCampaigns = await Campaign.findAll({
      where: { userId: testUser.id },
      attributes: ['id', 'name', 'status', 'type']
    });
    
    console.log('\n📊 All campaigns for this user:');
    allCampaigns.forEach((campaign, index) => {
      console.log(`   ${index + 1}. ${campaign.name} (${campaign.id}) - ${campaign.status}`);
    });
    
    // Clean up
    await testCampaign.destroy();
    await testUser.destroy();
    console.log('\n🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

testCampaignId(); 