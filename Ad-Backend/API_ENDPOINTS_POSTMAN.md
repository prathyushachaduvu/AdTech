# AdTech Backend API Endpoints - Postman Collection

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. User Registration
- **URL**: `POST /auth/register`
- **Description**: Register a new user account
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. User Login
- **URL**: `POST /auth/login`
- **Description**: Login and receive JWT token
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### 3. Email Verification
- **URL**: `GET /auth/verify-email/:token`
- **Description**: Verify email with token from registration email
- **Parameters**: `token` (from email)

### 4. Resend Verification Email
- **URL**: `POST /auth/resend-verification`
- **Description**: Resend email verification
- **Body**:
```json
{
  "email": "user@example.com"
}
```

### 5. Forgot Password
- **URL**: `POST /auth/forgot-password`
- **Description**: Request password reset email
- **Body**:
```json
{
  "email": "user@example.com"
}
```

### 6. Reset Password
- **URL**: `POST /auth/reset-password`
- **Description**: Reset password with token
- **Body**:
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePassword123!"
}
```

### 7. Refresh Token
- **URL**: `POST /auth/refresh-token`
- **Description**: Get new access token using refresh token
- **Body**:
```json
{
  "refreshToken": "your_refresh_token"
}
```

### 8. Get User Profile (Protected)
- **URL**: `GET /auth/profile`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`

### 9. Logout
- **URL**: `POST /auth/logout`
- **Description**: Logout current session
- **Headers**: `Authorization: Bearer <token>`

### 10. Logout All Devices
- **URL**: `POST /auth/logout-all`
- **Description**: Logout from all devices
- **Headers**: `Authorization: Bearer <token>`

### 11. Get User Sessions
- **URL**: `GET /auth/sessions`
- **Description**: Get all active sessions
- **Headers**: `Authorization: Bearer <token>`

### 12. Change Password
- **URL**: `POST /auth/change-password`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword123!"
}
```

---

## 👤 PROFILE MANAGEMENT ENDPOINTS

### 1. Get Complete Profile
- **URL**: `GET /profile`
- **Description**: Get complete user profile information
- **Headers**: `Authorization: Bearer <token>`

### 2. Update Basic Profile
- **URL**: `PUT /profile`
- **Description**: Update basic profile information
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

### 3. Get Profile Completion Status
- **URL**: `GET /profile/completion`
- **Description**: Get profile completion percentage
- **Headers**: `Authorization: Bearer <token>`

### 4. Update Company Information
- **URL**: `PUT /profile/company`
- **Description**: Update company details
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "companyName": "Acme Corp",
  "jobTitle": "Marketing Manager",
  "industry": "Technology",
  "companySize": "50-200"
}
```

### 5. Update Preferences
- **URL**: `PUT /profile/preferences`
- **Description**: Update user preferences
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "timezone": "America/New_York",
  "language": "en",
  "currency": "USD",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

### 6. Update Billing Address
- **URL**: `PUT /profile/billing-address`
- **Description**: Update billing address
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "US"
}
```

---

## 💳 PAYMENT METHODS ENDPOINTS

### 1. Add Payment Method
- **URL**: `POST /profile/payment-methods`
- **Description**: Add new payment method
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "type": "credit_card",
  "cardNumber": "4111111111111111",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "cvv": "123",
  "cardholderName": "John Doe",
  "isDefault": true
}
```

### 2. Get Payment Methods
- **URL**: `GET /profile/payment-methods`
- **Description**: Get all payment methods
- **Headers**: `Authorization: Bearer <token>`

### 3. Get Billing Summary
- **URL**: `GET /profile/payment-methods/summary`
- **Description**: Get billing summary
- **Headers**: `Authorization: Bearer <token>`

### 4. Update Payment Method
- **URL**: `PUT /profile/payment-methods/:paymentMethodId`
- **Description**: Update payment method
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "cardholderName": "John Doe Updated",
  "isDefault": false
}
```

### 5. Delete Payment Method
- **URL**: `DELETE /profile/payment-methods/:paymentMethodId`
- **Description**: Delete payment method
- **Headers**: `Authorization: Bearer <token>`

### 6. Set Default Payment Method
- **URL**: `PUT /profile/payment-methods/:paymentMethodId/default`
- **Description**: Set payment method as default
- **Headers**: `Authorization: Bearer <token>`

---

## 📊 CAMPAIGN MANAGEMENT ENDPOINTS

### 1. Create Campaign
- **URL**: `POST /api/campaigns`
- **Description**: Create a new campaign
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Summer Sale Campaign",
  "description": "Promote summer products",
  "type": "display",
  "objective": "conversions",
  "budgetType": "daily",
  "budgetAmount": 1000,
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "timezone": "America/New_York",
  "tags": ["summer", "sale"],
  "settings": {
    "bidStrategy": "manual",
    "targetCPA": 50
  }
}
```

### 2. Create Campaign with Targeting
- **URL**: `POST /api/campaigns/with-targeting`
- **Description**: Create campaign with targeting configuration
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "campaign": {
    "name": "Targeted Campaign",
    "type": "display",
    "objective": "awareness"
  },
  "targeting": {
    "ageRange": {"min": 25, "max": 45},
    "gender": "all",
    "locations": ["US", "CA"],
    "interests": ["technology", "business"]
  }
}
```

### 3. Get All Campaigns
- **URL**: `GET /api/campaigns`
- **Description**: Get campaigns with filtering and pagination
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status` (optional): active, paused, completed
  - `type` (optional): display, video, search
  - `page` (optional): page number
  - `limit` (optional): items per page

### 4. Get Specific Campaign
- **URL**: `GET /api/campaigns/:id`
- **Description**: Get campaign by ID
- **Headers**: `Authorization: Bearer <token>`

### 5. Update Campaign
- **URL**: `PUT /api/campaigns/:id`
- **Description**: Update campaign details
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Updated Campaign Name",
  "budgetAmount": 1500,
  "status": "active"
}
```

### 6. Delete Campaign
- **URL**: `DELETE /api/campaigns/:id`
- **Description**: Delete campaign
- **Headers**: `Authorization: Bearer <token>`

### 7. Update Campaign Status
- **URL**: `PATCH /api/campaigns/:id/status`
- **Description**: Update campaign status
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "status": "paused"
}
```

### 8. Duplicate Campaign
- **URL**: `POST /api/campaigns/:id/duplicate`
- **Description**: Create a copy of existing campaign
- **Headers**: `Authorization: Bearer <token>`

### 9. Get Campaign Statistics
- **URL**: `GET /api/campaigns/stats/overview`
- **Description**: Get campaign performance statistics
- **Headers**: `Authorization: Bearer <token>`

### 10. Update Campaign Metrics
- **URL**: `PATCH /api/campaigns/:id/metrics`
- **Description**: Update campaign performance metrics
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "impressions": 10000,
  "clicks": 500,
  "conversions": 25,
  "spend": 750.50
}
```

### 11. Bulk Update Campaigns
- **URL**: `PATCH /api/campaigns/bulk/update`
- **Description**: Update multiple campaigns
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "campaignIds": ["uuid1", "uuid2"],
  "updates": {
    "status": "paused",
    "budgetAmount": 2000
  }
}
```

### 12. Bulk Delete Campaigns
- **URL**: `DELETE /api/campaigns/bulk/delete`
- **Description**: Delete multiple campaigns
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "campaignIds": ["uuid1", "uuid2"]
}
```

### 13. General Bulk Operations
- **URL**: `POST /api/campaigns/bulk`
- **Description**: Perform bulk operations (update, delete, duplicate)
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "operation": "update",
  "campaignIds": ["uuid1", "uuid2"],
  "updates": {
    "status": "active"
  }
}
```

### 14. Export Campaigns
- **URL**: `GET /api/campaigns/export/:format`
- **Description**: Export campaigns in specified format
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `format` (csv, json, xlsx)
- **Query Parameters**: `status`, `type`, `objective`

---

## 🎯 TARGETING ENDPOINTS

### 1. Get Campaign Targeting
- **URL**: `GET /api/campaigns/:campaignId/targeting`
- **Description**: Get targeting configuration for campaign
- **Headers**: `Authorization: Bearer <token>`

### 2. Create/Update Targeting
- **URL**: `POST /api/campaigns/:campaignId/targeting`
- **Description**: Create or update targeting configuration
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "ageRange": {"min": 25, "max": 45},
  "gender": "all",
  "locations": ["US", "CA", "UK"],
  "interests": ["technology", "business", "finance"],
  "devices": ["desktop", "mobile"],
  "platforms": ["web", "ios", "android"],
  "behaviors": ["online_shoppers", "business_travelers"]
}
```

### 3. Delete Targeting
- **URL**: `DELETE /api/campaigns/:campaignId/targeting`
- **Description**: Delete targeting configuration
- **Headers**: `Authorization: Bearer <token>`

### 4. Get Targeting Templates
- **URL**: `GET /api/templates/targeting`
- **Description**: Get predefined targeting templates
- **Headers**: `Authorization: Bearer <token>`

---

## 📁 ASSET MANAGEMENT ENDPOINTS

### 1. Get Campaign Assets
- **URL**: `GET /api/campaigns/:campaignId/assets`
- **Description**: Get all assets for a campaign
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `type` (optional): image, video, text
  - `status` (optional): active, paused, draft
  - `page` (optional): page number
  - `limit` (optional): items per page

### 2. Create Asset
- **URL**: `POST /api/campaigns/:campaignId/assets`
- **Description**: Create new asset for campaign
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Summer Banner",
  "description": "A summer banner for the campaign",
  "originalName": "banner.jpg",
  "fileName": "banner_123456.jpg",
  "filePath": "/uploads/banners/banner_123456.jpg",
  "fileSize": 45000,
  "mimeType": "image/jpeg",
  "fileExtension": "jpg",
  "type": "image",
  "width": 728,
  "height": 90,
  "status": "ready",
  "isActive": true,
  "tags": ["banner", "summer"],
  "settings": {}
}
```

### 3. Get Specific Asset
- **URL**: `GET /api/assets/:assetId`
- **Description**: Get asset by ID
- **Headers**: `Authorization: Bearer <token>`

### 4. Update Asset
- **URL**: `PUT /api/assets/:assetId`
- **Description**: Update asset details
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Updated Banner Name",
  "status": "paused"
}
```

### 5. Delete Asset
- **URL**: `DELETE /api/assets/:assetId`
- **Description**: Delete asset
- **Headers**: `Authorization: Bearer <token>`

### 6. Bulk Update Assets
- **URL**: `PATCH /api/campaigns/:campaignId/assets/bulk`
- **Description**: Update multiple assets
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "assetIds": ["uuid1", "uuid2"],
  "updates": {
    "status": "active"
  }
}
```

---

## 🔍 CONTENT ANALYSIS ENDPOINTS

### 1. Analyze Text Content
- **URL**: `POST /api/content-analysis/analyze-text`
- **Description**: Analyze text content for sentiment, keywords, etc.
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text content to analyze",
  "campaignId": "campaign-uuid",
  "options": {
    "includeSentiment": true,
    "includeKeywords": true,
    "includeClassification": true
  }
}
```

### 2. Analyze URL Content
- **URL**: `POST /api/content-analysis/analyze-url`
- **Description**: Analyze content from a URL
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "url": "https://example.com/page",
  "campaignId": "campaign-uuid",
  "options": {
    "includeImages": true,
    "includeLinks": true
  }
}
```

### 3. Analyze Image Content
- **URL**: `POST /api/content-analysis/analyze-image`
- **Description**: Analyze image content
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "campaignId": "campaign-uuid",
  "options": {
    "includeObjects": true,
    "includeText": true
  }
}
```

### 4. Bulk Content Analysis
- **URL**: `POST /api/content-analysis/bulk-analyze`
- **Description**: Analyze multiple content pieces
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "contents": [
    {"type": "text", "content": "Text 1"},
    {"type": "url", "content": "https://example.com"},
    {"type": "image", "content": "https://example.com/image.jpg"}
  ],
  "campaignId": "campaign-uuid"
}
```

### 5. Sentiment Analysis
- **URL**: `POST /api/content-analysis/sentiment`
- **Description**: Analyze text sentiment
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text for sentiment analysis",
  "campaignId": "campaign-uuid"
}
```

### 6. Keyword Extraction
- **URL**: `POST /api/content-analysis/keywords`
- **Description**: Extract keywords from text
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text for keyword extraction",
  "campaignId": "campaign-uuid"
}
```

### 7. Content Classification
- **URL**: `POST /api/content-analysis/classify`
- **Description**: Classify content type
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "text": "Your text for classification",
  "campaignId": "campaign-uuid"
}
```

---

## 📈 ANALYTICS ENDPOINTS

### 1. Track Event
- **URL**: `POST /api/analytics/events`
- **Description**: Track engagement event
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "eventType": "impression",
  "campaignId": "campaign-uuid",
  "metadata": {
    "source": "web",
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  }
}
```

### 2. Get Real-time Metrics
- **URL**: `GET /api/analytics/real-time/:campaignId`
- **Description**: Get real-time metrics for campaign
- **Headers**: `Authorization: Bearer <token>`

### 3. Get Campaign Performance
- **URL**: `GET /api/analytics/campaigns/:campaignId`
- **Description**: Get campaign performance data
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `timeRange` (optional): 1h, 24h, 7d, 30d

### 4. Get Performance Overview
- **URL**: `GET /api/analytics/performance`
- **Description**: Get overall performance statistics
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `timeRange` (optional): 1h, 24h, 7d, 30d

### 5. Generate Custom Report
- **URL**: `POST /api/analytics/reports`
- **Description**: Generate custom analytics report
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "campaignId": "campaign-uuid",
  "reportType": "performance",
  "options": {
    "timeRange": "30d",
    "metrics": ["impressions", "clicks", "conversions"]
  }
}
```

### 6. Export Analytics Data
- **URL**: `GET /api/analytics/export/:campaignId`
- **Description**: Export analytics data
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `format` (optional): json, csv
  - `timeRange` (optional): 1h, 24h, 7d, 30d

### 7. Get Events
- **URL**: `GET /api/analytics/events`
- **Description**: Get events for user
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `campaignId` (optional): filter by campaign
  - `eventType` (optional): filter by event type
  - `limit` (optional): number of events
  - `offset` (optional): pagination offset

### 8. Delete User Data (GDPR)
- **URL**: `DELETE /api/analytics/user-data`
- **Description**: Delete user analytics data (GDPR compliance)
- **Headers**: `Authorization: Bearer <token>`

---

## 💾 BACKUP & RECOVERY ENDPOINTS

### 1. Create Backup
- **URL**: `POST /api/backup/create`
- **Description**: Create database backup
- **Headers**: `Authorization: Bearer <token>`

### 2. Restore Backup
- **URL**: `POST /api/backup/restore`
- **Description**: Restore database from backup
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "backupFileName": "backup_2024-01-01T12-00-00-000Z.sql"
}
```

### 3. List Backups
- **URL**: `GET /api/backup/list`
- **Description**: List available backups
- **Headers**: `Authorization: Bearer <token>`

### 4. Verify Backup
- **URL**: `POST /api/backup/verify`
- **Description**: Verify backup integrity
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "backupFileName": "backup_2024-01-01T12-00-00-000Z.sql"
}
```

### 5. Cleanup Old Backups
- **URL**: `POST /api/backup/cleanup`
- **Description**: Clean up old backups
- **Headers**: `Authorization: Bearer <token>`

### 6. Schedule Backup
- **URL**: `POST /api/backup/schedule`
- **Description**: Schedule automatic backup
- **Headers**: `Authorization: Bearer <token>`

---

## 📈 DASHBOARD ENDPOINTS

### 1. Dashboard Overview
- **URL**: `GET /dashboard`
- **Description**: Get dashboard overview data
- **Headers**: `Authorization: Bearer <token>`

### 2. Dashboard Statistics
- **URL**: `GET /dashboard/stats`
- **Description**: Get performance statistics
- **Headers**: `Authorization: Bearer <token>`

### 3. User Activity
- **URL**: `GET /dashboard/activity`
- **Description**: Get user activity history
- **Headers**: `Authorization: Bearer <token>`

---

## 🔧 API V1 ENDPOINTS

### 1. Health Check
- **URL**: `GET /api/v1/health`
- **Description**: Check API health status

### 2. Analytics (Coming Soon)
- **URL**: `GET /api/v1/analytics`
- **Description**: Get analytics data

### 3. Content (Coming Soon)
- **URL**: `GET /api/v1/content`
- **Description**: Get content data

---

## 🧪 TESTING ENDPOINTS

### 1. Test Email Configuration (GET)
- **URL**: `GET /test/test-email`
- **Description**: Test email configuration
- **Query Parameters**: `email` (optional)

### 2. Test Email Configuration (POST)
- **URL**: `POST /test/test-email`
- **Description**: Test email configuration
- **Body**:
```json
{
  "email": "test@example.com"
}
```

### 3. Test Registration Flow
- **URL**: `POST /test/test-registration`
- **Description**: Test complete registration flow
- **Body**:
```json
{
  "email": "test@example.com",
  "password": "TestPassword123!",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## 🏥 HEALTH CHECK ENDPOINTS

### 1. System Health Check
- **URL**: `GET /health`
- **Description**: Check system health including database and Redis connections

---

## 📝 RESPONSE FORMATS

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [],
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

## 🔒 AUTHENTICATION FLOW

1. **Register**: `POST /auth/register`
2. **Verify Email**: `GET /auth/verify-email/:token`
3. **Login**: `POST /auth/login` → Get JWT token
4. **Use Token**: Include `Authorization: Bearer <token>` in subsequent requests

---

## 📋 POSTMAN COLLECTION SETUP

1. **Create Environment Variables**:
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: (will be set after login)

2. **Pre-request Script for Login**:
```javascript
// After successful login, set the token
pm.environment.set("authToken", pm.response.json().token);
```

3. **Authorization Header**:
```
Authorization: Bearer {{authToken}}
```

---

## 🚀 GETTING STARTED

1. Start the server: `npm run dev`
2. Import this document into Postman
3. Set up environment variables
4. Test the health endpoint: `GET /health`
5. Register a new user: `POST /auth/register`
6. Verify email (check logs for token)
7. Login: `POST /auth/login`
8. Start testing protected endpoints with the JWT token

---

## 📞 SUPPORT

For API support or questions, check the server logs and ensure all environment variables are properly configured. 