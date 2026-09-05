import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError';
import { getUploadDir } from '../services/storage.service';

const MAX_FILE_SIZE_BYTES =
  parseInt(process.env.MAX_FILE_SIZE_MB ?? '50', 10) * 1024 * 1024;

export const ALLOWED_MIME_TYPES: readonly string[] = [
  'audio/mpeg',        // .mp3
  'audio/mp4',         // .m4a / .mp4
  'audio/wav',         // .wav
  'audio/wave',        // .wav (alternate)
  'audio/x-wav',       // .wav (alternate)
  'audio/ogg',         // .ogg
  'audio/webm',        // .webm
  'audio/flac',        // .flac
  'audio/x-flac',      // .flac (alternate)
  'audio/aac',         // .aac
  'audio/x-m4a',       // .m4a (alternate)
  'audio/x-mpeg',      // .mp3 (some encoders)
];

export const SUPPORTED_FORMATS = [
  { extension: '.mp3',  mimeType: 'audio/mpeg',  description: 'MPEG Audio Layer III' },
  { extension: '.wav',  mimeType: 'audio/wav',   description: 'Waveform Audio' },
  { extension: '.ogg',  mimeType: 'audio/ogg',   description: 'Ogg Vorbis' },
  { extension: '.flac', mimeType: 'audio/flac',  description: 'Free Lossless Audio Codec' },
  { extension: '.aac',  mimeType: 'audio/aac',   description: 'Advanced Audio Coding' },
  { extension: '.m4a',  mimeType: 'audio/mp4',   description: 'MPEG-4 Audio' },
  { extension: '.webm', mimeType: 'audio/webm',  description: 'WebM Audio' },
];

// ─── Disk storage engine ────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = getUploadDir();
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch {}
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // UUID-based filename prevents path traversal and collisions
    cb(null, `${uuidv4()}${ext}`);
  },
});

// ─── File type validation ───────────────────────────────────────────────────

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Passing an Error rejects the file and routes to the error middleware
    cb(ApiError.unsupportedMediaType(file.mimetype));
  }
};

// ─── Multer instance ────────────────────────────────────────────────────────

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1, // single file per request
  },
  fileFilter,
});

/**
 * uploadSingle — Multer middleware for a single audio file.
 * Expects the field name "audio" in multipart/form-data.
 */
export const uploadSingle = upload.single('audio');
