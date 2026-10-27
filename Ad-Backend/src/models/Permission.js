const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    },
    comment: 'The resource this permission applies to (e.g., users, profiles, billing)'
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    },
    comment: 'The action this permission allows (e.g., create, read, update, delete)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      fields: ['resource', 'action']
    }
  ]
});

module.exports = Permission; 