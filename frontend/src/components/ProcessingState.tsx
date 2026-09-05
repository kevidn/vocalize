import React from 'react';
import { Loader2, CheckCircle2, Clock, Radio } from 'lucide-react';
import type { ProcessingStep } from '../hooks/useTranscription';
import { SkeletonShimmer } from './SkeletonShimmer';

interface ProcessingStateProps {
  status: 'uploading' | 'processing';
  progress: number;
  steps: ProcessingStep[];
  elapsedSeconds: number;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  status,
  progress,
  steps,
  elapsedSeconds,
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full rounded-2xl dash-card p-7 sm:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#edf1f4]">
        <div className="flex items-center gap-4">
          {/* Animated Waveform Visualizer icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#e8f2e6] border border-[#c4dec1] flex items-center justify-center gap-[3px] p-2.5">
            {[40, 80, 55, 95, 70, 30, 85].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-[#557352] rounded-full soundwave-bar-light"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#191c1f]">
                {status === 'uploading' ? 'Uploading Audio Buffer' : 'Neural Speech Processing'}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f2e6] text-[#2d6329] text-[10px] font-bold font-mono">
                <Radio className="w-3 h-3 text-[#22c55e] animate-pulse" /> LIVE INFERENCE
              </span>
            </div>
            <p className="text-xs text-[#5f6c7b] mt-0.5">
              Deep speech recognition engine running in real-time
            </p>
          </div>
        </div>

        {/* Elapsed Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f1f4f7] text-xs font-mono font-bold text-[#191c1f]">
            <Clock className="w-3.5 h-3.5 text-[#557352]" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <span className="text-xs font-mono font-bold text-[#557352]">
            {status === 'uploading' ? `${progress}%` : 'PROCESSING'}
          </span>
        </div>
      </div>

      {/* Progress Bar (Green styled like medical overview) */}
      <div className="w-full bg-[#f1f4f7] rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#557352] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: status === 'uploading' ? `${progress}%` : '88%' }}
        />
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {steps.map((step) => {
          const isDone = step.isComplete;
          const isCurrent = step.isActive;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                isDone
                  ? 'bg-[#f2f8f1] border-[#c4dec1] text-[#191c1f]'
                  : isCurrent
                  ? 'bg-[#ffffff] border-[#557352] shadow-xs text-[#191c1f]'
                  : 'bg-[#f8fafb] border-[#e5e9ec] text-[#8c9ba5]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#557352] animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#cbd5e1] flex items-center justify-center text-[9px] font-mono text-[#8c9ba5]">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span className={`text-xs font-bold ${isCurrent ? 'text-[#557352]' : ''}`}>
                  {step.label}
                </span>
                <span className="text-[11px] text-[#5f6c7b] mt-0.5 leading-relaxed">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated Skeleton Placeholder Preview */}
      <div className="mt-2 flex flex-col gap-3 p-4 rounded-2xl bg-[#f8fafb] border border-[#e5e9ec]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5f6c7b]">Transcript Preview Skeleton</span>
          <span className="text-[10px] font-mono text-[#8c9ba5]">Generating acoustic mapping...</span>
        </div>
        <SkeletonShimmer lines={3} />
      </div>
    </div>
  );
};
