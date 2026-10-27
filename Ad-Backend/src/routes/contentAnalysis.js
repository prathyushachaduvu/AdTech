const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const contentAnalysisService = require('../services/contentAnalysisService');

// ========================================
// CORE ANALYSIS ENDPOINTS
// ========================================

// POST /api/content-analysis/analyze-text
router.post('/content-analysis/analyze-text', authenticateToken, async (req, res) => {
  try {
    const { text, campaignId, options = {} } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Text content is required'
      });
    }

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CAMPAIGN_ID',
        message: 'Campaign ID is required'
      });
    }

    const analysis = await contentAnalysisService.analyzeText(text, campaignId, options, req.user.userId);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze text content',
      details: error.message
    });
  }
});

// POST /api/content-analysis/analyze-url
router.post('/content-analysis/analyze-url', authenticateToken, async (req, res) => {
  try {
    const { url, campaignId, options = {} } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'URL is required'
      });
    }

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CAMPAIGN_ID',
        message: 'Campaign ID is required'
      });
    }

    const analysis = await contentAnalysisService.analyzeUrl(url, campaignId, options, req.user.userId);
    res.json({
      success: true,
      analysis,
      analysisId: analysis.id
    });
  } catch (error) {
    console.error('URL analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze URL content',
      details: error.message
    });
  }
});

// POST /api/content-analysis/analyze-image
router.post('/content-analysis/analyze-image', authenticateToken, async (req, res) => {
  try {
    const { imageUrl, campaignId, options = {} } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Image URL is required'
      });
    }

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CAMPAIGN_ID',
        message: 'Campaign ID is required'
      });
    }

    const analysis = await contentAnalysisService.analyzeImage(imageUrl, campaignId, options, req.user.userId);
    res.json({
      success: true,
      analysis,
      analysisId: analysis.id
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze image content',
      details: error.message
    });
  }
});

// POST /api/content-analysis/bulk-analyze
router.post('/content-analysis/bulk-analyze', authenticateToken, async (req, res) => {
  try {
    const { contents, campaignId } = req.body;
    
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Contents array is required and must not be empty'
      });
    }

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CAMPAIGN_ID',
        message: 'Campaign ID is required'
      });
    }

    const analyses = await contentAnalysisService.bulkAnalyze(contents, campaignId, req.user.userId);
    res.json({
      success: true,
      analyses: analyses.map(a => ({ ...a, analysisId: a.id }))
    });
  } catch (error) {
    console.error('Bulk analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to perform bulk analysis',
      details: error.message
    });
  }
});

// ========================================
// SPECIALIZED ANALYSIS ENDPOINTS
// ========================================

// POST /api/content-analysis/sentiment
router.post('/content-analysis/sentiment', authenticateToken, async (req, res) => {
  try {
    const { text, campaignId } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Text content is required'
      });
    }

    const sentiment = await contentAnalysisService.analyzeSentiment(text, campaignId);
    
    res.json({
      success: true,
      sentiment
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze sentiment',
      details: error.message
    });
  }
});

// POST /api/content-analysis/keywords
router.post('/content-analysis/keywords', authenticateToken, async (req, res) => {
  try {
    const { text, campaignId } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Text content is required'
      });
    }

    const keywords = await contentAnalysisService.extractKeywords(text, campaignId);
    
    res.json({
      success: true,
      keywords
    });
  } catch (error) {
    console.error('Keyword extraction error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to extract keywords',
      details: error.message
    });
  }
});

// POST /api/content-analysis/classify
router.post('/content-analysis/classify', authenticateToken, async (req, res) => {
  try {
    const { text, campaignId } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Text content is required'
      });
    }

    const classification = await contentAnalysisService.classifyContent(text, campaignId);
    
    res.json({
      success: true,
      classification
    });
  } catch (error) {
    console.error('Content classification error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to classify content',
      details: error.message
    });
  }
});

// POST /api/content-analysis/readability
router.post('/content-analysis/readability', authenticateToken, async (req, res) => {
  try {
    const { text, campaignId } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Text content is required'
      });
    }

    const readability = await contentAnalysisService.analyzeReadability(text, campaignId);
    
    res.json({
      success: true,
      readability
    });
  } catch (error) {
    console.error('Readability analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze readability',
      details: error.message
    });
  }
});

// ========================================
// HISTORY AND INSIGHTS ENDPOINTS
// ========================================

// GET /api/content-analysis/history
router.get('/content-analysis/history', authenticateToken, async (req, res) => {
  try {
    const { campaignId, limit = 10, offset = 0 } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CAMPAIGN_ID',
        message: 'Campaign ID is required'
      });
    }

    const history = await contentAnalysisService.getAnalysisHistory(campaignId, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      ...history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'HISTORY_ERROR',
      message: 'Failed to retrieve analysis history',
      details: error.message
    });
  }
});

// GET /api/content-analysis/:analysisId
router.get('/content-analysis/:analysisId', authenticateToken, async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    const analysis = await contentAnalysisService.getAnalysisById(analysisId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'ANALYSIS_NOT_FOUND',
        message: 'Analysis not found'
      });
    }
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Get analysis by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'ANALYSIS_ERROR',
      message: 'Failed to retrieve analysis',
      details: error.message
    });
  }
});

// GET /api/content-analysis/insights
router.get('/content-analysis/insights', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CAMPAIGN_ID',
        message: 'Campaign ID is required'
      });
    }

    const insights = await contentAnalysisService.getAnalysisInsights(campaignId);
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      error: 'INSIGHTS_ERROR',
      message: 'Failed to retrieve analysis insights',
      details: error.message
    });
  }
});

// GET /api/content-analysis/categories
router.get('/content-analysis/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await contentAnalysisService.getAvailableCategories();
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'CATEGORIES_ERROR',
      message: 'Failed to retrieve categories',
      details: error.message
    });
  }
});

// DELETE /api/content-analysis/cache
router.delete('/content-analysis/cache', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    await contentAnalysisService.clearCache(campaignId);
    
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: 'CACHE_ERROR',
      message: 'Failed to clear cache',
      details: error.message
    });
  }
});

module.exports = router; 