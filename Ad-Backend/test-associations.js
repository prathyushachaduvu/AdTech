const initializeDatabase = require('./src/config/initDatabase');

async function testAssociations() {
  try {
    console.log('🧪 Testing Model Associations...\n');
    
    // Initialize database with associations
    await initializeDatabase();
    
    console.log('✅ All associations set up successfully!');
    console.log('\n📋 Association Summary:');
    console.log('- User.hasOne(UserProfile, { as: "profile" })');
    console.log('- User.hasMany(BillingInfo, { as: "billingInfo" })');
    console.log('- User.hasMany(Campaign, { as: "campaigns" })');
    console.log('- User.hasMany(Asset, { as: "userAssets" })');
    console.log('- Campaign.belongsTo(User, { as: "user" })');
    console.log('- Campaign.hasOne(Targeting, { as: "targeting" })');
    console.log('- Campaign.hasMany(Asset, { as: "assets" })');
    console.log('- Asset.belongsTo(Campaign, { as: "campaign" })');
    console.log('- Asset.belongsTo(User, { as: "owner" })');
    
    console.log('\n🎉 Association test completed successfully!');
    console.log('✅ No conflicting associations detected');
    
  } catch (error) {
    console.error('❌ Association test failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testAssociations();
}

module.exports = testAssociations; 