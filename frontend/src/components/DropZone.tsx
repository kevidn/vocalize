import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileAudio, AlertCircle, CheckCircle2, Play, Sparkles, Mic, Square } from 'lucide-react';
import { createAudibleSampleAudio } from '../utils/audioGenerator';

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  onStartTranscription: (file?: File) => void;
  selectedFile: File | null;
  disabled: boolean;
}

const SUPPORTED_EXTS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.webm'];

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelected,
  onStartTranscription,
  selectedFile,
  disabled,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recTimerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      setValidationError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([audioBlob], `live_voice_record_${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        onFileSelected(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      setValidationError('Microphone access denied. Please grant permission to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    }
  };

  const validateAndSelectFile = (file: File) => {
    setValidationError(null);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExt = SUPPORTED_EXTS.includes(ext);
    const isValidMime = file.type.startsWith('audio/') || file.type === 'video/webm';

    if (!isValidExt && !isValidMime) {
      setValidationError(`Unsupported format "${ext}". Please upload MP3, WAV, OGG, FLAC, M4A, AAC, or WEBM.`);
      return;
    }

    const maxBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxBytes) {
      setValidationError('File exceeds maximum size limit of 50 MB.');
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setActivePreset(null);
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setActivePreset(null);
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleLoadSample = (sampleName: string, durationSec: number = 32, label: string) => {
    setActivePreset(label);
    const file = createAudibleSampleAudio(sampleName, durationSec);
    onFileSelected(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Presets Filter Chips Bar & Live Voice Dictation Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#5f6c7b] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#557352]" /> Sample Presets:
          </span>
          <div className="flex flex-wrap items-center gap-2 p-1 bg-[#ffffff] rounded-full border border-[#e5e9ec] shadow-xs">
            {[
              { id: 'tech', name: 'q3_earnings_briefing', dur: 28, label: '💼 Tech Meeting' },
              { id: 'podcast', name: 'ai_podcast_episode_42', dur: 36, label: '🎙️ AI Podcast' },
              { id: 'memo', name: 'voice_memo_architecture', dur: 22, label: '📝 Voice Memo' },
            ].map((p) => {
              const isActive = activePreset === p.label;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={disabled || isRecording}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample(p.name, p.dur, p.label);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#557352] text-white shadow-xs'
                      : 'text-[#5f6c7b] hover:text-[#191c1f] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Mic Voice Dictation Button */}
        <div>
          {!isRecording ? (
            <button
              type="button"
              disabled={disabled}
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Record Live Voice</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#191c1f] text-white text-xs font-bold animate-pulse shadow-xs cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 text-[#ef4444] fill-[#ef4444]" />
              <span>Recording... ({recordingTime}s) - Click Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Upload Drop Area Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`dash-card-hover p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? 'border-[#557352] bg-[#f2f8f1] scale-[1.01]'
            : selectedFile
            ? 'border-[#557352]/50 bg-[#fafcf9]'
            : 'border-[#d0d7de] hover:border-[#557352] bg-[#ffffff]'
        } ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Icon Container */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
            selectedFile
              ? 'bg-[#e8f2e6] text-[#3b6b37]'
              : 'bg-[#f1f4f7] text-[#5f6c7b]'
          }`}
        >
          {selectedFile ? (
            <FileAudio className="w-8 h-8 text-[#557352]" />
          ) : (
            <Upload className={`w-8 h-8 ${isDragging ? 'text-[#557352] animate-bounce' : 'text-[#5f6c7b]'}`} />
          )}
        </div>

        {/* File Details / Prompt Text */}
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f2e6] text-[#2d6329] text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Ready for Speech-to-Text
            </span>
            <p className="text-lg font-bold text-[#191c1f] truncate max-w-md">
              {selectedFile.name}
            </p>
            <p className="text-xs text-[#5f6c7b] mt-1 font-mono">
              Size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type || 'audio file'}
            </p>
            <p className="text-xs text-[#557352] font-semibold mt-3">
              Click or drag another file to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-base sm:text-lg font-semibold text-[#191c1f]">
              <span className="text-[#557352] font-bold">Click to upload audio</span> or drag and drop
            </p>
            <p className="text-xs sm:text-sm text-[#5f6c7b] mt-1.5">
              Supports MP3, WAV, OGG, FLAC, M4A, AAC, WEBM (up to 50MB)
            </p>

            {/* Format Pills (Subtle gray chips) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
              {['MP3', 'WAV', 'OGG', 'FLAC', 'M4A', 'AAC', 'WEBM'].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2.5 py-1 text-[11px] font-semibold font-mono rounded-lg bg-[#f1f4f7] text-[#5f6c7b] border border-[#e5e9ec]"
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-[#991b1b] text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* CTA Button when file selected */}
      {selectedFile && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onStartTranscription();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#557352] hover:bg-[#435c40] text-white font-bold text-sm shadow-md shadow-[#557352]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Process Speech-to-Text</span>
          </button>
        </div>
      )}
    </div>
  );
};
