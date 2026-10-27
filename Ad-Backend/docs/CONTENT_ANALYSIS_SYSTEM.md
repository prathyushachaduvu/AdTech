# 📊 Content Analysis API Documentation

Based on your project files, here's the complete **Content Analysis API Documentation** for your ad backend:

## 🔗 **Quick Links**
- **Base URL:** `http://localhost:3000/api/content-analysis`
- **Authentication:** JWT Bearer Token required
- **Postman Collection:** `Content_Analysis_API.postman_collection.json`
- **System Documentation:** `docs/CONTENT_ANALYSIS_SYSTEM.md`

---

## 🔐 **Authentication Setup**

### 1. Get JWT Token
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

### 2. Use Token
```
Authorization: Bearer <your-jwt-token>
```

---

## 📝 **Core Analysis Endpoints**

### 1. **Analyze Text Content**
```http
POST /api/content-analysis/analyze-text
```

**Request Body:**
```json
{
  "text": "This is an amazing product that everyone should buy!",
  "campaignId": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "includeSentiment": true,
    "includeKeywords": true,
    "includeClassification": true,
    "includeReadability": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "id": "analysis-uuid",
    "campaignId": "550e8400-e29b-41d4-a716-446655440000",
    "contentType": "text",
    "sentiment": {
      "score": 0.8,
      "label": "positive",
      "confidence": 0.95
    },
    "keywords": ["product", "amazing", "buy"],
    "classification": {
      "category": "promotional",
      "confidence": 0.88
    },
    "readability": {
      "score": 75.2,
      "level": "intermediate"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. **Analyze URL Content**
```http
POST /api/content-analysis/analyze-url
```

**Request Body:**
```json
{
  "url": "https://example.com/ad-page",
  "campaignId": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "extractText": true,
    "extractImages": true,
    "analyzeSentiment": true
  }
}
```

### 3. **Analyze Image Content**
```http
POST /api/content-analysis/analyze-image
```

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "campaignId": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "detectObjects": true,
    "analyzeColors": true,
    "extractText": true
  }
}
```

### 4. **Bulk Content Analysis**
```http
POST /api/content-analysis/bulk-analyze
```

**Request Body:**
```json
{
  "contents": [
    {
      "type": "text",
      "data": "First advertisement text"
    },
    {
      "type": "url",
      "data": "https://example.com/ad1"
    },
    {
      "type": "image",
      "data": "https://example.com/image1.jpg"
    }
  ],
  "campaignId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 🎯 **Specialized Analysis Endpoints**

### 5. **Sentiment Analysis**
```http
POST /api/content-analysis/sentiment
```

### 6. **Keyword Extraction**
```http
POST /api/content-analysis/keywords
```

### 7. **Content Classification**
```http
POST /api/content-analysis/classify
```

### 8. **Readability Analysis**
```http
POST /api/content-analysis/readability
```

---

## 📊 **History & Insights Endpoints**

### 9. **Get Analysis History**
```http
GET /api/content-analysis/history?campaignId=uuid&limit=10&offset=0
```

### 10. **Get Analysis by ID**
```http
GET /api/content-analysis/:analysisId
```

### 11. **Get Analysis Insights**
```http
GET /api/content-analysis/insights?campaignId=uuid
```

### 12. **Get Available Categories**
```http
GET /api/content-analysis/categories
```

### 13. **Clear Analysis Cache**
```http
DELETE /api/content-analysis/cache?campaignId=uuid
```

---

## 🎯 **Testing Examples**

### cURL Examples

```bash
# Analyze text
curl -X POST http://localhost:3000/api/content-analysis/analyze-text \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Amazing product that everyone should buy!",
    "campaignId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Analyze URL
curl -X POST http://localhost:3000/api/content-analysis/analyze-url \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/ad-page",
    "campaignId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# Get analysis history
curl -X GET "http://localhost:3000/api/content-analysis/history?campaignId=550e8400-e29b-41d4-a716-446655440000&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Examples

```javascript
const axios = require('axios');

// Analyze text content
const analyzeText = async (text, campaignId) => {
  try {
    const response = await axios.post('http://localhost:3000/api/content-analysis/analyze-text', {
      text: text,
      campaignId: campaignId,
      options: {
        includeSentiment: true,
        includeKeywords: true,
        includeClassification: true,
        includeReadability: true
      }
    }, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Analysis failed:', error.response?.data);
  }
};

// Bulk analyze multiple content pieces
const bulkAnalyze = async (contents, campaignId) => {
  try {
    const response = await axios.post('http://localhost:3000/api/content-analysis/bulk-analyze', {
      contents: contents,
      campaignId: campaignId
    }, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Bulk analysis failed:', error.response?.data);
  }
};
```

---

## 📋 **Postman Collection**

You have a complete Postman collection file: `Content_Analysis_API.postman_collection.json`

**Features:**
- ✅ Pre-configured environment variables
- ✅ Authentication setup with JWT token
- ✅ All endpoints with example requests
- ✅ Test scripts for automatic token handling
- ✅ Organized into logical folders

**To use:**
1. Import `Content_Analysis_API.postman_collection.json` into Postman
2. Set up environment variables:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: Your JWT token
   - `campaign_id`: A valid campaign ID
3. Start with the "Login" request to get your JWT token
4. Test all endpoints systematically

---

## ⚙️ **Configuration**

### Environment Variables
```env
# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# Analysis Service Configuration
CONTENT_ANALYSIS_CACHE_TTL=3600
CONTENT_ANALYSIS_MAX_CONTENT_LENGTH=10000
CONTENT_ANALYSIS_RATE_LIMIT=100
```

---

## 🚨 **Error Handling**

### Common Error Responses
```json
{
  "success": false,
  "error": "ANALYSIS_FAILED",
  "message": "Failed to analyze content",
  "details": "Invalid URL format"
}
```

### Error Codes
- `INVALID_CONTENT`: Content format is invalid
- `ANALYSIS_FAILED`: Analysis processing failed
- `MISSING_CAMPAIGN_ID`: Campaign ID is required
- `CACHE_ERROR`: Redis cache operation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests

---

## 📚 **Testing Your API**

### Quick Test Commands
```bash
# Test the API is running
curl http://localhost:3000/health

# Test with your Postman collection
# Import Content_Analysis_API.postman_collection.json
```

### Manual Testing Steps
1. **Start your Docker containers:**
   ```bash
   docker-compose up -d
   ```

2. **Get JWT token:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email", "password": "your-password"}'
   ```

3. **Test content analysis:**
   ```bash
   curl -X POST http://localhost:3000/api/content-analysis/analyze-text \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"text": "Test content", "campaignId": "test-uuid"}'
   ```

---

## 📚 **Additional Resources**

- **System Documentation:** `docs/CONTENT_ANALYSIS_SYSTEM.md`
- **API Documentation:** `Content_Analysis_API_Documentation.md`
- **Postman Collection:** `Content_Analysis_API.postman_collection.json`
- **Service Implementation:** `src/services/contentAnalysisService.js`
- **Routes:** `src/routes/contentAnalysis.js`

Your Content Analysis API is now ready for testing! Use the Postman collection for the easiest testing experience. 