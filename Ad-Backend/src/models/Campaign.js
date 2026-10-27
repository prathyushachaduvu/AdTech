const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Basic Campaign Information
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Campaign Status
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'active', 'paused', 'completed', 'cancelled'),
    defaultValue: 'draft',
    allowNull: false
  },
  
  // Campaign Type
  type: {
    type: DataTypes.ENUM('display', 'video', 'social', 'search', 'native', 'email'),
    allowNull: false
  },
  
  // Campaign Objectives
  objective: {
    type: DataTypes.ENUM('awareness', 'consideration', 'conversions', 'traffic', 'engagement', 'app_installs'),
    allowNull: false
  },
  
  // Budget Configuration
  budgetType: {
    type: DataTypes.ENUM('daily', 'lifetime', 'monthly'),
    allowNull: false,
    defaultValue: 'daily'
  },
  budgetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  budgetSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Timeline Configuration
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  // Campaign Settings
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'UTC'
  },
  
  // Performance Metrics
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  spend: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  
  // Campaign Settings
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // Metadata
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Additional Settings
  settings: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  
  // User Reference
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'campaigns',
  timestamps: true,
  paranoid: true, // Soft deletes
  
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    },
    {
      fields: ['start_date', 'end_date']
    },
    {
      fields: ['created_at']
    }
  ],
  
  hooks: {
    beforeCreate: (campaign) => {
      // Validate end date is after start date
      if (campaign.endDate <= campaign.startDate) {
        throw new Error('End date must be after start date');
      }
      
      // Validate budget amount
      if (campaign.budgetAmount <= 0) {
        throw new Error('Budget amount must be greater than 0');
      }
    },
    
    beforeUpdate: (campaign) => {
      // Validate end date is after start date
      if (campaign.endDate && campaign.startDate && campaign.endDate <= campaign.startDate) {
        throw new Error('End date must be after start date');
      }
      
      // Validate budget amount
      if (campaign.budgetAmount && campaign.budgetAmount <= 0) {
        throw new Error('Budget amount must be greater than 0');
      }
    }
  }
});

// Instance methods
Campaign.prototype.isOverBudget = function() {
  return this.budgetSpent >= this.budgetAmount;
};

Campaign.prototype.getBudgetRemaining = function() {
  return Math.max(0, this.budgetAmount - this.budgetSpent);
};

Campaign.prototype.getCTR = function() {
  return this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0;
};

Campaign.prototype.getConversionRate = function() {
  return this.clicks > 0 ? (this.conversions / this.clicks) * 100 : 0;
};

Campaign.prototype.getCPC = function() {
  return this.clicks > 0 ? this.spend / this.clicks : 0;
};

Campaign.prototype.getCPM = function() {
  return this.impressions > 0 ? (this.spend / this.impressions) * 1000 : 0;
};

Campaign.prototype.isActiveNow = function() {
  const now = new Date();
  return this.isActive && 
         this.status === 'active' && 
         now >= this.startDate && 
         now <= this.endDate;
};

// Class methods
Campaign.findActiveCampaigns = function(userId) {
  return this.findAll({
    where: {
      userId,
      isActive: true,
      status: 'active',
      startDate: { [sequelize.Op.lte]: new Date() },
      endDate: { [sequelize.Op.gte]: new Date() }
    }
  });
};

Campaign.findOverBudgetCampaigns = function(userId) {
  return this.findAll({
    where: {
      userId,
      budgetSpent: { [sequelize.Op.gte]: sequelize.col('budgetAmount') }
    }
  });
};

module.exports = Campaign; 