const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Targeting = sequelize.define('Targeting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Campaign Reference
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  
  // Geographic Targeting
  locations: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of country codes, states, cities'
  },
  locationType: {
    type: DataTypes.ENUM('include', 'exclude'),
    defaultValue: 'include'
  },
  
  // Demographic Targeting
  ageRange: {
    type: DataTypes.JSON,
    defaultValue: null,
    comment: '{"min": 18, "max": 65}'
  },
  gender: {
    type: DataTypes.ENUM('all', 'male', 'female', 'other'),
    defaultValue: 'all'
  },
  
  // Interest & Behavior Targeting
  interests: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of interest categories'
  },
  behaviors: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of behavior categories'
  },
  
  // Device & Platform Targeting
  devices: {
    type: DataTypes.JSON,
    defaultValue: ['desktop', 'mobile', 'tablet'],
    comment: 'Array of device types'
  },
  platforms: {
    type: DataTypes.JSON,
    defaultValue: ['web', 'ios', 'android'],
    comment: 'Array of platforms'
  },
  browsers: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of browser types'
  },
  
  // Contextual Targeting
  keywords: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of keywords for contextual matching'
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of content categories'
  },
  topics: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of content topics'
  },
  
  // Time-based Targeting
  timeSlots: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of time slots for dayparting'
  },
  daysOfWeek: {
    type: DataTypes.JSON,
    defaultValue: [0, 1, 2, 3, 4, 5, 6],
    comment: 'Array of days (0=Sunday, 6=Saturday)'
  },
  
  // Frequency Capping
  frequencyCap: {
    type: DataTypes.INTEGER,
    defaultValue: null,
    comment: 'Maximum impressions per user per time period'
  },
  frequencyPeriod: {
    type: DataTypes.ENUM('hour', 'day', 'week', 'month'),
    defaultValue: 'day'
  },
  
  // Advanced Targeting
  customAudiences: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of custom audience IDs'
  },
  lookalikeAudiences: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of lookalike audience configurations'
  },
  
  // Exclusions
  excludedAudiences: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of excluded audience IDs'
  },
  excludedCategories: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of excluded content categories'
  },
  
  // Targeting Settings
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // Additional Settings
  settings: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'targeting',
  timestamps: true,
  
  indexes: [
    {
      fields: ['campaign_id']
    },
    {
      fields: ['is_active']
    }
  ],
  
  hooks: {
    beforeCreate: (targeting) => {
      // Validate frequency cap if provided
      if (targeting.frequencyCap !== null && targeting.frequencyCap <= 0) {
        throw new Error('Frequency cap must be greater than 0');
      }
      
      // Validate age range if provided
      if (targeting.ageRange) {
        if (targeting.ageRange.min < 13 || targeting.ageRange.max > 100) {
          throw new Error('Age range must be between 13 and 100');
        }
        if (targeting.ageRange.min > targeting.ageRange.max) {
          throw new Error('Minimum age cannot be greater than maximum age');
        }
      }
    }
  }
});

// Instance methods
Targeting.prototype.isValidForUser = function(userData) {
  // This method would implement the targeting logic
  // For now, return true as a placeholder
  return true;
};

Targeting.prototype.getTargetingSummary = function() {
  const summary = {
    locations: this.locations.length,
    ageRange: this.ageRange ? `${this.ageRange.min}-${this.ageRange.max}` : 'All ages',
    gender: this.gender,
    interests: this.interests.length,
    devices: this.devices.length,
    platforms: this.platforms.length,
    keywords: this.keywords.length,
    categories: this.categories.length
  };
  
  return summary;
};

module.exports = Targeting; 