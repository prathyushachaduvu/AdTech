# 🚀 Complete AdTech Backend API Testing Guide

## 📋 Overview
This guide provides comprehensive testing for all implemented AdTech backend features. The backend is running on `http://localhost:3000`.

## 🔧 Prerequisites
- Backend running on port 3000
- Postman or similar API testing tool
- Docker containers running (backend, postgres, redis)

## 📊 Current System Status
✅ **Running Features:**
- Authentication System
- User Profile Management
- Campaign Management
- Content Analysis
- File Upload System
- Dashboard
- Health Checks

⚠️ **Temporarily Disabled:**
- Analytics System (for database stability)

---

## 🧪 STEP-BY-STEP TESTING SEQUENCE

### 1. 🏥 HEALTH CHECK
**Test the system is running**

```http
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "database": "connected",
    "redis": "connected",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. 🔐 AUTHENTICATION FLOW

#### 2.1 Register New User
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "userId": "uuid-here",
    "email": "testuser@example.com"
  }
}
```

#### 2.2 Check Email Verification Token
Look in the backend logs for the verification token, then:

```http
GET http://localhost:3000/auth/verify-email/{token_from_logs}
```

#### 2.3 Login
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "uuid",
      "email": "testuser@example.com",
      "firstName": "Test",
      "lastName": "User"
    }
  }
}
```

**Save the JWT token for subsequent requests!**

---

### 3. 👤 PROFILE MANAGEMENT

#### 3.1 Get User Profile
```http
GET http://localhost:3000/profile
Authorization: Bearer {jwt_token}
```

#### 3.2 Update Basic Profile
```http
PUT http://localhost:3000/profile
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

#### 3.3 Update Company Information
```http
PUT http://localhost:3000/profile/company
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "companyName": "Test Company",
  "jobTitle": "Marketing Manager",
  "industry": "Technology",
  "companySize": "51-200"
}
```

#### 3.4 Update Preferences
```http
PUT http://localhost:3000/profile/preferences
Authorization: Bearer {jwt_token}
Content-Type: application/json

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

#### 3.5 Get Profile Completion Status
```http
GET http://localhost:3000/profile/completion
Authorization: Bearer {jwt_token}
```

---

### 4. 💳 PAYMENT METHODS

#### 4.1 Add Payment Method
```http
POST http://localhost:3000/profile/payment-methods
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "paymentMethodType": "credit_card",
  "paymentMethodName": "Test Credit Card",
  "cardLastFour": "1111",
  "cardBrand": "visa",
  "cardExpiryMonth": 12,
  "cardExpiryYear": 2025,
  "billingName": "Test User",
  "billingEmail": "test@example.com",
  "billingPhone": "+1234567890",
  "billingAddressLine1": "123 Test Street",
  "billingAddressLine2": "Apt 1",
  "billingCity": "Test City",
  "billingState": "Test State",
  "billingPostalCode": "12345",
  "billingCountry": "United States",
  "isDefault": true
}
```

#### 4.2 Get Payment Methods
```http
GET http://localhost:3000/profile/payment-methods
Authorization: Bearer {jwt_token}
```

#### 4.3 Get Billing Summary
```http
GET http://localhost:3000/profile/payment-methods/summary
Authorization: Bearer {jwt_token}
```

---

### 5. 📊 CAMPAIGN MANAGEMENT

#### 5.1 Create Campaign
```http
POST http://localhost:3000/api/campaigns
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Test Campaign",
  "description": "A test campaign for API testing",
  "type": "display",
  "objective": "awareness",
  "budgetType": "daily",
  "budgetAmount": 1000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "timezone": "America/New_York",
  "tags": ["test", "api"],
  "settings": {
    "bidStrategy": "manual",
    "targetCPA": 50
  }
}
```

#### 5.2 Get All Campaigns
```http
GET http://localhost:3000/api/campaigns
Authorization: Bearer {jwt_token}
```

#### 5.3 Get Specific Campaign
```http
GET http://localhost:3000/api/campaigns/{campaign_id}
Authorization: Bearer {jwt_token}
```

#### 5.4 Update Campaign
```http
PUT http://localhost:3000/api/campaigns/{campaign_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated Test Campaign",
  "budgetAmount": 1500,
  "status": "active"
}
```

#### 5.5 Update Campaign Status
```http
PATCH http://localhost:3000/api/campaigns/{campaign_id}/status
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "status": "paused"
}
```

#### 5.6 Get Campaign Statistics
```http
GET http://localhost:3000/api/campaigns/stats/overview
Authorization: Bearer {jwt_token}
```

---

### 6. 🎯 TARGETING

#### 6.1 Create/Update Targeting
```http
POST http://localhost:3000/api/campaigns/{campaign_id}/targeting
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "ageRange": {"min": 25, "max": 45},
  "gender": "all",
  "locations": ["US", "CA"],
  "interests": ["technology", "business"],
  "devices": ["desktop", "mobile"],
  "platforms": ["web", "ios", "android"]
}
```

#### 6.2 Get Campaign Targeting
```http
GET http://localhost:3000/api/campaigns/{campaign_id}/targeting
Authorization: Bearer {jwt_token}
```

---

### 7. 📁 ASSET MANAGEMENT

#### 7.1 Get Campaign Assets
```http
GET http://localhost:3000/api/campaigns/{campaign_id}/assets
Authorization: Bearer {jwt_token}
```

#### 7.2 Create Asset
```http
POST http://localhost:3000/api/campaigns/{campaign_id}/assets
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Test Banner",
  "description": "A test banner for the campaign",
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
  "tags": ["banner", "test"],
  "settings": {}
}
```

---

### 8. 🔍 CONTENT ANALYSIS

#### 8.1 Analyze Text Content
```http
POST http://localhost:3000/api/content-analysis/analyze-text
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "text": "This is a sample text for content analysis testing. It contains positive sentiment and should be classified as marketing content.",
  "campaignId": "{campaign_id}",
  "options": {
    "includeSentiment": true,
    "includeKeywords": true,
    "includeClassification": true
  }
}
```

#### 8.2 Analyze URL Content
```http
POST http://localhost:3000/api/content-analysis/analyze-url
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "url": "https://example.com",
  "campaignId": "{campaign_id}",
  "options": {
    "includeImages": true,
    "includeLinks": true
  }
}
```

#### 8.3 Sentiment Analysis
```http
POST http://localhost:3000/api/content-analysis/sentiment
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "text": "This product is amazing and I love using it!",
  "campaignId": "{campaign_id}"
}
```

#### 8.4 Keyword Extraction
```http
POST http://localhost:3000/api/content-analysis/keywords
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "text": "Digital marketing strategies for e-commerce businesses in 2024",
  "campaignId": "{campaign_id}"
}
```

#### 8.5 Get Analysis by ID
```http
GET http://localhost:3000/api/content-analysis/{analysis_id}
Authorization: Bearer {jwt_token}
```

---

### 9. 📁 FILE UPLOAD SYSTEM

#### 9.1 Upload Single File
```http
POST http://localhost:3000/api/files/upload
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Form Data:
- file: [select a file]
- campaignId: {campaign_id} (optional)
- tags: "banner,test"
- description: "Test file upload"
```

#### 9.2 Upload Multiple Files
```http
POST http://localhost:3000/api/files/upload-multiple
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Form Data:
- files: [select multiple files]
- campaignId: {campaign_id} (optional)
- tags: "bulk,test"
```

#### 9.3 Get User Files
```http
GET http://localhost:3000/api/files
Authorization: Bearer {jwt_token}
```

#### 9.4 Get File by ID
```http
GET http://localhost:3000/api/files/{file_id}
Authorization: Bearer {jwt_token}
```

#### 9.5 Update File Metadata
```http
PUT http://localhost:3000/api/files/{file_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated File Name",
  "description": "Updated description",
  "tags": ["updated", "tags"]
}
```

#### 9.6 Download File
```http
GET http://localhost:3000/api/files/{file_id}/download
Authorization: Bearer {jwt_token}
```

---

### 10. 📈 DASHBOARD

#### 10.1 Dashboard Overview
```http
GET http://localhost:3000/dashboard
Authorization: Bearer {jwt_token}
```

#### 10.2 Dashboard Statistics
```http
GET http://localhost:3000/dashboard/stats
Authorization: Bearer {jwt_token}
```

#### 10.3 User Activity
```http
GET http://localhost:3000/dashboard/activity
Authorization: Bearer {jwt_token}
```

---

### 11. 🧪 TESTING ENDPOINTS

#### 11.1 Test Email Configuration
```http
POST http://localhost:3000/test/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

#### 11.2 Test Registration Flow
```http
POST http://localhost:3000/test/test-registration
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123!",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## 🔄 TESTING SEQUENCE RECOMMENDATION

1. **Start with Health Check** - Ensure system is running
2. **Authentication Flow** - Register, verify, login
3. **Profile Management** - Complete user profile
4. **Payment Methods** - Add test payment method
5. **Campaign Creation** - Create test campaign
6. **Targeting** - Set up campaign targeting
7. **Content Analysis** - Test text and URL analysis
8. **File Upload** - Upload test files
9. **Asset Management** - Create campaign assets
10. **Dashboard** - Check overview and stats

---

## 📝 TESTING NOTES

### Environment Variables for Postman
- `baseUrl`: `http://localhost:3000`
- `authToken`: Set after login (JWT token)
- `campaignId`: Set after creating a campaign
- `fileId`: Set after uploading a file
- `analysisId`: Set after content analysis

### Common Headers
```
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

### Error Handling
- Check response status codes
- Verify error messages are descriptive
- Ensure proper validation responses

---

## 🚨 TROUBLESHOOTING

### Common Issues:
1. **401 Unauthorized**: Check JWT token is valid and included
2. **404 Not Found**: Verify endpoint URL is correct
3. **500 Server Error**: Check backend logs for details
4. **Database Errors**: Ensure PostgreSQL is running

### Debug Commands:
```bash
# Check backend status
docker-compose ps

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check database
docker exec -it adtech_postgres psql -U postgres -c '\dt'
```

---

## ✅ SUCCESS CRITERIA

A successful test run should:
- ✅ All health checks pass
- ✅ User can register and login
- ✅ Profile can be updated completely
- ✅ Payment method can be added
- ✅ Campaign can be created and managed
- ✅ Targeting can be configured
- ✅ Content analysis returns results
- ✅ Files can be uploaded and managed
- ✅ Dashboard shows data
- ✅ All endpoints return proper responses

---

## 📞 SUPPORT

If you encounter issues:
1. Check the backend logs
2. Verify all Docker containers are running
3. Ensure database is properly initialized
4. Check environment variables are set correctly

The backend is designed to be robust and provide clear error messages for debugging. 