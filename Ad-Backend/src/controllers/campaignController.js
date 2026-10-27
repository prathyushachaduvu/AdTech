const Campaign = require('../models/Campaign');
const Targeting = require('../models/Targeting');
const Asset = require('../models/Asset');
const { Op } = require('sequelize');

class CampaignController {
  
  // Create a new campaign
  async createCampaign(req, res) {
    try {
      const {
        name,
        description,
        type,
        objective,
        budgetType,
        budgetAmount,
        startDate,
        endDate,
        timezone,
        tags,
        settings,
        targeting,
        assets
      } = req.body;

      // Create campaign
      const campaign = await Campaign.create({
        name,
        description,
        type,
        objective,
        budgetType,
        budgetAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timezone: timezone || 'UTC',
        tags: tags || [],
        settings: settings || {},
        userId: req.user.userId
      });

      // Create targeting if provided
      if (targeting) {
        await Targeting.create({
          campaignId: campaign.id,
          ...targeting
        });
      }

      // Create assets if provided
      if (assets && Array.isArray(assets)) {
        const assetPromises = assets.map(assetData => 
          Asset.create({
            campaignId: campaign.id,
            userId: req.user.userId,
            ...assetData
          })
        );
        await Promise.all(assetPromises);
      }

      // Get campaign with associations
      const campaignWithAssociations = await Campaign.findByPk(campaign.id, {
        include: [
          { model: Targeting, as: 'targeting' },
          { model: Asset, as: 'assets' }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaignWithAssociations
      });

    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create campaign'
      });
    }
  }

  // Get all campaigns for a user with filtering and pagination
  async getCampaigns(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        objective,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where clause
      const whereClause = {
        userId: req.user.userId
      };

      if (status) {
        whereClause.status = status;
      }

      if (type) {
        whereClause.type = type;
      }

      if (objective) {
        whereClause.objective = objective;
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Get campaigns with pagination
      const { count, rows: campaigns } = await Campaign.findAndCountAll({
        where: whereClause,
        include: [
          { model: Targeting, as: 'targeting' },
          { model: Asset, as: 'assets' }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Calculate additional metrics for each campaign
      const campaignsWithMetrics = campaigns.map(campaign => {
        const campaignData = campaign.toJSON();
        return {
          ...campaignData,
          budgetRemaining: campaign.getBudgetRemaining(),
          ctr: campaign.getCTR(),
          conversionRate: campaign.getConversionRate(),
          cpc: campaign.getCPC(),
          cpm: campaign.getCPM(),
          isActiveNow: campaign.isActiveNow(),
          isOverBudget: campaign.isOverBudget()
        };
      });

      res.json({
        success: true,
        message: 'Campaigns retrieved successfully',
        data: {
          campaigns: campaignsWithMetrics,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get campaigns error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve campaigns'
      });
    }
  }

  // Get a specific campaign by ID
  async getCampaign(req, res) {
    try {
      const { id } = req.params;

      const campaign = await Campaign.findOne({
        where: {
          id,
          userId: req.user.userId
        },
        include: [
          { model: Targeting, as: 'targeting' },
          { model: Asset, as: 'assets' }
        ]
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Add calculated metrics
      const campaignData = campaign.toJSON();
      const campaignWithMetrics = {
        ...campaignData,
        budgetRemaining: campaign.getBudgetRemaining(),
        ctr: campaign.getCTR(),
        conversionRate: campaign.getConversionRate(),
        cpc: campaign.getCPC(),
        cpm: campaign.getCPM(),
        isActiveNow: campaign.isActiveNow(),
        isOverBudget: campaign.isOverBudget()
      };

      res.json({
        success: true,
        message: 'Campaign retrieved successfully',
        data: campaignWithMetrics
      });

    } catch (error) {
      console.error('Get campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve campaign'
      });
    }
  }

  // Update a campaign
  async updateCampaign(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Find campaign
      const campaign = await Campaign.findOne({
        where: {
          id,
          userId: req.user.userId
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Convert date strings to Date objects if provided
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      // Update campaign
      await campaign.update(updateData);

      // Update targeting if provided
      if (updateData.targeting) {
        await Targeting.upsert({
          campaignId: id,
          ...updateData.targeting
        });
      }

      // Get updated campaign with metrics
      const updatedCampaign = await Campaign.findByPk(id, {
        include: [
          { model: Targeting, as: 'targeting' },
          { model: Asset, as: 'assets' }
        ]
      });
      
      const campaignData = updatedCampaign.toJSON();
      const campaignWithMetrics = {
        ...campaignData,
        budgetRemaining: updatedCampaign.getBudgetRemaining(),
        ctr: updatedCampaign.getCTR(),
        conversionRate: updatedCampaign.getConversionRate(),
        cpc: updatedCampaign.getCPC(),
        cpm: updatedCampaign.getCPM(),
        isActiveNow: updatedCampaign.isActiveNow(),
        isOverBudget: updatedCampaign.isOverBudget()
      };

      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaignWithMetrics
      });

    } catch (error) {
      console.error('Update campaign error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update campaign'
      });
    }
  }

  // Delete a campaign
  async deleteCampaign(req, res) {
    try {
      const { id } = req.params;

      const campaign = await Campaign.findOne({
        where: {
          id,
          userId: req.user.userId
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Soft delete campaign (and related data)
      await campaign.destroy();

      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });

    } catch (error) {
      console.error('Delete campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete campaign'
      });
    }
  }

  // Update campaign status
  async updateCampaignStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const campaign = await Campaign.findOne({
        where: {
          id,
          userId: req.user.userId
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      await campaign.update({ status });

      res.json({
        success: true,
        message: `Campaign status updated to ${status}`,
        data: { id, status }
      });

    } catch (error) {
      console.error('Update campaign status error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update campaign status'
      });
    }
  }

  // Duplicate a campaign
  async duplicateCampaign(req, res) {
    try {
      const { id } = req.params;

      const originalCampaign = await Campaign.findOne({
        where: {
          id,
          userId: req.user.userId
        },
        include: [
          { model: Targeting, as: 'targeting' },
          { model: Asset, as: 'assets' }
        ]
      });

      if (!originalCampaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Create duplicate campaign
      const campaignData = originalCampaign.toJSON();
      delete campaignData.id;
      delete campaignData.createdAt;
      delete campaignData.updatedAt;
      delete campaignData.targeting;
      delete campaignData.assets;

      campaignData.name = `${campaignData.name} (Copy)`;
      campaignData.status = 'draft';

      const duplicatedCampaign = await Campaign.create(campaignData);

      // Duplicate targeting
      if (originalCampaign.targeting) {
        const targetingData = originalCampaign.targeting.toJSON();
        delete targetingData.id;
        delete targetingData.createdAt;
        delete targetingData.updatedAt;
        
        await Targeting.create({
          ...targetingData,
          campaignId: duplicatedCampaign.id
        });
      }

      // Duplicate assets
      if (originalCampaign.assets && originalCampaign.assets.length > 0) {
        const assetPromises = originalCampaign.assets.map(asset => {
          const assetData = asset.toJSON();
          delete assetData.id;
          delete assetData.createdAt;
          delete assetData.updatedAt;
          
          return Asset.create({
            ...assetData,
            campaignId: duplicatedCampaign.id
          });
        });
        await Promise.all(assetPromises);
      }

      res.status(201).json({
        success: true,
        message: 'Campaign duplicated successfully',
        data: duplicatedCampaign
      });

    } catch (error) {
      console.error('Duplicate campaign error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to duplicate campaign'
      });
    }
  }

  // Get campaign statistics
  async getCampaignStats(req, res) {
    try {
      const userId = req.user.userId;

      // Get various campaign statistics
      const [
        totalCampaigns,
        activeCampaigns,
        draftCampaigns,
        completedCampaigns,
        totalSpend,
        totalBudget,
        campaignsByType,
        campaignsByObjective
      ] = await Promise.all([
        // Total campaigns
        Campaign.count({ where: { userId } }),
        
        // Active campaigns
        Campaign.count({
          where: {
            userId,
            status: 'active',
            isActive: true,
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() }
          }
        }),
        
        // Draft campaigns
        Campaign.count({ where: { userId, status: 'draft' } }),
        
        // Completed campaigns
        Campaign.count({ where: { userId, status: 'completed' } }),
        
        // Total spend
        Campaign.sum('spend', { where: { userId } }),
        
        // Total budget
        Campaign.sum('budgetAmount', { where: { userId } }),
        
        // Campaigns by type
        Campaign.findAll({
          attributes: [
            'type',
            [Campaign.sequelize.fn('COUNT', Campaign.sequelize.col('id')), 'count']
          ],
          where: { userId },
          group: ['type']
        }),
        
        // Campaigns by objective
        Campaign.findAll({
          attributes: [
            'objective',
            [Campaign.sequelize.fn('COUNT', Campaign.sequelize.col('id')), 'count']
          ],
          where: { userId },
          group: ['objective']
        })
      ]);

      const stats = {
        overview: {
          totalCampaigns,
          activeCampaigns,
          draftCampaigns,
          completedCampaigns
        },
        budget: {
          totalSpend: totalSpend || 0,
          totalBudget: totalBudget || 0,
          budgetUtilization: totalBudget > 0 ? ((totalSpend || 0) / totalBudget) * 100 : 0
        },
        distribution: {
          byType: campaignsByType.reduce((acc, item) => {
            acc[item.type] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
          byObjective: campaignsByObjective.reduce((acc, item) => {
            acc[item.objective] = parseInt(item.dataValues.count);
            return acc;
          }, {})
        }
      };

      res.json({
        success: true,
        message: 'Campaign statistics retrieved successfully',
        data: stats
      });

    } catch (error) {
      console.error('Get campaign stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve campaign statistics'
      });
    }
  }

  // Bulk update campaigns
  async bulkUpdateCampaigns(req, res) {
    try {
      const { campaignIds, updates } = req.body;

      const result = await Campaign.update(updates, {
        where: {
          id: { [Op.in]: campaignIds },
          userId: req.user.userId
        }
      });

      res.json({
        success: true,
        message: `Updated ${result[0]} campaigns successfully`,
        data: { updatedCount: result[0] }
      });

    } catch (error) {
      console.error('Bulk update campaigns error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update campaigns'
      });
    }
  }

  // Bulk delete campaigns
  async bulkDeleteCampaigns(req, res) {
    try {
      const { campaignIds } = req.body;

      const result = await Campaign.destroy({
        where: {
          id: { [Op.in]: campaignIds },
          userId: req.user.userId
        }
      });

      res.json({
        success: true,
        message: `Deleted ${result} campaigns successfully`,
        data: { deletedCount: result }
      });

    } catch (error) {
      console.error('Bulk delete campaigns error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete campaigns'
      });
    }
  }

  // Update campaign metrics
  async updateCampaignMetrics(req, res) {
    try {
      const { id } = req.params;
      const { impressions, clicks, conversions, spend } = req.body;

      const campaign = await Campaign.findOne({
        where: {
          id,
          userId: req.user.userId
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Update metrics
      const updateData = {};
      if (impressions !== undefined) updateData.impressions = impressions;
      if (clicks !== undefined) updateData.clicks = clicks;
      if (conversions !== undefined) updateData.conversions = conversions;
      if (spend !== undefined) updateData.spend = spend;

      await campaign.update(updateData);

      res.json({
        success: true,
        message: 'Campaign metrics updated successfully',
        data: {
          id,
          ...updateData,
          updatedAt: campaign.updatedAt
        }
      });

    } catch (error) {
      console.error('Update campaign metrics error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update campaign metrics'
      });
    }
  }
}

module.exports = new CampaignController(); 