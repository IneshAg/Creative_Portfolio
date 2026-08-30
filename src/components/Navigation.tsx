import React from 'react';
import { Volume2, VolumeX, Disc } from 'lucide-react';

interface NavigationProps {
  isPlaying: boolean;
  isMuted: boolean;
  onToggleAudio: () => void;
  onToggleMute: () => void;
  onJumpToRoom: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isPlaying,
  isMuted,
  onToggleAudio,
  onToggleMute,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-5 flex items-center justify-end pointer-events-none select-none">
      {/* Discreet Audio Mute/Toggle */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={isPlaying ? onToggleMute : onToggleAudio}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-stone-300 hover:text-white transition-all text-xs font-grotesk bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-md"
          title={isPlaying ? (isMuted ? 'Unmute Audio' : 'Mute Audio') : 'Play 2 AM Ambient Audio'}
        >
          {isPlaying ? (
            isMuted ? (
              <>
                <VolumeX size={12} className="text-stone-400" />
                <span className="text-[10px] text-stone-400 font-mono">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 size={12} className="text-[#e8a84a] animate-pulse" />
                <span className="text-[10px] text-[#e8a84a] font-mono">2 AM SOUND</span>
              </>
            )
          ) : (
            <>
              <Disc size={12} className="text-stone-400" />
              <span className="text-[10px] text-stone-400 font-mono">AUDIO OFF</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
