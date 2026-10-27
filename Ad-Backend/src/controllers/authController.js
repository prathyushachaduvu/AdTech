const { validationResult } = require('express-validator');
const User = require('../models/User');
const emailService = require('../services/emailService');
const tokenService = require('../services/tokenService');
const { SessionManager } = require('../middleware/session');

class AuthController {
  // User Registration
  async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, firstName, lastName } = req.body;

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
      try {
        await emailService.sendVerificationEmail(user, verificationToken);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the registration if email fails
      }

      // Return success response (without sensitive data)
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  }

  // Email Verification
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Find user with the verification token
      const user = await User.findOne({
        where: {
          emailVerificationToken: token,
          emailVerificationExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      // Mark email as verified
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpires = null;
      await user.save();

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Welcome email sending failed:', emailError);
      }

      res.json({
        success: true,
        message: 'Email verified successfully! Welcome to our platform.'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during email verification'
      });
    }
  }

  // User Login with enhanced authentication
  async login(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, rememberMe = false } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if email is verified (skip in development mode)
      if (!user.isEmailVerified && process.env.NODE_ENV !== 'development') {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email address before logging in'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create session
      const sessionManager = new SessionManager();
      const sessionId = await sessionManager.createSession(user.id, req.deviceInfo);

      // Generate token pair
      const tokenPair = await tokenService.generateTokenPair(
        user.id, 
        user.email, 
        user.role || 'user'
      );

      // Add session ID to access token
      const accessTokenWithSession = tokenService.generateAccessToken(
        user.id, 
        user.email, 
        user.role || 'user'
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken: accessTokenWithSession,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn,
          sessionId,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
            role: user.role || 'user'
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }

  // Resend Verification Email
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email is already verified
      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Generate new verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      try {
        await emailService.sendVerificationEmail(user, verificationToken);
        res.json({
          success: true,
          message: 'Verification email sent successfully'
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        res.status(500).json({
          success: false,
          message: 'Failed to send verification email'
        });
      }

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get Current User Profile
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'resetPasswordToken'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Refresh Access Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = await tokenService.verifyRefreshToken(refreshToken);
      
      // Get user
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      // Generate new token pair
      const tokenPair = await tokenService.generateTokenPair(
        user.id, 
        user.email, 
        user.role || 'user'
      );

      // Invalidate old refresh token
      await tokenService.invalidateRefreshToken(decoded.userId, decoded.token);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (token) {
        // Blacklist the access token
        await tokenService.blacklistToken(token);
      }

      // Invalidate session if present
      if (req.sessionId) {
        const sessionManager = new SessionManager();
        await sessionManager.invalidateSession(req.sessionId);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  }

  // Logout from all devices
  async logoutAllDevices(req, res) {
    try {
      // Invalidate all refresh tokens for the user
      const invalidatedCount = await tokenService.invalidateAllRefreshTokens(req.user.userId);

      // Invalidate all sessions for the user
      const sessionManager = new SessionManager();
      const sessionCount = await sessionManager.invalidateAllUserSessions(req.user.userId);

      res.json({
        success: true,
        message: 'Logged out from all devices successfully',
        data: {
          invalidatedTokens: invalidatedCount,
          invalidatedSessions: sessionCount
        }
      });

    } catch (error) {
      console.error('Logout all devices error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  }

  // Get user sessions
  async getUserSessions(req, res) {
    try {
      const sessionManager = new SessionManager();
      const sessions = await sessionManager.getUserSessions(req.user.userId);

      res.json({
        success: true,
        data: {
          sessions,
          totalSessions: sessions.length
        }
      });

    } catch (error) {
      console.error('Get user sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Password Reset Request
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = tokenService.generateResetToken(user.id);

      // Send reset email
      try {
        await emailService.sendPasswordResetEmail(user, resetToken);
      } catch (emailError) {
        console.error('Password reset email sending failed:', emailError);
      }

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });

    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
      }

      // Verify reset token
      const decoded = await tokenService.verifyResetToken(token);
      
      // Get user
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Invalidate reset token
      await tokenService.invalidateResetToken(decoded.userId, decoded.token);

      // Invalidate all sessions and tokens (force re-login)
      await tokenService.invalidateAllRefreshTokens(user.id);
      const sessionManager = new SessionManager();
      await sessionManager.invalidateAllUserSessions(user.id);

      res.json({
        success: true,
        message: 'Password reset successfully. Please login with your new password.'
      });

    } catch (error) {
      console.error('Password reset error:', error);
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
  }

  // Change Password (authenticated user)
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Invalidate all sessions and tokens (force re-login)
      await tokenService.invalidateAllRefreshTokens(user.id);
      const sessionManager = new SessionManager();
      await sessionManager.invalidateAllUserSessions(user.id);

      res.json({
        success: true,
        message: 'Password changed successfully. Please login with your new password.'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController();