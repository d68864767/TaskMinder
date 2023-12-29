// config.js

module.exports = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/taskminder',
  secret: process.env.JWT_SECRET || 'your-secret-key',
  taskMinderApiKey: process.env.TASKMINDER_API_KEY || 'your-taskminder-api-key',
  socketIoOptions: {
    cors: {
      origin: '*',
    },
  },
};
