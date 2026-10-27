const sequelize = require('./src/config/database');

// Import all models in the correct order
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

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Drop all tables in reverse dependency order
    console.log('🗑️ Dropping all tables...');
    
    const tablesToDrop = [
      'assets',
      'targeting', 
      'campaigns',
      'user_roles',
      'role_permissions',
      'billing_info',
      'user_profiles',
      'permissions',
      'roles',
      'users'
    ];
    
    for (const table of tablesToDrop) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`✅ Dropped ${table} table`);
      } catch (error) {
        console.log(`ℹ️ ${table} table not found or already dropped`);
      }
    }
    
    // Force sync to recreate all tables in correct order
    console.log('🔄 Force syncing database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database force synced');
    
    // Set up associations in the correct order
    console.log('🔗 Setting up model associations...');
    
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
    
    // Role and Permission associations
    User.belongsToMany(Role, {
      through: UserRole,
      foreignKey: 'userId',
      otherKey: 'roleId',
      as: 'roles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Role.belongsToMany(User, {
      through: UserRole,
      foreignKey: 'roleId',
      otherKey: 'userId',
      as: 'users',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Role.belongsToMany(Permission, {
      through: RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Permission.belongsToMany(Role, {
      through: RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    console.log('✅ Model associations set up successfully.');
    
    // Verify tables were created correctly
    console.log('🔍 Verifying table structure...');
    const tables = await sequelize.showAllSchemas();
    console.log('✅ Available tables:', tables.map(t => t.name));
    
    console.log('🎉 Database fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the fix
fixDatabase().catch(console.error); 