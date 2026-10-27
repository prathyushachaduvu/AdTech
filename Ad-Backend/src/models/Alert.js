const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
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
    }
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  // Alert details
  alertType: {
    type: DataTypes.ENUM('performance_drop', 'performance_spike', 'budget_exceeded', 'conversion_drop', 'ctr_anomaly', 'spend_anomaly', 'custom'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Alert conditions
  metric: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'ctr', 'conversions', 'spend'
  },
  threshold: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  },
  previousValue: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true
  },
  changePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  // Time period
  timeWindow: {
    type: DataTypes.INTEGER, // in hours
    allowNull: false
  },
  comparisonPeriod: {
    type: DataTypes.INTEGER, // in hours
    allowNull: false
  },
  // Alert status
  status: {
    type: DataTypes.ENUM('active', 'acknowledged', 'resolved', 'dismissed'),
    defaultValue: 'active'
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  acknowledgedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Notification settings
  notifyEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notifyPush: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notifySlack: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Additional data
  context: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  // Timestamps
  triggeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'alerts',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['campaignId']
    },
    {
      fields: ['alertType']
    },
    {
      fields: ['severity']
    },
    {
      fields: ['status']
    },
    {
      fields: ['triggeredAt']
    }
  ]
});

module.exports = Alert; 