/**
 * ApiError — a typed, structured HTTP error.
 * Thrown anywhere in the service layer and caught by the global error middleware.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // ─── Factory helpers ─────────────────────────────────────────────────────

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static notFound(resource: string): ApiError {
    return new ApiError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static unsupportedMediaType(mimeType: string): ApiError {
    return new ApiError(
      415,
      'UNSUPPORTED_MEDIA_TYPE',
      `Unsupported audio format: "${mimeType}". Accepted: MP3, WAV, OGG, FLAC, AAC, M4A, WEBM`,
    );
  }

  static payloadTooLarge(maxMb: number): ApiError {
    return new ApiError(
      413,
      'PAYLOAD_TOO_LARGE',
      `File size exceeds the ${maxMb} MB limit`,
    );
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, 'INTERNAL_ERROR', message, undefined, false);
  }
}
