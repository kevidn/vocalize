import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { storageService } from './services/storage.service';
import audioRoutes from './routes/audio.routes';
import { logger } from './utils/logger';

// ─── App setup ─────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT ?? 3001;

// ─── Ensure uploads directory exists ───────────────────────────────────────

storageService.ensureUploadDir();

// ─── Global Middlewares ─────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);

// ─── Static: serve processed audio previews (optional future use) ───────────

app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR ?? 'uploads')));

// ─── API Routes ─────────────────────────────────────────────────────────────

app.use('/api/audio', audioRoutes);

// ─── Root health check ──────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'vocalize-backend',
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 handler ────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
    meta: { timestamp: new Date().toISOString() },
  });
});

// ─── Global error handler (MUST be last) ────────────────────────────────────

app.use(errorMiddleware);

// ─── Start server ────────────────────────────────────────────────────────────

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.success(`🎙️  Vocalize backend ready on http://localhost:${PORT}`);
    logger.info(`   Environment : ${process.env.NODE_ENV ?? 'development'}`);
    logger.info(`   CORS origin : ${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}`);
    logger.info(`   Upload dir  : ${path.resolve(process.env.UPLOAD_DIR ?? 'uploads')}`);
    logger.info(`   Endpoints:`);
    logger.info(`     GET  /health`);
    logger.info(`     GET  /api/audio/health`);
    logger.info(`     GET  /api/audio/formats`);
    logger.info(`     POST /api/audio/transcribe`);
  });
}

export default app;
