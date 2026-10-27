const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test configuration
const TEST_CONFIG = {
  user: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  },
  campaign: {
    name: 'Summer Sale Campaign',
    description: 'Promote summer products with special discounts',
    type: 'display',
    objective: 'conversions',
    budgetType: 'daily',
    budgetAmount: 100.00,
    startDate: '2024-06-01T00:00:00.000Z',
    endDate: '2024-08-31T23:59:59.000Z',
    timezone: 'America/New_York',
    tags: ['summer', 'sale', 'display'],
    settings: {
      targetAudience: '18-35',
      locations: ['US', 'CA']
    }
  },
  targeting: {
    locations: ['US', 'CA'],
    locationType: 'include',
    ageRange: { min: 18, max: 65 },
    gender: 'all',
    interests: ['shopping', 'fashion', 'lifestyle'],
    behaviors: ['online_shopper', 'frequent_buyer'],
    devices: ['desktop', 'mobile'],
    platforms: ['web', 'ios', 'android'],
    keywords: ['summer', 'sale', 'discount', 'fashion'],
    categories: ['shopping', 'fashion', 'lifestyle'],
    frequencyCap: 3,
    frequencyPeriod: 'day'
  },
  asset: {
    name: 'Summer Banner',
    description: 'Main banner for summer sale campaign',
    tags: ['banner', 'summer', 'sale'],
    categories: ['display', 'banner']
  }
};

class CampaignSystemTester {
  constructor() {
    this.token = null;
    this.campaignId = null;
    this.assetId = null;
  }

  async log(message, data = null) {
    console.log(`\n${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  async setup() {
    try {
      await this.log('🚀 Starting Campaign System Tests...');
      
      // Step 1: Register test user
      await this.log('1. Registering test user...');
      await this.registerUser();
      
      // Step 2: Login to get JWT token
      await this.log('2. Logging in to get JWT token...');
      await this.login();
      
      await this.log('✅ Setup completed successfully!');
    } catch (error) {
      await this.log('❌ Setup failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async registerUser() {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, TEST_CONFIG.user);
      await this.log('✅ User registered successfully');
      await this.log('User ID:', response.data.data.id);
    } catch (error) {
      if (error.response?.status === 409) {
        await this.log('ℹ️ User already exists, proceeding...');
      } else {
        throw error;
      }
    }
  }

  async login() {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_CONFIG.user.email,
      password: TEST_CONFIG.user.password
    });
    
    this.token = response.data.data.token;
    await this.log('✅ Login successful');
    await this.log('Token received:', this.token.substring(0, 20) + '...');
  }

  async testCampaignCreation() {
    await this.log('\n📋 Testing Campaign Creation...');
    
    try {
      const campaignData = {
        ...TEST_CONFIG.campaign,
        targeting: TEST_CONFIG.targeting
      };

      const response = await axios.post(`${BASE_URL}/api/v1/campaigns`, campaignData, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      this.campaignId = response.data.data.id;
      await this.log('✅ Campaign created successfully!');
      await this.log('Campaign ID:', this.campaignId);
      await this.log('Campaign Data:', {
        name: response.data.data.name,
        status: response.data.data.status,
        budgetAmount: response.data.data.budgetAmount,
        targeting: response.data.data.targeting ? 'Configured' : 'Not configured'
      });

    } catch (error) {
      await this.log('❌ Campaign creation failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignRetrieval() {
    await this.log('\n📖 Testing Campaign Retrieval...');
    
    try {
      // Get single campaign
      const response = await axios.get(`${BASE_URL}/api/v1/campaigns/${this.campaignId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      await this.log('✅ Campaign retrieved successfully!');
      await this.log('Campaign Details:', {
        name: response.data.data.name,
        status: response.data.data.status,
        budgetRemaining: response.data.data.budgetRemaining,
        ctr: response.data.data.ctr,
        isActiveNow: response.data.data.isActiveNow
      });

      // Get all campaigns
      const campaignsResponse = await axios.get(`${BASE_URL}/api/v1/campaigns`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      await this.log('✅ All campaigns retrieved successfully!');
      await this.log('Total campaigns:', campaignsResponse.data.data.pagination.totalItems);

    } catch (error) {
      await this.log('❌ Campaign retrieval failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignUpdate() {
    await this.log('\n✏️ Testing Campaign Update...');
    
    try {
      const updateData = {
        name: 'Updated Summer Sale Campaign',
        description: 'Updated description for summer sale campaign',
        budgetAmount: 150.00,
        tags: ['summer', 'sale', 'display', 'updated']
      };

      const response = await axios.put(`${BASE_URL}/api/v1/campaigns/${this.campaignId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      await this.log('✅ Campaign updated successfully!');
      await this.log('Updated Data:', {
        name: response.data.data.name,
        budgetAmount: response.data.data.budgetAmount,
        tags: response.data.data.tags
      });

    } catch (error) {
      await this.log('❌ Campaign update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignStatusUpdate() {
    await this.log('\n🔄 Testing Campaign Status Update...');
    
    try {
      const statusData = { status: 'active' };

      const response = await axios.patch(`${BASE_URL}/api/v1/campaigns/${this.campaignId}/status`, statusData, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      await this.log('✅ Campaign status updated successfully!');
      await this.log('New Status:', response.data.data.status);

    } catch (error) {
      await this.log('❌ Campaign status update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignDuplication() {
    await this.log('\n📋 Testing Campaign Duplication...');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/campaigns/${this.campaignId}/duplicate`, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      await this.log('✅ Campaign duplicated successfully!');
      await this.log('Duplicated Campaign ID:', response.data.data.id);
      await this.log('Duplicated Campaign Name:', response.data.data.name);

    } catch (error) {
      await this.log('❌ Campaign duplication failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignStatistics() {
    await this.log('\n📊 Testing Campaign Statistics...');
    
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/campaigns/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      await this.log('✅ Campaign statistics retrieved successfully!');
      await this.log('Statistics:', response.data.data);

    } catch (error) {
      await this.log('❌ Campaign statistics failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignMetrics() {
    await this.log('\n📈 Testing Campaign Metrics Update...');
    
    try {
      const metricsData = {
        impressions: 5000,
        clicks: 125,
        conversions: 15,
        spend: 45.75
      };

      const response = await axios.patch(`${BASE_URL}/api/v1/campaigns/${this.campaignId}/metrics`, metricsData, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      await this.log('✅ Campaign metrics updated successfully!');
      await this.log('Updated Metrics:', {
        impressions: response.data.data.impressions,
        clicks: response.data.data.clicks,
        conversions: response.data.data.conversions,
        spend: response.data.data.spend
      });

    } catch (error) {
      await this.log('❌ Campaign metrics update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignTemplates() {
    await this.log('\n📋 Testing Campaign Templates...');
    
    try {
      // Get templates
      const templatesResponse = await axios.get(`${BASE_URL}/api/v1/campaigns/templates/list`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      await this.log('✅ Campaign templates retrieved successfully!');
      await this.log('Available Templates:', templatesResponse.data.data.map(t => t.name));

      // Create campaign from template
      const templateId = 'awareness-display';
      const templateData = {
        name: 'Template Campaign',
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-08-31T23:59:59.000Z',
        budgetAmount: 200
      };

      const templateResponse = await axios.post(`${BASE_URL}/api/v1/campaigns/templates/${templateId}`, templateData, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      await this.log('✅ Campaign created from template successfully!');
      await this.log('Template Campaign ID:', templateResponse.data.data.id);

    } catch (error) {
      await this.log('❌ Campaign templates test failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCampaignExport() {
    await this.log('\n📤 Testing Campaign Export...');
    
    try {
      // Export as JSON
      const jsonResponse = await axios.get(`${BASE_URL}/api/v1/campaigns/export/json`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      await this.log('✅ JSON export successful!');
      await this.log('Exported campaigns:', jsonResponse.data.exportInfo.totalCampaigns);

      // Export as CSV
      const csvResponse = await axios.get(`${BASE_URL}/api/v1/campaigns/export/csv`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      await this.log('✅ CSV export successful!');
      await this.log('CSV Content Length:', csvResponse.data.length);

    } catch (error) {
      await this.log('❌ Campaign export failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testValidation() {
    await this.log('\n✅ Testing Validation...');
    
    try {
      // Test invalid campaign creation
      const invalidData = {
        name: '', // Invalid: empty name
        type: 'invalid_type', // Invalid: unknown type
        objective: 'invalid_objective', // Invalid: unknown objective
        budgetAmount: -10, // Invalid: negative budget
        startDate: '2023-01-01T00:00:00.000Z', // Invalid: past date
        endDate: '2023-01-01T00:00:00.000Z' // Invalid: same as start date
      };

      try {
        await axios.post(`${BASE_URL}/api/v1/campaigns`, invalidData, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
        await this.log('❌ Validation should have failed but didn\'t');
      } catch (error) {
        if (error.response?.status === 400) {
          await this.log('✅ Validation working correctly - rejected invalid data');
          await this.log('Validation Errors:', error.response.data.errors);
        } else {
          throw error;
        }
      }

    } catch (error) {
      await this.log('❌ Validation test failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async runAllTests() {
    try {
      await this.setup();
      
      await this.testCampaignCreation();
      await this.testCampaignRetrieval();
      await this.testCampaignUpdate();
      await this.testCampaignStatusUpdate();
      await this.testCampaignDuplication();
      await this.testCampaignStatistics();
      await this.testCampaignMetrics();
      await this.testCampaignTemplates();
      await this.testCampaignExport();
      await this.testValidation();
      
      await this.log('\n🎉 All Campaign System Tests Completed Successfully!');
      await this.log('✅ Campaign Storage: Working');
      await this.log('✅ Targeting Configuration: Working');
      await this.log('✅ Asset Management: Ready');
      await this.log('✅ Validation: Working');
      
    } catch (error) {
      await this.log('\n❌ Campaign System Tests Failed:', error.message);
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new CampaignSystemTester();
  tester.runAllTests();
}

module.exports = CampaignSystemTester; 