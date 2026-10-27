const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of event (impression, click, conversion, etc.)'
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    },
    comment: 'Associated campaign ID'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who triggered the event (nullable for anonymous events)'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'When the event occurred'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional event data (user agent, IP, etc.)'
  },
  processed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether the event has been processed by analytics'
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Session identifier for grouping related events'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'IP address of the event source'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User agent string'
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Referrer URL'
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Geographic location data'
  },
  deviceInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Device information (browser, OS, etc.)'
  }
}, {
  tableName: 'Events',
  timestamps: true,
  indexes: [
    {
      name: 'idx_events_campaign_timestamp',
      fields: ['campaign_id', 'timestamp']
    },
    {
      name: 'idx_events_type_timestamp',
      fields: ['event_type', 'timestamp']
    },
    {
      name: 'idx_events_user_timestamp',
      fields: ['user_id', 'timestamp']
    },
    {
      name: 'idx_events_processed',
      fields: ['processed']
    },
    {
      name: 'idx_events_session',
      fields: ['session_id']
    }
  ]
});

// Associations
Event.associate = (models) => {
  Event.belongsTo(models.Campaign, {
    foreignKey: 'campaignId',
    as: 'campaign'
  });
  
  Event.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Event; 