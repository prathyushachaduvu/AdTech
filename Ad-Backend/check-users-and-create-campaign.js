const User = require('./src/models/User');
const Campaign = require('./src/models/Campaign');
const sequelize = require('./src/config/database');

async function checkUsersAndCreateCampaign() {
  try {
    console.log('🔍 Checking users and creating campaign...\n');
    
    // Check if database is connected
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Get all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName']
    });
    
    console.log(`📊 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} - ID: ${user.id}`);
    });
    
    if (users.length === 0) {
      console.log('\n⚠️  No users found. Creating a test user first...');
      
      const testUser = await User.create({
        email: 'test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true
      });
      
      console.log('✅ Test user created:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   ID: ${testUser.id}`);
      
      // Create campaign with this user
      const testCampaign = await Campaign.create({
        name: 'Test Campaign for Files',
        description: 'A test campaign for file upload testing',
        type: 'display',
        objective: 'awareness',
        budgetType: 'daily',
        budgetAmount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        timezone: 'UTC',
        tags: ['test', 'files'],
        settings: {},
        userId: testUser.id
      });
      
      console.log('\n✅ Test campaign created:');
      console.log(`   Name: ${testCampaign.name}`);
      console.log(`   ID: ${testCampaign.id}`);
      console.log(`   User ID: ${testCampaign.userId}`);
      
    } else {
      // Use the first user
      const firstUser = users[0];
      console.log(`\n👤 Using first user: ${firstUser.email}`);
      
      const testCampaign = await Campaign.create({
        name: 'Test Campaign for Files',
        description: 'A test campaign for file upload testing',
        type: 'display',
        objective: 'awareness',
        budgetType: 'daily',
        budgetAmount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        timezone: 'UTC',
        tags: ['test', 'files'],
        settings: {},
        userId: firstUser.id
      });
      
      console.log('\n✅ Test campaign created:');
      console.log(`   Name: ${testCampaign.name}`);
      console.log(`   ID: ${testCampaign.id}`);
      console.log(`   User ID: ${testCampaign.userId}`);
    }
    
    console.log('\n🔑 Use this campaign ID for file uploads:');
    console.log(`   campaignId: ${testCampaign.id}`);
    
    console.log('\n📋 Example file upload:');
    console.log('POST /api/files/upload');
    console.log('Body: form-data');
    console.log('- file: (your file)');
    console.log(`- campaignId: ${testCampaign.id}`);
    console.log('- tags: test,banner');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkUsersAndCreateCampaign(); 