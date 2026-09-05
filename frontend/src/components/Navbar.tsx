import React, { useEffect, useState } from 'react';
import { Mic, Layers, Sparkles, Cloud, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';

interface NavbarProps {
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArchitecture }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'healthy' | 'offline'>('checking');

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        await ApiService.checkHealth();
        if (mounted) setBackendStatus('healthy');
      } catch {
        if (mounted) setBackendStatus('offline');
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="dash-card px-5 sm:px-6 h-20 flex items-center justify-between">
        {/* Left: Simplified Vocalize Logo */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#557352] text-white shadow-sm">
            <Mic className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#191c1f]">
                Vocalize
              </h1>
            </div>
            <p className="text-xs text-[#5f6c7b] font-medium hidden sm:block">
              Production-Grade Speech Processing Platform
            </p>
          </div>
        </div>

        {/* Right: Chip-style indicator cards */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* API Status Chip (Pastel Green) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f2e6] text-[#2d6329] text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'healthy'
                  ? 'bg-[#22c55e]'
                  : backendStatus === 'offline'
                  ? 'bg-[#ef4444]'
                  : 'bg-[#f59e0b] animate-pulse'
              }`}
            />
            <span>{backendStatus === 'healthy' ? 'API Online' : backendStatus === 'offline' ? 'API Offline' : 'Checking...'}</span>
          </div>

          {/* Model Chip (Pastel Sage Green) */}
          <div className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e8f2e6] text-[#2d6329] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#557352]" />
            <span>Whisper-Large-v3</span>
          </div>

          {/* Powered by Google AI Cloud Chip (Pastel Blue) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-xs font-medium">
            <Cloud className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Google AI Cloud</span>
          </div>

          {/* System Architecture Button & User Avatar (Dark pill matching reference) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191c1f] hover:bg-[#2d3136] text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#e8f2e6]" />
              <span className="hidden sm:inline">System Architecture</span>
            </button>

            {/* User Profile avatar placeholder / Clerk integration icon */}
            <div 
              onClick={onOpenArchitecture}
              title="User Account & Architecture"
              className="w-8 h-8 rounded-full bg-[#557352] text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 hover:ring-[#557352]/40 transition-all"
            >
              VK
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
