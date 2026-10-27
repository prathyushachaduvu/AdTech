const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');
const {
  createCampaignValidation,
  updateCampaignValidation,
  updateStatusValidation,
  campaignQueryValidation,
  campaignIdValidation,
  bulkUpdateValidation,
  bulkDeleteValidation,
  updateMetricsValidation,
  exportFormatValidation
} = require('../middleware/campaignValidation');

// ========================================
// CAMPAIGN CRUD OPERATIONS
// ========================================

// Create a new campaign
router.post('/', authenticateToken, createCampaignValidation, campaignController.createCampaign);

// Create a new campaign with targeting
router.post('/with-targeting', authenticateToken, async (req, res) => {
  try {
    const { campaign: campaignData, targeting: targetingData } = req.body;

    // Validate campaign data
    if (!campaignData || !campaignData.name || !campaignData.type || !campaignData.objective) {
      return res.status(400).json({
        success: false,
        message: 'Campaign data is required with name, type, and objective'
      });
    }

    // Create campaign
    const campaign = await require('../models/Campaign').create({
      ...campaignData,
      userId: req.user.userId
    });

    // Create targeting if provided
    let targeting = null;
    if (targetingData) {
      targeting = await require('../models/Targeting').create({
        ...targetingData,
        campaignId: campaign.id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully with targeting',
      data: {
        campaign,
        targeting
      }
    });

  } catch (error) {
    console.error('Create campaign with targeting error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create campaign with targeting'
    });
  }
});

// Get all campaigns with filtering and pagination
router.get('/', authenticateToken, campaignQueryValidation, campaignController.getCampaigns);

// Get a specific campaign by ID
router.get('/:id', authenticateToken, campaignIdValidation, campaignController.getCampaign);

// Update a campaign
router.put('/:id', authenticateToken, updateCampaignValidation, campaignController.updateCampaign);

// Delete a campaign
router.delete('/:id', authenticateToken, campaignIdValidation, campaignController.deleteCampaign);

// ========================================
// CAMPAIGN STATUS MANAGEMENT
// ========================================

// Update campaign status
router.patch('/:id/status', authenticateToken, updateStatusValidation, campaignController.updateCampaignStatus);

// ========================================
// CAMPAIGN OPERATIONS
// ========================================

// Duplicate a campaign
router.post('/:id/duplicate', authenticateToken, campaignIdValidation, campaignController.duplicateCampaign);

// ========================================
// CAMPAIGN STATISTICS
// ========================================

// Get campaign statistics
router.get('/stats/overview', authenticateToken, campaignController.getCampaignStats);

// ========================================
// BULK OPERATIONS
// ========================================

// Bulk update campaigns
router.patch('/bulk/update', authenticateToken, bulkUpdateValidation, campaignController.bulkUpdateCampaigns);

// Bulk delete campaigns
router.delete('/bulk/delete', authenticateToken, bulkDeleteValidation, campaignController.bulkDeleteCampaigns);

// General bulk operations endpoint
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { operation, campaignIds, updates } = req.body;

    if (!operation || !campaignIds || !Array.isArray(campaignIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation, campaignIds array, and updates are required'
      });
    }

    // Validate campaign IDs
    for (const id of campaignIds) {
      if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return res.status(400).json({
          success: false,
          message: 'All campaign IDs must be valid UUIDs'
        });
      }
    }

    const Campaign = require('../models/Campaign');

    switch (operation.toLowerCase()) {
      case 'update':
        if (!updates || typeof updates !== 'object') {
          return res.status(400).json({
            success: false,
            message: 'Updates object is required for update operation'
          });
        }

        const allowedUpdateFields = ['status', 'tags', 'isActive', 'budgetAmount', 'budgetType'];
        for (const field of Object.keys(updates)) {
          if (!allowedUpdateFields.includes(field)) {
            return res.status(400).json({
              success: false,
              message: `Field '${field}' is not allowed for bulk updates`
            });
          }
        }

        const updateResult = await Campaign.update(updates, {
          where: {
            id: campaignIds,
            userId: req.user.userId
          }
        });

        res.json({
          success: true,
          message: `${updateResult[0]} campaigns updated successfully`,
          data: { updatedCount: updateResult[0] }
        });
        break;

      case 'delete':
        const deleteResult = await Campaign.destroy({
          where: {
            id: campaignIds,
            userId: req.user.userId
          }
        });

        res.json({
          success: true,
          message: `${deleteResult} campaigns deleted successfully`,
          data: { deletedCount: deleteResult }
        });
        break;

      case 'duplicate':
        const campaigns = await Campaign.findAll({
          where: {
            id: campaignIds,
            userId: req.user.userId
          }
        });

        const duplicatedCampaigns = [];
        for (const campaign of campaigns) {
          const duplicated = await Campaign.create({
            name: `${campaign.name} (Copy)`,
            description: campaign.description,
            type: campaign.type,
            objective: campaign.objective,
            budgetType: campaign.budgetType,
            budgetAmount: campaign.budgetAmount,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            timezone: campaign.timezone,
            tags: campaign.tags,
            settings: campaign.settings,
            userId: req.user.userId
          });
          duplicatedCampaigns.push(duplicated);
        }

        res.json({
          success: true,
          message: `${duplicatedCampaigns.length} campaigns duplicated successfully`,
          data: { duplicatedCampaigns }
        });
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid operation. Supported operations: update, delete, duplicate'
        });
    }

  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation'
    });
  }
});

// ========================================
// CAMPAIGN METRICS
// ========================================

// Update campaign performance metrics
router.patch('/:id/metrics', authenticateToken, updateMetricsValidation, campaignController.updateCampaignMetrics);

// ========================================
// EXPORT FUNCTIONALITY
// ========================================

// Export campaigns
router.get('/export/:format', authenticateToken, exportFormatValidation, async (req, res) => {
  try {
    const { format } = req.params;
    const { status, type, objective } = req.query;

    // Build where clause
    const whereClause = {
      userId: req.user.userId
    };

    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    if (objective) whereClause.objective = objective;

    const campaigns = await require('../models/Campaign').findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    // JSON export
    if (format === 'json') {
      res.json({
        success: true,
        message: 'Campaigns exported successfully',
        data: campaigns,
        exportInfo: {
          format: 'json',
          totalCampaigns: campaigns.length,
          exportedAt: new Date().toISOString()
        }
      });
      return;
    }

    // CSV export
    if (format === 'csv') {
      const csvHeaders = [
        'ID', 'Name', 'Description', 'Type', 'Objective', 'Status',
        'Budget Type', 'Budget Amount', 'Budget Spent', 'Start Date',
        'End Date', 'Impressions', 'Clicks', 'Conversions', 'Spend',
        'Created At', 'Updated At'
      ];

      const csvData = campaigns.map(campaign => [
        campaign.id,
        campaign.name,
        campaign.description || '',
        campaign.type,
        campaign.objective,
        campaign.status,
        campaign.budgetType,
        campaign.budgetAmount,
        campaign.budgetSpent,
        campaign.startDate,
        campaign.endDate,
        campaign.impressions,
        campaign.clicks,
        campaign.conversions,
        campaign.spend,
        campaign.createdAt,
        campaign.updatedAt
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="campaigns-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    }

  } catch (error) {
    console.error('Export campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export campaigns'
    });
  }
});

// ========================================
// CAMPAIGN TEMPLATES
// ========================================

// Get campaign templates
router.get('/templates/list', authenticateToken, async (req, res) => {
  try {
    const templates = [
      {
        id: 'awareness-display',
        name: 'Brand Awareness Display',
        type: 'display',
        objective: 'awareness',
        description: 'Template for brand awareness display campaigns',
        defaultSettings: {
          budgetType: 'daily',
          budgetAmount: 100,
          tags: ['awareness', 'display', 'brand']
        }
      },
      {
        id: 'conversion-search',
        name: 'Conversion Search',
        type: 'search',
        objective: 'conversions',
        description: 'Template for conversion-focused search campaigns',
        defaultSettings: {
          budgetType: 'daily',
          budgetAmount: 200,
          tags: ['conversion', 'search', 'performance']
        }
      },
      {
        id: 'engagement-social',
        name: 'Social Engagement',
        type: 'social',
        objective: 'engagement',
        description: 'Template for social media engagement campaigns',
        defaultSettings: {
          budgetType: 'daily',
          budgetAmount: 150,
          tags: ['social', 'engagement', 'community']
        }
      },
      {
        id: 'traffic-video',
        name: 'Video Traffic',
        type: 'video',
        objective: 'traffic',
        description: 'Template for video traffic generation campaigns',
        defaultSettings: {
          budgetType: 'daily',
          budgetAmount: 300,
          tags: ['video', 'traffic', 'content']
        }
      }
    ];

    res.json({
      success: true,
      message: 'Campaign templates retrieved successfully',
      data: templates
    });

  } catch (error) {
    console.error('Get campaign templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve campaign templates'
    });
  }
});

// Create campaign from template
router.post('/templates/:templateId', authenticateToken, async (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, startDate, endDate, budgetAmount } = req.body;

    // Template definitions
    const templates = {
      'awareness-display': {
        type: 'display',
        objective: 'awareness',
        defaultSettings: { budgetType: 'daily', tags: ['awareness', 'display'] }
      },
      'conversion-search': {
        type: 'search',
        objective: 'conversions',
        defaultSettings: { budgetType: 'daily', tags: ['conversion', 'search'] }
      },
      'engagement-social': {
        type: 'social',
        objective: 'engagement',
        defaultSettings: { budgetType: 'daily', tags: ['social', 'engagement'] }
      },
      'traffic-video': {
        type: 'video',
        objective: 'traffic',
        defaultSettings: { budgetType: 'daily', tags: ['video', 'traffic'] }
      }
    };

    const template = templates[templateId];
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Create campaign from template
    const campaign = await require('../models/Campaign').create({
      name,
      type: template.type,
      objective: template.objective,
      budgetType: template.defaultSettings.budgetType,
      budgetAmount: budgetAmount || 100,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      tags: template.defaultSettings.tags,
      settings: template.defaultSettings,
      userId: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created from template successfully',
      data: campaign
    });

  } catch (error) {
    console.error('Create campaign from template error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create campaign from template'
    });
  }
});

module.exports = router; 