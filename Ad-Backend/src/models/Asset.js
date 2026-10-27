const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
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
  
  // Asset Information
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // File Information
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'File size in bytes'
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fileExtension: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  
  // Asset Type
  type: {
    type: DataTypes.ENUM('image', 'video', 'audio', 'document', 'other'),
    allowNull: false
  },
  
  // Image/Video Specific Fields
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Width in pixels (for images/videos)'
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Height in pixels (for images/videos)'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds (for videos/audio)'
  },
  
  // Thumbnail Information
  thumbnailPath: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  thumbnailWidth: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  thumbnailHeight: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  // Asset Status
  status: {
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'error', 'deleted'),
    defaultValue: 'uploading'
  },
  
  // Processing Information
  processingStatus: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Processing status and metadata'
  },
  
  // Asset Settings
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Tags and Categories
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Usage Information
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of times this asset has been used'
  },
  lastUsed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // User Reference
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Additional Settings
  settings: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'assets',
  timestamps: true,
  paranoid: true, // Soft deletes
  
  indexes: [
    {
      fields: ['campaign_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_active']
    }
  ],
  
  hooks: {
    beforeCreate: (asset) => {
      // Validate file size (max 100MB)
      if (asset.fileSize > 100 * 1024 * 1024) {
        throw new Error('File size cannot exceed 100MB');
      }
      
      // Validate dimensions for images/videos
      if ((asset.type === 'image' || asset.type === 'video') && 
          (!asset.width || !asset.height || asset.width <= 0 || asset.height <= 0)) {
        throw new Error('Width and height are required for images and videos');
      }
    }
  }
});

// Instance methods
Asset.prototype.getFileSizeFormatted = function() {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  let size = this.fileSize;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < sizes.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${sizes[unitIndex]}`;
};

Asset.prototype.getDimensions = function() {
  if (this.width && this.height) {
    return `${this.width}x${this.height}`;
  }
  return null;
};

Asset.prototype.getDurationFormatted = function() {
  if (!this.duration) return null;
  
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

Asset.prototype.isImage = function() {
  return this.type === 'image';
};

Asset.prototype.isVideo = function() {
  return this.type === 'video';
};

Asset.prototype.isAudio = function() {
  return this.type === 'audio';
};

Asset.prototype.isDocument = function() {
  return this.type === 'document';
};

// Class methods
Asset.findByCampaign = function(campaignId, options = {}) {
  return this.findAll({
    where: {
      campaignId,
      isActive: true,
      status: 'ready'
    },
    ...options
  });
};

Asset.findByType = function(type, userId, options = {}) {
  return this.findAll({
    where: {
      type,
      userId,
      isActive: true,
      status: 'ready'
    },
    ...options
  });
};

module.exports = Asset; 