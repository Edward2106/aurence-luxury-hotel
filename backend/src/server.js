import app from './app.js';
import { checkDatabaseConnection, sequelize, host, port, dbName, dbUser } from './config/database.js';
import { seedInitialAdmin } from './controllers/authController.js';
import dotenv from 'dotenv';
import './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  console.log('=== AURENCE LUXURY HOTEL BACKEND STARTUP ===');
  console.log(`- Environment:   ${NODE_ENV}`);
  console.log(`- Database Host: ${host}`);
  console.log(`- Database Port: ${port}`);
  console.log(`- Database Name: ${dbName}`);
  console.log(`- Database User: ${dbUser}`);
  console.log(`- Server Port:   ${PORT}`);

  console.log('📋 Registered API Routes:');
  console.log('  - GET  /health');
  console.log('  - GET  /api/health');
  console.log('  - POST /api/auth/register');
  console.log('  - POST /api/auth/login');
  console.log('  - GET  /api/auth/me');
  console.log('  - GET  /api/hotels');
  console.log('  - GET  /api/hotels/:id');
  console.log('  - GET  /api/rooms');
  console.log('  - POST /api/bookings');
  console.log('  - GET  /api/admin/employees');

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
      console.log(`🚀 Aurence Luxury Hotel Express Server listening on 0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer();
