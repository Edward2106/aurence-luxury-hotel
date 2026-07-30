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
  'https://benevolent-vacherin-b7fcaf.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
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
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With'
  ],
  optionsSuccessStatus: 204
};

// Register single authoritative CORS middleware BEFORE express.json(), routes, and error handlers
app.use(cors(corsOptions));

// HTTP Request Logger for Production Debugging (safely logs method, path, origin without secrets)
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path} Origin: ${req.headers.origin || 'none'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check handler
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
