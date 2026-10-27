const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const BillingInfo = require('../models/BillingInfo');
const { Op } = require('sequelize');

class ProfileController {
  
  // Get complete user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'resetPasswordToken'] },
        include: [
          {
            model: UserProfile,
            as: 'profile',
            required: false
          },
          {
            model: BillingInfo,
            as: 'billingInfo',
            where: { isActive: true },
            required: false
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });

    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving profile'
      });
    }
  }

  // Update basic profile information
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      // Validate required fields
      const allowedFields = [
        'phoneNumber', 'dateOfBirth', 'gender', 'bio', 'timezone', 'language',
        'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country',
        'linkedinUrl', 'twitterUrl', 'githubUrl', 'skills', 'interests'
      ];

      const filteredData = {};
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      // Get or create profile
      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          ...filteredData
        });
      } else {
        await profile.update(filteredData);
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: profile
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating profile'
      });
    }
  }

  // Update company information
  async updateCompanyInfo(req, res) {
    try {
      const userId = req.user.userId;
      const companyData = req.body;

      const allowedFields = [
        'companyName', 'jobTitle', 'department', 'companyWebsite',
        'companySize', 'industry'
      ];

      const filteredData = {};
      allowedFields.forEach(field => {
        if (companyData[field] !== undefined) {
          filteredData[field] = companyData[field];
        }
      });

      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          ...filteredData
        });
      } else {
        await profile.update(filteredData);
      }

      res.json({
        success: true,
        message: 'Company information updated successfully',
        data: profile
      });

    } catch (error) {
      console.error('Error updating company info:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating company information'
      });
    }
  }

  // Update billing address
  async updateBillingAddress(req, res) {
    try {
      const userId = req.user.userId;
      const billingData = req.body;

      // Validate required fields
      const allowedFields = [
        'billingAddressLine1', 'billingAddressLine2', 'billingCity',
        'billingState', 'billingPostalCode', 'billingCountry', 'taxId'
      ];

      const filteredData = {};
      allowedFields.forEach(field => {
        if (billingData[field] !== undefined) {
          filteredData[field] = billingData[field];
        }
      });

      // Get or create profile
      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          ...filteredData
        });
      } else {
        await profile.update(filteredData);
      }

      res.json({
        success: true,
        message: 'Billing address updated successfully',
        data: profile
      });

    } catch (error) {
      console.error('Error updating billing address:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating billing address'
      });
    }
  }

  // Update preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.userId;
      const preferences = req.body;

      const allowedPreferences = ['emailNotifications', 'pushNotifications', 'privacySettings'];
      const filteredPreferences = {};

      allowedPreferences.forEach(prefType => {
        if (preferences[prefType] && typeof preferences[prefType] === 'object') {
          filteredPreferences[prefType] = preferences[prefType];
        }
      });

      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          ...filteredPreferences
        });
      } else {
        await profile.update(filteredPreferences);
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: profile
      });

    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating preferences'
      });
    }
  }

  // Add payment method
  async addPaymentMethod(req, res) {
    try {
      const userId = req.user.userId;
      const paymentData = req.body;

      // Validate required fields
      const requiredFields = [
        'paymentMethodType', 'paymentMethodName', 'billingName',
        'billingEmail', 'billingAddressLine1', 'billingCity',
        'billingState', 'billingPostalCode', 'billingCountry'
      ];

      for (const field of requiredFields) {
        if (!paymentData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }

      // If this is the first payment method, make it default
      const existingMethods = await BillingInfo.count({ where: { userId } });
      if (existingMethods === 0) {
        paymentData.isDefault = true;
      }

      // If setting as default, unset other defaults
      if (paymentData.isDefault) {
        await BillingInfo.update(
          { isDefault: false },
          { where: { userId, isDefault: true } }
        );
      }

      const paymentMethod = await BillingInfo.create({
        userId,
        ...paymentData
      });

      res.status(201).json({
        success: true,
        message: 'Payment method added successfully',
        data: paymentMethod
      });

    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while adding payment method'
      });
    }
  }

  // Get payment methods
  async getPaymentMethods(req, res) {
    try {
      const userId = req.user.userId;

      const paymentMethods = await BillingInfo.findAll({
        where: { userId, isActive: true },
        order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        message: 'Payment methods retrieved successfully',
        data: paymentMethods
      });

    } catch (error) {
      console.error('Error getting payment methods:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving payment methods'
      });
    }
  }

  // Update payment method
  async updatePaymentMethod(req, res) {
    try {
      const userId = req.user.userId;
      const { paymentMethodId } = req.params;
      const updateData = req.body;

      const paymentMethod = await BillingInfo.findOne({
        where: { id: paymentMethodId, userId }
      });

      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          message: 'Payment method not found'
        });
      }

      // If setting as default, unset other defaults
      if (updateData.isDefault) {
        await BillingInfo.update(
          { isDefault: false },
          { where: { userId, isDefault: true } }
        );
      }

      await paymentMethod.update(updateData);

      res.json({
        success: true,
        message: 'Payment method updated successfully',
        data: paymentMethod
      });

    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating payment method'
      });
    }
  }

  // Delete payment method
  async deletePaymentMethod(req, res) {
    try {
      const userId = req.user.userId;
      const { paymentMethodId } = req.params;

      const paymentMethod = await BillingInfo.findOne({
        where: { id: paymentMethodId, userId }
      });

      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          message: 'Payment method not found'
        });
      }

      // If deleting default method, set another as default
      if (paymentMethod.isDefault) {
        const nextDefault = await BillingInfo.findOne({
          where: { userId, isActive: true, id: { [Op.ne]: paymentMethodId } },
          order: [['createdAt', 'ASC']]
        });

        if (nextDefault) {
          await nextDefault.update({ isDefault: true });
        }
      }

      await paymentMethod.update({ isActive: false });

      res.json({
        success: true,
        message: 'Payment method deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting payment method'
      });
    }
  }

  // Upload profile picture
  async uploadProfilePicture(req, res) {
    try {
      const userId = req.user.userId;
      
      // This would typically handle file upload
      // For now, we'll assume the file URL is passed in the request
      const { profilePictureUrl } = req.body;

      if (!profilePictureUrl) {
        return res.status(400).json({
          success: false,
          message: 'Profile picture URL is required'
        });
      }

      let profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          profilePicture: profilePictureUrl
        });
      } else {
        await profile.update({ profilePicture: profilePictureUrl });
      }

      res.json({
        success: true,
        message: 'Profile picture updated successfully',
        data: { profilePicture: profilePictureUrl }
      });

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while uploading profile picture'
      });
    }
  }

  // Get profile completion status
  async getProfileCompletion(req, res) {
    try {
      const userId = req.user.userId;

      const profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        return res.json({
          success: true,
          data: {
            isComplete: false,
            completionPercentage: 0,
            missingFields: ['phoneNumber', 'companyName', 'jobTitle', 'addressLine1']
          }
        });
      }

      const completionPercentage = this.calculateCompletionPercentage(profile);
      const missingFields = this.getMissingFields(profile);

      res.json({
        success: true,
        data: {
          isComplete: profile.isProfileComplete,
          completionPercentage,
          missingFields
        }
      });

    } catch (error) {
      console.error('Error getting profile completion:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while getting profile completion'
      });
    }
  }

  // Helper method to calculate completion percentage
  calculateCompletionPercentage(profile) {
    const totalFields = 10;
    let completedFields = 0;

    const importantFields = [
      'phoneNumber', 'dateOfBirth', 'gender', 'bio',
      'companyName', 'jobTitle', 'department',
      'addressLine1', 'city', 'country'
    ];

    importantFields.forEach(field => {
      if (profile[field] && profile[field].toString().trim() !== '') {
        completedFields++;
      }
    });

    return Math.round((completedFields / totalFields) * 100);
  }

  // Helper method to get missing fields
  getMissingFields(profile) {
    const requiredFields = [
      'phoneNumber', 'dateOfBirth', 'gender', 'bio',
      'companyName', 'jobTitle', 'department',
      'addressLine1', 'city', 'country'
    ];

    return requiredFields.filter(field => 
      !profile[field] || profile[field].toString().trim() === ''
    );
  }
}

module.exports = new ProfileController(); 