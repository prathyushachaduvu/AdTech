# User Registration System Setup Guide

## Overview
This document explains how to set up and use the complete user registration system with email verification.

## Features
- ✅ User registration with validation
- ✅ Email verification system
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting and security headers
- ✅ Beautiful email templates
- ✅ Resend verification functionality

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adtech_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Email Configuration (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Metadata
APP_NAME=AdTech Platform
```

### 2. Email Setup (Gmail Example)
For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in SMTP_PASS

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Make sure PostgreSQL and Redis are running, then start the application:
```bash
npm run dev
```

The application will automatically create the Users table in development mode.

## API Endpoints

### Registration
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

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Email Verification
```http
GET /auth/verify-email/:token
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! Welcome to our platform."
}
```

### Resend Verification
```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Get Profile (Protected Route)
```http
GET /auth/profile
Authorization: Bearer jwt_token_here
```

## Validation Rules

### Registration Validation
- **Email**: Must be a valid email format
- **Password**: Minimum 6 characters, must contain uppercase, lowercase, and number
- **FirstName**: 2-50 characters, letters and spaces only
- **LastName**: 2-50 characters, letters and spaces only

### Login Validation
- **Email**: Must be a valid email format
- **Password**: Required

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Authentication**: Secure token-based authentication
3. **Rate Limiting**: Prevents abuse with configurable limits
4. **Input Validation**: Comprehensive validation using express-validator
5. **CORS Protection**: Configurable cross-origin resource sharing
6. **Security Headers**: Added by Helmet middleware
7. **Email Verification**: Required before login

## Email Templates

The system includes two beautiful email templates:

1. **Verification Email**: Sent after registration with verification link
2. **Welcome Email**: Sent after successful email verification

Both templates feature:
- Responsive design
- Professional styling
- Clear call-to-action buttons
- Fallback text links

## Error Handling

The system provides comprehensive error handling:

- **Validation Errors**: Detailed field-specific error messages
- **Authentication Errors**: Clear login/registration failure messages
- **Email Errors**: Graceful handling of email service failures
- **Database Errors**: Proper error responses for database issues

## Testing the System

1. **Register a new user** using the `/auth/register` endpoint
2. **Check your email** for the verification link
3. **Click the verification link** or use the `/auth/verify-email/:token` endpoint
4. **Login** using the `/auth/login` endpoint
5. **Access protected routes** using the JWT token

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP configuration and credentials
2. **Database connection failed**: Verify PostgreSQL is running and credentials are correct
3. **Redis connection failed**: Verify Redis is running
4. **JWT errors**: Ensure JWT_SECRET is set and is a strong secret

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and stack traces.

## File Structure

```
src/
├── models/
│   └── User.js              # User model with Sequelize
├── controllers/
│   └── authController.js    # Authentication logic
├── services/
│   └── emailService.js      # Email sending service
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation middleware
├── routes/
│   └── auth.js             # Authentication routes
└── app.js                  # Main application file
```

This system provides a complete, production-ready user registration and authentication solution with email verification. 