const initializeDatabase = require('./src/config/initDatabase');

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    const sequelize = require('./src/config/database');
    
    // Drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log('✅ Database reset completed successfully!');
    
    // Re-initialize with associations
    await initializeDatabase();
    console.log('✅ Database re-initialized with associations!');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase; 