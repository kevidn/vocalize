import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Search,
  FileCode,
  FileText,
  Subtitles,
  PlayCircle,
  ChevronDown,
} from 'lucide-react';
import type { TranscriptionResult, TranscriptionSegment, TranscriptionWord } from '../types';

interface TranscriptViewerProps {
  result: TranscriptionResult;
  currentTime: number;
  onSeekTo: (timeInSeconds: number) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  result,
  currentTime,
  onSeekTo,
}) => {
  const [viewMode, setViewMode] = useState<'segments' | 'raw'>('segments');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const segments: TranscriptionSegment[] = result?.segments || [];
  const fullText = result?.fullTranscript || '';

  // Format seconds to mm:ss.ms
  const formatTime = (seconds: number): string => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00.0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}.${ms}`;
  };

  const formatSRTTime = (seconds: number): string => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00:00,000';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const formatVTTTime = (seconds: number): string => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00:00.000';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsTXT = () => {
    downloadFile(fullText, `${result?.originalName || 'transcript'}.txt`, 'text/plain');
  };

  const exportAsJSON = () => {
    downloadFile(
      JSON.stringify(result, null, 2),
      `${result?.originalName || 'transcript'}.json`,
      'application/json'
    );
  };

  const exportAsSRT = () => {
    let srt = '';
    segments.forEach((seg, idx) => {
      srt += `${idx + 1}\n`;
      srt += `${formatSRTTime(seg.start)} --> ${formatSRTTime(seg.end)}\n`;
      srt += `${seg.text?.trim() || ''}\n\n`;
    });
    downloadFile(srt, `${result?.originalName || 'transcript'}.srt`, 'text/plain');
  };

  const exportAsVTT = () => {
    let vtt = 'WEBVTT\n\n';
    segments.forEach((seg, idx) => {
      vtt += `${idx + 1}\n`;
      vtt += `${formatVTTTime(seg.start)} --> ${formatVTTTime(seg.end)}\n`;
      vtt += `${seg.text?.trim() || ''}\n\n`;
    });
    downloadFile(vtt, `${result?.originalName || 'transcript'}.vtt`, 'text/vtt');
  };

  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter((seg) => seg.text?.toLowerCase().includes(q));
  }, [segments, searchQuery]);

  const renderHighlightedText = (text: string) => {
    if (!text) return '';
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-[#fef08a] text-[#854d0e] px-1 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full flex flex-col gap-5 rounded-2xl dash-card p-6 sm:p-7 relative">
      {/* Top Toolbar (Adopted from image_2.png header style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#edf1f4]">
        {/* Left: Tab Structure Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f1f4f7] rounded-full self-start">
          <button
            onClick={() => setViewMode('segments')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'segments'
                ? 'bg-[#557352] text-white shadow-xs'
                : 'text-[#5f6c7b] hover:text-[#191c1f]'
            }`}
          >
            Timed Segments
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-[#557352] text-white shadow-xs'
                : 'text-[#5f6c7b] hover:text-[#191c1f]'
            }`}
          >
            Raw Paragraph
          </button>
        </div>

        {/* Right: Search Bar & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search Bar styled like reference search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c9ba5]" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8fafb] hover:bg-[#f1f4f7] focus:bg-[#ffffff] border border-[#e5e9ec] focus:border-[#557352] rounded-full pl-9 pr-4 py-2 text-xs font-medium text-[#191c1f] placeholder-[#8c9ba5] focus:outline-none transition-all"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffffff] hover:bg-[#f1f4f7] border border-[#e5e9ec] text-xs font-semibold text-[#191c1f] transition-all cursor-pointer shadow-xs"
            title="Copy text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5 text-[#5f6c7b]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#557352] hover:bg-[#435c40] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#ffffff] border border-[#e5e9ec] shadow-xl p-1.5 z-30 flex flex-col gap-1 animate-fadeIn">
                <button
                  onClick={exportAsTXT}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#191c1f] hover:bg-[#f8fafb] transition-all text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#0284c7]" />
                  <span>Plain Text (.txt)</span>
                </button>
                <button
                  onClick={exportAsJSON}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#191c1f] hover:bg-[#f8fafb] transition-all text-left cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-[#d97706]" />
                  <span>Full JSON (.json)</span>
                </button>
                <button
                  onClick={exportAsSRT}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#191c1f] hover:bg-[#f8fafb] transition-all text-left cursor-pointer"
                >
                  <Subtitles className="w-4 h-4 text-[#16a34a]" />
                  <span>Subtitles (.srt)</span>
                </button>
                <button
                  onClick={exportAsVTT}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#191c1f] hover:bg-[#f8fafb] transition-all text-left cursor-pointer"
                >
                  <Subtitles className="w-4 h-4 text-[#557352]" />
                  <span>WebVTT (.vtt)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Transcript Content Area with Smooth Scroll */}
      <div className="relative">
        <div className="max-h-[500px] overflow-y-auto pr-2 flex flex-col gap-3">
          {viewMode === 'raw' ? (
            <div className="p-6 rounded-2xl bg-[#f8fafb] border border-[#e5e9ec] text-[#191c1f] text-sm leading-relaxed whitespace-pre-wrap">
              {renderHighlightedText(fullText)}
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-6">
              {filteredSegments.map((segment, sIdx) => {
                const isActiveSegment =
                  currentTime >= segment.start && currentTime <= segment.end;

                return (
                  <div
                    key={segment.id}
                    onClick={() => onSeekTo(segment.start)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-2.5 cursor-pointer ${
                      isActiveSegment
                        ? 'bg-[#edf7ec] border-[#7ba877] shadow-sm'
                        : sIdx === 0
                        ? 'bg-[#f8fafb] hover:bg-[#edf7ec]/70 border-[#e5e9ec] hover:border-[#a3cf9f]'
                        : 'bg-[#ffffff] hover:bg-[#f8fafb] border-[#e5e9ec]'
                    }`}
                  >
                    {/* Segment Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f2e6] text-[#2d6329] font-mono text-[11px] font-bold">
                          <PlayCircle className="w-3.5 h-3.5 text-[#557352]" />
                          {formatTime(segment.start)} - {formatTime(segment.end)}
                        </span>
                        <span className="text-xs font-bold text-[#5f6c7b]">
                          Speaker / Segment #{(segment.id ?? 0) + 1}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          (segment.confidence ?? 0.9) > 0.9
                            ? 'bg-[#e8f2e6] text-[#2d6329]'
                            : 'bg-[#fef3c7] text-[#92400e]'
                        }`}
                      >
                        {((segment.confidence ?? 0.98) * 100).toFixed(0)}% acc
                      </span>
                    </div>

                    {/* Interactive Word Level Click-to-Seek */}
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-sm sm:text-base leading-relaxed text-[#191c1f]">
                      {segment.words && segment.words.length > 0 ? (
                        segment.words.map((wordObj, wIdx) => {
                          const isWordActive =
                            currentTime >= wordObj.start && currentTime <= wordObj.end;

                          return (
                            <span
                              key={wIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSeekTo(wordObj.start);
                              }}
                              title={`Timestamp: ${formatTime(wordObj.start)} - ${formatTime(wordObj.end)}`}
                              className={`px-1.5 py-0.5 rounded-lg transition-all duration-100 cursor-pointer ${
                                isWordActive
                                  ? 'bg-[#557352] text-white font-bold shadow-xs scale-105'
                                  : 'hover:bg-[#e8f2e6] hover:text-[#2d6329] text-[#191c1f]'
                              }`}
                            >
                              {renderHighlightedText(wordObj.word)}
                            </span>
                          );
                        })
                      ) : (
                        <span className="font-medium">{renderHighlightedText(segment.text)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Subtle Fade & Scroll for more indicator at bottom */}
        {filteredSegments.length > 3 && viewMode === 'segments' && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#ffffff] to-transparent flex items-end justify-center pb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8c9ba5] bg-[#ffffff]/90 px-3 py-0.5 rounded-full shadow-xs border border-[#e5e9ec]">
              Scroll for more segments <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
