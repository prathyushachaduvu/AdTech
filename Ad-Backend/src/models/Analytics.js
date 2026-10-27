const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who owns this analytics data'
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    },
    comment: 'Associated campaign'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date of the analytics data'
  },
  period: {
    type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly'),
    allowNull: false,
    defaultValue: 'daily',
    comment: 'Time period for the analytics'
  },
  // Core metrics
  impressions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of impressions'
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of clicks'
  },
  conversions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of conversions'
  },
  spend: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Amount spent'
  },
  // Derived metrics
  ctr: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0.0000,
    comment: 'Click-through rate'
  },
  cpc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Cost per click'
  },
  cpm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Cost per thousand impressions'
  },
  conversionRate: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0.0000,
    comment: 'Conversion rate'
  },
  // Additional metrics
  uniqueUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of unique users'
  },
  sessions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of sessions'
  },
  bounceRate: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0.0000,
    comment: 'Bounce rate'
  },
  avgSessionDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Average session duration in seconds'
  },
  // Geographic data
  geographicData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Geographic distribution of users'
  },
  // Device data
  deviceData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Device type distribution'
  },
  // Source data
  sourceData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Traffic source distribution'
  },
  // Custom metrics
  customMetrics: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Custom metrics specific to the campaign'
  },
  // Processing status
  processed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether the data has been processed'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Last time the analytics were updated'
  }
}, {
  tableName: 'Analytics',
  timestamps: true,
  indexes: [
    {
      name: 'idx_analytics_user_campaign_date',
      fields: ['user_id', 'campaign_id', 'date']
    },
    {
      name: 'idx_analytics_campaign_date',
      fields: ['campaign_id', 'date']
    },
    {
      name: 'idx_analytics_date_period',
      fields: ['date', 'period']
    },
    {
      name: 'idx_analytics_processed',
      fields: ['processed']
    }
  ]
});

// Associations
Analytics.associate = (models) => {
  Analytics.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  Analytics.belongsTo(models.Campaign, {
    foreignKey: 'campaignId',
    as: 'campaign'
  });
};

module.exports = Analytics; 