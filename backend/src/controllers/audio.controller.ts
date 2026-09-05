import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { transcriptionService } from '../services/transcription.service';
import { storageService } from '../services/storage.service';
import { ApiResponse, TranscriptionJob } from '../types';
import { ApiError } from '../utils/ApiError';
import { SUPPORTED_FORMATS } from '../middlewares/upload.middleware';
import { logger } from '../utils/logger';

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildMeta(req: Request, processingTimeMs: number) {
  return {
    requestId: req._requestId ?? uuidv4(),
    timestamp: new Date().toISOString(),
    processingTimeMs,
  };
}

// ─── AudioController ───────────────────────────────────────────────────────

export class AudioController {
  /**
   * POST /api/audio/transcribe
   *
   * Accepts an audio file upload, runs it through the transcription service,
   * and returns a fully-typed TranscriptionJob payload.
   */
  async transcribe(req: Request, res: Response): Promise<void> {
    const start = req._startTime ?? Date.now();

    // Multer places the uploaded file on req.file
    if (!req.file) {
      throw ApiError.badRequest(
        'No audio file provided. Send a multipart/form-data request with field name "audio".',
      );
    }

    const { file } = req;
    const jobId = uuidv4();
    const uploadedAt = new Date().toISOString();

    logger.info(`[JOB:${jobId}] Received file: ${file.originalname} (${file.mimetype})`);

    // Build initial "processing" job snapshot
    const job: TranscriptionJob = {
      jobId,
      status: 'processing',
      fileName: file.filename,
      originalFileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt,
    };

    // Run transcription (mock STT service — swap for real provider here)
    const result = await transcriptionService.transcribe(file.path, {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    // Cleanup the upload after processing (keeps the server lean)
    // In a production queue-based system this would run asynchronously
    await storageService.deleteFile(file.filename);

    const completedAt = new Date().toISOString();
    const processingTimeMs = Date.now() - start;

    const completedJob: TranscriptionJob = {
      ...job,
      status: 'completed',
      completedAt,
      result,
    };

    logger.success(`[JOB:${jobId}] Completed in ${processingTimeMs}ms`);

    const response: ApiResponse<TranscriptionJob> = {
      success: true,
      data: completedJob,
      meta: buildMeta(req, processingTimeMs),
    };

    res.status(200).json(response);
  }

  /**
   * GET /api/audio/formats
   *
   * Returns the list of accepted audio formats for UI validation.
   */
  getSupportedFormats(req: Request, res: Response): void {
    const response: ApiResponse<typeof SUPPORTED_FORMATS> = {
      success: true,
      data: SUPPORTED_FORMATS,
      meta: buildMeta(req, Date.now() - (req._startTime ?? Date.now())),
    };
    res.json(response);
  }

  /**
   * GET /api/audio/health
   *
   * Audio sub-system health check.
   */
  health(req: Request, res: Response): void {
    const response: ApiResponse<{ status: string; uploadDir: string }> = {
      success: true,
      data: {
        status: 'operational',
        uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
      },
      meta: buildMeta(req, Date.now() - (req._startTime ?? Date.now())),
    };
    res.json(response);
  }
}

export const audioController = new AudioController();
