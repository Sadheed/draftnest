import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';

// Import Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import { unknownEndpoint, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Global Middleware
app.use(cors({
  origin: env.CLIENT_URL,
}));
app.use(helmet());
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Try again later.' },
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts', postRoutes);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;