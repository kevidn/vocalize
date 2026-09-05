import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * errorMiddleware — global Express error handler.
 * Must have exactly 4 parameters to be recognized by Express as an error handler.
 * Converts any thrown error into a structured ApiResponse.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const requestId = (req.headers['x-request-id'] as string) ?? uuidv4();
  const start = (req as Request & { _startTime?: number })._startTime ?? Date.now();
  const processingTimeMs = Date.now() - start;

  // ─── Handle known operational errors ───────────────────────────────────
  if (err instanceof ApiError) {
    logger.warn(`[${err.statusCode}] ${err.code}: ${err.message}`, {
      path: req.path,
      method: req.method,
    });

    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        processingTimeMs,
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // ─── Handle Multer errors ────────────────────────────────────────────────
  if (err.name === 'MulterError') {
    const multerErr = err as Error & { code?: string; field?: string };
    let message = 'File upload error';
    let statusCode = 400;

    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      const maxMb = parseInt(process.env.MAX_FILE_SIZE_MB ?? '50', 10);
      message = `File size exceeds the ${maxMb} MB limit`;
      statusCode = 413;
    } else if (multerErr.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected field "${multerErr.field ?? 'unknown'}". Use field name "audio"`;
    }

    const response: ApiResponse<never> = {
      success: false,
      error: { code: multerErr.code ?? 'UPLOAD_ERROR', message },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        processingTimeMs,
      },
    };

    res.status(statusCode).json(response);
    return;
  }

  // ─── Unhandled / programming errors ─────────────────────────────────────
  logger.error('Unhandled error', { err: err.message, stack: err.stack, path: req.path });

  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'An unexpected error occurred. Please try again.',
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      processingTimeMs,
    },
  };

  res.status(500).json(response);
};
