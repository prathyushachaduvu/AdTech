const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const redisClient = require('../config/redis');

// Configuration
const config = {
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html', 'application/json'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
    },
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    tempDir: process.env.TEMP_DIR || './temp'
  },
  thumbnail: {
    sizes: {
      small: { width: 150, height: 150 },
      medium: { width: 300, height: 300 },
      large: { width: 600, height: 600 }
    },
    quality: 80
  },
  virusScan: {
    enabled: process.env.VIRUS_SCAN_ENABLED === 'true',
    providers: ['clamav', 'virustotal'] // Mock for now
  },
  cdn: {
    enabled: process.env.CDN_ENABLED === 'true',
    provider: process.env.CDN_PROVIDER || 'local',
    region: process.env.CDN_REGION || 'us-east-1'
  }
};

// File type detection
function getFileType(mimeType) {
  for (const [type, mimes] of Object.entries(config.upload.allowedTypes)) {
    if (mimes.includes(mimeType)) {
      return type;
    }
  }
  return 'other';
}

// Generate unique filename
function generateFileName(originalName, extension) {
  const timestamp = Date.now();
  const randomId = uuidv4().replace(/-/g, '');
  return `${timestamp}_${randomId}${extension}`;
}

// Virus scanning (mock implementation)
async function scanFile(filePath) {
  if (!config.virusScan.enabled) {
    return { isClean: true, scanResult: { provider: 'disabled' } };
  }

  try {
    // Mock virus scanning - in production, integrate with ClamAV or VirusTotal
    const fileSize = (await fs.stat(filePath)).size;
    const isClean = fileSize < 1024 * 1024 * 10; // Mock: files under 10MB are clean
    
    return {
      isClean,
      scanResult: {
        provider: 'mock',
        scanDate: new Date(),
        threats: isClean ? [] : ['mock_threat'],
        engineVersion: '1.0.0'
      }
    };
  } catch (error) {
    console.error('Virus scan error:', error);
    return { isClean: false, scanResult: { error: error.message } };
  }
}

// Thumbnail generation
async function generateThumbnail(filePath, fileType, outputDir) {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    const thumbnails = {};

    if (fileType === 'image') {
      // Generate image thumbnails
      for (const [size, dimensions] of Object.entries(config.thumbnail.sizes)) {
        const thumbnailPath = path.join(outputDir, `${fileName}_${size}.jpg`);
        
        await sharp(filePath)
          .resize(dimensions.width, dimensions.height, { fit: 'inside' })
          .jpeg({ quality: config.thumbnail.quality })
          .toFile(thumbnailPath);
        
        thumbnails[size] = thumbnailPath;
      }
    } else if (fileType === 'video') {
      // Generate video thumbnail
      const thumbnailPath = path.join(outputDir, `${fileName}_thumb.jpg`);
      
      return new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .screenshots({
            timestamps: ['50%'],
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '300x200'
          })
          .on('end', () => resolve({ medium: thumbnailPath }))
          .on('error', reject);
      });
    }

    return thumbnails;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return {};
  }
}

// Extract file metadata
async function extractMetadata(filePath, fileType, mimeType) {
  const metadata = {};

  try {
    if (fileType === 'image') {
      const imageInfo = await sharp(filePath).metadata();
      metadata.dimensions = {
        width: imageInfo.width,
        height: imageInfo.height
      };
      metadata.format = imageInfo.format;
      metadata.space = imageInfo.space;
    } else if (fileType === 'video') {
      return new Promise((resolve) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (!err && metadata.streams) {
            const videoStream = metadata.streams.find(s => s.codec_type === 'video');
            if (videoStream) {
              resolve({
                dimensions: {
                  width: videoStream.width,
                  height: videoStream.height
                },
                duration: Math.round(metadata.format.duration),
                format: metadata.format.format_name,
                bitrate: metadata.format.bit_rate
              });
            }
          }
          resolve({});
        });
      });
    }

    return metadata;
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return {};
  }
}

// CDN upload (mock implementation)
async function uploadToCDN(filePath, fileName) {
  if (!config.cdn.enabled) {
    return { url: `/uploads/${fileName}`, provider: 'local' };
  }

  try {
    // Mock CDN upload - in production, integrate with AWS S3, Cloudflare, etc.
    const cdnUrl = `https://cdn.example.com/${fileName}`;
    
    return {
      url: cdnUrl,
      provider: config.cdn.provider,
      region: config.cdn.region
    };
  } catch (error) {
    console.error('CDN upload error:', error);
    return { url: `/uploads/${fileName}`, provider: 'local' };
  }
}

// Main file upload function
async function uploadFile(file, userId, campaignId = null, options = {}) {
  const startTime = Date.now();
  
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    const fileSize = file.size;
    if (fileSize > config.upload.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${config.upload.maxFileSize / (1024 * 1024)}MB`);
    }

    const mimeType = file.mimetype;
    const fileType = getFileType(mimeType);
    const extension = path.extname(file.originalname);

    // Generate unique filename
    const fileName = generateFileName(file.originalname, extension);
    const filePath = path.join(config.upload.uploadDir, fileName);

    // Ensure upload directory exists
    await fs.mkdir(config.upload.uploadDir, { recursive: true });

    // Copy file to upload directory (use copy instead of rename for cross-device compatibility)
    await fs.copyFile(file.path, filePath);
    
    // Remove the temporary file
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.warn('Could not remove temporary file:', error.message);
    }

    // Create file record
    const fileRecord = await File.create({
      userId,
      campaignId,
      originalName: file.originalname,
      fileName,
      filePath,
      fileSize,
      mimeType,
      fileType,
      extension,
      status: 'processing',
      processingProgress: 10
    });

    // Virus scanning
    const scanResult = await scanFile(filePath);
    await fileRecord.update({
      isScanned: true,
      isClean: scanResult.isClean,
      scanResult: scanResult.scanResult,
      scanDate: new Date(),
      processingProgress: 30
    });

    if (!scanResult.isClean) {
      await fileRecord.update({
        status: 'quarantined',
        errorMessage: 'File failed virus scan'
      });
      throw new Error('File failed virus scan');
    }

    // Extract metadata
    const metadata = await extractMetadata(filePath, fileType, mimeType);
    await fileRecord.update({
      metadata,
      dimensions: metadata.dimensions,
      duration: metadata.duration,
      processingProgress: 50
    });

    // Generate thumbnails
    const thumbnails = await generateThumbnail(filePath, fileType, config.upload.uploadDir);
    if (Object.keys(thumbnails).length > 0) {
      const thumbnailPath = thumbnails.medium || Object.values(thumbnails)[0];
      await fileRecord.update({
        hasThumbnail: true,
        thumbnailPath,
        processingProgress: 70
      });
    }

    // Upload to CDN
    const cdnResult = await uploadToCDN(filePath, fileName);
    await fileRecord.update({
      cdnUrl: cdnResult.url,
      cdnProvider: cdnResult.provider,
      cdnRegion: cdnResult.region,
      processingProgress: 90
    });

    // Update tags and category if provided
    if (options.tags) {
      await fileRecord.update({ tags: options.tags });
    }
    if (options.category) {
      await fileRecord.update({ category: options.category });
    }
    if (options.description) {
      await fileRecord.update({ description: options.description });
    }

    // Mark as ready
    await fileRecord.update({
      status: 'ready',
      processingProgress: 100
    });

    return fileRecord;

  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

// File versioning
async function createFileVersion(fileId, newFile, userId) {
  try {
    const originalFile = await File.findByPk(fileId);
    if (!originalFile) {
      throw new Error('Original file not found');
    }

    // Mark original as not latest
    await originalFile.update({ isLatest: false });

    // Upload new version
    const newFileRecord = await uploadFile(newFile, userId, originalFile.campaignId, {
      tags: originalFile.tags,
      category: originalFile.category,
      description: originalFile.description
    });

    // Update version info
    await newFileRecord.update({
      parentFileId: fileId,
      version: originalFile.version + 1,
      isLatest: true
    });

    return newFileRecord;
  } catch (error) {
    console.error('File versioning error:', error);
    throw error;
  }
}

// Get file versions
async function getFileVersions(fileId) {
  try {
    const versions = await File.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { id: fileId },
          { parentFileId: fileId }
        ]
      },
      order: [['version', 'ASC']]
    });

    return versions;
  } catch (error) {
    console.error('Get file versions error:', error);
    throw error;
  }
}

// Delete file
async function deleteFile(fileId, userId) {
  try {
    const file = await File.findOne({
      where: { id: fileId, userId }
    });

    if (!file) {
      throw new Error('File not found');
    }

    // Delete physical file
    try {
      await fs.unlink(file.filePath);
      if (file.thumbnailPath) {
        await fs.unlink(file.thumbnailPath);
      }
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }

    // Delete from database
    await file.destroy();

    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
}

// Search files
async function searchFiles(userId, filters = {}) {
  try {
    const whereClause = { userId };

    if (filters.fileType) {
      whereClause.fileType = filters.fileType;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.campaignId) {
      whereClause.campaignId = filters.campaignId;
    }
    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = {
        [require('sequelize').Op.overlap]: filters.tags
      };
    }

    const files = await File.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: filters.limit || 50,
      offset: filters.offset || 0
    });

    return files;
  } catch (error) {
    console.error('Search files error:', error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  createFileVersion,
  getFileVersions,
  deleteFile,
  searchFiles,
  scanFile,
  generateThumbnail,
  extractMetadata,
  uploadToCDN,
  config
}; 