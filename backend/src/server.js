import app from './app.js';
import { checkDatabaseConnection, sequelize } from './config/database.js';
import { seedInitialAdmin } from './controllers/authController.js';
import dotenv from 'dotenv';
import './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('🔄 Checking database connection before starting server...');
  const isConnected = await checkDatabaseConnection();

  if (!isConnected) {
    console.error('❌ Server startup aborted: Failed to connect to MySQL database.');
    process.exit(1);
  }

  try {
    await sequelize.sync();
    console.log('✅ Database models synchronized successfully.');

    await seedInitialAdmin();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Aurence Luxury Hotel Express Server running on port ${PORT} (0.0.0.0)`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer();

