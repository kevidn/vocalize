import React, { useEffect } from 'react';
import { X, Server, Layers, Cloud, Terminal } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#ffffff] border border-[#e5e9ec] p-7 sm:p-9 shadow-2xl cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#f1f4f7] hover:bg-[#e2e7ec] text-[#5f6c7b] hover:text-[#191c1f] transition-all cursor-pointer"
          title="Close modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & CV Validation Badge */}
        <div className="flex flex-col gap-1 pb-5 border-b border-[#edf1f4]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#e8f2e6] text-[#2d6329] text-xs font-bold font-mono">
              SYSTEM DESIGN & ARCHITECTURE
            </span>
            <span className="px-3 py-1 rounded-full bg-[#e0f2fe] text-[#0369a1] text-xs font-bold font-mono">
              PRODUCTION SPEC
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#191c1f] mt-1.5">
            Vocalize — End-to-End Platform Topology
          </h2>
          <p className="text-xs text-[#5f6c7b]">
            Architected for low-latency audio chunk streaming, neural STT processing, and containerized cloud deployment.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {/* Layer 1: Client / Frontend */}
          <div className="p-5 rounded-2xl bg-[#f8fafb] border border-[#e5e9ec] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#0369a1] font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>1. Client Tier (React 19 + TS)</span>
            </div>
            <ul className="text-xs text-[#5f6c7b] space-y-2 list-disc list-inside font-medium">
              <li>Vite 6 SPA with Strict TypeScript</li>
              <li>Light Medical Dashboard Design System</li>
              <li>Interactive Waveform Visualization</li>
              <li>Realtime word-timestamp synchronization</li>
              <li>SRT/VTT/JSON/TXT export engine</li>
            </ul>
          </div>

          {/* Layer 2: API Gateway & Backend */}
          <div className="p-5 rounded-2xl bg-[#f8fafb] border border-[#e5e9ec] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#557352] font-bold text-sm">
              <Server className="w-4 h-4" />
              <span>2. API Tier (Express + TS)</span>
            </div>
            <ul className="text-xs text-[#5f6c7b] space-y-2 list-disc list-inside font-medium">
              <li>Multer v2 disk buffer stream handling</li>
              <li>Strict MIME whitelist validation</li>
              <li>Path-traversal sanitization guard</li>
              <li>Centralized ApiError & request tracing</li>
              <li>Colorized production leveled logger</li>
            </ul>
          </div>

          {/* Layer 3: Cloud & Infra */}
          <div className="p-5 rounded-2xl bg-[#f8fafb] border border-[#e5e9ec] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#6b21a8] font-bold text-sm">
              <Cloud className="w-4 h-4" />
              <span>3. Infra Tier (GCP / Docker)</span>
            </div>
            <ul className="text-xs text-[#5f6c7b] space-y-2 list-disc list-inside font-medium">
              <li>Multi-stage Alpine Docker builds</li>
              <li>Docker Compose container orchestration</li>
              <li>GCP Cloud Run / Compute deployment</li>
              <li>GitHub Actions automated CI/CD</li>
              <li>Zero-downtime rolling releases</li>
            </ul>
          </div>
        </div>

        {/* Data Flow Diagram Card */}
        <div className="p-5 rounded-2xl bg-[#f1f4f7] border border-[#e5e9ec] flex flex-col gap-3">
          <div className="text-xs font-bold text-[#191c1f] uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#557352]" />
            Audio Processing Ingestion Lifecycle
          </div>
          <div className="p-3.5 bg-[#ffffff] rounded-xl font-mono text-[11px] text-[#191c1f] leading-relaxed overflow-x-auto border border-[#e5e9ec]">
            <span className="text-[#0369a1] font-bold">Browser Audio Upload</span>
            {' ──[ multipart/form-data ]──> '}
            <span className="text-[#557352] font-bold">Express Ingestion Gateway</span>
            {' ──[ Storage Service ]──> '}
            <span className="text-[#b45309] font-bold">Multer Buffer Staging</span>
            <br />
            {'                                                                               │'}
            <br />
            <span className="text-[#2d6329] font-bold">Client UI Visualizer</span>
            {' <──[ Word-Level Timestamps & SRT ]── '}
            <span className="text-[#6b21a8] font-bold">Google Gemini / Whisper STT</span>
            {' <──┘'}
          </div>
        </div>

        {/* Close CTA */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#557352] hover:bg-[#435c40] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
