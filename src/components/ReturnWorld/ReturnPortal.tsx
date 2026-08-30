import React from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

interface ReturnPortalProps {
  onReturnHome: () => void;
  isReturning: boolean;
}

export const ReturnPortal: React.FC<ReturnPortalProps> = ({ onReturnHome, isReturning }) => {
  const [emailCopied, setEmailCopied] = React.useState(false);

  const handleEmailClick = () => {
    // Open mailto — this is the primary action
    // window.location.href = 'mailto:ineshag123@gmail.com'; // let the <a> tag do this
    // Also copy to clipboard as a fallback
    try {
      navigator.clipboard.writeText('ineshag123@gmail.com').then(() => {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      });
    } catch (_) {}
  };

  return (
    <div
      className="relative z-20 py-24 px-6 sm:px-14 flex flex-col items-center text-center"
      style={{
        background: 'linear-gradient(to bottom, rgba(10,10,18,0.7) 0%, rgba(10,10,18,0.97) 15%, #0a0a12 35%)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    >
      {/* Return Home button — minimal text only */}
      <button
        onClick={onReturnHome}
        className={`group flex flex-col items-center gap-3 transition-all duration-500 ${isReturning ? 'scale-110' : ''}`}
      >
        <div className="w-12 h-12 rounded-full border border-[#e8a84a]/40 flex items-center justify-center group-hover:border-[#e8a84a] group-hover:shadow-[0_0_24px_rgba(232,168,74,0.4)] transition-all duration-300">
          <ArrowUp size={18} className="text-[#e8a84a]" />
        </div>
        <span className="font-mono text-[10px] tracking-[0.35em] text-stone-500 group-hover:text-[#e8a84a] transition-colors uppercase">
          Return to Room
        </span>
      </button>

      {/* Divider */}
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent mt-12" />

      {/* Contact Links */}
      <div className="mt-12 w-full max-w-lg">
        <p className="font-mono text-[10px] tracking-[0.4em] text-stone-600 mb-8 uppercase">
          Connect
        </p>
        <div className="flex flex-col gap-0">
          {/* Email — primary contact */}
          <a
            href="mailto:ineshag123@gmail.com"
            onClick={handleEmailClick}
            className="group flex items-center justify-between py-5 border-t border-white/8 hover:border-[#e8a84a]/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-stone-600 tracking-widest w-6">01</span>
              <span className="font-grotesk text-lg sm:text-xl font-bold text-white group-hover:text-[#e8a84a] transition-colors">
                {emailCopied ? 'Copied ✓' : 'Email'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-stone-500 tracking-widest group-hover:text-[#e8a84a] transition-colors">
                ineshag123@gmail.com
              </span>
              <ArrowUpRight size={14} className="text-stone-600 group-hover:text-[#e8a84a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/IneshAg"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-5 border-t border-white/8 hover:border-[#00ffe1]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-stone-600 tracking-widest w-6">02</span>
              <span className="font-grotesk text-lg sm:text-xl font-bold text-white group-hover:text-[#00ffe1] transition-colors">GitHub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-stone-500 tracking-widest group-hover:text-[#00ffe1] transition-colors">IneshAg</span>
              <ArrowUpRight size={14} className="text-stone-600 group-hover:text-[#00ffe1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/inesh-agarwal/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-5 border-t border-b border-white/8 hover:border-[#b400ff]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-stone-600 tracking-widest w-6">03</span>
              <span className="font-grotesk text-lg sm:text-xl font-bold text-white group-hover:text-[#b400ff] transition-colors">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-stone-500 tracking-widest group-hover:text-[#b400ff] transition-colors">inesh-agarwal</span>
              <ArrowUpRight size={14} className="text-stone-600 group-hover:text-[#b400ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </a>
        </div>
      </div>

      <div className="mt-14 font-mono text-[9px] tracking-[0.4em] text-stone-700 uppercase">
        Inesh Agarwal — Designer — 2026
      </div>
    </div>
  );
};
