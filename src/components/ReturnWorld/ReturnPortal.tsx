import React from 'react';
import { Home, ArrowUp, ArrowUpRight } from 'lucide-react';

interface ReturnPortalProps {
  onReturnHome: () => void;
  isReturning: boolean;
}

export const ReturnPortal: React.FC<ReturnPortalProps> = ({ onReturnHome, isReturning }) => {
  const [emailText, setEmailText] = React.useState('Email');

  const handleEmailClick = () => {
    // Attempt mailto, but also copy to clipboard just in case they have no mail client
    navigator.clipboard.writeText('ineshag123@gmail.com');
    setEmailText('Copied!');
    setTimeout(() => setEmailText('Email'), 2000);
  };

  return (
    <div className="relative z-20 py-24 px-6 sm:px-14 flex flex-col items-center text-center bg-[#0a0a12] border-t border-white/5">
      {/* The Warm Glowing Pixel Window */}
      <div
        onClick={onReturnHome}
        className={`group relative w-[170px] h-[230px] sm:w-[200px] sm:h-[265px] rounded-xl p-2 cursor-pointer
          bg-gradient-to-b from-[#3d1a0a] to-[#1a0800] border-2 border-[#e8a84a] shadow-[0_0_70px_rgba(232,168,74,0.45)]
          hover:shadow-[0_0_100px_rgba(232,168,74,0.75)] transition-all duration-500 transform hover:scale-105 flex flex-col justify-between overflow-hidden select-none
          ${isReturning ? 'scale-125 ring-8 ring-[#e8a84a] shadow-[0_0_130px_rgba(232,168,74,0.95)]' : ''}
        `}
      >
        {/* Volumetric Amber Backlight */}
        <div className="absolute inset-0 bg-[#e8a84a]/35 blur-xl group-hover:bg-[#e8a84a]/65 transition-all pointer-events-none" />

        {/* Pixel Window View of the 2 AM Room */}
        <div 
          className="relative w-full h-full rounded-lg overflow-hidden pixelated bg-cover bg-center border border-[#8b3a1a] flex flex-col justify-between p-2"
          style={{
            backgroundImage: `url('/assets/room.png')`,
            filter: 'brightness(1.15) contrast(1.2)',
          }}
        >
          {/* Window Grid Panes */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none border border-[#3d1a0a]/80">
            <div className="border-r border-b border-[#3d1a0a]/80" />
            <div className="border-b border-[#3d1a0a]/80" />
            <div className="border-r border-[#3d1a0a]/80" />
            <div />
          </div>

          <div className="relative z-10 flex justify-between">
            <span className="text-[8px] font-mono text-[#1a0800] bg-[#e8a84a] px-1.5 py-0.5 rounded shadow font-bold">
              2:00 AM
            </span>
          </div>

          <div className="relative z-10 text-center">
            <span className="text-[9px] font-grotesk font-bold text-[#1a0800] bg-[#e8a84a] px-2.5 py-1 rounded shadow inline-flex items-center gap-1">
              <Home size={11} /> Return Home
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onReturnHome}
        className="mt-4 flex items-center gap-2 text-stone-300 hover:text-[#e8a84a] font-grotesk text-xs tracking-wider transition-colors"
      >
        <span>Click the window to return to the room</span>
        <ArrowUp size={12} className="animate-bounce" />
      </button>

      {/* Clean Human Contact Typography */}
      <div className="w-full max-w-2xl mt-16 pt-8 border-t border-white/10 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-14 font-grotesk text-xs sm:text-sm tracking-widest uppercase">
          <a
            href="mailto:ineshag123@gmail.com"
            onClick={handleEmailClick}
            className="flex items-center gap-1.5 text-stone-300 hover:text-[#e8a84a] transition-colors"
          >
            <span>{emailText}</span>
            <ArrowUpRight size={13} />
          </a>

          <a
            href="https://github.com/IneshAg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-stone-300 hover:text-[#00ffe1] transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} />
          </a>

          <a
            href="https://www.linkedin.com/in/inesh-agarwal/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-stone-300 hover:text-[#b400ff] transition-colors"
          >
            <span>LinkedIn</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        <div className="mt-8 text-xs font-grotesk text-stone-500 tracking-wider">
          INESH AGARWAL — DESIGNER — 2026
        </div>
      </div>
    </div>
  );
};
