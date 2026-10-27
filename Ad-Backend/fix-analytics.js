const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Connect to Docker PostgreSQL
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'prathyu5454196',
  database: 'adtech_db'
});

async function fixAnalytics() {
  try {
    console.log('🔗 Connecting to Docker database...');
    await client.connect();
    console.log('✅ Connected to database');
    
    // Create test user
    console.log('👤 Creating test user...');
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash('Test123!', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password, "firstName", "lastName", "emailVerified", status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [userId, 'analytics@test.com', hashedPassword, 'Analytics', 'Test', true, 'active']);
    
    console.log('✅ Test user created:', userId);
    
    // Create test campaign
    console.log('📊 Creating test campaign...');
    const campaignId = uuidv4();
    
    await client.query(`
      INSERT INTO campaigns (id, "userId", name, description, type, objective, "budgetType", "budgetAmount", "startDate", "endDate", timezone, status, tags, settings, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
    `, [
      campaignId,
      userId,
      'Analytics Test Campaign',
      'Campaign for testing analytics events',
      'display',
      'awareness',
      'daily',
      100,
      '2024-01-01',
      '2024-12-31',
      'America/New_York',
      'active',
      ['test', 'analytics'],
      JSON.stringify({ bidStrategy: 'manual', targetCPA: 10 })
    ]);
    
    console.log('✅ Test campaign created:', campaignId);
    
    console.log('\n🎉 Test data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: analytics@test.com');
    console.log('   Password: Test123!');
    console.log('   User ID:', userId);
    console.log('   Campaign ID:', campaignId);
    
    // Test login
    console.log('\n🔐 Testing login...');
    const axios = require('axios');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'analytics@test.com',
      password: 'Test123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('🔑 Token:', token);
    
    // Test analytics event
    console.log('\n📈 Testing analytics event...');
    const eventResponse = await axios.post('http://localhost:3000/api/analytics/events', {
      eventType: 'impression',
      campaignId: campaignId,
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
    
    console.log('✅ Analytics event tracked successfully!');
    console.log('Response:', eventResponse.data);
    
    console.log('\n🎉 SUCCESS! Your analytics endpoint is now working.');
    console.log('\n📝 Use this campaign ID for your analytics requests:');
    console.log('   Campaign ID:', campaignId);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    await client.end();
  }
}

fixAnalytics(); 