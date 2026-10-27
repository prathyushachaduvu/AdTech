# Content Analysis API Endpoints - Postman Collection

## Base URL
```
http://localhost:3000
```

## Authentication
All content analysis endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔍 CONTENT ANALYSIS ENDPOINTS

### 1. Analyze Text Content
- **URL**: `POST /api/content-analysis/analyze-text`
- **Description**: Analyze text content for sentiment, keywords, classification, and insights
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text content to analyze",
  "campaignId": "campaign-uuid",
  "options": {
    "includeSentiment": true,
    "includeKeywords": true,
    "includeClassification": true,
    "includeEntities": true,
    "includeLanguage": true
  }
}
```

**Response Example**:
```json
{
  "success": true,
  "analysis": {
    "text": "Your text content to analyze",
    "sentiment": {
      "score": 0.8,
      "label": "positive",
      "confidence": 0.95
    },
    "keywords": [
      {"word": "content", "score": 0.9},
      {"word": "analyze", "score": 0.8}
    ],
    "classification": {
      "category": "business",
      "confidence": 0.85
    },
    "entities": [
      {"text": "content", "type": "concept", "confidence": 0.9}
    ],
    "language": "en",
    "wordCount": 5,
    "characterCount": 28
  }
}
```

### 2. Analyze URL Content
- **URL**: `POST /api/content-analysis/analyze-url`
- **Description**: Analyze content from a webpage URL
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "url": "https://example.com/page",
  "campaignId": "campaign-uuid",
  "options": {
    "includeImages": true,
    "includeLinks": true,
    "includeMetaData": true,
    "includeText": true,
    "maxDepth": 2
  }
}
```

**Response Example**:
```json
{
  "success": true,
  "analysis": {
    "url": "https://example.com/page",
    "title": "Page Title",
    "description": "Page description",
    "text": "Extracted text content...",
    "images": [
      {
        "src": "https://example.com/image.jpg",
        "alt": "Image description",
        "width": 800,
        "height": 600
      }
    ],
    "links": [
      {
        "href": "https://example.com/link",
        "text": "Link text"
      }
    ],
    "metaData": {
      "keywords": "meta, keywords",
      "author": "Author Name",
      "robots": "index, follow"
    },
    "sentiment": {
      "score": 0.6,
      "label": "neutral"
    },
    "keywords": [
      {"word": "example", "score": 0.8}
    ]
  }
}
```

### 3. Analyze Image Content
- **URL**: `POST /api/content-analysis/analyze-image`
- **Description**: Analyze image content for objects, text, colors, and insights
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "campaignId": "campaign-uuid",
  "options": {
    "includeObjects": true,
    "includeText": true,
    "includeColors": true,
    "includeFaces": true,
    "includeLabels": true
  }
}
```

**Response Example**:
```json
{
  "success": true,
  "analysis": {
    "imageUrl": "https://example.com/image.jpg",
    "objects": [
      {
        "name": "person",
        "confidence": 0.95,
        "boundingBox": {"x": 100, "y": 50, "width": 200, "height": 300}
      },
      {
        "name": "car",
        "confidence": 0.87,
        "boundingBox": {"x": 300, "y": 200, "width": 150, "height": 100}
      }
    ],
    "text": [
      {
        "text": "Hello World",
        "confidence": 0.9,
        "boundingBox": {"x": 50, "y": 25, "width": 100, "height": 20}
      }
    ],
    "colors": {
      "dominant": ["#FF5733", "#33FF57", "#3357FF"],
      "palette": ["#FF0000", "#00FF00", "#0000FF"]
    },
    "faces": [
      {
        "confidence": 0.95,
        "boundingBox": {"x": 100, "y": 50, "width": 80, "height": 80},
        "attributes": {
          "age": "25-35",
          "gender": "male",
          "emotion": "happy"
        }
      }
    ],
    "labels": [
      {"name": "outdoor", "confidence": 0.9},
      {"name": "people", "confidence": 0.85}
    ],
    "imageInfo": {
      "width": 800,
      "height": 600,
      "format": "JPEG",
      "fileSize": 45000
    }
  }
}
```

### 4. Bulk Content Analysis
- **URL**: `POST /api/content-analysis/bulk-analyze`
- **Description**: Analyze multiple content pieces in a single request
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "contents": [
    {
      "type": "text",
      "content": "First text content to analyze",
      "id": "content-1"
    },
    {
      "type": "url",
      "content": "https://example.com/page1",
      "id": "content-2"
    },
    {
      "type": "image",
      "content": "https://example.com/image1.jpg",
      "id": "content-3"
    },
    {
      "type": "text",
      "content": "Second text content to analyze",
      "id": "content-4"
    }
  ],
  "campaignId": "campaign-uuid",
  "options": {
    "includeSentiment": true,
    "includeKeywords": true,
    "includeClassification": true
  }
}
```

**Response Example**:
```json
{
  "success": true,
  "analyses": [
    {
      "id": "content-1",
      "type": "text",
      "analysis": {
        "sentiment": {"score": 0.7, "label": "positive"},
        "keywords": [{"word": "first", "score": 0.8}],
        "classification": {"category": "general", "confidence": 0.6}
      }
    },
    {
      "id": "content-2",
      "type": "url",
      "analysis": {
        "title": "Example Page",
        "sentiment": {"score": 0.5, "label": "neutral"},
        "keywords": [{"word": "example", "score": 0.9}]
      }
    },
    {
      "id": "content-3",
      "type": "image",
      "analysis": {
        "objects": [{"name": "person", "confidence": 0.9}],
        "labels": [{"name": "people", "confidence": 0.85}]
      }
    },
    {
      "id": "content-4",
      "type": "text",
      "analysis": {
        "sentiment": {"score": 0.3, "label": "negative"},
        "keywords": [{"word": "second", "score": 0.8}]
      }
    }
  ],
  "summary": {
    "totalProcessed": 4,
    "averageSentiment": 0.5,
    "commonKeywords": ["example", "content"],
    "processingTime": "2.3s"
  }
}
```

### 5. Sentiment Analysis Only
- **URL**: `POST /api/content-analysis/sentiment`
- **Description**: Analyze text sentiment specifically
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text for sentiment analysis",
  "campaignId": "campaign-uuid"
}
```

**Response Example**:
```json
{
  "success": true,
  "sentiment": {
    "score": 0.8,
    "label": "positive",
    "confidence": 0.95,
    "details": {
      "positive": 0.8,
      "negative": 0.1,
      "neutral": 0.1
    },
    "emotions": {
      "joy": 0.7,
      "sadness": 0.1,
      "anger": 0.05,
      "fear": 0.05,
      "surprise": 0.1
    }
  }
}
```

### 6. Keyword Extraction Only
- **URL**: `POST /api/content-analysis/keywords`
- **Description**: Extract keywords from text content
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text for keyword extraction",
  "campaignId": "campaign-uuid"
}
```

**Response Example**:
```json
{
  "success": true,
  "keywords": [
    {
      "word": "artificial intelligence",
      "score": 0.95,
      "frequency": 3,
      "type": "phrase"
    },
    {
      "word": "machine learning",
      "score": 0.88,
      "frequency": 2,
      "type": "phrase"
    },
    {
      "word": "technology",
      "score": 0.82,
      "frequency": 5,
      "type": "noun"
    },
    {
      "word": "innovation",
      "score": 0.75,
      "frequency": 1,
      "type": "noun"
    }
  ],
  "summary": {
    "totalKeywords": 4,
    "averageScore": 0.85,
    "topKeyword": "artificial intelligence"
  }
}
```

### 7. Content Classification Only
- **URL**: `POST /api/content-analysis/classify`
- **Description**: Classify content type and category
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text for classification",
  "campaignId": "campaign-uuid"
}
```

**Response Example**:
```json
{
  "success": true,
  "classification": {
    "primaryCategory": "technology",
    "confidence": 0.92,
    "categories": [
      {
        "category": "technology",
        "confidence": 0.92,
        "score": 0.92
      },
      {
        "category": "business",
        "confidence": 0.75,
        "score": 0.75
      },
      {
        "category": "education",
        "confidence": 0.65,
        "score": 0.65
      }
    ],
    "subcategories": [
      {
        "category": "artificial intelligence",
        "confidence": 0.88
      },
      {
        "category": "software development",
        "confidence": 0.72
      }
    ],
    "language": "en",
    "contentType": "article"
  }
}
```

---

## 📝 RESPONSE FORMATS

### Success Response
```json
{
  "success": true,
  "analysis": {
    // Analysis results
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Error description",
  "details": "Additional error information"
}
```

### Common Error Codes
- `INVALID_CONTENT` - Missing or invalid content
- `MISSING_CAMPAIGN_ID` - Campaign ID is required
- `ANALYSIS_FAILED` - Analysis processing failed
- `INVALID_URL` - URL is not accessible or invalid
- `INVALID_IMAGE` - Image URL is not accessible or invalid

---

## 🔒 AUTHENTICATION FLOW

1. **Login**: `POST /auth/login` → Get JWT token
2. **Use Token**: Include `Authorization: Bearer <token>` in all content analysis requests

**Login Example**:
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

---

## 📋 POSTMAN COLLECTION SETUP

### 1. Environment Variables
Create a Postman environment with these variables:
- `baseUrl`: `http://localhost:3000`
- `authToken`: (will be set after login)
- `campaignId`: `your-campaign-uuid`

### 2. Pre-request Script for Login
```javascript
// After successful login, set the token
pm.environment.set("authToken", pm.response.json().token);
```

### 3. Authorization Header
```
Authorization: Bearer {{authToken}}
```

### 4. Request Body Templates

**Text Analysis**:
```json
{
  "text": "{{$randomLoremParagraph}}",
  "campaignId": "{{campaignId}}",
  "options": {
    "includeSentiment": true,
    "includeKeywords": true,
    "includeClassification": true
  }
}
```

**URL Analysis**:
```json
{
  "url": "https://example.com",
  "campaignId": "{{campaignId}}",
  "options": {
    "includeImages": true,
    "includeLinks": true
  }
}
```

**Image Analysis**:
```json
{
  "imageUrl": "https://picsum.photos/800/600",
  "campaignId": "{{campaignId}}",
  "options": {
    "includeObjects": true,
    "includeText": true
  }
}
```

---

## 🚀 TESTING SCENARIOS

### 1. Basic Text Analysis
```bash
curl -X POST http://localhost:3000/api/content-analysis/analyze-text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a positive review about our amazing product!",
    "campaignId": "your-campaign-id"
  }'
```

### 2. URL Content Analysis
```bash
curl -X POST http://localhost:3000/api/content-analysis/analyze-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "campaignId": "your-campaign-id"
  }'
```

### 3. Bulk Analysis
```bash
curl -X POST http://localhost:3000/api/content-analysis/bulk-analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {"type": "text", "content": "Positive content", "id": "1"},
      {"type": "text", "content": "Negative content", "id": "2"}
    ],
    "campaignId": "your-campaign-id"
  }'
```

---

## 📊 ANALYSIS FEATURES

### Text Analysis Features
- ✅ **Sentiment Analysis** - Positive, negative, neutral with confidence scores
- ✅ **Keyword Extraction** - Important words and phrases with relevance scores
- ✅ **Content Classification** - Categorize content by topic/industry
- ✅ **Entity Recognition** - Identify people, places, organizations
- ✅ **Language Detection** - Detect content language
- ✅ **Text Statistics** - Word count, character count, readability

### URL Analysis Features
- ✅ **Webpage Content Extraction** - Text, images, links
- ✅ **Meta Data Analysis** - Title, description, keywords
- ✅ **Sentiment Analysis** - Overall page sentiment
- ✅ **Keyword Extraction** - Important terms from page content
- ✅ **Link Analysis** - Internal and external links
- ✅ **Image Analysis** - Images found on the page

### Image Analysis Features
- ✅ **Object Detection** - Identify objects in images
- ✅ **Text Recognition (OCR)** - Extract text from images
- ✅ **Face Detection** - Detect and analyze faces
- ✅ **Color Analysis** - Dominant colors and color palette
- ✅ **Label Classification** - General image labels
- ✅ **Image Metadata** - Size, format, dimensions

### Bulk Analysis Features
- ✅ **Batch Processing** - Analyze multiple content pieces
- ✅ **Mixed Content Types** - Text, URLs, and images in one request
- ✅ **Summary Statistics** - Overall analysis summary
- ✅ **Performance Metrics** - Processing time and efficiency

---

## 🔧 INTEGRATION EXAMPLES

### Campaign Content Analysis
```javascript
// Analyze all content for a campaign
const campaignContent = [
  { type: 'text', content: 'Campaign headline' },
  { type: 'url', content: 'https://landing-page.com' },
  { type: 'image', content: 'https://ad-image.jpg' }
];

const analysis = await fetch('/api/content-analysis/bulk-analyze', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contents: campaignContent,
    campaignId: campaignId
  })
});
```

### Real-time Content Monitoring
```javascript
// Monitor social media content sentiment
const socialContent = await fetch('/api/content-analysis/analyze-text', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: socialMediaPost,
    campaignId: campaignId,
    options: { includeSentiment: true }
  })
});
```

---

## 📞 SUPPORT

For content analysis API support:
1. Check server logs for detailed error messages
2. Ensure all environment variables are configured
3. Verify JWT token is valid and not expired
4. Check that campaign ID exists and belongs to the authenticated user 