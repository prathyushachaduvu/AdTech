# Authentication System Documentation

## Overview
This document describes the comprehensive authentication system with JWT tokens, session management, and credential verification.

## Features

### 🔐 **Core Authentication**
- ✅ User registration with email verification
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Email verification system
- ✅ Role-based access control

### 🎫 **Token Management**
- ✅ Access tokens (15 minutes expiry)
- ✅ Refresh tokens (7 days expiry)
- ✅ Token blacklisting for logout
- ✅ Automatic token refresh
- ✅ Password reset tokens (1 hour expiry)

### 📱 **Session Management**
- ✅ Multi-device session tracking
- ✅ Session activity monitoring
- ✅ Device information capture
- ✅ Force logout from all devices
- ✅ Session cleanup and expiration

### 🔒 **Security Features**
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Security headers with Helmet
- ✅ Token blacklisting
- ✅ Password strength requirements

## API Endpoints

### **Public Endpoints (No Authentication Required)**

#### 1. User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### 2. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "sessionId": "session:123:1234567890",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "role": "user"
    }
  }
}
```

#### 3. Email Verification
```http
GET /auth/verify-email/:token
```

#### 4. Resend Verification Email
```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 5. Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 6. Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123"
}
```

#### 7. Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### **Protected Endpoints (Authentication Required)**

#### 8. Get User Profile
```http
GET /auth/profile
Authorization: Bearer access_token_here
```

#### 9. Logout
```http
POST /auth/logout
Authorization: Bearer access_token_here
```

#### 10. Logout from All Devices
```http
POST /auth/logout-all
Authorization: Bearer access_token_here
```

#### 11. Get User Sessions
```http
GET /auth/sessions
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "sessionId": "session:123:1234567890",
        "userId": "uuid",
        "deviceInfo": {
          "userAgent": "Mozilla/5.0...",
          "ip": "192.168.1.1",
          "timestamp": "2024-01-01T00:00:00.000Z"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "lastActivity": "2024-01-01T01:00:00.000Z",
        "isActive": true
      }
    ],
    "totalSessions": 1
  }
}
```

#### 12. Change Password
```http
POST /auth/change-password
Authorization: Bearer access_token_here
Content-Type: application/json

{
  "currentPassword": "OldSecurePass123",
  "newPassword": "NewSecurePass123"
}
```

## Token Types

### 1. **Access Token**
- **Purpose**: API authentication
- **Expiry**: 15 minutes (configurable)
- **Storage**: Client-side (memory/localStorage)
- **Format**: JWT with user info and role

### 2. **Refresh Token**
- **Purpose**: Generate new access tokens
- **Expiry**: 7 days (configurable)
- **Storage**: Client-side (httpOnly cookie recommended)
- **Format**: JWT with embedded random token

### 3. **Reset Token**
- **Purpose**: Password reset verification
- **Expiry**: 1 hour (configurable)
- **Storage**: Redis with expiration
- **Format**: JWT with embedded random token

## Session Management

### **Session Features**
- **Multi-device support**: Track sessions across devices
- **Device information**: Capture IP, user agent, timestamp
- **Activity tracking**: Update last activity on each request
- **Automatic cleanup**: Sessions expire after 24 hours
- **Force logout**: Invalidate all sessions for a user

### **Session Storage**
- **Redis**: Fast, distributed session storage
- **Key format**: `session:userId:timestamp`
- **TTL**: 24 hours automatic expiration
- **Data**: User ID, device info, timestamps

## Security Implementation

### **Password Security**
```javascript
// Password hashing with bcrypt
const hashedPassword = await bcrypt.hash(password, 12);

// Password verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### **Token Security**
```javascript
// Token blacklisting
await tokenService.blacklistToken(token);

// Token verification with blacklist check
const decoded = await tokenService.verifyAccessToken(token);
```

### **Rate Limiting**
```javascript
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_RESET_EXPIRY=1h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
APP_NAME=AdTech Platform

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Error Handling

### **Authentication Errors**
```json
{
  "success": false,
  "message": "Token has expired",
  "code": "TOKEN_EXPIRED"
}
```

### **Validation Errors**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### **Permission Errors**
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

## Usage Examples

### **Frontend Integration**

#### 1. Login Flow
```javascript
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store tokens
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    // Store user info
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};
```

#### 2. API Request with Token
```javascript
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry request with new token
      return apiRequest(url, options);
    }
  }
  
  return response;
};
```

#### 3. Token Refresh
```javascript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return true;
  }
  
  // Refresh failed, redirect to login
  localStorage.clear();
  window.location.href = '/login';
  return false;
};
```

## Testing

### **Postman Collection**

1. **Health Check**
   ```
   GET http://localhost:3000/health
   ```

2. **Register User**
   ```
   POST http://localhost:3000/auth/register
   Body: { "email": "test@example.com", "password": "TestPass123", "firstName": "John", "lastName": "Doe" }
   ```

3. **Login**
   ```
   POST http://localhost:3000/auth/login
   Body: { "email": "test@example.com", "password": "TestPass123" }
   ```

4. **Get Profile (with token)**
   ```
   GET http://localhost:3000/auth/profile
   Headers: Authorization: Bearer {{accessToken}}
   ```

5. **Refresh Token**
   ```
   POST http://localhost:3000/auth/refresh-token
   Body: { "refreshToken": "{{refreshToken}}" }
   ```

6. **Logout**
   ```
   POST http://localhost:3000/auth/logout
   Headers: Authorization: Bearer {{accessToken}}
   ```

## Best Practices

### **Security**
1. **Never store sensitive data in tokens**
2. **Use HTTPS in production**
3. **Implement proper CORS policies**
4. **Regular token rotation**
5. **Monitor for suspicious activity**

### **Performance**
1. **Use Redis for session storage**
2. **Implement token caching**
3. **Optimize database queries**
4. **Use connection pooling**

### **User Experience**
1. **Automatic token refresh**
2. **Graceful error handling**
3. **Clear error messages**
4. **Session management UI**

This authentication system provides enterprise-level security with modern best practices for token management, session handling, and user authentication. 