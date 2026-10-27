const express = require('express');
const analyticsRoutes = require('./src/routes/analytics');

console.log('Testing analytics routes import...');
console.log('Analytics routes type:', typeof analyticsRoutes);
console.log('Analytics routes:', analyticsRoutes);

// Create a simple test app
const app = express();
app.use('/api/analytics', analyticsRoutes);

// Test if the route is registered
console.log('\nRegistered routes:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(`${Object.keys(handler.route.methods)} ${handler.route.path}`);
      }
    });
  }
});

console.log('\nTest completed.'); 