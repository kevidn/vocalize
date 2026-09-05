import React, { useEffect, useRef, useState } from 'react';
import { Mic, Layers, Sparkles, Cloud, Code, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ApiService } from '../services/api';

const user = {
  fullName: 'Vocalize Developer',
  email: 'dev@vocalize.ai',
  initials: 'VK',
};

const contentAnimations = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { delay: 0.15 } },
  exit: { opacity: 0, filter: 'blur(8px)' },
};

const SPRING = { type: 'spring', bounce: 0.15, visualDuration: 0.25 };

function Avatar({ large = false }: { large?: boolean }) {
  return (
    <motion.div
      layoutId="clerk-avatar"
      transition={SPRING}
      className={
        large
          ? 'w-10 h-10 rounded-full bg-gradient-to-br from-[#557352] to-[#3b6b37] text-white flex items-center justify-center text-sm font-semibold shadow-sm shrink-0'
          : 'w-8 h-8 rounded-full bg-[#557352] text-white flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer hover:ring-2 hover:ring-[#557352]/40 transition-all'
      }
    >
      {user.initials}
    </motion.div>
  );
}

function SecuredByClerk() {
  return (
    <a
      href="https://clerk.com"
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
    >
      <span className="text-[10px]">Secured by</span>
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 14" className="h-3 text-current">
        <ellipse cx="7.889" cy="7" rx="2.187" ry="2.188" fill="currentColor"></ellipse>
        <path
          d="M11.83 12.18a.415.415 0 0 1-.05.64A6.967 6.967 0 0 1 7.888 14a6.967 6.967 0 0 1-3.891-1.18.415.415 0 0 1-.051-.64l1.598-1.6a.473.473 0 0 1 .55-.074 3.92 3.92 0 0 0 1.794.431 3.92 3.92 0 0 0 1.792-.43.473.473 0 0 1 .551.074l1.599 1.598Z"
          fill="currentColor"
        ></path>
        <path
          opacity="0.5"
          d="M11.78 1.18a.415.415 0 0 1 .05.64l-1.598 1.6a.473.473 0 0 1-.55.073 3.937 3.937 0 0 0-5.3 5.3.473.473 0 0 1-.074.55L2.71 10.942a.415.415 0 0 1-.641-.051 7 7 0 0 1 9.71-9.71Z"
          fill="currentColor"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.748 1.422c0-.06.05-.11.11-.11h1.64c.06 0 .11.05.11.11v11.156a.11.11 0 0 1-.11.11h-1.64a.11.11 0 0 1-.11-.11V1.422Zm-2.315 8.9a.112.112 0 0 0-.15.004 2.88 2.88 0 0 1-.884.569c-.36.148-.747.222-1.137.219-.33.01-.658-.047-.965-.166a2.422 2.422 0 0 1-.817-.527c-.424-.432-.668-1.05-.668-1.785 0-1.473.98-2.48 2.45-2.48.394-.005.785.074 1.144.234.325.144.617.35.86.607.04.044.11.049.155.01l1.108-.959a.107.107 0 0 0 .01-.152c-.832-.93-2.138-1.412-3.379-1.412-2.499 0-4.27 1.686-4.27 4.166 0 1.227.44 2.26 1.182 2.99.743.728 1.801 1.157 3.022 1.157 1.53 0 2.763-.587 3.485-1.34a.107.107 0 0 0-.009-.155l-1.137-.98Zm13.212-1.14a.108.108 0 0 1-.107.096H28.79a.106.106 0 0 0-.104.132c.286 1.06 1.138 1.701 2.302 1.701a2.59 2.59 0 0 0 1.136-.236 2.55 2.55 0 0 0 .862-.645.08.08 0 0 1 .112-.01l1.155 1.006c.044.039.05.105.013.15-.698.823-1.828 1.42-3.38 1.42-2.386 0-4.185-1.651-4.185-4.162 0-1.232.424-2.264 1.13-2.994.373-.375.82-.67 1.314-.87a3.968 3.968 0 0 1 1.557-.285c2.419 0 3.983 1.701 3.983 4.05a6.737 6.737 0 0 1-.04.647Zm-5.924-1.524a.104.104 0 0 0 .103.133h3.821c.07 0 .123-.066.103-.134-.26-.901-.921-1.503-1.947-1.503a2.13 2.13 0 0 0-.88.16 2.1 2.1 0 0 0-.733.507 2.242 2.242 0 0 0-.467.837Zm11.651-3.172c.061-.001.11.048.11.109v1.837a.11.11 0 0 1-.117.109 7.17 7.17 0 0 0-.455-.024c-1.43 0-2.27 1.007-2.27 2.329v3.732a.11.11 0 0 1-.11.11h-1.64a.11.11 0 0 1-.11-.11v-7.87c0-.06.049-.109.11-.109h1.64c.06 0 .11.05.11.11v1.104a.011.011 0 0 0 .02.007c.64-.857 1.587-1.333 2.587-1.333l.125-.001Zm4.444 4.81a.035.035 0 0 1 .056.006l2.075 3.334a.11.11 0 0 0 .093.052h1.865a.11.11 0 0 0 .093-.168L46.152 7.93a.11.11 0 0 1 .012-.131l2.742-3.026a.11.11 0 0 0-.081-.183h-1.946a.11.11 0 0 0-.08.036l-3.173 3.458a.11.11 0 0 1-.19-.074V1.422a.11.11 0 0 0-.11-.11h-1.64a.11.11 0 0 0-.11.11v11.156c0 .06.05.11.11.11h1.64a.11.11 0 0 0 .11-.11v-1.755a.11.11 0 0 1 .03-.075l1.35-1.452Z"
          fill="currentColor"
        ></path>
      </svg>
    </a>
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
      className="h-8 flex items-center gap-2 px-3 text-xs text-[#191c1f] font-medium rounded-lg hover:bg-[#f1f4f7] cursor-pointer transition-colors"
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
      className="absolute top-0 right-0 z-50 w-60 p-1.5 rounded-2xl bg-white border border-[#e5e9ec] shadow-xl"
      transition={SPRING}
    >
      <div className="flex flex-col gap-2 p-2.5 border-b border-[#edf1f4]">
        <div className="flex items-center gap-2.5">
          <Avatar large />
          <motion.div
            className="flex flex-col text-left"
            initial={contentAnimations.initial}
            animate={contentAnimations.animate}
            exit={contentAnimations.exit}
          >
            <p className="text-xs font-bold text-[#191c1f]">{user.fullName}</p>
            <p className="text-[11px] text-[#5f6c7b] truncate max-w-[130px]">{user.email}</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="flex flex-col gap-0.5 p-1 mt-1"
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
          <Layers className="w-3.5 h-3.5 text-[#557352]" />
          <span>System Architecture</span>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onOpenArchitecture();
            onClose();
          }}
        >
          <Code className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>View Tech Stack & Code</span>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onClose();
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>API Specs & Health</span>
        </MenuItem>

        <div className="mt-1 pt-1 border-t border-[#edf1f4]">
          <SecuredByClerk />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ClerkUserButton({ onOpenArchitecture }: { onOpenArchitecture: () => void }) {
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
          <motion.button
            key="closed"
            layoutId="clerk-userbtn"
            className="p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center"
            style={{ borderRadius: 99 }}
            transition={SPRING}
            onClick={() => setOpen(true)}
            aria-label="Open user menu"
          >
            <Avatar />
          </motion.button>
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

            {/* Clerk User Button Avatar with Motion Menu */}
            <ClerkUserButton onOpenArchitecture={onOpenArchitecture} />
          </div>
        </div>
      </div>
    </header>
  );
};
