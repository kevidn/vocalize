import React from 'react';
import { Mic } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#e5e9ec] py-8 px-4 sm:px-6 lg:px-8 mt-16 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#e8f2e6] text-[#3b6b37] flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#191c1f]">Vocalize Platform</div>
            <p className="text-[11px] text-[#5f6c7b]">
              Production-Grade Speech Processing Platform
            </p>
          </div>
        </div>

        {/* Stack badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['React 19', 'TypeScript', 'Node.js Express', 'Docker', 'Google Cloud', 'Whisper STT'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-[#f1f4f7] border border-[#e5e9ec] text-[11px] font-semibold text-[#5f6c7b]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#8c9ba5] text-center sm:text-right font-medium">
          Clean Architecture & Enterprise Scalability
        </div>
      </div>
    </footer>
  );
};
