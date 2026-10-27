const { Client } = require('pg');

async function testConnection() {
  console.log('Testing PostgreSQL connection to Docker container...');
  
  const configs = [
    {
      name: 'Docker Container IP',
      host: '172.18.0.3',
      port: 5432,
      database: 'privacy_adtech',
      user: 'postgres',
      password: 'prathyu5454196'
    },
    {
      name: 'Localhost with Docker Port',
      host: 'localhost',
      port: 5432,
      database: 'privacy_adtech',
      user: 'postgres',
      password: 'prathyu5454196'
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