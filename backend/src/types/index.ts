// ─── Word-level granularity ───────────────────────────────────────────────────

export interface TranscriptionWord {
  word: string;
  startTime: number; // seconds
  endTime: number; // seconds
  confidence: number; // 0.0 – 1.0
}

// ─── Segment (sentence / phrase) ──────────────────────────────────────────────

export interface TranscriptionSegment {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
  words: TranscriptionWord[];
}

// ─── Full STT result payload ──────────────────────────────────────────────────

export interface TranscriptionResult {
  transcript: string;
  segments: TranscriptionSegment[];
  language: string;
  languageConfidence: number;
  duration: number; // total audio duration in seconds
  wordCount: number;
  speakerCount: number;
  audioChannels: number;
  sampleRate: number;
  model: string;
  processingTimeMs: number;
}

// ─── Transcription Job (top-level response) ───────────────────────────────────

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TranscriptionJob {
  jobId: string;
  status: JobStatus;
  fileName: string; // stored filename (uuid-based)
  originalFileName: string; // user's original filename
  fileSize: number; // bytes
  mimeType: string;
  uploadedAt: string; // ISO 8601
  completedAt?: string; // ISO 8601
  result?: TranscriptionResult;
  error?: string;
}

// ─── Generic API response envelope ───────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiMeta {
  requestId: string;
  timestamp: string; // ISO 8601
  processingTimeMs: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta: ApiMeta;
}

// ─── Supported audio format descriptor ────────────────────────────────────────

export interface SupportedFormat {
  extension: string;
  mimeType: string;
  description: string;
}
