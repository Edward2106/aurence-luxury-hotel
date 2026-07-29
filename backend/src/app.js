import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { checkDatabaseConnection } from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (req, res) => {
  const isConnected = await checkDatabaseConnection();
  if (isConnected) {
    return res.status(200).json({
      success: true,
      database: 'connected',
    });
  } else {
    return res.status(500).json({
      success: false,
      database: 'disconnected',
    });
  }
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
