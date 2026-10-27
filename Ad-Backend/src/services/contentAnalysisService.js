const axios = require('axios');
const { parse } = require('node-html-parser');
const redisClient = require('../config/redis');
const { v4: uuidv4 } = require('uuid');
const Analysis = require('../models/Analysis');

// Configuration
const config = {
  cache: {
    ttl: process.env.CONTENT_ANALYSIS_CACHE_TTL || 3600,
    prefix: 'content_analysis:'
  },
  limits: {
    maxContentLength: process.env.CONTENT_ANALYSIS_MAX_CONTENT_LENGTH || 10000,
    maxBulkItems: 10
  },
  analysis: {
    enableSentiment: true,
    enableKeywords: true,
    enableClassification: true,
    enableReadability: true
  }
};

// Mock AI/NLP and Vision analysis (replace with real models or APIs)
async function analyzeTextNLP(text) {
  // Simulate NLP analysis
  const words = text.toLowerCase().split(/\s+/);
  const positiveWords = ['amazing', 'great', 'excellent', 'fantastic', 'wonderful', 'love', 'best', 'perfect'];
  const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointing'];
  
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  let sentiment = 'neutral';
  let score = 0;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    score = Math.min(1, (positiveCount - negativeCount) / Math.max(1, words.length) * 2);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    score = Math.max(-1, (negativeCount - positiveCount) / Math.max(1, words.length) * -2);
  }
  
  return {
    sentiment,
    score,
    confidence: 0.85
  };
}

async function extractKeywordsNLP(text) {
  // Simple keyword extraction (replace with real NLP)
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can'];
  
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.includes(word) && word.length > 2) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const keywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return keywords;
}

async function classifyContentNLP(text) {
  // Simple content classification (replace with real ML model)
  const categories = {
    'promotional': ['buy', 'sale', 'offer', 'discount', 'limited', 'deal'],
    'informational': ['information', 'guide', 'how', 'what', 'why', 'when'],
    'news': ['announcement', 'news', 'update', 'release', 'launch'],
    'review': ['review', 'rating', 'opinion', 'experience', 'test']
  };
  
  const textLower = text.toLowerCase();
  let bestCategory = 'general';
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.filter(keyword => textLower.includes(keyword)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return {
    category: bestCategory,
    confidence: Math.min(0.95, 0.5 + bestScore * 0.1)
  };
}

async function analyzeReadabilityNLP(text) {
  // Simple readability analysis (replace with real algorithm)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = text.toLowerCase().replace(/[^a-z]/g, '').replace(/[^aeiouy]+/g, ' ').trim().split(/\s+/).length;
  
  const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
  const avgSyllablesPerWord = syllables / Math.max(1, words.length);
  
  // Simple Flesch Reading Ease approximation
  let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  score = Math.max(0, Math.min(100, score));
  
  let level = 'intermediate';
  if (score >= 90) level = 'very easy';
  else if (score >= 80) level = 'easy';
  else if (score >= 70) level = 'fairly easy';
  else if (score >= 60) level = 'intermediate';
  else if (score >= 50) level = 'fairly difficult';
  else if (score >= 30) level = 'difficult';
  else level = 'very difficult';
  
  return {
    score: Math.round(score * 10) / 10,
    level,
    metrics: {
      sentences: sentences.length,
      words: words.length,
      syllables,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100
    }
  };
}

async function analyzeImageVision(imageUrl) {
  // Simulate computer vision analysis
  return {
    objects: ['person', 'laptop', 'office'],
    brandSafe: true,
    labels: ['professional', 'work', 'technology'],
    colors: ['blue', 'white', 'gray'],
    text: null // OCR would go here
  };
}

// Content Retrieval: Fetch webpage content, extract text and images
async function fetchWebContent(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const root = parse(response.data);
    
    // Extract text content
    const title = root.querySelector('title')?.text || '';
    const metaDescription = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const bodyText = root.querySelector('body')?.text || '';
    const text = `${title} ${metaDescription} ${bodyText}`.trim();
    
    // Extract images
    const images = root.querySelectorAll('img')
      .map(img => img.getAttribute('src'))
      .filter(src => src && src.startsWith('http'));
    
    return { text, images, title, metaDescription };
  } catch (error) {
    throw new Error(`Failed to fetch content from URL: ${error.message}`);
  }
}

// Cache management
async function cacheResults(key, data, ttl = config.cache.ttl) {
  try {
    await redisClient.setEx(`${config.cache.prefix}${key}`, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

async function getCachedResults(key) {
  try {
    const cached = await redisClient.get(`${config.cache.prefix}${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

async function clearCache(campaignId = null) {
  try {
    if (campaignId) {
      const pattern = `${config.cache.prefix}*campaign:${campaignId}*`;
      // Note: Redis KEYS should be used carefully in production
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } else {
      const pattern = `${config.cache.prefix}*`;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

// Main analysis methods
async function analyzeText(text, campaignId, options = {}, userId = null) {
  const cacheKey = `text:${Buffer.from(text).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const startTime = Date.now();
  const analysisId = uuidv4();

  const analysis = {
    id: analysisId,
    campaignId,
    contentType: 'text',
    content: text.substring(0, 1000), // Store first 1000 chars
    createdAt: new Date().toISOString()
  };

  // Perform analysis based on options
  if (options.includeSentiment !== false && config.analysis.enableSentiment) {
    analysis.sentiment = await analyzeTextNLP(text);
  }

  if (options.includeKeywords !== false && config.analysis.enableKeywords) {
    analysis.keywords = await extractKeywordsNLP(text);
  }

  if (options.includeClassification !== false && config.analysis.enableClassification) {
    analysis.classification = await classifyContentNLP(text);
  }

  if (options.includeReadability !== false && config.analysis.enableReadability) {
    analysis.readability = await analyzeReadabilityNLP(text);
  }

  // Store in database if userId is provided
  if (userId) {
    try {
      await Analysis.create({
        id: analysisId,
        userId,
        campaignId,
        type: 'text',
        content: text,
        results: analysis,
        options,
        processingTime: Date.now() - startTime
      });
    } catch (error) {
      console.error('Failed to store analysis in database:', error);
    }
  }

  await cacheResults(cacheKey, analysis);
  return analysis;
}

async function analyzeUrl(url, campaignId, options = {}, userId = null) {
  const cacheKey = `url:${Buffer.from(url).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const startTime = Date.now();
  const analysisId = uuidv4();

  const { text, images, title, metaDescription } = await fetchWebContent(url);
  
  const analysis = {
    id: analysisId,
    campaignId,
    contentType: 'url',
    url,
    title,
    metaDescription,
    content: text.substring(0, 1000),
    images: images.slice(0, 10), // Limit to first 10 images
    createdAt: new Date().toISOString()
  };

  // Analyze extracted text
  if (options.analyzeSentiment !== false) {
    analysis.sentiment = await analyzeTextNLP(text);
  }

  if (options.extractKeywords !== false) {
    analysis.keywords = await extractKeywordsNLP(text);
  }

  if (options.analyzeImages !== false && images.length > 0) {
    analysis.imageAnalysis = await analyzeImageVision(images[0]); // Analyze first image
  }

  // Store in database if userId is provided
  if (userId) {
    try {
      await Analysis.create({
        id: analysisId,
        userId,
        campaignId,
        type: 'url',
        content: url,
        results: analysis,
        options,
        processingTime: Date.now() - startTime
      });
    } catch (error) {
      console.error('Failed to store analysis in database:', error);
    }
  }

  await cacheResults(cacheKey, analysis);
  return analysis;
}

async function analyzeImage(imageUrl, campaignId, options = {}, userId = null) {
  const cacheKey = `image:${Buffer.from(imageUrl).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const startTime = Date.now();
  const analysisId = uuidv4();

  const analysis = {
    id: analysisId,
    campaignId,
    contentType: 'image',
    imageUrl,
    createdAt: new Date().toISOString()
  };

  // Perform image analysis
  if (options.detectObjects !== false) {
    const visionResult = await analyzeImageVision(imageUrl);
    analysis.objects = visionResult.objects;
    analysis.labels = visionResult.labels;
    analysis.brandSafe = visionResult.brandSafe;
  }

  if (options.analyzeColors !== false) {
    analysis.colors = ['blue', 'white', 'gray']; // Mock color analysis
  }

  if (options.extractText !== false) {
    analysis.extractedText = null; // Mock OCR
  }

  // Store in database if userId is provided
  if (userId) {
    try {
      await Analysis.create({
        id: analysisId,
        userId,
        campaignId,
        type: 'image',
        content: imageUrl,
        results: analysis,
        options,
        processingTime: Date.now() - startTime
      });
    } catch (error) {
      console.error('Failed to store analysis in database:', error);
    }
  }

  await cacheResults(cacheKey, analysis);
  return analysis;
}

async function bulkAnalyze(contents, campaignId, userId = null) {
  if (contents.length > config.limits.maxBulkItems) {
    throw new Error(`Too many items. Maximum allowed: ${config.limits.maxBulkItems}`);
  }

  const analyses = [];
  
  for (const content of contents) {
    try {
      let analysis;
      switch (content.type) {
        case 'text':
          analysis = await analyzeText(content.data, campaignId, {}, userId);
          break;
        case 'url':
          analysis = await analyzeUrl(content.data, campaignId, {}, userId);
          break;
        case 'image':
          analysis = await analyzeImage(content.data, campaignId, {}, userId);
          break;
        default:
          throw new Error(`Unsupported content type: ${content.type}`);
      }
      analyses.push(analysis);
    } catch (error) {
      analyses.push({
        id: uuidv4(),
        campaignId,
        contentType: content.type,
        error: error.message,
        createdAt: new Date().toISOString()
      });
    }
  }
  return analyses;
}

// Specialized analysis methods
async function analyzeSentiment(text, campaignId) {
  const cacheKey = `sentiment:${Buffer.from(text).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const sentiment = await analyzeTextNLP(text);
  await cacheResults(cacheKey, sentiment);
  return sentiment;
}

async function extractKeywords(text, campaignId) {
  const cacheKey = `keywords:${Buffer.from(text).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const keywords = await extractKeywordsNLP(text);
  await cacheResults(cacheKey, keywords);
  return keywords;
}

async function classifyContent(text, campaignId) {
  const cacheKey = `classification:${Buffer.from(text).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const classification = await classifyContentNLP(text);
  await cacheResults(cacheKey, classification);
  return classification;
}

async function analyzeReadability(text, campaignId) {
  const cacheKey = `readability:${Buffer.from(text).toString('base64').slice(0, 50)}:campaign:${campaignId}`;
  const cached = await getCachedResults(cacheKey);
  if (cached) return cached;

  const readability = await analyzeReadabilityNLP(text);
  await cacheResults(cacheKey, readability);
  return readability;
}

// History and insights methods (mock implementations)
async function getAnalysisHistory(campaignId, limit = 10, offset = 0) {
  // Mock implementation - in real app, this would query a database
  return {
    analyses: [],
    total: 0,
    limit,
    offset
  };
}

async function getAnalysisById(analysisId) {
  try {
    const analysis = await Analysis.findByPk(analysisId, {
      include: [
        {
          model: require('../models/Campaign'),
          as: 'campaign',
          attributes: ['id', 'name']
        },
        {
          model: require('../models/User'),
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });
    
    return analysis;
  } catch (error) {
    console.error('Error retrieving analysis by ID:', error);
    return null;
  }
}

async function getAnalysisInsights(campaignId) {
  // Mock implementation - in real app, this would aggregate analysis data
  return {
    totalAnalyses: 0,
    averageSentiment: 0,
    topKeywords: [],
    contentTypes: {
      text: 0,
      url: 0,
      image: 0
    },
    recommendations: [
      'Start analyzing content to get insights',
      'Try different content types for better engagement',
      'Monitor sentiment trends over time'
    ]
  };
}

async function getAvailableCategories() {
  // Return available content categories for analysis
  return {
    contentTypes: [
      {
        id: 'text',
        name: 'Text Content',
        description: 'Analyze text content for sentiment, keywords, and readability',
        features: ['sentiment', 'keywords', 'classification', 'readability']
      },
      {
        id: 'url',
        name: 'Web Page Content',
        description: 'Analyze web page content by URL',
        features: ['text_extraction', 'image_extraction', 'sentiment_analysis']
      },
      {
        id: 'image',
        name: 'Image Content',
        description: 'Analyze image content for objects, colors, and text',
        features: ['object_detection', 'color_analysis', 'text_extraction']
      }
    ],
    analysisTypes: [
      {
        id: 'sentiment',
        name: 'Sentiment Analysis',
        description: 'Analyze the emotional tone of content',
        supportedTypes: ['text', 'url']
      },
      {
        id: 'keywords',
        name: 'Keyword Extraction',
        description: 'Extract important keywords from content',
        supportedTypes: ['text', 'url']
      },
      {
        id: 'classification',
        name: 'Content Classification',
        description: 'Categorize content by type and purpose',
        supportedTypes: ['text', 'url']
      },
      {
        id: 'readability',
        name: 'Readability Analysis',
        description: 'Analyze content readability and complexity',
        supportedTypes: ['text', 'url']
      },
      {
        id: 'object_detection',
        name: 'Object Detection',
        description: 'Detect objects in images',
        supportedTypes: ['image']
      },
      {
        id: 'color_analysis',
        name: 'Color Analysis',
        description: 'Analyze color composition in images',
        supportedTypes: ['image']
      }
    ],
    contentCategories: [
      {
        id: 'promotional',
        name: 'Promotional',
        description: 'Marketing and advertising content'
      },
      {
        id: 'informational',
        name: 'Informational',
        description: 'Educational and informative content'
      },
      {
        id: 'news',
        name: 'News',
        description: 'News and current events content'
      },
      {
        id: 'review',
        name: 'Review',
        description: 'Product reviews and opinions'
      },
      {
        id: 'general',
        name: 'General',
        description: 'General content that doesn\'t fit other categories'
      }
    ]
  };
}

module.exports = {
  // Core analysis methods
  analyzeText,
  analyzeUrl,
  analyzeImage,
  bulkAnalyze,
  
  // Specialized analysis methods
  analyzeSentiment,
  extractKeywords,
  classifyContent,
  analyzeReadability,
  
  // History and insights
  getAnalysisHistory,
  getAnalysisById,
  getAnalysisInsights,
  getAvailableCategories,
  
  // Cache management
  cacheResults,
  getCachedResults,
  clearCache,
  
  // Utility methods
  fetchWebContent,
  analyzeTextNLP,
  extractKeywordsNLP,
  classifyContentNLP,
  analyzeReadabilityNLP,
  analyzeImageVision
}; 