const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
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
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.ENUM('image', 'video', 'document', 'audio', 'other'),
    allowNull: false
  },
  extension: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  // Virus scanning
  isScanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isClean: {
    type: DataTypes.BOOLEAN,
    defaultValue: null
  },
  scanResult: {
    type: DataTypes.JSONB,
    defaultValue: null
  },
  scanDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Thumbnail generation
  hasThumbnail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  thumbnailPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // CDN integration
  cdnUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cdnProvider: {
    type: DataTypes.ENUM('aws_s3', 'cloudflare', 'local'),
    defaultValue: 'local'
  },
  cdnRegion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // File versioning
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  parentFileId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'files',
      key: 'id'
    }
  },
  isLatest: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // File metadata
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  // Image/Video specific metadata
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: null // {width: 1920, height: 1080}
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true // in seconds
  },
  // Status and processing
  status: {
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'error', 'quarantined'),
    defaultValue: 'uploading'
  },
  processingProgress: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // 0-100
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Access control
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  accessLevel: {
    type: DataTypes.ENUM('private', 'shared', 'public'),
    defaultValue: 'private'
  },
  // Tags and organization
  tags: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Analytics
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastAccessed: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'files',
  timestamps: true,
  indexes: []
});

module.exports = File; 