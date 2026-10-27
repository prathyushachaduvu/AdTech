const BillingInfo = require('../models/BillingInfo');
const { Op } = require('sequelize');

class BillingController {
  
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

  // Set default payment method
  async setDefaultPaymentMethod(req, res) {
    try {
      const userId = req.user.userId;
      const { paymentMethodId } = req.params;

      const paymentMethod = await BillingInfo.findOne({
        where: { id: paymentMethodId, userId, isActive: true }
      });

      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          message: 'Payment method not found'
        });
      }

      // Unset all other defaults
      await BillingInfo.update(
        { isDefault: false },
        { where: { userId, isActive: true } }
      );

      // Set this as default
      await paymentMethod.update({ isDefault: true });

      res.json({
        success: true,
        message: 'Default payment method updated successfully',
        data: paymentMethod
      });

    } catch (error) {
      console.error('Error setting default payment method:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while setting default payment method'
      });
    }
  }

  // Get billing summary
  async getBillingSummary(req, res) {
    try {
      const userId = req.user.userId;

      const paymentMethods = await BillingInfo.findAll({
        where: { userId, isActive: true },
        order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
      });

      const defaultMethod = paymentMethods.find(method => method.isDefault);
      const totalMethods = paymentMethods.length;

      res.json({
        success: true,
        message: 'Billing summary retrieved successfully',
        data: {
          totalPaymentMethods: totalMethods,
          hasDefaultMethod: !!defaultMethod,
          defaultMethod: defaultMethod ? {
            id: defaultMethod.id,
            paymentMethodType: defaultMethod.paymentMethodType,
            paymentMethodName: defaultMethod.paymentMethodName,
            cardLastFour: defaultMethod.cardLastFour,
            cardBrand: defaultMethod.cardBrand
          } : null,
          allMethods: paymentMethods.map(method => ({
            id: method.id,
            paymentMethodType: method.paymentMethodType,
            paymentMethodName: method.paymentMethodName,
            cardLastFour: method.cardLastFour,
            cardBrand: method.cardBrand,
            isDefault: method.isDefault,
            isActive: method.isActive
          }))
        }
      });

    } catch (error) {
      console.error('Error getting billing summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving billing summary'
      });
    }
  }
}

module.exports = new BillingController(); 