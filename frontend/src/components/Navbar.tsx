import React, { useEffect, useRef, useState } from 'react';
import { Mic, Layers, Sparkles, Cloud, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ApiService } from '../services/api';

const user = {
  fullName: 'Vocalize Platform',
  email: 'dev@vocalize.ai',
};

const contentAnimations = {
  initial: { opacity: 0, filter: 'blur(6px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { delay: 0.1 } },
  exit: { opacity: 0, filter: 'blur(6px)' },
};

const SPRING = { type: 'spring', bounce: 0.15, visualDuration: 0.2 };

function SettingsTriggerIcon() {
  return (
    <motion.div
      layoutId="clerk-avatar"
      transition={SPRING}
      className="w-10 h-10 rounded-full bg-[#191c1f] text-white flex items-center justify-center shrink-0 shadow-sm"
      title="Platform Settings & System Architecture"
    >
      <Menu className="w-5 h-5 text-[#e8f2e6]" />
    </motion.div>
  );
}

function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      className="h-9 flex items-center gap-2.5 px-3.5 text-xs text-[#191c1f] font-semibold rounded-xl hover:bg-[#f1f4f7] cursor-pointer transition-colors"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function MenuContent({
  onOpenArchitecture,
  onClose,
}: {
  onOpenArchitecture: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      layoutId="clerk-userbtn"
      className="absolute top-0 right-0 z-50 w-72 p-2 rounded-2xl bg-white border border-[#e5e9ec] shadow-xl flex flex-col gap-1"
      transition={SPRING}
    >
      {/* Menu Header with Settings Trigger Icon Persistent */}
      <div className="flex items-center gap-3 p-2.5 border-b border-[#edf1f4]">
        <SettingsTriggerIcon />
        <motion.div
          className="flex flex-col text-left"
          initial={contentAnimations.initial}
          animate={contentAnimations.animate}
          exit={contentAnimations.exit}
        >
          <p className="text-xs font-bold text-[#191c1f]">{user.fullName}</p>
          <p className="text-[11px] text-[#5f6c7b] truncate max-w-[150px]">{user.email}</p>
        </motion.div>
      </div>

      {/* Menu Items */}
      <motion.div
        className="flex flex-col gap-0.5 p-1"
        initial={contentAnimations.initial}
        animate={contentAnimations.animate}
        exit={contentAnimations.exit}
      >
        <MenuItem
          onClick={() => {
            onOpenArchitecture();
            onClose();
          }}
        >
          <Layers className="w-4 h-4 text-[#557352]" />
          <span>System Architecture Topology</span>
        </MenuItem>

        <MenuItem
          onClick={() => {
            window.open('https://github.com/kevidn/vocalize', '_blank');
          }}
        >
          <Cloud className="w-4 h-4 text-[#0284c7]" />
          <span>GitHub Source Repository</span>
        </MenuItem>
      </motion.div>
    </motion.div>
  );
}

function SettingsUserButton({ onOpenArchitecture }: { onOpenArchitecture: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={rootRef}>
      <AnimatePresence>
        {!open ? (
          <motion.div
            key="closed"
            layoutId="clerk-userbtn"
            className="p-0 rounded-full bg-[#191c1f] hover:bg-[#2d3136] cursor-pointer flex items-center justify-center shadow-sm"
            transition={SPRING}
            onClick={() => setOpen(true)}
            aria-label="Open system menu"
          >
            <SettingsTriggerIcon />
          </motion.div>
        ) : (
          <MenuContent
            key="open"
            onOpenArchitecture={onOpenArchitecture}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

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

        {/* Right: Chip-style indicator cards & Settings Menu Button */}
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

          {/* Settings Menu Button with Motion Popover */}
          <SettingsUserButton onOpenArchitecture={onOpenArchitecture} />
        </div>
      </div>
    </header>
  );
};
