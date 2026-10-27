const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const billingController = require('../controllers/billingController');
const { authenticateToken } = require('../middleware/auth');
const { trackSessionActivity } = require('../middleware/session');
const {
  profileValidation,
  companyValidation,
  billingAddressValidation,
  preferencesValidation,
  paymentMethodValidation,
  paymentMethodUpdateValidation,
  handleValidationErrors
} = require('../middleware/profileValidation');

// Apply authentication and session tracking to all routes
router.use(authenticateToken);
router.use(trackSessionActivity);

// Profile Management Routes
router.get('/', profileController.getProfile);
router.put('/', profileValidation, handleValidationErrors, profileController.updateProfile);
router.get('/completion', profileController.getProfileCompletion);

// Company Information Routes
router.put('/company', companyValidation, handleValidationErrors, profileController.updateCompanyInfo);

// Preferences Routes
router.put('/preferences', preferencesValidation, handleValidationErrors, profileController.updatePreferences);

// Billing Address Routes (in profile)
router.put('/billing-address', billingAddressValidation, handleValidationErrors, profileController.updateBillingAddress);

// Payment Methods Routes
router.post('/payment-methods', paymentMethodValidation, handleValidationErrors, billingController.addPaymentMethod);
router.get('/payment-methods', billingController.getPaymentMethods);
router.get('/payment-methods/summary', billingController.getBillingSummary);
router.put('/payment-methods/:paymentMethodId', paymentMethodUpdateValidation, handleValidationErrors, billingController.updatePaymentMethod);
router.delete('/payment-methods/:paymentMethodId', billingController.deletePaymentMethod);
router.put('/payment-methods/:paymentMethodId/default', billingController.setDefaultPaymentMethod);

module.exports = router; 