const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');
const { Event, Campaign } = require('../models');

const router = express.Router();

// ========================================
// REAL-TIME ANALYTICS ENDPOINTS
// ========================================

// POST /api/analytics/events - Track engagement event
router.post('/events', authenticateToken, async (req, res) => {
  try {
    const { eventType, campaignId, metadata } = req.body;

    if (!eventType || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'eventType and campaignId are required'
      });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found'
      });
    }

    const event = await analyticsService.processEvent({
      eventType,
      campaignId,
      userId: req.user.userId,
      metadata
    });

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      data: {
        eventId: event.id,
        eventType,
        campaignId,
        timestamp: event.timestamp
      }
    });

  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      error: 'TRACKING_FAILED',
      message: error.message
    });
  }
});

// GET /api/analytics/real-time/{campaignId} - Get real-time metrics
router.get('/real-time/:campaignId', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found'
      });
    }

    const metrics = await analyticsService.getRealTimeMetrics(campaignId);

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Get real-time metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'FETCH_FAILED',
      message: error.message
    });
  }
});

// ========================================
// PERFORMANCE REPORTING ENDPOINTS
// ========================================

// GET /api/analytics/campaigns/{campaignId} - Campaign performance
router.get('/campaigns/:campaignId', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { timeRange = '24h' } = req.query;

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found'
      });
    }

    const metrics = await analyticsService.calculateMetrics(campaignId, timeRange);

    res.json({
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status
        },
        metrics
      }
    });

  } catch (error) {
    console.error('Get campaign performance error:', error);
    res.status(500).json({
      success: false,
      error: 'FETCH_FAILED',
      message: error.message
    });
  }
});

// GET /api/analytics/performance - Overall performance
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    const overview = await analyticsService.getAnalyticsOverview(req.user.userId);

    res.json({
      success: true,
      data: {
        timeRange,
        overview
      }
    });

  } catch (error) {
    console.error('Get performance overview error:', error);
    res.status(500).json({
      success: false,
      error: 'FETCH_FAILED',
      message: error.message
    });
  }
});

// POST /api/analytics/reports - Generate custom reports
router.post('/reports', authenticateToken, async (req, res) => {
  try {
    const { campaignId, reportType, options = {} } = req.body;

    if (!campaignId || !reportType) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'campaignId and reportType are required'
      });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found'
      });
    }

    const report = await analyticsService.generateReport(campaignId, reportType, options);

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      error: 'REPORT_GENERATION_FAILED',
      message: error.message
    });
  }
});

// GET /api/analytics/export/{campaignId} - Export data
router.get('/export/:campaignId', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { format = 'json', timeRange = '30d' } = req.query;

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId: req.user.userId }
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found'
      });
    }

    const data = await analyticsService.exportData(campaignId, format, timeRange);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics_${campaignId}_${timeRange}.csv"`);
      res.send(data);
    } else {
      res.json({
        success: true,
        data
      });
    }

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      error: 'EXPORT_FAILED',
      message: error.message
    });
  }
});

// ========================================
// PRIVACY COMPLIANCE ENDPOINTS
// ========================================

// DELETE /api/analytics/user-data - GDPR compliance - Delete user data
router.delete('/user-data', authenticateToken, async (req, res) => {
  try {
    const result = await analyticsService.deleteUserData(req.user.userId);

    res.json({
      success: true,
      message: 'User data deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Delete user data error:', error);
    res.status(500).json({
      success: false,
      error: 'DELETION_FAILED',
      message: error.message
    });
  }
});

// GET /api/analytics/events - Get events for user
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const { campaignId, eventType, limit = 50, offset = 0 } = req.query;

    const whereClause = { userId: req.user.userId };
    
    if (campaignId) {
      whereClause.campaignId = campaignId;
    }
    
    if (eventType) {
      whereClause.eventType = eventType;
    }

    const events = await Event.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Campaign,
        as: 'campaign',
        attributes: ['id', 'name']
      }]
    });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: events.length
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'FETCH_FAILED',
      message: error.message
    });
  }
});

module.exports = router; 