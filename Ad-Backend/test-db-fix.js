const { v4: uuidv4 } = require('uuid');
const sequelize = require('./src/config/database');

// Import models
const User = require('./src/models/User');
const UserProfile = require('./src/models/UserProfile');
const BillingInfo = require('./src/models/BillingInfo');
const Role = require('./src/models/Role');
const Permission = require('./src/models/Permission');
const UserRole = require('./src/models/UserRole');
const RolePermission = require('./src/models/RolePermission');
const Campaign = require('./src/models/Campaign');
const Targeting = require('./src/models/Targeting');
const Asset = require('./src/models/Asset');

async function testDatabase() {
  // Generate a unique email for each test run
  const uniqueEmail = `test_${uuidv4()}@example.com`;
  let testUser, testCampaign;
  try {
    console.log('🧪 Testing database after fix...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Set up associations
    console.log('🔗 Setting up associations...');
    
    // User associations
    User.hasOne(UserProfile, {
      foreignKey: 'userId',
      as: 'profile',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(BillingInfo, {
      foreignKey: 'userId',
      as: 'billingInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(Campaign, {
      foreignKey: 'userId',
      as: 'campaigns',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(Asset, {
      foreignKey: 'userId',
      as: 'userAssets',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    // Campaign associations
    Campaign.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Campaign.hasOne(Targeting, {
      foreignKey: 'campaignId',
      as: 'targeting',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Campaign.hasMany(Asset, {
      foreignKey: 'campaignId',
      as: 'assets',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    // Targeting associations
    Targeting.belongsTo(Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    // Asset associations
    Asset.belongsTo(Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Asset.belongsTo(User, {
      foreignKey: 'userId',
      as: 'owner',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    console.log('✅ Associations set up');
    
    // Test table creation
    console.log('📋 Checking table structure...');
    
    // Check if users table exists and has correct columns
    const userColumns = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    console.log('✅ Users table columns:', userColumns[0].map(col => col.column_name));
    
    // Check if campaigns table exists and has userId column
    const campaignColumns = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'campaigns' 
      ORDER BY ordinal_position;
    `);
    console.log('✅ Campaigns table columns:', campaignColumns[0].map(col => col.column_name));
    
    // Check foreign key constraints
    const foreignKeys = await sequelize.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY';
    `);
    console.log('✅ Foreign key constraints:', foreignKeys[0]);
    
    // Clean up any previous test users with the same email (shouldn't exist, but for safety)
    await User.destroy({ where: { email: uniqueEmail }, force: true });
    
    // Test creating a simple user
    console.log('👤 Testing user creation...');
    testUser = await User.create({
      email: uniqueEmail,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Test user created:', testUser.id);
    
    // Test creating a campaign
    console.log('📢 Testing campaign creation...');
    testCampaign = await Campaign.create({
      name: 'Test Campaign',
      description: 'A test campaign',
      type: 'display',
      objective: 'awareness',
      budgetType: 'daily',
      budgetAmount: 100.00,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: testUser.id
    });
    console.log('✅ Test campaign created:', testCampaign.id);
    
    // Test association
    console.log('🔗 Testing associations...');
    const userWithCampaigns = await User.findByPk(testUser.id, {
      include: [{
        model: Campaign,
        as: 'campaigns'
      }]
    });
    console.log('✅ User has campaigns:', userWithCampaigns.campaigns.length);
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  } finally {
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    if (testCampaign) await testCampaign.destroy({ force: true });
    if (testUser) await testUser.destroy({ force: true });
    // Remove any lingering test users with the same email
    await User.destroy({ where: { email: uniqueEmail }, force: true });
    console.log('✅ Test data cleaned up');
    await sequelize.close();
  }
}

testDatabase().catch(console.error); 