const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { campaignIdParamValidation } = require('../middleware/campaignValidation');

// ========================================
// ASSET MANAGEMENT
// ========================================

// Get all assets for a campaign
router.get('/campaigns/:campaignId/assets', authenticateToken, campaignIdParamValidation, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { type, status, page = 1, limit = 20 } = req.query;

    // Verify campaign exists and belongs to user
    const campaign = await require('../models/Campaign').findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Build where clause
    const whereClause = { campaignId };
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    // Pagination
    const offset = (page - 1) * limit;

    const assets = await require('../models/Asset').findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Assets retrieved successfully',
      data: {
        assets: assets.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: assets.count,
          totalPages: Math.ceil(assets.count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve assets'
    });
  }
});

// Create a new asset for a campaign
router.post('/campaigns/:campaignId/assets', authenticateToken, campaignIdParamValidation, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const assetData = req.body;

    // Verify campaign exists and belongs to user
    const campaign = await require('../models/Campaign').findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Create asset
    const asset = await require('../models/Asset').create({
      ...assetData,
      campaignId,
      userId: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });

  } catch (error) {
    console.error('Create asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create asset'
    });
  }
});

// Get a specific asset
router.get('/assets/:assetId', authenticateToken, async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await require('../models/Asset').findOne({
      where: { id: assetId, userId: req.user.userId },
      include: [{
        model: require('../models/Campaign'),
        as: 'campaign',
        attributes: ['id', 'name']
      }]
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      message: 'Asset retrieved successfully',
      data: asset
    });

  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve asset'
    });
  }
});

// Update an asset
router.put('/assets/:assetId', authenticateToken, async (req, res) => {
  try {
    const { assetId } = req.params;
    const updateData = req.body;

    const asset = await require('../models/Asset').findOne({
      where: { id: assetId, userId: req.user.userId }
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    await asset.update(updateData);

    res.json({
      success: true,
      message: 'Asset updated successfully',
      data: asset
    });

  } catch (error) {
    console.error('Update asset error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update asset'
    });
  }
});

// Delete an asset
router.delete('/assets/:assetId', authenticateToken, async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await require('../models/Asset').findOne({
      where: { id: assetId, userId: req.user.userId }
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    await asset.destroy();

    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });

  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete asset'
    });
  }
});

// ========================================
// ASSET OPERATIONS
// ========================================

// Bulk update assets
router.patch('/campaigns/:campaignId/assets/bulk', authenticateToken, campaignIdParamValidation, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { assetIds, updates } = req.body;

    // Verify campaign exists and belongs to user
    const campaign = await require('../models/Campaign').findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Update assets
    const result = await require('../models/Asset').update(updates, {
      where: {
        id: assetIds,
        campaignId,
        userId: req.user.userId
      }
    });

    res.json({
      success: true,
      message: `${result[0]} assets updated successfully`
    });

  } catch (error) {
    console.error('Bulk update assets error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update assets'
    });
  }
});

// Get asset statistics
router.get('/campaigns/:campaignId/assets/stats', authenticateToken, campaignIdParamValidation, async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Verify campaign exists and belongs to user
    const campaign = await require('../models/Campaign').findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const Asset = require('../models/Asset');
    
    // Get asset counts by type
    const typeStats = await Asset.findAll({
      where: { campaignId },
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type']
    });

    // Get asset counts by status
    const statusStats = await Asset.findAll({
      where: { campaignId },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status']
    });

    // Get total file size
    const totalSize = await Asset.sum('fileSize', {
      where: { campaignId }
    });

    res.json({
      success: true,
      message: 'Asset statistics retrieved successfully',
      data: {
        totalAssets: await Asset.count({ where: { campaignId } }),
        totalFileSize: totalSize,
        byType: typeStats,
        byStatus: statusStats
      }
    });

  } catch (error) {
    console.error('Get asset stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve asset statistics'
    });
  }
});

module.exports = router; 