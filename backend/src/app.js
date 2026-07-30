import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { checkDatabaseConnection } from './config/database.js';

const app = express();

function sanitizeOrigin(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  let clean = urlStr.trim().replace(/['"]/g, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
}

const defaultOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5000',
  'http://localhost:5000',
  'https://benevolent-vacherin-b7fcaf.netlify.app',
];

const envRaw = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URLS,
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .join(',');

const envOrigins = envRaw
  .split(',')
  .map(sanitizeOrigin)
  .filter(Boolean);

export const allowedOrigins = Array.from(
  new Set([...defaultOrigins.map(sanitizeOrigin), ...envOrigins])
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests with no origin (e.g. mobile apps, curl, server health checks)
    if (!origin) {
      return callback(null, true);
    }

    const cleanReqOrigin = sanitizeOrigin(origin);
    if (allowedOrigins.includes(cleanReqOrigin)) {
      return callback(null, true);
    }

    // Do NOT throw an error; return false so CORS headers are omitted cleanly
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Register CORS middleware before all routes and handlers
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
