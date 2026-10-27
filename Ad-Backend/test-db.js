const { Client } = require('pg');

async function testConnection() {
  console.log('Testing PostgreSQL connection...');
  
  const configs = [
    {
      name: 'Docker PostgreSQL',
      host: 'localhost',
      port: 5432,
      database: 'privacy_adtech',
      user: 'postgres',
      password: 'prathyu5454196'
    },
    {
      name: 'Default PostgreSQL',
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'postgres'
    }
  ];

  for (const config of configs) {
    console.log(`\nTesting ${config.name}...`);
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log(`✅ ${config.name} connection successful!`);
      
      const result = await client.query('SELECT current_database(), current_user;');
      console.log(`Database: ${result.rows[0].current_database}`);
      console.log(`User: ${result.rows[0].current_user}`);
      
      await client.end();
    } catch (error) {
      console.log(`❌ ${config.name} connection failed:`, error.message);
    }
  }
}

testConnection(); 