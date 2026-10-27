const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BillingInfo = sequelize.define('BillingInfo', {
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
  
  // Payment Method Information
  paymentMethodType: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe'),
    allowNull: false
  },
  paymentMethodName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  
  // Card Information (encrypted)
  cardLastFour: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [4, 4]
    }
  },
  cardBrand: {
    type: DataTypes.ENUM('visa', 'mastercard', 'amex', 'discover', 'other'),
    allowNull: true
  },
  cardExpiryMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 12
    }
  },
  cardExpiryYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: new Date().getFullYear(),
      max: new Date().getFullYear() + 20
    }
  },
  
  // Billing Address
  billingName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  billingEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  billingPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [10, 15]
    }
  },
  billingAddressLine1: {
    type: DataTypes.STRING,
    allowNull: false,
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
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  billingState: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  billingPostalCode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 20]
    }
  },
  billingCountry: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  
  // Tax Information
  taxId: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 50]
    }
  },
  taxExempt: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Payment Gateway Information
  paymentGatewayId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentGatewayCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Status and Preferences
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // Additional Information
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  }
}, {
  tableName: 'billing_info', // Force lowercase table name
  timestamps: true
});

module.exports = BillingInfo; 