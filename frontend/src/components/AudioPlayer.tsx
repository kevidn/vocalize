import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward, Volume1 } from 'lucide-react';
import type { TranscriptionSegment } from '../types';

interface AudioPlayerProps {
  audioUrl: string | null;
  currentTime: number;
  durationSeconds?: number;
  segments?: TranscriptionSegment[];
  fullTranscript?: string;
  onTimeUpdate: (time: number) => void;
  seekTime?: number | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  currentTime,
  durationSeconds = 30,
  segments = [],
  fullTranscript = '',
  onTimeUpdate,
  seekTime,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(durationSeconds);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Keep track of current spoken utterance
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenSegIdRef = useRef<number | null>(null);

  // Sync duration prop
  useEffect(() => {
    if (durationSeconds && durationSeconds > 0) {
      setDuration(durationSeconds);
    }
  }, [durationSeconds]);

  // Stop active Web Speech synthesis
  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  }, []);

  // Speak text starting from a given segment
  const speakFromSegment = useCallback(
    (segIndex: number) => {
      if (!speechEnabled || !('speechSynthesis' in window)) return;
      if (segIndex < 0 || segIndex >= segments.length) return;

      stopSpeech();

      const seg = segments[segIndex];
      const textToSpeak = seg.text;
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = playbackRate;
      utterance.volume = isMuted ? 0 : volume;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira')));
      if (engVoice) utterance.voice = engVoice;

      lastSpokenSegIdRef.current = seg.id;
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [segments, speechEnabled, playbackRate, isMuted, volume, stopSpeech]
  );

  // Monitor segment changes during playback and trigger speech
  useEffect(() => {
    if (!isPlaying || !speechEnabled || segments.length === 0) return;

    const currentSegIdx = segments.findIndex(
      (s) => currentTime >= s.start && currentTime <= s.end
    );

    if (currentSegIdx !== -1) {
      const currentSeg = segments[currentSegIdx];
      if (lastSpokenSegIdRef.current !== currentSeg.id) {
        speakFromSegment(currentSegIdx);
      }
    }
  }, [currentTime, isPlaying, speechEnabled, segments, speakFromSegment]);

  // Handle external seek triggers
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && audioRef.current) {
      audioRef.current.currentTime = seekTime;
      onTimeUpdate(seekTime);

      const targetSegIdx = segments.findIndex(
        (s) => seekTime >= s.start && seekTime <= s.end
      );

      if (targetSegIdx !== -1) {
        speakFromSegment(targetSegIdx);
      }

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [seekTime]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      stopSpeech();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          const currentSegIdx = segments.findIndex(
            (s) => currentTime >= s.start && currentTime <= s.end
          );
          if (currentSegIdx !== -1) {
            speakFromSegment(currentSegIdx);
          } else if (segments.length > 0) {
            speakFromSegment(0);
          }
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      onTimeUpdate(time);

      const targetSegIdx = segments.findIndex(
        (s) => time >= s.start && time <= s.end
      );
      if (targetSegIdx !== -1 && isPlaying) {
        speakFromSegment(targetSegIdx);
      }
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
    if (utteranceRef.current) {
      utteranceRef.current.rate = nextRate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    if (isMuted) {
      stopSpeech();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00.0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}.${ms}`;
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  if (!audioUrl) return null;

  const totalDuration = duration > 0 ? duration : durationSeconds || 30;

  return (
    <div className="w-full rounded-2xl dash-card p-6 sm:p-7 flex flex-col gap-5">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false);
          stopSpeech();
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          stopSpeech();
        }}
      />

      {/* Header of Audio Player Card */}
      <div className="flex items-center justify-between pb-1 border-b border-[#edf1f4]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#557352]" />
          <h4 className="text-sm font-bold text-[#191c1f]">
            Audio Stream Playback & Synchronization
          </h4>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#557352]">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[#8c9ba5]">/</span>
          <span className="text-[#5f6c7b]">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Color-coded Waveform Visualizer (Teal & Sage Green matching image_2.png progress bars) */}
      <div className="w-full h-16 flex items-center justify-between gap-1 px-4 py-2 bg-[#f8fafb] rounded-2xl border border-[#e5e9ec] overflow-hidden">
        {Array.from({ length: 54 }).map((_, idx) => {
          const barProgress = idx / 54;
          const currentProgress = totalDuration > 0 ? currentTime / totalDuration : 0;
          const isPlayed = barProgress <= currentProgress;
          const pseudoHeight = 25 + Math.sin(idx * 0.45) * 40 + (idx % 3) * 15;

          return (
            <div
              key={idx}
              onClick={() => {
                if (audioRef.current && totalDuration > 0) {
                  const targetTime = barProgress * totalDuration;
                  audioRef.current.currentTime = targetTime;
                  onTimeUpdate(targetTime);
                  const targetSegIdx = segments.findIndex(
                    (s) => targetTime >= s.start && targetTime <= s.end
                  );
                  if (targetSegIdx !== -1 && isPlaying) {
                    speakFromSegment(targetSegIdx);
                  }
                }
              }}
              className={`flex-1 rounded-full cursor-pointer transition-all duration-100 ${
                isPlayed
                  ? 'bg-[#557352]'
                  : 'bg-[#d5ded4] hover:bg-[#b0c2af]'
              }`}
              style={{
                height: `${Math.max(15, Math.min(95, pseudoHeight))}%`,
              }}
            />
          );
        })}
      </div>

      {/* Scrubber Progress Slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-[#557352] min-w-[55px]">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={totalDuration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-[#e5e9ec] rounded-lg appearance-none cursor-pointer accent-[#557352]"
        />
        <span className="text-xs font-mono font-bold text-[#8c9ba5] min-w-[55px] text-right">
          {formatTime(totalDuration)}
        </span>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Play/Pause, Rewind, AI Voice Toggle */}
        <div className="flex items-center gap-3">
          {/* Main Play/Pause Button (Forest Green Circle matching reference) */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-[#557352] hover:bg-[#435c40] text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          {/* Rewind */}
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                onTimeUpdate(0);
                lastSpokenSegIdRef.current = null;
                if (isPlaying && segments.length > 0) {
                  speakFromSegment(0);
                }
              }
            }}
            className="p-2.5 rounded-full bg-[#f1f4f7] hover:bg-[#e2e7ec] text-[#5f6c7b] hover:text-[#191c1f] transition-all cursor-pointer"
            title="Restart audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* AI Spoken Voice Switch */}
          <button
            onClick={() => {
              setSpeechEnabled(!speechEnabled);
              if (speechEnabled) stopSpeech();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              speechEnabled
                ? 'bg-[#e8f2e6] text-[#2d6329] border-[#c4dec1]'
                : 'bg-[#f1f4f7] text-[#5f6c7b] border-[#e5e9ec] hover:bg-[#e2e7ec]'
            }`}
            title="Toggle AI voice readout"
          >
            <Volume1 className={`w-3.5 h-3.5 ${speechEnabled ? 'text-[#2d6329]' : 'text-[#8c9ba5]'}`} />
            <span>{speechEnabled ? 'AI Voice: ON' : 'AI Voice: OFF'}</span>
          </button>
        </div>

        {/* Right: Playback Speed & Volume Slider */}
        <div className="flex items-center gap-3">
          {/* Speed Pill */}
          <button
            onClick={cyclePlaybackRate}
            className="px-3.5 py-1.5 rounded-full bg-[#f1f4f7] hover:bg-[#e2e7ec] text-xs font-mono font-bold text-[#191c1f] transition-all cursor-pointer flex items-center gap-1.5"
            title="Playback Speed"
          >
            <FastForward className="w-3.5 h-3.5 text-[#557352]" />
            <span>{playbackRate}x</span>
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 bg-[#f8fafb] px-3 py-1.5 rounded-full border border-[#e5e9ec]">
            <button
              onClick={toggleMute}
              className="text-[#5f6c7b] hover:text-[#191c1f] transition-all cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#dc2626]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-[#d0d7de] rounded-lg appearance-none cursor-pointer accent-[#557352]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
