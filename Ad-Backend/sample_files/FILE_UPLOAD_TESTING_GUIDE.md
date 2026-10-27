# File Upload Testing Guide

## 📁 Sample Files Provided

### 1. `test_banner.txt`
- **Type**: Text file
- **Size**: ~1KB
- **Purpose**: Basic file upload testing
- **Use Case**: Test file upload validation and processing

### 2. `sample_banner.html`
- **Type**: HTML file (can be converted to image)
- **Size**: ~2KB
- **Purpose**: Visual banner testing
- **Use Case**: Test image-like content processing

### 3. `sample_asset_metadata.json`
- **Type**: JSON metadata file
- **Size**: ~1KB
- **Purpose**: Asset creation testing
- **Use Case**: Test asset creation with complete metadata

---

## 🧪 Testing Scenarios

### Scenario 1: Basic File Upload
**Endpoint**: `POST /api/files/upload`
**File**: `test_banner.txt`

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sample_files/test_banner.txt" \
  -F "campaignId=YOUR_CAMPAIGN_ID" \
  -F "tags=banner,test" \
  -F "description=Test file upload"
```

### Scenario 2: Asset Creation with Metadata
**Endpoint**: `POST /api/campaigns/:campaignId/assets`
**Data**: Use content from `sample_asset_metadata.json`

```json
{
  "name": "Sample Test Banner",
  "description": "A sample banner for testing",
  "originalName": "sample_banner.jpg",
  "fileName": "sample_banner_20241201_123456.jpg",
  "filePath": "/uploads/banners/sample_banner_20241201_123456.jpg",
  "fileSize": 45000,
  "mimeType": "image/jpeg",
  "fileExtension": "jpg",
  "type": "image",
  "width": 728,
  "height": 90,
  "status": "ready",
  "isActive": true,
  "tags": ["banner", "test", "sample"],
  "settings": {
    "quality": "high",
    "compression": "optimized"
  }
}
```

### Scenario 3: HTML to Image Conversion
**File**: `sample_banner.html`
**Process**: 
1. Open in browser
2. Take screenshot or use browser dev tools
3. Save as image file
4. Upload using file upload endpoint

---

## 📋 Test Cases

### ✅ Valid File Uploads
- [ ] Text file upload
- [ ] Image file upload (JPG, PNG, GIF)
- [ ] Video file upload (MP4, MOV)
- [ ] Document upload (PDF, DOC)
- [ ] Audio file upload (MP3, WAV)

### ❌ Invalid File Uploads
- [ ] File too large (>100MB)
- [ ] Unsupported file type
- [ ] Corrupted file
- [ ] Empty file
- [ ] Missing required fields

### 🔧 Edge Cases
- [ ] File with special characters in name
- [ ] File with spaces in name
- [ ] File with very long name
- [ ] Duplicate file upload
- [ ] Upload without authentication

---

## 🎯 Postman Testing

### 1. File Upload Request
```
Method: POST
URL: {{baseUrl}}/api/files/upload
Headers: 
  - Authorization: Bearer {{authToken}}
Body: form-data
  - file: [Select file]
  - campaignId: {{campaignId}}
  - tags: banner,test
  - description: Test file upload
```

### 2. Asset Creation Request
```
Method: POST
URL: {{baseUrl}}/api/campaigns/{{campaignId}}/assets
Headers:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
Body: raw (JSON)
  [Use sample_asset_metadata.json content]
```

---

## 📊 Expected Responses

### Successful File Upload
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "uuid",
    "name": "test_banner.txt",
    "size": 1024,
    "type": "text/plain",
    "url": "/uploads/files/filename.txt",
    "uploadedAt": "2024-12-01T12:00:00Z"
  }
}
```

### Successful Asset Creation
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "id": "uuid",
    "name": "Sample Test Banner",
    "type": "image",
    "status": "ready",
    "fileSize": 45000,
    "width": 728,
    "height": 90,
    "createdAt": "2024-12-01T12:00:00Z"
  }
}
```

---

## 🚀 Quick Start Testing

1. **Start the backend**:
   ```bash
   npm run dev
   ```

2. **Login and get token**:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"TestPassword123!"}'
   ```

3. **Create a campaign** (if needed):
   ```bash
   curl -X POST http://localhost:3000/api/campaigns \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Campaign","type":"display","objective":"awareness"}'
   ```

4. **Upload a file**:
   ```bash
   curl -X POST http://localhost:3000/api/files/upload \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "file=@sample_files/test_banner.txt" \
     -F "campaignId=YOUR_CAMPAIGN_ID"
   ```

5. **Create an asset**:
   ```bash
   curl -X POST http://localhost:3000/api/campaigns/YOUR_CAMPAIGN_ID/assets \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d @sample_files/sample_asset_metadata.json
   ```

---

## 🔍 Troubleshooting

### Common Issues:
1. **"File not found"**: Check file path and permissions
2. **"Invalid file type"**: Ensure file type is supported
3. **"File too large"**: Check file size limits
4. **"Authentication required"**: Ensure valid JWT token
5. **"Campaign not found"**: Verify campaign ID exists

### Debug Steps:
1. Check server logs for detailed error messages
2. Verify file exists and is readable
3. Confirm authentication token is valid
4. Check campaign ID belongs to authenticated user
5. Validate file format and size

---

## 📝 Notes

- The sample files are for testing purposes only
- In production, use actual media files
- File uploads are processed asynchronously
- Asset creation requires complete metadata
- All file operations are logged for debugging 