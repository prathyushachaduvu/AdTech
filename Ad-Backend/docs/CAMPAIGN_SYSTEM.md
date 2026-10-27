# Campaign Management System

## Overview

The Campaign Management System provides comprehensive functionality for creating, managing, and tracking advertising campaigns. It includes campaign metadata storage, objective configuration, budget management, timeline tracking, contextual targeting, asset management, and validation.

## Features

### ✅ Campaign Storage
- Save campaign metadata, objectives, budgets, timelines
- Comprehensive campaign information tracking
- Performance metrics and analytics
- Campaign status management

### ✅ Targeting Configuration
- Store contextual targeting parameters and rules
- Geographic, demographic, and behavioral targeting
- Device and platform targeting
- Frequency capping and exclusions

### ✅ Asset Management
- Handle file uploads (images, videos, audio, documents)
- Generate thumbnails automatically
- Organize assets by campaign
- Asset metadata and categorization

### ✅ Validation
- Ensure campaign settings are valid and complete
- Comprehensive input validation
- Business rule enforcement
- Error handling and reporting

## Database Schema

### Campaign Model
```javascript
{
  id: UUID (Primary Key),
  name: STRING(255) - Campaign name,
  description: TEXT - Campaign description,
  status: ENUM - 'draft', 'pending', 'active', 'paused', 'completed', 'cancelled',
  type: ENUM - 'display', 'video', 'social', 'search', 'native', 'email',
  objective: ENUM - 'awareness', 'consideration', 'conversions', 'traffic', 'engagement', 'app_installs',
  budgetType: ENUM - 'daily', 'lifetime', 'monthly',
  budgetAmount: DECIMAL(10,2) - Total budget amount,
  budgetSpent: DECIMAL(10,2) - Amount spent so far,
  startDate: DATE - Campaign start date,
  endDate: DATE - Campaign end date,
  timezone: STRING(50) - Campaign timezone,
  impressions: INTEGER - Total impressions,
  clicks: INTEGER - Total clicks,
  conversions: INTEGER - Total conversions,
  spend: DECIMAL(10,2) - Total spend,
  isActive: BOOLEAN - Campaign active status,
  tags: JSON - Campaign tags array,
  settings: JSON - Additional campaign settings,
  userId: UUID - User who owns the campaign,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
  deletedAt: TIMESTAMP (Soft delete)
}
```

### Targeting Model
```javascript
{
  id: UUID (Primary Key),
  campaignId: UUID - Reference to campaign,
  locations: JSON - Array of geographic locations,
  locationType: ENUM - 'include' or 'exclude',
  ageRange: JSON - {"min": 18, "max": 65},
  gender: ENUM - 'all', 'male', 'female', 'other',
  interests: JSON - Array of interest categories,
  behaviors: JSON - Array of behavior categories,
  devices: JSON - Array of device types,
  platforms: JSON - Array of platforms,
  browsers: JSON - Array of browser types,
  keywords: JSON - Array of contextual keywords,
  categories: JSON - Array of content categories,
  topics: JSON - Array of content topics,
  timeSlots: JSON - Array of time slots for dayparting,
  daysOfWeek: JSON - Array of days (0=Sunday, 6=Saturday),
  frequencyCap: INTEGER - Maximum impressions per user,
  frequencyPeriod: ENUM - 'hour', 'day', 'week', 'month',
  customAudiences: JSON - Array of custom audience IDs,
  lookalikeAudiences: JSON - Array of lookalike configurations,
  excludedAudiences: JSON - Array of excluded audience IDs,
  excludedCategories: JSON - Array of excluded categories,
  isActive: BOOLEAN - Targeting active status,
  settings: JSON - Additional targeting settings,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

### Asset Model
```javascript
{
  id: UUID (Primary Key),
  campaignId: UUID - Reference to campaign,
  name: STRING(255) - Asset name,
  description: TEXT - Asset description,
  originalName: STRING(255) - Original file name,
  fileName: STRING(255) - Stored file name,
  filePath: STRING(500) - File storage path,
  fileSize: INTEGER - File size in bytes,
  mimeType: STRING(100) - File MIME type,
  fileExtension: STRING(10) - File extension,
  type: ENUM - 'image', 'video', 'audio', 'document', 'other',
  width: INTEGER - Width in pixels (images/videos),
  height: INTEGER - Height in pixels (images/videos),
  duration: INTEGER - Duration in seconds (videos/audio),
  thumbnailPath: STRING(500) - Thumbnail file path,
  thumbnailWidth: INTEGER - Thumbnail width,
  thumbnailHeight: INTEGER - Thumbnail height,
  status: ENUM - 'uploading', 'processing', 'ready', 'error', 'deleted',
  processingStatus: JSON - Processing metadata,
  isActive: BOOLEAN - Asset active status,
  isPublic: BOOLEAN - Public access flag,
  tags: JSON - Asset tags array,
  categories: JSON - Asset categories array,
  usageCount: INTEGER - Number of times used,
  lastUsed: DATE - Last usage timestamp,
  userId: UUID - User who owns the asset,
  settings: JSON - Additional asset settings,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
  deletedAt: TIMESTAMP (Soft delete)
}
```

## API Endpoints

### Base URL
```
/api/v1/campaigns
```

### Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Campaign CRUD Operations

### Create Campaign
**POST** `/api/v1/campaigns`

**Request Body:**
```json
{
  "name": "Summer Sale Campaign",
  "description": "Promote summer products with special discounts",
  "type": "display",
  "objective": "conversions",
  "budgetType": "daily",
  "budgetAmount": 100.00,
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-08-31T23:59:59.000Z",
  "timezone": "America/New_York",
  "tags": ["summer", "sale", "display"],
  "settings": {
    "targetAudience": "18-35",
    "locations": ["US", "CA"]
  },
  "targeting": {
    "locations": ["US", "CA"],
    "ageRange": {"min": 18, "max": 65},
    "interests": ["shopping", "fashion"],
    "devices": ["desktop", "mobile"],
    "keywords": ["summer", "sale", "discount"]
  }
}
```

### Get All Campaigns
**GET** `/api/v1/campaigns`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status
- `type` (optional): Filter by type
- `objective` (optional): Filter by objective
- `search` (optional): Search in name and description
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): ASC or DESC (default: DESC)

### Get Single Campaign
**GET** `/api/v1/campaigns/:id`

### Update Campaign
**PUT** `/api/v1/campaigns/:id`

### Delete Campaign
**DELETE** `/api/v1/campaigns/:id`

---

## 2. Campaign Status Management

### Update Campaign Status
**PATCH** `/api/v1/campaigns/:id/status`

**Request Body:**
```json
{
  "status": "active"
}
```

**Available Statuses:**
- `draft` - Campaign is in draft mode
- `pending` - Campaign is pending approval
- `active` - Campaign is running
- `paused` - Campaign is paused
- `completed` - Campaign has ended
- `cancelled` - Campaign was cancelled

---

## 3. Campaign Operations

### Duplicate Campaign
**POST** `/api/v1/campaigns/:id/duplicate`

Creates a copy of an existing campaign with all settings and targeting.

---

## 4. Campaign Statistics

### Get Campaign Statistics
**GET** `/api/v1/campaigns/stats/overview`

Returns comprehensive campaign statistics including:
- Overview counts (total, active, draft, completed)
- Budget utilization
- Distribution by type and objective

---

## 5. Campaign Metrics

### Update Campaign Metrics
**PATCH** `/api/v1/campaigns/:id/metrics`

**Request Body:**
```json
{
  "impressions": 5000,
  "clicks": 125,
  "conversions": 15,
  "spend": 45.75
}
```

---

## 6. Campaign Templates

### Get Available Templates
**GET** `/api/v1/campaigns/templates/list`

### Create Campaign from Template
**POST** `/api/v1/campaigns/templates/:templateId`

**Request Body:**
```json
{
  "name": "My Brand Awareness Campaign",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-08-31T23:59:59.000Z",
  "budgetAmount": 150
}
```

---

## 7. Export Functionality

### Export Campaigns
**GET** `/api/v1/campaigns/export/:format`

**Formats:**
- `csv` - Export as CSV file
- `json` - Export as JSON

---

## 8. Bulk Operations

### Bulk Update Campaigns
**PATCH** `/api/v1/campaigns/bulk/update`

**Request Body:**
```json
{
  "campaignIds": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "status": "paused",
    "tags": ["bulk-updated"]
  }
}
```

### Bulk Delete Campaigns
**DELETE** `/api/v1/campaigns/bulk/delete`

**Request Body:**
```json
{
  "campaignIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## Validation Rules

### Campaign Creation/Update
- **name**: Required, 1-255 characters
- **description**: Optional, max 1000 characters
- **type**: Required, must be one of: display, video, social, search, native, email
- **objective**: Required, must be one of: awareness, consideration, conversions, traffic, engagement, app_installs
- **budgetType**: Required, must be one of: daily, lifetime, monthly
- **budgetAmount**: Required, positive number greater than 0
- **startDate**: Required, valid ISO 8601 date, cannot be in the past
- **endDate**: Required, valid ISO 8601 date, must be after startDate
- **timezone**: Optional, max 50 characters
- **tags**: Optional, array of strings, max 10 tags, each tag max 50 characters
- **settings**: Optional, object

### Targeting Validation
- **frequencyCap**: Optional, positive integer if provided
- **ageRange**: Optional, min 13, max 100, min cannot exceed max
- **locations**: Optional, array of strings
- **interests**: Optional, array of strings
- **devices**: Optional, array of device types
- **platforms**: Optional, array of platforms

### Asset Validation
- **fileSize**: Maximum 100MB
- **width/height**: Required for images and videos, must be positive
- **mimeType**: Must be supported file type

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "budgetAmount",
      "message": "Budget amount must be a positive number greater than 0",
      "value": -10
    }
  ]
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Campaign not found"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing

### Running Tests
```bash
# Install dependencies
npm install

# Run the comprehensive test suite
node test-campaign-system.js
```

### Test Coverage
The test suite covers:
- ✅ Campaign creation with targeting
- ✅ Campaign retrieval and listing
- ✅ Campaign updates and status changes
- ✅ Campaign duplication
- ✅ Statistics and metrics
- ✅ Templates and exports
- ✅ Validation and error handling

### Manual Testing
1. Start the server: `npm run dev`
2. Run the test script: `node test-campaign-system.js`
3. Check the console output for test results

### API Testing with Postman/Insomnia
1. Register a user: `POST /auth/register`
2. Login: `POST /auth/login`
3. Use the JWT token in Authorization header
4. Test campaign endpoints as documented above

---

## File Structure

```
src/
├── models/
│   ├── Campaign.js          # Campaign data model
│   ├── Targeting.js         # Targeting configuration model
│   └── Asset.js            # Asset management model
├── controllers/
│   └── campaignController.js # Campaign business logic
├── routes/
│   └── campaigns.js         # Campaign API routes
├── middleware/
│   └── campaignValidation.js # Validation middleware
└── services/
    └── assetService.js      # Asset management service

test-campaign-system.js      # Comprehensive test suite
docs/
└── CAMPAIGN_SYSTEM.md       # This documentation
```

---

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination for large result sets
- Soft deletes for data preservation
- Efficient asset processing with thumbnails
- Caching for frequently accessed data

## Security Features

- JWT authentication required for all endpoints
- Input validation and sanitization
- File type and size restrictions
- User ownership validation
- Rate limiting on API endpoints

## Future Enhancements

- Real-time campaign performance tracking
- Advanced analytics and reporting
- A/B testing capabilities
- Automated campaign optimization
- Integration with external ad platforms
- Advanced targeting algorithms
- Campaign performance predictions 