# Campaign System API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "id": "uuid-here",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

---

## 📢 Campaign Management Endpoints

### Create Campaign
```http
POST /api/campaigns
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Summer Sale Campaign",
  "description": "Promoting summer products with special discounts",
  "type": "display",
  "objective": "conversions",
  "budgetType": "daily",
  "budgetAmount": 500.00,
  "startDate": "2024-07-15T00:00:00.000Z",
  "endDate": "2024-08-15T23:59:59.000Z",
  "timezone": "UTC",
  "tags": ["summer", "sale", "discount"]
}
```

### Create Campaign with Targeting
```http
POST /api/campaigns/with-targeting
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "campaign": {
    "name": "Targeted Summer Campaign",
    "description": "Campaign with specific targeting",
    "type": "display",
    "objective": "awareness",
    "budgetType": "daily",
    "budgetAmount": 300.00,
    "startDate": "2024-07-15T00:00:00.000Z",
    "endDate": "2024-08-15T23:59:59.000Z"
  },
  "targeting": {
    "locations": ["US", "CA"],
    "locationType": "include",
    "ageRange": {"min": 25, "max": 45},
    "gender": "all",
    "interests": ["technology", "fashion"],
    "devices": ["desktop", "mobile"],
    "platforms": ["web", "ios", "android"]
  }
}
```

### Get All Campaigns
```http
GET /api/campaigns?status=active&type=display&page=1&limit=10
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**
- `status`: draft, pending, active, paused, completed, cancelled
- `type`: display, video, social, search, native, email
- `objective`: awareness, consideration, conversions, traffic, engagement, app_installs
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

### Get Campaign by ID
```http
GET /api/campaigns/:campaignId
Authorization: Bearer <your-jwt-token>
```

### Update Campaign
```http
PUT /api/campaigns/:campaignId
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Updated Summer Sale Campaign",
  "budgetAmount": 750.00,
  "status": "active",
  "description": "Updated description"
}
```

### Update Campaign Status
```http
PATCH /api/campaigns/:campaignId/status
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "status": "active"
}
```

### Delete Campaign
```http
DELETE /api/campaigns/:campaignId
Authorization: Bearer <your-jwt-token>
```

### Duplicate Campaign
```http
POST /api/campaigns/:campaignId/duplicate
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Copy of Summer Campaign"
}
```

### Get Campaign Statistics
```http
GET /api/campaigns/stats/overview
Authorization: Bearer <your-jwt-token>
```

### Export Campaigns
```http
GET /api/campaigns/export/json?status=active&type=display
Authorization: Bearer <your-jwt-token>
```

**Export Formats:**
- `json`: JSON format
- `csv`: CSV format

### Get Campaign Templates
```http
GET /api/campaigns/templates/list
Authorization: Bearer <your-jwt-token>
```

### Create Campaign from Template
```http
POST /api/campaigns/templates/awareness-display
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "My Awareness Campaign",
  "startDate": "2024-07-15T00:00:00.000Z",
  "endDate": "2024-08-15T23:59:59.000Z",
  "budgetAmount": 200.00
}
```

---

## 🎯 Targeting Management Endpoints

### Get Targeting for Campaign
```http
GET /api/campaigns/:campaignId/targeting
Authorization: Bearer <your-jwt-token>
```

### Create/Update Targeting
```http
POST /api/campaigns/:campaignId/targeting
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "locations": ["US", "CA", "UK"],
  "locationType": "include",
  "ageRange": {"min": 18, "max": 55},
  "gender": "all",
  "interests": ["technology", "business", "lifestyle"],
  "behaviors": ["online_shoppers", "mobile_users"],
  "devices": ["desktop", "mobile", "tablet"],
  "platforms": ["web", "ios", "android"],
  "keywords": ["summer", "vacation", "travel"],
  "categories": ["travel", "lifestyle"],
  "frequencyCap": 3,
  "frequencyPeriod": "day"
}
```

### Delete Targeting
```http
DELETE /api/campaigns/:campaignId/targeting
Authorization: Bearer <your-jwt-token>
```

### Get Targeting Templates
```http
GET /api/templates/targeting
Authorization: Bearer <your-jwt-token>
```

---

## 📁 Asset Management Endpoints

### Get Campaign Assets
```http
GET /api/campaigns/:campaignId/assets?type=image&status=ready&page=1&limit=20
Authorization: Bearer <your-jwt-token>
```

### Create Asset
```http
POST /api/campaigns/:campaignId/assets
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Summer Banner Ad",
  "type": "image",
  "filePath": "/uploads/summer-banner.jpg",
  "fileSize": 1024000,
  "width": 728,
  "height": 90,
  "isPublic": true,
  "tags": ["summer", "banner", "display"],
  "categories": ["display", "banner"],
  "settings": {
    "altText": "Summer Sale Banner",
    "clickUrl": "https://example.com/summer-sale"
  }
}
```

### Get Asset by ID
```http
GET /api/assets/:assetId
Authorization: Bearer <your-jwt-token>
```

### Update Asset
```http
PUT /api/assets/:assetId
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Updated Banner Ad",
  "isActive": true,
  "tags": ["updated", "banner"]
}
```

### Delete Asset
```http
DELETE /api/assets/:assetId
Authorization: Bearer <your-jwt-token>
```

### Bulk Update Assets
```http
PATCH /api/campaigns/:campaignId/assets/bulk
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "assetIds": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "isActive": true,
    "tags": ["updated", "bulk"]
  }
}
```

### Get Asset Statistics
```http
GET /api/campaigns/:campaignId/assets/stats
Authorization: Bearer <your-jwt-token>
```

---

## 📊 Bulk Operations

### Bulk Update Campaigns
```http
PATCH /api/campaigns/bulk/update
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "campaignIds": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "status": "paused",
    "budgetAmount": 1000.00
  }
}
```

### Bulk Delete Campaigns
```http
DELETE /api/campaigns/bulk/delete
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "campaignIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 📈 Campaign Metrics

### Update Campaign Metrics
```http
PATCH /api/campaigns/:campaignId/metrics
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "impressions": 10000,
  "clicks": 500,
  "conversions": 25,
  "spend": 150.00
}
```

---

## 🧪 Testing Sequence

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 2. Create Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "description": "A test campaign",
    "type": "display",
    "objective": "awareness",
    "budgetType": "daily",
    "budgetAmount": 100.00,
    "startDate": "2024-07-15T00:00:00.000Z",
    "endDate": "2024-08-15T23:59:59.000Z"
  }'
```

### 3. Get Campaigns
```bash
curl -X GET http://localhost:3000/api/campaigns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Add Targeting
```bash
curl -X POST http://localhost:3000/api/campaigns/CAMPAIGN_ID/targeting \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locations": ["US"],
    "ageRange": {"min": 25, "max": 45},
    "devices": ["desktop", "mobile"]
  }'
```

### 5. Add Asset
```bash
curl -X POST http://localhost:3000/api/campaigns/CAMPAIGN_ID/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Banner",
    "type": "image",
    "filePath": "/uploads/test-banner.jpg",
    "fileSize": 1024000,
    "width": 728,
    "height": 90
  }'
```

---

## 📋 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Specific error details"
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 🔧 Environment Variables

Create a Postman environment with these variables:
- `baseUrl`: `http://localhost:3000`
- `jwtToken`: (from login response)
- `campaignId`: (from campaign creation response)
- `assetId`: (from asset creation response)

---

## 🚀 Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-07-09T10:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- File sizes are in bytes
- Budget amounts are in decimal format (e.g., 100.00)
- UUIDs are used for all IDs
- All endpoints return JSON responses
- Error responses include appropriate HTTP status codes
- Protected endpoints require valid JWT token
- Rate limiting is applied to all endpoints 