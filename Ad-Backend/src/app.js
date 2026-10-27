const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database connection and initialization
const sequelize = require('./config/database');
const redisClient = require('./config/redis');
const initializeDatabase = require('./config/initDatabase');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const apiRoutes = require('./routes/api');
const testRoutes = require('./routes/test');
const dashboardRoutes = require('./routes/dashboard');
const campaignRoutes = require('./routes/campaigns');
const targetingRoutes = require('./routes/targeting');
const assetRoutes = require('./routes/assets');
const contentAnalysisRoutes = require('./routes/contentAnalysis');
const fileRoutes = require('./routes/files');
const analyticsRoutes = require('./routes/analytics');
const backupRoutes = require('./routes/backup');

const app = express();

// ========================================
// SECURITY MIDDLEWARE
// ========================================

// Helmet: Adds various HTTP headers for security
app.use(helmet());

// CORS: Configure Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
  credentials: true
}));

// Rate limiting: Prevent abuse by limiting requests per IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// ========================================
// LOGGING & PARSING MIDDLEWARE
// ========================================

// Morgan: HTTP request logger middleware
app.use(morgan('combined'));

// Body parsing middleware for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// ========================================
// HEALTH CHECK ENDPOINT
// ========================================

app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    // Check Redis connection
    await redisClient.ping();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// ========================================
// API ROUTES
// ========================================

// Authentication routes (user registration, login, verification)
// These routes handle:
// - POST /auth/register - User registration with email validation
// - POST /auth/login - User login with JWT token generation
// - POST /auth/resend-verification - Resend email verification
// - GET /auth/verify-email/:token - Verify email with token
// - GET /auth/profile - Get user profile (protected route)
app.use('/auth', authRoutes);

// Profile management routes (protected)
// These routes handle:
// - GET /profile - Get complete user profile
// - PUT /profile - Update basic profile information
// - PUT /profile/company - Update company information
// - PUT /profile/preferences - Update user preferences
// - PUT /profile/billing-address - Update billing address
// - GET /profile/completion - Get profile completion status
// - POST /profile/payment-methods - Add payment method
// - GET /profile/payment-methods - Get payment methods
// - PUT /profile/payment-methods/:id - Update payment method
// - DELETE /profile/payment-methods/:id - Delete payment method
app.use('/profile', profileRoutes);

// API v1 routes (content, analytics, etc.)
app.use('/api/v1', apiRoutes);

// Campaign management routes (protected)
app.use('/api/campaigns', campaignRoutes);

// Targeting management routes (protected)
app.use('/api', targetingRoutes);

// Asset management routes (protected)
app.use('/api', assetRoutes);

// Content analysis routes (protected)
app.use('/api', contentAnalysisRoutes);

// File upload and management routes (protected)
app.use('/api', fileRoutes);

// Analytics routes (protected)
app.use('/api/analytics', analyticsRoutes);

// Backup routes (protected)
app.use('/api/backup', backupRoutes);

// Test routes (for debugging)
app.use('/test', testRoutes);

// Dashboard routes (protected)
app.use('/dashboard', dashboardRoutes);

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Global error handler - catches all errors thrown in the application
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Determine if we should show detailed error in production
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// APPLICATION INITIALIZATION
// ========================================

async function initializeApp() {
  try {
    // Initialize database with proper associations
    await initializeDatabase();
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📧 Email verification enabled: ${process.env.SMTP_USER ? 'Yes' : 'No'}`);
      console.log(`🔐 JWT Secret configured: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// ========================================
// GRACEFUL SHUTDOWN HANDLING
// ========================================

// Handle graceful shutdown on SIGTERM signal
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  try {
    await sequelize.close();
    await redisClient.quit();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Handle graceful shutdown on SIGINT signal (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  try {
    await sequelize.close();
    await redisClient.quit();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// ========================================
// USER REGISTRATION SYSTEM EXPLANATION
// ========================================

/*
USER REGISTRATION SYSTEM OVERVIEW:

1. REGISTRATION FLOW:
   - User submits registration form with email, password, firstName, lastName
   - Validation middleware checks data format and requirements
   - Controller creates user record with hashed password
   - Verification token is generated and stored
   - Email service sends verification email
   - User receives success response

2. EMAIL VERIFICATION FLOW:
   - User clicks verification link in email
   - Token is validated against database
   - If valid, user's email is marked as verified
   - Welcome email is sent
   - User can now login

3. LOGIN FLOW:
   - User submits email and password
   - Password is verified against hashed password
   - JWT token is generated and returned
   - Token is used for authenticated requests

4. SECURITY FEATURES:
   - Password hashing with bcrypt
   - JWT token authentication
   - Rate limiting to prevent abuse
   - Input validation and sanitization
   - CORS protection
   - Helmet security headers

5. ENVIRONMENT VARIABLES NEEDED:
   - JWT_SECRET: Secret key for JWT tokens
   - SMTP_USER: Email service username
   - SMTP_PASS: Email service password
   - SMTP_HOST: Email service host (default: smtp.gmail.com)
   - SMTP_PORT: Email service port (default: 587)
   - FRONTEND_URL: Frontend application URL
   - NODE_ENV: Environment (development/production)

6. API ENDPOINTS:
   - POST /auth/register - Register new user
   - POST /auth/login - Login user
   - GET /auth/verify-email/:token - Verify email
   - POST /auth/resend-verification - Resend verification email
   - GET /auth/profile - Get user profile (protected)

7. DATABASE TABLES:
   - Users: Stores user information, verification tokens, etc.

8. EMAIL TEMPLATES:
   - Verification email with styled HTML
   - Welcome email after verification
*/

// Start the application
initializeApp();

module.exports = app;