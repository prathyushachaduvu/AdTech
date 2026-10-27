const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Database configuration for Docker container
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'prathyu5454196',
  database: 'adtech_db',
  logging: false,
  dialectOptions: {
    ssl: false
  }
});

// Import models
const User = require('./src/models/User')(sequelize, DataTypes);
const Campaign = require('./src/models/Campaign')(sequelize, DataTypes);

async function createTestData() {
  try {
    console.log('🔗 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Create test user
    console.log('👤 Creating test user...');
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    const user = await User.create({
      id: uuidv4(),
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true, // Skip email verification
      status: 'active'
    });
    console.log('✅ Test user created:', user.id);
    
    // Create test campaign
    console.log('📊 Creating test campaign...');
    const campaign = await Campaign.create({
      id: uuidv4(),
      userId: user.id,
      name: 'Test Analytics Campaign',
      description: 'Campaign for testing analytics events',
      type: 'display',
      objective: 'awareness',
      budgetType: 'daily',
      budgetAmount: 100,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      timezone: 'America/New_York',
      status: 'active',
      tags: ['test', 'analytics'],
      settings: {
        bidStrategy: 'manual',
        targetCPA: 10
      }
    });
    console.log('✅ Test campaign created:', campaign.id);
    
    console.log('\n🎉 Test data created successfully!');
    console.log('📋 Test Credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: TestPassword123!');
    console.log('   User ID:', user.id);
    console.log('   Campaign ID:', campaign.id);
    
    // Test login to get token
    console.log('\n🔐 Testing login...');
    const axios = require('axios');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('🔑 Token:', token);
    
    // Test analytics event
    console.log('\n📈 Testing analytics event...');
    const eventResponse = await axios.post('http://localhost:3000/api/analytics/events', {
      eventType: 'impression',
      campaignId: campaign.id,
      metadata: {
        source: 'test',
        userAgent: 'Test Browser',
        ipAddress: '127.0.0.1'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Analytics event tracked:', eventResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    await sequelize.close();
  }
}

createTestData(); 