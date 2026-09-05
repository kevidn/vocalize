import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { DropZone } from './components/DropZone';
import { ProcessingState } from './components/ProcessingState';
import { ResultMetadata } from './components/ResultMetadata';
import { AudioPlayer } from './components/AudioPlayer';
import { TranscriptViewer } from './components/TranscriptViewer';
import { ArchitectureModal } from './components/ArchitectureModal';
import { Footer } from './components/Footer';
import { useTranscription } from './hooks/useTranscription';

export const App: React.FC = () => {
  const {
    status,
    file,
    audioUrl,
    uploadProgress,
    steps,
    result,
    error,
    elapsedSeconds,
    selectFile,
    startTranscription,
    reset,
  } = useTranscription();

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekTargetTime, setSeekTargetTime] = useState<number | null>(null);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  const handleSeekFromTranscript = (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
    setSeekTargetTime(timeInSeconds);
    setTimeout(() => setSeekTargetTime(null), 100);
  };

  const isProcessing = status === 'uploading' || status === 'processing';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#edf0f3] text-[#191c1f]">
      {/* Top Header Card */}
      <Navbar onOpenArchitecture={() => setIsArchModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 flex flex-col gap-6">
        {/* Primary Information Card (Adopted from image_2.png title area) - Hidden when viewing transcript */}
        {!result && (
          <motion.section 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dash-card p-6 sm:p-8 flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#557352]">
                  Vocalize Platform
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8f2e6] text-[#2d6329] text-[11px] font-bold">
                  Feature: Speech-to-Text Synchronization
                </span>
              </div>

              <div className="text-xs text-[#8c9ba5] font-semibold hidden md:block">
                AI Powered Neural Audio Transcription
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#191c1f]">
              Precision Audio Transcription & Text Synchronization
            </h2>

            <p className="text-sm sm:text-base text-[#5f6c7b] max-w-3xl leading-relaxed">
              Synchronize audio streams for detailed analysis and accessibility. Ingest high-resolution audio files into verbatim word-level synchronized transcripts with acoustic confidence scoring.
            </p>
          </motion.section>
        )}

        {/* Dynamic Workflow Area */}
        <div className="w-full flex flex-col gap-6">
          {/* Error Banner */}
          {status === 'failed' && (
            <div className="p-5 rounded-2xl bg-[#fee2e2] border border-[#fecaca] text-[#991b1b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#dc2626] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#991b1b]">Transcription Request Failed</h4>
                  <p className="text-xs text-[#b91c1c] mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="px-4 py-2 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Upload Drop Zone (Shown when idle) */}
          {status === 'idle' && (
            <div className="animate-fadeIn">
              <DropZone
                onFileSelected={selectFile}
                onStartTranscription={startTranscription}
                selectedFile={file}
                disabled={isProcessing}
              />
            </div>
          )}

          {/* Processing / Uploading Active State */}
          {isProcessing && (
            <div className="animate-fadeIn">
              <ProcessingState
                status={status}
                progress={uploadProgress}
                steps={steps}
                elapsedSeconds={elapsedSeconds}
              />
            </div>
          )}

          {/* Completed State: Metrics Cards + Waveform Audio Player + Transcript Viewer */}
          {result && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Reset Toolbar */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  <h3 className="text-sm font-bold text-[#191c1f]">
                    Transcription Analysis Ready
                  </h3>
                </div>

                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffffff] hover:bg-[#f1f4f7] border border-[#e5e9ec] text-xs font-bold text-[#191c1f] transition-all cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#557352]" />
                  <span>Upload Another Audio</span>
                </button>
              </div>

              {/* 1. Metrics Row (Row of 4 Cards) */}
              <ResultMetadata result={result} />

              {/* 2. Audio Visualization & Control Card */}
              <AudioPlayer
                audioUrl={audioUrl}
                currentTime={currentTime}
                durationSeconds={result.durationSeconds}
                segments={result.segments}
                fullTranscript={result.fullTranscript}
                onTimeUpdate={setCurrentTime}
                seekTime={seekTargetTime}
              />

              {/* 3. Transcript Card (Main content area with scroll effect) */}
              <TranscriptViewer
                result={result}
                currentTime={currentTime}
                onSeekTo={handleSeekFromTranscript}
              />
            </div>
          )}
        </div>
      </main>

      {/* Architecture System Design Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
