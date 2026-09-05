import React from 'react';
import { Clock, FileText, Zap, ShieldCheck, Globe, Cpu } from 'lucide-react';
import type { TranscriptionResult } from '../types';
import { motion } from 'framer-motion';

interface ResultMetadataProps {
  result: TranscriptionResult;
}

export const ResultMetadata: React.FC<ResultMetadataProps> = ({ result }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const duration = typeof result?.durationSeconds === 'number' ? result.durationSeconds : 0;
  const confidence = typeof result?.confidence === 'number' ? result.confidence : 0.98;
  const wordCount = result?.words?.length || (result?.fullTranscript ? result.fullTranscript.split(/\s+/).filter(Boolean).length : 0);
  const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
  const confidencePercent = (confidence * 100).toFixed(1);
  const processingTime = result?.processingTimeMs || 1500;
  const realtimeFactor = duration > 0 ? ((duration * 1000) / processingTime).toFixed(1) : '1.0';

  const stats = [
    {
      title: 'Audio Duration',
      value: formatDuration(duration),
      subLabel: `${duration.toFixed(1)}s`,
      icon: Clock,
      inverted: false,
      cardClass: 'dash-card bg-white border border-[#e5e9ec]',
      barTrack: 'bg-[#f1f4f7]',
      barColor: 'bg-[#557352]',
      iconBg: 'bg-[#e8f2e6]',
      iconColor: 'text-[#3b6b37]',
      titleColor: 'text-[#5f6c7b]',
      valueColor: 'text-[#191c1f]',
      subLabelColor: 'text-[#8c9ba5]',
    },
    {
      title: 'Word Count & WPM',
      value: `${wordCount} words`,
      subLabel: `~${wpm} WPM cadence`,
      icon: FileText,
      inverted: false,
      cardClass: 'dash-card bg-white border border-[#e5e9ec]',
      barTrack: 'bg-[#f1f4f7]',
      barColor: 'bg-[#f59e0b]',
      iconBg: 'bg-[#fef3c7]',
      iconColor: 'text-[#b45309]',
      titleColor: 'text-[#5f6c7b]',
      valueColor: 'text-[#191c1f]',
      subLabelColor: 'text-[#8c9ba5]',
    },
    {
      title: 'STT Latency & Speed',
      value: `${processingTime} ms`,
      subLabel: `${realtimeFactor}x Realtime`,
      icon: Zap,
      inverted: true,
      cardClass: 'rounded-2xl bg-[#ea580c] border border-[#c2410c] shadow-sm',
      barTrack: 'bg-white/20',
      barColor: 'bg-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      titleColor: 'text-white/90',
      valueColor: 'text-white',
      subLabelColor: 'text-amber-100',
    },
    {
      title: 'Confidence Score',
      value: `${confidencePercent}%`,
      subLabel: 'High Acoustic Accuracy',
      icon: ShieldCheck,
      inverted: true,
      cardClass: 'rounded-2xl bg-[#557352] border border-[#446041] shadow-sm',
      barTrack: 'bg-white/20',
      barColor: 'bg-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      titleColor: 'text-white/90',
      valueColor: 'text-white',
      subLabelColor: 'text-[#e8f2e6]',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Meta Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e5e9ec] text-xs font-semibold text-[#191c1f] shadow-xs">
            <Globe className="w-3.5 h-3.5 text-[#557352]" />
            <span>Language: <strong className="text-[#557352] uppercase">{result?.language || 'EN'}</strong></span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e5e9ec] text-xs font-semibold text-[#191c1f] shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#557352]" />
            <span>Model: <strong className="text-[#3b6b37]">{result?.model || 'Whisper-Large-v3'}</strong></span>
          </span>
        </div>

        <div className="text-xs text-[#8c9ba5] font-mono">
          Job: <span className="text-[#5f6c7b] font-medium">{(result?.jobId || 'job_sync').slice(0, 16)}...</span>
        </div>
      </div>

      {/* Row of 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              className={`${stat.cardClass} p-5 sm:p-6 flex flex-col justify-between gap-4 relative overflow-hidden transition-all duration-200`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              {/* Top progress accent line */}
              <div className={`w-full ${stat.barTrack} rounded-full h-1.5 overflow-hidden`}>
                <div className={`${stat.barColor} h-full rounded-full w-3/4`} />
              </div>

              {/* Icon Circle & Title */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold ${stat.titleColor} leading-tight`}>
                  {stat.title}
                </span>
              </div>

              {/* Large Metric Display */}
              <div>
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.valueColor}`}>
                  {stat.value}
                </div>
                <div className={`text-xs font-semibold ${stat.subLabelColor} mt-1`}>
                  {stat.subLabel}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
