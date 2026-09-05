import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { JobStatus, TranscriptionResult } from '../types';

export interface ProcessingStep {
  id: number;
  label: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

const STEPS_DATA: Omit<ProcessingStep, 'isComplete' | 'isActive'>[] = [
  { id: 1, label: 'Payload Transfer', description: 'Encrypting and streaming audio chunk buffer to API gateway' },
  { id: 2, label: 'Acoustic Feature Extraction', description: 'Computing 80-channel log-mel spectrogram representations' },
  { id: 3, label: 'Encoder-Decoder STT Inference', description: 'Running transformer-based deep speech recognition model' },
  { id: 4, label: 'Timestamp Alignment & Scoring', description: 'Cross-attention alignment for word-level timestamps and confidence' },
];

export function useTranscription() {
  const [status, setStatus] = useState<JobStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [audioUrl]);

  const reset = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    setStatus('idle');
    setFile(null);
    setAudioUrl(null);
    setUploadProgress(0);
    setActiveStepIndex(0);
    setResult(null);
    setError(null);
    setElapsedSeconds(0);
  }, [audioUrl]);

  const selectFile = useCallback((newFile: File) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const url = URL.createObjectURL(newFile);
    setFile(newFile);
    setAudioUrl(url);
    setStatus('idle');
    setResult(null);
    setError(null);
    setUploadProgress(0);
    setActiveStepIndex(0);
  }, [audioUrl]);

  const startTranscription = useCallback(async (audioFile?: File) => {
    const targetFile = audioFile || file;
    if (!targetFile) {
      setError('Please select or drop an audio file first.');
      return;
    }

    // Initialize state
    setStatus('uploading');
    setUploadProgress(0);
    setActiveStepIndex(0);
    setError(null);
    setResult(null);
    setElapsedSeconds(0);

    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 200);

    // Simulate progressive backend pipeline steps
    stepTimerRef.current = window.setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < STEPS_DATA.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const response = await ApiService.transcribeAudio(targetFile, (percent) => {
        setUploadProgress(percent);
        if (percent >= 100) {
          setStatus('processing');
        }
      });

      if (timerRef.current) clearInterval(timerRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);

      setActiveStepIndex(STEPS_DATA.length);
      setResult(response.data);
      setStatus('completed');
    } catch (err: unknown) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);

      const message = err instanceof Error ? err.message : 'An unexpected error occurred during transcription.';
      setError(message);
      setStatus('failed');
    }
  }, [file]);

  const steps: ProcessingStep[] = STEPS_DATA.map((step, idx) => ({
    ...step,
    isComplete: idx < activeStepIndex || status === 'completed',
    isActive: idx === activeStepIndex && status === 'processing',
  }));

  return {
    status,
    file,
    audioUrl,
    uploadProgress,
    steps,
    activeStepIndex,
    result,
    error,
    elapsedSeconds,
    selectFile,
    startTranscription,
    reset,
  };
}
