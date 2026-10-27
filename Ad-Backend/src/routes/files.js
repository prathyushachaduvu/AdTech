const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { authenticateToken } = require('../middleware/auth');
const fileUploadService = require('../services/fileUploadService');
const File = require('../models/File');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadService.config.upload.tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileUploadService.config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = Object.values(fileUploadService.config.upload.allowedTypes).flat();
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// ========================================
// FILE UPLOAD ENDPOINTS
// ========================================

// POST /api/files/upload - Upload single file
router.post('/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    const { campaignId, tags, category, description } = req.body;
    
    const fileRecord = await fileUploadService.uploadFile(
      req.file,
      req.user.userId,
      campaignId || null,
      { tags: tags ? JSON.parse(tags) : [], category, description }
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileRecord.id,
        originalName: fileRecord.originalName,
        fileName: fileRecord.fileName,
        fileSize: fileRecord.fileSize,
        mimeType: fileRecord.mimeType,
        fileType: fileRecord.fileType,
        status: fileRecord.status,
        processingProgress: fileRecord.processingProgress,
        cdnUrl: fileRecord.cdnUrl,
        thumbnailUrl: fileRecord.thumbnailUrl,
        isClean: fileRecord.isClean,
        dimensions: fileRecord.dimensions,
        duration: fileRecord.duration,
        tags: fileRecord.tags,
        category: fileRecord.category,
        createdAt: fileRecord.createdAt
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'UPLOAD_FAILED',
      message: error.message
    });
  }
});

// POST /api/files/upload-multiple - Upload multiple files
router.post('/files/upload-multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'NO_FILES',
        message: 'No files uploaded'
      });
    }

    const { campaignId, tags, category } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        const fileRecord = await fileUploadService.uploadFile(
          file,
          req.user.userId,
          campaignId || null,
          { tags: tags ? JSON.parse(tags) : [], category }
        );

        uploadedFiles.push({
          id: fileRecord.id,
          originalName: fileRecord.originalName,
          fileName: fileRecord.fileName,
          fileSize: fileRecord.fileSize,
          mimeType: fileRecord.mimeType,
          fileType: fileRecord.fileType,
          status: fileRecord.status,
          processingProgress: fileRecord.processingProgress,
          cdnUrl: fileRecord.cdnUrl,
          isClean: fileRecord.isClean
        });
      } catch (error) {
        uploadedFiles.push({
          originalName: file.originalname,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      error: 'UPLOAD_FAILED',
      message: error.message
    });
  }
});

// ========================================
// FILE MANAGEMENT ENDPOINTS
// ========================================

// GET /api/files - Get user's files with filtering
router.get('/files', authenticateToken, async (req, res) => {
  try {
    const {
      fileType,
      status,
      campaignId,
      tags,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const filters = {
      fileType,
      status,
      campaignId,
      tags: tags ? tags.split(',') : null,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const files = await fileUploadService.searchFiles(req.user.userId, filters);

    res.json({
      success: true,
      files: files.map(file => ({
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        fileType: file.fileType,
        status: file.status,
        processingProgress: file.processingProgress,
        cdnUrl: file.cdnUrl,
        thumbnailUrl: file.thumbnailUrl,
        isClean: file.isClean,
        dimensions: file.dimensions,
        duration: file.duration,
        tags: file.tags,
        category: file.category,
        description: file.description,
        downloadCount: file.downloadCount,
        viewCount: file.viewCount,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt
      })),
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        total: files.length
      }
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      error: 'FETCH_FAILED',
      message: error.message
    });
  }
});

// GET /api/files/:id - Get specific file
router.get('/files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({
      where: { id, userId: req.user.userId },
      include: [
        {
          model: require('../models/Campaign'),
          as: 'campaign',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'FILE_NOT_FOUND',
        message: 'File not found'
      });
    }

    // Increment view count
    await file.increment('viewCount');
    await file.update({ lastAccessed: new Date() });

    res.json({
      success: true,
      file: {
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        fileType: file.fileType,
        status: file.status,
        processingProgress: file.processingProgress,
        cdnUrl: file.cdnUrl,
        thumbnailUrl: file.thumbnailUrl,
        isClean: file.isClean,
        scanResult: file.scanResult,
        dimensions: file.dimensions,
        duration: file.duration,
        metadata: file.metadata,
        tags: file.tags,
        category: file.category,
        description: file.description,
        downloadCount: file.downloadCount,
        viewCount: file.viewCount,
        version: file.version,
        isLatest: file.isLatest,
        campaign: file.campaign,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt
      }
    });

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      error: 'FETCH_FAILED',
      message: error.message
    });
  }
});

// GET /api/files/:id/download - Download file
router.get('/files/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'FILE_NOT_FOUND',
        message: 'File not found'
      });
    }

    if (file.status !== 'ready') {
      return res.status(400).json({
        success: false,
        error: 'FILE_NOT_READY',
        message: 'File is not ready for download'
      });
    }

    // Increment download count
    await file.increment('downloadCount');

    // Serve file
    res.download(file.filePath, file.originalName);

  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      error: 'DOWNLOAD_FAILED',
      message: error.message
    });
  }
});

// PUT /api/files/:id - Update file metadata
router.put('/files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { tags, category, description, accessLevel } = req.body;

    const file = await File.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'FILE_NOT_FOUND',
        message: 'File not found'
      });
    }

    const updateData = {};
    if (tags !== undefined) updateData.tags = tags;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (accessLevel !== undefined) updateData.accessLevel = accessLevel;

    await file.update(updateData);

    res.json({
      success: true,
      message: 'File updated successfully',
      file: {
        id: file.id,
        tags: file.tags,
        category: file.category,
        description: file.description,
        accessLevel: file.accessLevel,
        updatedAt: file.updatedAt
      }
    });

  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({
      success: false,
      error: 'UPDATE_FAILED',
      message: error.message
    });
  }
});

// DELETE /api/files/:id - Delete file
router.delete('/files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await fileUploadService.deleteFile(id, req.user.userId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'DELETE_FAILED',
      message: error.message
    });
  }
});

// ========================================
// FILE VERSIONING ENDPOINTS
// ========================================

// POST /api/files/:id/versions - Create new version
router.post('/files/:id/versions', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    const newVersion = await fileUploadService.createFileVersion(id, req.file, req.user.userId);

    res.status(201).json({
      success: true,
      message: 'File version created successfully',
      file: {
        id: newVersion.id,
        originalName: newVersion.originalName,
        fileName: newVersion.fileName,
        version: newVersion.version,
        status: newVersion.status,
        processingProgress: newVersion.processingProgress
      }
    });

  } catch (error) {
    console.error('Create file version error:', error);
    res.status(500).json({
      success: false,
      error: 'VERSION_CREATE_FAILED',
      message: error.message
    });
  }
});

// GET /api/files/:id/versions - Get file versions
router.get('/files/:id/versions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const versions = await fileUploadService.getFileVersions(id);

    res.json({
      success: true,
      versions: versions.map(file => ({
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        version: file.version,
        isLatest: file.isLatest,
        fileSize: file.fileSize,
        status: file.status,
        createdAt: file.createdAt
      }))
    });

  } catch (error) {
    console.error('Get file versions error:', error);
    res.status(500).json({
      success: false,
      error: 'VERSION_FETCH_FAILED',
      message: error.message
    });
  }
});

// ========================================
// FILE PROCESSING ENDPOINTS
// ========================================

// POST /api/files/:id/rescan - Rescan file for viruses
router.post('/files/:id/rescan', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'FILE_NOT_FOUND',
        message: 'File not found'
      });
    }

    const scanResult = await fileUploadService.scanFile(file.filePath);
    
    await file.update({
      isScanned: true,
      isClean: scanResult.isClean,
      scanResult: scanResult.scanResult,
      scanDate: new Date()
    });

    res.json({
      success: true,
      message: 'File rescanned successfully',
      scanResult: {
        isClean: scanResult.isClean,
        scanDate: new Date(),
        scanResult: scanResult.scanResult
      }
    });

  } catch (error) {
    console.error('Rescan file error:', error);
    res.status(500).json({
      success: false,
      error: 'RESCAN_FAILED',
      message: error.message
    });
  }
});

// POST /api/files/:id/regenerate-thumbnail - Regenerate thumbnail
router.post('/files/:id/regenerate-thumbnail', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'FILE_NOT_FOUND',
        message: 'File not found'
      });
    }

    const thumbnails = await fileUploadService.generateThumbnail(
      file.filePath,
      file.fileType,
      fileUploadService.config.upload.uploadDir
    );

    if (Object.keys(thumbnails).length > 0) {
      const thumbnailPath = thumbnails.medium || Object.values(thumbnails)[0];
      await file.update({
        hasThumbnail: true,
        thumbnailPath
      });
    }

    res.json({
      success: true,
      message: 'Thumbnail regenerated successfully',
      thumbnailPath: file.thumbnailPath
    });

  } catch (error) {
    console.error('Regenerate thumbnail error:', error);
    res.status(500).json({
      success: false,
      error: 'THUMBNAIL_GENERATION_FAILED',
      message: error.message
    });
  }
});

// ========================================
// FILE ANALYTICS ENDPOINTS
// ========================================

// GET /api/files/analytics/overview - Get file analytics
router.get('/files/analytics/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await File.findAll({
      where: { userId: req.user.userId },
      attributes: [
        'fileType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('fileSize')), 'totalSize'],
        [require('sequelize').fn('SUM', require('sequelize').col('downloadCount')), 'totalDownloads'],
        [require('sequelize').fn('SUM', require('sequelize').col('viewCount')), 'totalViews']
      ],
      group: ['fileType']
    });

    const totalFiles = await File.count({ where: { userId: req.user.userId } });
    const totalSize = await File.sum('fileSize', { where: { userId: req.user.userId } });
    const totalDownloads = await File.sum('downloadCount', { where: { userId: req.user.userId } });
    const totalViews = await File.sum('viewCount', { where: { userId: req.user.userId } });

    res.json({
      success: true,
      analytics: {
        totalFiles,
        totalSize,
        totalDownloads,
        totalViews,
        byType: stats
      }
    });

  } catch (error) {
    console.error('Get file analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYTICS_FAILED',
      message: error.message
    });
  }
});

module.exports = router; 