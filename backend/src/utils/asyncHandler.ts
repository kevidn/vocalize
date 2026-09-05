import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

/**
 * asyncHandler — wraps an async Express handler so that any rejected promise
 * is automatically forwarded to next(err), eliminating try/catch boilerplate
 * in every controller method.
 *
 * Usage:
 *   router.post('/upload', asyncHandler(audioController.transcribe));
 */
export const asyncHandler =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
