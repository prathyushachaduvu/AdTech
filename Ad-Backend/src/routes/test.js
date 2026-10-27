const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Test email configuration (GET - for easy browser testing)
router.get('/test-email', async (req, res) => {
  try {
    const email = req.query.email || 'chaduvuprathyushareddy@gmail.com';
    
    // Test email configuration
    console.log('📧 Testing email configuration...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('SMTP Pass:', process.env.SMTP_PASS ? '***configured***' : '***NOT CONFIGURED***');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email configuration is missing. Please set SMTP_USER and SMTP_PASS environment variables.',
        config: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER ? 'configured' : 'missing',
          smtpPass: process.env.SMTP_PASS ? 'configured' : 'missing'
        }
      });
    }

    // Send test email
    const testUser = {
      email: email,
      firstName: 'Test',
      lastName: 'User'
    };

    await emailService.sendVerificationEmail(testUser, 'test-verification-token');

    res.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      email: email,
      verificationUrl: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/verify-email/test-verification-token`,
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPass: 'configured'
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER ? 'configured' : 'missing',
        smtpPass: process.env.SMTP_PASS ? 'configured' : 'missing'
      }
    });
  }
});

// Test email configuration (POST)
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Test email configuration
    console.log('📧 Testing email configuration...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('SMTP Pass:', process.env.SMTP_PASS ? '***configured***' : '***NOT CONFIGURED***');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email configuration is missing. Please set SMTP_USER and SMTP_PASS environment variables.',
        config: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER ? 'configured' : 'missing',
          smtpPass: process.env.SMTP_PASS ? 'configured' : 'missing'
        }
      });
    }

    // Send test email
    const testUser = {
      email: email,
      firstName: 'Test',
      lastName: 'User'
    };

    await emailService.sendVerificationEmail(testUser, 'test-verification-token');

    res.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPass: 'configured'
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      config: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER ? 'configured' : 'missing',
        smtpPass: process.env.SMTP_PASS ? 'configured' : 'missing'
      }
    });
  }
});

// Test complete registration flow
router.post('/test-registration', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: email, password, firstName, lastName'
      });
    }

    // Import User model
    const User = require('../models/User');
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Generate verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    res.json({
      success: true,
      message: 'Test user registered successfully! Check your email for verification link.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified
      },
      verificationUrl: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/verify-email/${verificationToken}`,
      verificationToken: verificationToken
    });

  } catch (error) {
    console.error('❌ Test registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test user',
      error: error.message
    });
  }
});

module.exports = router; 