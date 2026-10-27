const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
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
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  
  // Personal Information
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [10, 15]
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'UTC'
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'en'
  },
  
  // Company Information
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  companyWebsite: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  companySize: {
    type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  
  // Address Information
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 200]
    }
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [3, 20]
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  
  // Billing Information
  billingAddressLine1: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 200]
    }
  },
  billingAddressLine2: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  billingCity: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  billingState: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  billingPostalCode: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [3, 20]
    }
  },
  billingCountry: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 50]
    }
  },
  
  // Preferences
  emailNotifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      marketing: true,
      security: true,
      updates: true,
      newsletter: false
    }
  },
  pushNotifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      enabled: true,
      marketing: false,
      security: true,
      updates: true
    }
  },
  privacySettings: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowContact: true
    }
  },
  
  // Social Media Links
  linkedinUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  twitterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  githubUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  
  // Additional Fields
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  isProfileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_profiles', // Force lowercase table name
  timestamps: true
});

module.exports = UserProfile; 