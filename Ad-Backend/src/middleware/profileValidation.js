const { body, validationResult } = require('express-validator');

// Validation rules for basic profile updates
const profileValidation = [
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Please select a valid gender'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  
  body('timezone')
    .optional()
    .isString()
    .withMessage('Please provide a valid timezone'),
  
  body('language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'])
    .withMessage('Please select a valid language'),
  
  body('addressLine1')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address line 1 must be between 5 and 200 characters'),
  
  body('addressLine2')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address line 2 must be less than 200 characters'),
  
  body('city')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('state')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  
  body('postalCode')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Postal code must be between 3 and 20 characters'),
  
  body('country')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  
  body('linkedinUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  
  body('twitterUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  
  body('interests.*')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each interest must be between 1 and 50 characters')
];

// Validation rules for company information
const companyValidation = [
  body('companyName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('jobTitle')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Job title must be between 2 and 100 characters'),
  
  body('department')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  
  body('companyWebsite')
    .optional()
    .isURL()
    .withMessage('Please provide a valid company website URL'),
  
  body('companySize')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Please select a valid company size'),
  
  body('industry')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Industry must be between 2 and 100 characters')
];

// Validation rules for billing address
const billingAddressValidation = [
  body('billingAddressLine1')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Billing address line 1 must be between 5 and 200 characters'),
  
  body('billingAddressLine2')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Billing address line 2 must be less than 200 characters'),
  
  body('billingCity')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing city must be between 2 and 100 characters'),
  
  body('billingState')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing state must be between 2 and 100 characters'),
  
  body('billingPostalCode')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Billing postal code must be between 3 and 20 characters'),
  
  body('billingCountry')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing country must be between 2 and 100 characters'),
  
  body('taxId')
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tax ID must be between 5 and 50 characters')
];

// Validation rules for preferences
const preferencesValidation = [
  body('emailNotifications')
    .optional()
    .isObject()
    .withMessage('Email notifications must be an object'),
  
  body('emailNotifications.marketing')
    .optional()
    .isBoolean()
    .withMessage('Marketing email preference must be a boolean'),
  
  body('emailNotifications.security')
    .optional()
    .isBoolean()
    .withMessage('Security email preference must be a boolean'),
  
  body('emailNotifications.updates')
    .optional()
    .isBoolean()
    .withMessage('Updates email preference must be a boolean'),
  
  body('emailNotifications.newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter email preference must be a boolean'),
  
  body('pushNotifications')
    .optional()
    .isObject()
    .withMessage('Push notifications must be an object'),
  
  body('pushNotifications.enabled')
    .optional()
    .isBoolean()
    .withMessage('Push notifications enabled must be a boolean'),
  
  body('pushNotifications.marketing')
    .optional()
    .isBoolean()
    .withMessage('Marketing push preference must be a boolean'),
  
  body('pushNotifications.security')
    .optional()
    .isBoolean()
    .withMessage('Security push preference must be a boolean'),
  
  body('pushNotifications.updates')
    .optional()
    .isBoolean()
    .withMessage('Updates push preference must be a boolean'),
  
  body('privacySettings')
    .optional()
    .isObject()
    .withMessage('Privacy settings must be an object'),
  
  body('privacySettings.profileVisibility')
    .optional()
    .isIn(['public', 'private', 'friends'])
    .withMessage('Profile visibility must be public, private, or friends'),
  
  body('privacySettings.showEmail')
    .optional()
    .isBoolean()
    .withMessage('Show email preference must be a boolean'),
  
  body('privacySettings.showPhone')
    .optional()
    .isBoolean()
    .withMessage('Show phone preference must be a boolean'),
  
  body('privacySettings.allowContact')
    .optional()
    .isBoolean()
    .withMessage('Allow contact preference must be a boolean')
];

// Validation rules for payment methods
const paymentMethodValidation = [
  body('paymentMethodType')
    .isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe'])
    .withMessage('Please select a valid payment method type'),
  
  body('paymentMethodName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Payment method name must be between 2 and 100 characters'),
  
  body('cardLastFour')
    .optional()
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage('Card last four digits must be exactly 4 digits'),
  
  body('cardBrand')
    .optional()
    .isIn(['visa', 'mastercard', 'amex', 'discover', 'other'])
    .withMessage('Please select a valid card brand'),
  
  body('cardExpiryMonth')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Card expiry month must be between 1 and 12'),
  
  body('cardExpiryYear')
    .optional()
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 20 })
    .withMessage('Card expiry year must be valid'),
  
  body('billingName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing name must be between 2 and 100 characters'),
  
  body('billingEmail')
    .isEmail()
    .withMessage('Please provide a valid billing email'),
  
  body('billingPhone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid billing phone number'),
  
  body('billingAddressLine1')
    .isLength({ min: 5, max: 200 })
    .withMessage('Billing address line 1 must be between 5 and 200 characters'),
  
  body('billingAddressLine2')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Billing address line 2 must be less than 200 characters'),
  
  body('billingCity')
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing city must be between 2 and 100 characters'),
  
  body('billingState')
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing state must be between 2 and 100 characters'),
  
  body('billingPostalCode')
    .isLength({ min: 3, max: 20 })
    .withMessage('Billing postal code must be between 3 and 20 characters'),
  
  body('billingCountry')
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing country must be between 2 and 100 characters'),
  
  body('taxId')
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tax ID must be between 5 and 50 characters'),
  
  body('taxExempt')
    .optional()
    .isBoolean()
    .withMessage('Tax exempt must be a boolean'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

// Validation rules for payment method updates
const paymentMethodUpdateValidation = [
  body('paymentMethodName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Payment method name must be between 2 and 100 characters'),
  
  body('billingName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing name must be between 2 and 100 characters'),
  
  body('billingEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid billing email'),
  
  body('billingPhone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid billing phone number'),
  
  body('billingAddressLine1')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Billing address line 1 must be between 5 and 200 characters'),
  
  body('billingAddressLine2')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Billing address line 2 must be less than 200 characters'),
  
  body('billingCity')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing city must be between 2 and 100 characters'),
  
  body('billingState')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing state must be between 2 and 100 characters'),
  
  body('billingPostalCode')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Billing postal code must be between 3 and 20 characters'),
  
  body('billingCountry')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Billing country must be between 2 and 100 characters'),
  
  body('taxId')
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tax ID must be between 5 and 50 characters'),
  
  body('taxExempt')
    .optional()
    .isBoolean()
    .withMessage('Tax exempt must be a boolean'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('Is default must be a boolean'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  profileValidation,
  companyValidation,
  billingAddressValidation,
  preferencesValidation,
  paymentMethodValidation,
  paymentMethodUpdateValidation,
  handleValidationErrors
}; 