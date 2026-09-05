export type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface TranscriptionWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  confidence: number; // 0.0 - 1.0
}

export interface TranscriptionSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  confidence: number;
  words: TranscriptionWord[];
}

export interface STTResultPayload {
  durationSeconds: number;
  language: string;
  model: string;
  confidence: number;
  processingTimeMs: number;
  fullTranscript: string;
  segments: TranscriptionSegment[];
  words: TranscriptionWord[];
}

export interface BackendJobData {
  jobId: string;
  status: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  completedAt?: string;
  result: STTResultPayload;
}

export interface TranscriptionResult {
  jobId: string;
  filename: string;
  originalName: string;
  fileSizeBytes: number;
  durationSeconds: number;
  language: string;
  model: string;
  confidence: number;
  processingTimeMs: number;
  fullTranscript: string;
  segments: TranscriptionSegment[];
  words: TranscriptionWord[];
  createdAt: string;
}

export interface SupportedFormat {
  extension: string;
  mimeType: string;
  category: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    processingTimeMs?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}
