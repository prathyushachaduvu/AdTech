const sequelize = require('./database');

// Import all models in the correct order
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const BillingInfo = require('../models/BillingInfo');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const UserRole = require('../models/UserRole');
const RolePermission = require('../models/RolePermission');
const Campaign = require('../models/Campaign');
const Targeting = require('../models/Targeting');
const Asset = require('../models/Asset');
const Analysis = require('../models/Analysis');
const File = require('../models/File');
// Analytics models
const Event = require('../models/Event');
const Analytics = require('../models/Analytics');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
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
    
    // Analysis associations
    Analysis.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Analysis.belongsTo(Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(Analysis, {
      foreignKey: 'userId',
      as: 'analyses',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Campaign.hasMany(Analysis, {
      foreignKey: 'campaignId',
      as: 'analyses',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    // File associations
    File.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    File.belongsTo(Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    File.belongsTo(File, {
      foreignKey: 'parentFileId',
      as: 'parentFile',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    File.hasMany(File, {
      foreignKey: 'parentFileId',
      as: 'versions',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(File, {
      foreignKey: 'userId',
      as: 'files',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Campaign.hasMany(File, {
      foreignKey: 'campaignId',
      as: 'files',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    // Analytics associations
    Event.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Event.belongsTo(Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(Event, {
      foreignKey: 'userId',
      as: 'events',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Campaign.hasMany(Event, {
      foreignKey: 'campaignId',
      as: 'events',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Analytics.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Analytics.belongsTo(Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    User.hasMany(Analytics, {
      foreignKey: 'userId',
      as: 'analytics',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    Campaign.hasMany(Analytics, {
      foreignKey: 'campaignId',
      as: 'analytics',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    // Analytics.belongsTo(User, {
    //   foreignKey: 'userId',
    //   as: 'user',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // Analytics.belongsTo(Campaign, {
    //   foreignKey: 'campaignId',
    //   as: 'campaign',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // User.hasMany(Analytics, {
    //   foreignKey: 'userId',
    //   as: 'analytics',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // Campaign.hasMany(Analytics, {
    //   foreignKey: 'campaignId',
    //   as: 'analytics',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // Alert.belongsTo(User, {
    //   foreignKey: 'userId',
    //   as: 'user',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // Alert.belongsTo(Campaign, {
    //   foreignKey: 'campaignId',
    //   as: 'campaign',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // User.hasMany(Alert, {
    //   foreignKey: 'userId',
    //   as: 'alerts',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
    // Campaign.hasMany(Alert, {
    //   foreignKey: 'campaignId',
    //   as: 'alerts',
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // });
    
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
    
    // Sync database in development mode with proper order
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Syncing database models...');
      
      // Step 1: Sync base models first (User, Role, Permission)
      await User.sync({ force: true });
      await Role.sync({ force: true });
      await Permission.sync({ force: true });
      await UserRole.sync({ force: true });
      await RolePermission.sync({ force: true });
      
      // Step 2: Sync dependent models (Campaign, UserProfile, BillingInfo)
      await Campaign.sync({ force: true });
      await UserProfile.sync({ force: true });
      await BillingInfo.sync({ force: true });
      
      // Step 3: Sync related models (Targeting, Asset, Analysis, File)
      await Targeting.sync({ force: true });
      await Asset.sync({ force: true });
      await Analysis.sync({ force: true });
      await File.sync({ force: true });
      
      // Step 4: Sync analytics models last (Event, Analytics)
      await Event.sync({ force: true });
      await Analytics.sync({ force: true });
      
      console.log('✅ Database models synchronized in correct order.');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

module.exports = initializeDatabase; 