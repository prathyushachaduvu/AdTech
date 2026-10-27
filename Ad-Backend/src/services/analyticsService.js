const redis = require('../config/redis');
const { Event, Analytics } = require('../models');
const { Op } = require('sequelize');

class AnalyticsService {
  constructor() {
    this.redis = redis;
    this.eventQueue = 'analytics_events';
    this.metricsPrefix = 'metrics:';
  }

  // Process real-time engagement events
  async processEvent(eventData) {
    try {
      const {
        eventType,
        campaignId,
        userId,
        timestamp = new Date(),
        metadata = {}
      } = eventData;

      // Store event in database
      const event = await Event.create({
        eventType,
        campaignId,
        userId,
        timestamp,
        metadata,
        processed: false
      });

      // Add to Redis queue for real-time processing
      await this.redis.lPush(this.eventQueue, JSON.stringify({
        eventId: event.id,
        eventType,
        campaignId,
        timestamp: timestamp.toISOString()
      }));

      // Update real-time metrics in Redis
      await this.updateRealTimeMetrics(eventType, campaignId);

      return event;
    } catch (error) {
      console.error('Error processing event:', error);
      throw error;
    }
  }

  // Update real-time metrics in Redis
  async updateRealTimeMetrics(eventType, campaignId) {
    const now = Date.now();
    const hourKey = `${this.metricsPrefix}${campaignId}:hour:${Math.floor(now / (1000 * 60 * 60))}`;
    const dayKey = `${this.metricsPrefix}${campaignId}:day:${Math.floor(now / (1000 * 60 * 60 * 24))}`;

    const pipeline = this.redis.multi();

    // Increment event counters
    pipeline.hIncrBy(hourKey, eventType, 1);
    pipeline.hIncrBy(dayKey, eventType, 1);
    pipeline.expire(hourKey, 60 * 60 * 2); // 2 hours
    pipeline.expire(dayKey, 60 * 60 * 24 * 2); // 2 days

    await pipeline.exec();
  }

  // Get real-time metrics
  async getRealTimeMetrics(campaignId) {
    const now = Date.now();
    const hourKey = `${this.metricsPrefix}${campaignId}:hour:${Math.floor(now / (1000 * 60 * 60))}`;
    const dayKey = `${this.metricsPrefix}${campaignId}:day:${Math.floor(now / (1000 * 60 * 60 * 24))}`;

    const [hourMetrics, dayMetrics] = await Promise.all([
      this.redis.hGetAll(hourKey),
      this.redis.hGetAll(dayKey)
    ]);

    return {
      hourly: hourMetrics,
      daily: dayMetrics,
      timestamp: new Date().toISOString()
    };
  }

  // Calculate performance metrics
  async calculateMetrics(campaignId, timeRange = '24h') {
    const endDate = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    }

    const events = await Event.findAll({
      where: {
        campaignId,
        timestamp: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'eventType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['eventType']
    });

    const metrics = {};
    events.forEach(event => {
      metrics[event.eventType] = parseInt(event.dataValues.count);
    });

    return {
      campaignId,
      timeRange,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      metrics
    };
  }

  // Generate custom reports
  async generateReport(campaignId, reportType, options = {}) {
    const { timeRange = '30d', metrics = ['impressions', 'clicks', 'conversions'] } = options;

    const data = await this.calculateMetrics(campaignId, timeRange);
    
    // Calculate derived metrics
    const impressions = data.metrics.impression || 0;
    const clicks = data.metrics.click || 0;
    const conversions = data.metrics.conversion || 0;

    const report = {
      campaignId,
      reportType,
      timeRange,
      generatedAt: new Date().toISOString(),
      metrics: {
        impressions,
        clicks,
        conversions,
        ctr: impressions > 0 ? (clicks / impressions * 100).toFixed(2) : 0,
        conversionRate: clicks > 0 ? (conversions / clicks * 100).toFixed(2) : 0,
        cpc: clicks > 0 ? (data.metrics.spend || 0) / clicks : 0,
        cpm: impressions > 0 ? (data.metrics.spend || 0) / impressions * 1000 : 0
      }
    };

    return report;
  }

  // Export data
  async exportData(campaignId, format = 'json', timeRange = '30d') {
    const data = await this.calculateMetrics(campaignId, timeRange);
    
    switch (format.toLowerCase()) {
      case 'csv':
        return this.convertToCSV(data);
      case 'json':
        return data;
      default:
        return data;
    }
  }

  // Convert data to CSV
  convertToCSV(data) {
    const headers = ['Event Type', 'Count'];
    const rows = Object.entries(data.metrics).map(([type, count]) => [type, count]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csv;
  }

  // GDPR compliance - Delete user data
  async deleteUserData(userId) {
    try {
      // Anonymize events
      await Event.update(
        { 
          userId: null,
          metadata: { anonymized: true, originalUserId: userId }
        },
        { where: { userId } }
      );

      // Delete analytics records
      await Analytics.destroy({ where: { userId } });

      return { success: true, message: 'User data deleted successfully' };
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }

  // Get analytics overview
  async getAnalyticsOverview(userId) {
    const campaigns = await require('../models/Campaign').findAll({
      where: { userId },
      attributes: ['id', 'name', 'status']
    });

    const overview = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalEvents: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0
    };

    for (const campaign of campaigns) {
      const metrics = await this.calculateMetrics(campaign.id, '30d');
      overview.totalEvents += Object.values(metrics.metrics).reduce((a, b) => a + b, 0);
      overview.totalImpressions += metrics.metrics.impression || 0;
      overview.totalClicks += metrics.metrics.click || 0;
      overview.totalConversions += metrics.metrics.conversion || 0;
    }

    return overview;
  }
}

module.exports = new AnalyticsService(); 