const { body, param, query, validationResult } = require('express-validator');

// Helper function to handle validation errors
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

// Campaign creation validation
const createCampaignValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Campaign name is required and must be between 1 and 255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('type')
    .isIn(['display', 'video', 'social', 'search', 'native', 'email'])
    .withMessage('Campaign type must be one of: display, video, social, search, native, email'),
  
  body('objective')
    .isIn(['awareness', 'consideration', 'conversions', 'traffic', 'engagement', 'app_installs'])
    .withMessage('Campaign objective must be one of: awareness, consideration, conversions, traffic, engagement, app_installs'),
  
  body('budgetType')
    .isIn(['daily', 'lifetime', 'monthly'])
    .withMessage('Budget type must be one of: daily, lifetime, monthly'),
  
  body('budgetAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Budget amount must be a positive number greater than 0'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date')
    .custom((value) => {
      const startDate = new Date(value);
      const now = new Date();
      if (startDate < now) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('timezone')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Timezone must be less than 50 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value && value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      if (value) {
        for (const tag of value) {
          if (typeof tag !== 'string' || tag.length > 50) {
            throw new Error('Each tag must be a string with maximum 50 characters');
          }
        }
      }
      return true;
    }),
  
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  
  handleValidationErrors
];

// Campaign update validation
const updateCampaignValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid campaign ID format'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Campaign name must be between 1 and 255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('type')
    .optional()
    .isIn(['display', 'video', 'social', 'search', 'native', 'email'])
    .withMessage('Campaign type must be one of: display, video, social, search, native, email'),
  
  body('objective')
    .optional()
    .isIn(['awareness', 'consideration', 'conversions', 'traffic', 'engagement', 'app_installs'])
    .withMessage('Campaign objective must be one of: awareness, consideration, conversions, traffic, engagement, app_installs'),
  
  body('budgetType')
    .optional()
    .isIn(['daily', 'lifetime', 'monthly'])
    .withMessage('Budget type must be one of: daily, lifetime, monthly'),
  
  body('budgetAmount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Budget amount must be a positive number greater than 0'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),
  
  body('timezone')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Timezone must be less than 50 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (value && value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      if (value) {
        for (const tag of value) {
          if (typeof tag !== 'string' || tag.length > 50) {
            throw new Error('Each tag must be a string with maximum 50 characters');
          }
        }
      }
      return true;
    }),
  
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  
  handleValidationErrors
];

// Campaign status update validation
const updateStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid campaign ID format'),
  
  body('status')
    .isIn(['draft', 'pending', 'active', 'paused', 'completed', 'cancelled'])
    .withMessage('Status must be one of: draft, pending, active, paused, completed, cancelled'),
  
  handleValidationErrors
];

// Campaign query validation (for filtering and pagination)
const campaignQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['draft', 'pending', 'active', 'paused', 'completed', 'cancelled'])
    .withMessage('Invalid status filter'),
  
  query('type')
    .optional()
    .isIn(['display', 'video', 'social', 'search', 'native', 'email'])
    .withMessage('Invalid type filter'),
  
  query('objective')
    .optional()
    .isIn(['awareness', 'consideration', 'conversions', 'traffic', 'engagement', 'app_installs'])
    .withMessage('Invalid objective filter'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'status', 'type', 'objective', 'budgetAmount', 'startDate', 'endDate', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
  
  handleValidationErrors
];

// Campaign ID validation
const campaignIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid campaign ID format'),
  
  handleValidationErrors
];

// Campaign ID validation for routes using campaignId parameter
const campaignIdParamValidation = [
  param('campaignId')
    .isUUID()
    .withMessage('Invalid campaign ID format'),
  
  handleValidationErrors
];

// Bulk operations validation
const bulkUpdateValidation = [
  body('campaignIds')
    .isArray({ min: 1 })
    .withMessage('Campaign IDs must be a non-empty array')
    .custom((value) => {
      for (const id of value) {
        if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('All campaign IDs must be valid UUIDs');
        }
      }
      return true;
    }),
  
  body('updates')
    .isObject()
    .withMessage('Updates must be an object')
    .custom((value) => {
      const allowedFields = ['status', 'tags', 'isActive', 'budgetAmount', 'budgetType'];
      for (const field of Object.keys(value)) {
        if (!allowedFields.includes(field)) {
          throw new Error(`Field '${field}' is not allowed for bulk updates`);
        }
      }
      return true;
    }),
  
  handleValidationErrors
];

const bulkDeleteValidation = [
  body('campaignIds')
    .isArray({ min: 1 })
    .withMessage('Campaign IDs must be a non-empty array')
    .custom((value) => {
      for (const id of value) {
        if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('All campaign IDs must be valid UUIDs');
        }
      }
      return true;
    }),
  
  handleValidationErrors
];

// Campaign metrics validation
const updateMetricsValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid campaign ID format'),
  
  body('impressions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Impressions must be a non-negative integer'),
  
  body('clicks')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Clicks must be a non-negative integer'),
  
  body('conversions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Conversions must be a non-negative integer'),
  
  body('spend')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Spend must be a non-negative number'),
  
  handleValidationErrors
];

// Export format validation
const exportFormatValidation = [
  param('format')
    .isIn(['csv', 'json'])
    .withMessage('Export format must be either csv or json'),
  
  handleValidationErrors
];

module.exports = {
  createCampaignValidation,
  updateCampaignValidation,
  updateStatusValidation,
  campaignQueryValidation,
  campaignIdValidation,
  campaignIdParamValidation,
  bulkUpdateValidation,
  bulkDeleteValidation,
  updateMetricsValidation,
  exportFormatValidation
}; 