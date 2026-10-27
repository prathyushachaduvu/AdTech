const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  registerValidation, 
  loginValidation, 
  resendVerificationValidation,
  passwordResetValidation,
  changePasswordValidation
} = require('../middleware/validation');
const { 
  authenticateToken
} = require('../middleware/auth');
const { trackSessionActivity, extractDeviceInfo } = require('../middleware/session');

// Public routes (no authentication required)
router.post('/register', registerValidation, authController.register);
router.post('/login', extractDeviceInfo, loginValidation, authController.login);
router.post('/resend-verification', resendVerificationValidation, authController.resendVerification);
router.get('/verify-email/:token', authController.verifyEmail);

// Password reset routes (public)
router.post('/forgot-password', passwordResetValidation, authController.requestPasswordReset);
router.post('/reset-password', passwordResetValidation, authController.resetPassword);

// Token management routes
router.post('/refresh-token', authController.refreshToken);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, trackSessionActivity, authController.getProfile);
router.post('/logout', authenticateToken, trackSessionActivity, authController.logout);
router.post('/logout-all', authenticateToken, trackSessionActivity, authController.logoutAllDevices);
router.get('/sessions', authenticateToken, trackSessionActivity, authController.getUserSessions);
router.post('/change-password', authenticateToken, trackSessionActivity, changePasswordValidation, authController.changePassword);

module.exports = router; 