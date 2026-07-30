import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { checkDatabaseConnection } from './config/database.js';

const app = express();

const defaultOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://benevolent-vacherin-b7fcaf.netlify.app',
];

const envOrigins = (
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  ''
)
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked request from origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint for cloud platforms & monitoring
const handleHealthCheck = async (req, res) => {
  const isConnected = await checkDatabaseConnection();
  if (isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Aurence Luxury Hotel API is healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
};

app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    name: 'Aurence Luxury Hotel API',
    version: '1.0.0',
    health: '/api/health',
  });
});

app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// Mount central API routes under /api
app.use('/api', routes);

app.use(errorHandler);

export default app;
