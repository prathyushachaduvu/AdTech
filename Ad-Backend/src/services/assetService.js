const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const Asset = require('../models/Asset');

class AssetService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    this.thumbnailDir = process.env.THUMBNAIL_DIR || 'thumbnails';
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    this.allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    this.allowedAudioTypes = ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg'];
    this.allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }

  // Create upload directories if they don't exist
  async ensureDirectories() {
    const dirs = [this.uploadDir, this.thumbnailDir];
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  // Validate file type and size
  validateFile(file) {
    const allowedTypes = [
      ...this.allowedImageTypes,
      ...this.allowedVideoTypes,
      ...this.allowedAudioTypes,
      ...this.allowedDocumentTypes
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('File type not supported');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('File size exceeds maximum limit of 100MB');
    }

    return true;
  }

  // Determine asset type from MIME type
  getAssetType(mimeType) {
    if (this.allowedImageTypes.includes(mimeType)) return 'image';
    if (this.allowedVideoTypes.includes(mimeType)) return 'video';
    if (this.allowedAudioTypes.includes(mimeType)) return 'audio';
    if (this.allowedDocumentTypes.includes(mimeType)) return 'document';
    return 'other';
  }

  // Generate unique filename
  generateFileName(originalName, extension) {
    const timestamp = Date.now();
    const uuid = uuidv4();
    return `${timestamp}-${uuid}${extension}`;
  }

  // Get file dimensions (for images and videos)
  async getFileDimensions(filePath, type) {
    if (type === 'image') {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width,
        height: metadata.height
      };
    }

    if (type === 'video') {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) {
            reject(err);
            return;
          }
          const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
          if (videoStream) {
            resolve({
              width: videoStream.width,
              height: videoStream.height
            });
          } else {
            resolve({ width: null, height: null });
          }
        });
      });
    }

    return { width: null, height: null };
  }

  // Get video/audio duration
  async getDuration(filePath, type) {
    if (type === 'video' || type === 'audio') {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(Math.floor(metadata.format.duration));
        });
      });
    }
    return null;
  }

  // Generate thumbnail for images and videos
  async generateThumbnail(filePath, type, outputPath) {
    try {
      if (type === 'image') {
        await sharp(filePath)
          .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(outputPath);

        const metadata = await sharp(outputPath).metadata();
        return {
          width: metadata.width,
          height: metadata.height
        };
      }

      if (type === 'video') {
        return new Promise((resolve, reject) => {
          ffmpeg(filePath)
            .screenshots({
              timestamps: ['50%'],
              filename: path.basename(outputPath),
              folder: path.dirname(outputPath),
              size: '300x300'
            })
            .on('end', async () => {
              try {
                const metadata = await sharp(outputPath).metadata();
                resolve({
                  width: metadata.width,
                  height: metadata.height
                });
              } catch (error) {
                reject(error);
              }
            })
            .on('error', reject);
        });
      }

      return null;
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return null;
    }
  }

  // Upload and process asset
  async uploadAsset(file, campaignId, userId, metadata = {}) {
    try {
      await this.ensureDirectories();

      // Validate file
      this.validateFile(file);

      // Determine asset type
      const assetType = this.getAssetType(file.mimetype);
      const fileExtension = path.extname(file.originalname);
      const fileName = this.generateFileName(file.originalname, fileExtension);
      const filePath = path.join(this.uploadDir, fileName);

      // Move uploaded file
      await fs.rename(file.path, filePath);

      // Get file dimensions and duration
      const dimensions = await this.getFileDimensions(filePath, assetType);
      const duration = await this.getDuration(filePath, assetType);

      // Generate thumbnail
      let thumbnailInfo = null;
      if (assetType === 'image' || assetType === 'video') {
        const thumbnailFileName = `thumb-${fileName.replace(fileExtension, '.jpg')}`;
        const thumbnailPath = path.join(this.thumbnailDir, thumbnailFileName);
        thumbnailInfo = await this.generateThumbnail(filePath, assetType, thumbnailPath);
      }

      // Create asset record
      const asset = await Asset.create({
        campaignId,
        userId,
        name: metadata.name || file.originalname,
        description: metadata.description,
        originalName: file.originalname,
        fileName,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileExtension,
        type: assetType,
        width: dimensions.width,
        height: dimensions.height,
        duration,
        thumbnailPath: thumbnailInfo ? path.join(this.thumbnailDir, `thumb-${fileName.replace(fileExtension, '.jpg')}`) : null,
        thumbnailWidth: thumbnailInfo?.width,
        thumbnailHeight: thumbnailInfo?.height,
        status: 'ready',
        tags: metadata.tags || [],
        categories: metadata.categories || [],
        settings: metadata.settings || {}
      });

      return asset;
    } catch (error) {
      console.error('Asset upload error:', error);
      throw error;
    }
  }

  // Get asset by ID
  async getAsset(assetId, userId) {
    const asset = await Asset.findOne({
      where: {
        id: assetId,
        userId,
        isActive: true
      }
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    return asset;
  }

  // Get assets by campaign
  async getCampaignAssets(campaignId, userId, options = {}) {
    const assets = await Asset.findAll({
      where: {
        campaignId,
        userId,
        isActive: true,
        status: 'ready'
      },
      ...options
    });

    return assets;
  }

  // Update asset metadata
  async updateAsset(assetId, userId, updateData) {
    const asset = await this.getAsset(assetId, userId);
    
    await asset.update(updateData);
    
    return asset;
  }

  // Delete asset
  async deleteAsset(assetId, userId) {
    const asset = await this.getAsset(assetId, userId);
    
    // Delete physical files
    try {
      if (asset.filePath) {
        await fs.unlink(asset.filePath);
      }
      if (asset.thumbnailPath) {
        await fs.unlink(asset.thumbnailPath);
      }
    } catch (error) {
      console.error('Error deleting physical files:', error);
    }
    
    // Soft delete asset record
    await asset.destroy();
    
    return true;
  }

  // Get asset statistics
  async getAssetStats(userId) {
    const stats = await Asset.findAll({
      attributes: [
        'type',
        [Asset.sequelize.fn('COUNT', Asset.sequelize.col('id')), 'count'],
        [Asset.sequelize.fn('SUM', Asset.sequelize.col('fileSize')), 'totalSize']
      ],
      where: {
        userId,
        isActive: true
      },
      group: ['type']
    });

    return stats;
  }

  // Search assets
  async searchAssets(userId, searchTerm, options = {}) {
    const assets = await Asset.findAll({
      where: {
        userId,
        isActive: true,
        status: 'ready',
        [Asset.sequelize.Op.or]: [
          { name: { [Asset.sequelize.Op.iLike]: `%${searchTerm}%` } },
          { description: { [Asset.sequelize.Op.iLike]: `%${searchTerm}%` } },
          { tags: { [Asset.sequelize.Op.contains]: [searchTerm] } }
        ]
      },
      ...options
    });

    return assets;
  }

  // Bulk delete assets
  async bulkDeleteAssets(assetIds, userId) {
    const assets = await Asset.findAll({
      where: {
        id: { [Asset.sequelize.Op.in]: assetIds },
        userId,
        isActive: true
      }
    });

    const deletePromises = assets.map(asset => this.deleteAsset(asset.id, userId));
    await Promise.all(deletePromises);

    return assets.length;
  }
}

module.exports = new AssetService(); 