import type { ApiResponse, SupportedFormat, TranscriptionResult, BackendJobData, TranscriptionSegment, TranscriptionWord } from '../types';

const API_BASE = '/api';

export class ApiService {
  /**
   * Health check for backend service
   */
  static async checkHealth(): Promise<{ status: string; uploadDir: string }> {
    const res = await fetch(`${API_BASE}/audio/health`);
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.statusText}`);
    }
    const json: ApiResponse<{ status: string; uploadDir: string }> = await res.json();
    return json.data;
  }

  /**
   * Fetch list of supported audio formats
   */
  static async getSupportedFormats(): Promise<SupportedFormat[]> {
    const res = await fetch(`${API_BASE}/audio/formats`);
    if (!res.ok) {
      throw new Error(`Failed to fetch formats: ${res.statusText}`);
    }
    const json: ApiResponse<SupportedFormat[]> = await res.json();
    return json.data;
  }

  /**
   * Upload audio file and run transcription with progress monitoring
   */
  static transcribeAudio(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<ApiResponse<TranscriptionResult>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('audio', file);

      xhr.open('POST', `${API_BASE}/audio/transcribe`);

      // Track upload progress
      if (xhr.upload && onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        });
      }

      xhr.onload = () => {
        try {
          const response: ApiResponse<BackendJobData> = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && response.success) {
            const jobData = response.data;
            const raw = jobData.result as unknown as Record<string, unknown>;

            const fullTranscript =
              (raw.transcript as string) || (raw.fullTranscript as string) || '';

            const rawSegments = (raw.segments as Array<Record<string, unknown>>) || [];
            const allWords: TranscriptionWord[] = [];

            const normalizedSegments: TranscriptionSegment[] = rawSegments.map((seg, idx) => {
              const segWordsRaw = (seg.words as Array<Record<string, unknown>>) || [];
              const segWords: TranscriptionWord[] = segWordsRaw.map((w) => {
                const wordObj: TranscriptionWord = {
                  word: String(w.word || ''),
                  start: typeof w.startTime === 'number' ? w.startTime : typeof w.start === 'number' ? w.start : 0,
                  end: typeof w.endTime === 'number' ? w.endTime : typeof w.end === 'number' ? w.end : 0,
                  confidence: typeof w.confidence === 'number' ? w.confidence : 0.95,
                };
                allWords.push(wordObj);
                return wordObj;
              });

              return {
                id: typeof seg.id === 'number' ? seg.id : idx,
                seek: typeof seg.seek === 'number' ? seg.seek : 0,
                start: typeof seg.startTime === 'number' ? seg.startTime : typeof seg.start === 'number' ? seg.start : 0,
                end: typeof seg.endTime === 'number' ? seg.endTime : typeof seg.end === 'number' ? seg.end : 0,
                text: String(seg.text || ''),
                confidence: typeof seg.confidence === 'number' ? seg.confidence : 0.95,
                words: segWords,
              };
            });

            const durationSeconds =
              typeof raw.duration === 'number'
                ? raw.duration
                : typeof raw.durationSeconds === 'number'
                ? raw.durationSeconds
                : normalizedSegments[normalizedSegments.length - 1]?.end || 30;

            const normalizedResult: TranscriptionResult = {
              jobId: jobData.jobId,
              filename: jobData.fileName,
              originalName: jobData.originalFileName,
              fileSizeBytes: jobData.fileSize,
              durationSeconds,
              language: String(raw.language || 'en-US'),
              model: String(raw.model || 'vocalize-general-v3'),
              confidence:
                typeof raw.languageConfidence === 'number'
                  ? raw.languageConfidence
                  : typeof raw.confidence === 'number'
                  ? raw.confidence
                  : 0.96,
              processingTimeMs:
                typeof raw.processingTimeMs === 'number'
                  ? raw.processingTimeMs
                  : (response.meta?.processingTimeMs ?? 1500),
              fullTranscript,
              segments: normalizedSegments,
              words: allWords.length > 0 ? allWords : (raw.words as TranscriptionWord[]) || [],
              createdAt: jobData.completedAt || jobData.uploadedAt || new Date().toISOString(),
            };

            resolve({
              success: true,
              data: normalizedResult,
              meta: response.meta,
            });
          } else {
            const rawErr = JSON.parse(xhr.responseText);
            const errorMsg = rawErr?.error?.message || `Transcription failed with HTTP ${xhr.status}`;
            reject(new Error(errorMsg));
          }
        } catch {
          reject(new Error(`Failed to parse response: ${xhr.responseText || xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred while connecting to Vocalize API server.'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Request timed out while waiting for speech-to-text processing.'));
      };

      xhr.send(formData);
    });
  }
}
