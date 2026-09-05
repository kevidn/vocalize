import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

declare module 'express' {
  interface Request {
    _startTime?: number;
    _requestId?: string;
  }
}

/**
 * requestLoggerMiddleware — logs each incoming request and its response status/time.
 * Also stamps req._startTime and req._requestId for downstream use.
 */
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  req._startTime = Date.now();
  req._requestId = (req.headers['x-request-id'] as string) ?? uuidv4();

  // Inject request ID into response headers for tracing
  res.setHeader('X-Request-Id', req._requestId);

  res.on('finish', () => {
    const duration = Date.now() - (req._startTime ?? Date.now());
    const status = res.statusCode;
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    const message = `${req.method} ${req.originalUrl} → ${status} (${duration}ms)`;
    logger[level](message);
  });

  next();
};
