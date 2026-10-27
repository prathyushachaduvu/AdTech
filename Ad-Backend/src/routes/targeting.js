const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');
const { campaignIdParamValidation } = require('../middleware/campaignValidation');

// ========================================
// TARGETING MANAGEMENT
// ========================================

// Get targeting for a campaign
router.get('/campaigns/:campaignId/targeting', authenticateToken, campaignIdParamValidation, async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const targeting = await require('../models/Targeting').findOne({
      where: { campaignId }
    });

    if (!targeting) {
      return res.status(404).json({
        success: false,
        message: 'Targeting configuration not found for this campaign'
      });
    }

    res.json({
      success: true,
      message: 'Targeting configuration retrieved successfully',
      data: targeting
    });

  } catch (error) {
    console.error('Get targeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve targeting configuration'
    });
  }
});

// Create or update targeting for a campaign
router.post('/campaigns/:campaignId/targeting', authenticateToken, campaignIdParamValidation, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const targetingData = req.body;

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

    // Check if targeting already exists
    let targeting = await require('../models/Targeting').findOne({
      where: { campaignId }
    });

    if (targeting) {
      // Update existing targeting
      await targeting.update(targetingData);
    } else {
      // Create new targeting
      targeting = await require('../models/Targeting').create({
        ...targetingData,
        campaignId
      });
    }

    res.json({
      success: true,
      message: targeting ? 'Targeting configuration updated successfully' : 'Targeting configuration created successfully',
      data: targeting
    });

  } catch (error) {
    console.error('Create/update targeting error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create/update targeting configuration'
    });
  }
});

// Delete targeting for a campaign
router.delete('/campaigns/:campaignId/targeting', authenticateToken, campaignIdParamValidation, async (req, res) => {
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

    const targeting = await require('../models/Targeting').findOne({
      where: { campaignId }
    });

    if (!targeting) {
      return res.status(404).json({
        success: false,
        message: 'Targeting configuration not found'
      });
    }

    await targeting.destroy();

    res.json({
      success: true,
      message: 'Targeting configuration deleted successfully'
    });

  } catch (error) {
    console.error('Delete targeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete targeting configuration'
    });
  }
});

// ========================================
// TARGETING TEMPLATES
// ========================================

// Get targeting templates
router.get('/templates/targeting', authenticateToken, async (req, res) => {
  try {
    const templates = [
      {
        id: 'broad-audience',
        name: 'Broad Audience',
        description: 'Target a wide audience with minimal restrictions',
        settings: {
          locationType: 'include',
          ageRange: { min: 18, max: 65 },
          gender: 'all',
          devices: ['desktop', 'mobile', 'tablet'],
          platforms: ['web', 'ios', 'android']
        }
      },
      {
        id: 'young-professionals',
        name: 'Young Professionals',
        description: 'Target young professionals aged 25-40',
        settings: {
          locationType: 'include',
          ageRange: { min: 25, max: 40 },
          gender: 'all',
          interests: ['technology', 'business', 'career'],
          devices: ['desktop', 'mobile'],
          platforms: ['web', 'ios', 'android']
        }
      },
      {
        id: 'mobile-first',
        name: 'Mobile First',
        description: 'Optimized for mobile users',
        settings: {
          locationType: 'include',
          devices: ['mobile'],
          platforms: ['ios', 'android'],
          behaviors: ['mobile_shoppers', 'app_users']
        }
      },
      {
        id: 'local-business',
        name: 'Local Business',
        description: 'Target local audience in specific areas',
        settings: {
          locationType: 'include',
          ageRange: { min: 18, max: 65 },
          gender: 'all',
          devices: ['desktop', 'mobile', 'tablet'],
          platforms: ['web', 'ios', 'android'],
          behaviors: ['local_searchers']
        }
      }
    ];

    res.json({
      success: true,
      message: 'Targeting templates retrieved successfully',
      data: templates
    });

  } catch (error) {
    console.error('Get targeting templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve targeting templates'
    });
  }
});

module.exports = router; 