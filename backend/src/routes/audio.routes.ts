import { Router } from 'express';
import { audioController } from '../controllers/audio.controller';
import { uploadSingle } from '../middlewares/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * POST /api/audio/transcribe
 * Body: multipart/form-data, field "audio" (audio file)
 * Response: ApiResponse<TranscriptionJob>
 */
router.post(
  '/transcribe',
  uploadSingle,
  asyncHandler((req, res) => audioController.transcribe(req, res)),
);

/**
 * GET /api/audio/formats
 * Response: ApiResponse<SupportedFormat[]>
 */
router.get('/formats', (req, res) => audioController.getSupportedFormats(req, res));

/**
 * GET /api/audio/health
 * Response: ApiResponse<{ status, uploadDir }>
 */
router.get('/health', (req, res) => audioController.health(req, res));

export default router;
