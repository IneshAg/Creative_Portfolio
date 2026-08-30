import React from 'react';
import { Play } from 'lucide-react';
import { AudioWaveform } from '../../audio/AudioWaveform';

interface RoomSceneProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
  corruptionProgress: number;
}

export const RoomScene: React.FC<RoomSceneProps> = ({
  isPlaying,
  onToggleAudio,
  corruptionProgress,
}) => {
  const roomOpacity = Math.max(0, 1 - corruptionProgress * 1.5);
  const glitchOffset = corruptionProgress > 0.3 ? (Math.random() - 0.5) * 4 * corruptionProgress : 0;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{
        opacity: roomOpacity,
        transform: `translate(${glitchOffset}px, 0px)`,
        zIndex: 20
      }}
    >
      {/* ============================================================
          INTERACTIVE TURNTABLE HIT-BOX & SUBTLE AUDIO CUE
          ============================================================ */}
      <div
        onClick={onToggleAudio}
        className="group absolute cursor-pointer z-30 pointer-events-auto flex items-center justify-center"
        style={{
          left: '9%',
          top: '34%',
          width: '17.5%',
          height: '25%',
        }}
        title={isPlaying ? 'Click to pause vinyl' : 'Click to spin vinyl & play audio'}
      >
        {/* Prominent Play Overlay when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:scale-110">
            <div className="absolute w-12 h-12 bg-[#e8a84a]/20 rounded-full animate-ping" />
            <div className="relative w-12 h-12 bg-black/60 backdrop-blur-sm border-2 border-[#e8a84a] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(232,168,74,0.4)]">
              <Play className="text-[#e8a84a] ml-1" size={20} fill="currentColor" />
            </div>
          </div>
        )}

        {/* Status Cue above the Turntable */}
        <div
          className={`absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-[0.25em] font-bold px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 shadow-xl ${
            isPlaying 
              ? 'text-[#00ffe1] bg-black/60 border border-[#00ffe1]/30' 
              : 'text-[#e8a84a] bg-black/80 border border-[#e8a84a] group-hover:bg-black group-hover:scale-105 shadow-[0_0_15px_rgba(232,168,74,0.3)]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00ffe1] animate-ping' : 'bg-[#e8a84a]'}`} />
          <span className="whitespace-nowrap">{isPlaying ? 'NOW PLAYING' : 'PLAY VINYL'}</span>
        </div>

        {/* Real-time Subtle Waveform Ribbon below turntable */}
        <div className="absolute -bottom-8 left-0 w-full px-1">
          <AudioWaveform isPlaying={isPlaying} />
        </div>
      </div>

      {/* ============================================================
          MINIMAL HUMAN TYPOGRAPHY
          ============================================================ */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-12 z-20 pointer-events-none">
        <h1 className="font-grotesk font-bold text-xl sm:text-3xl text-[#f7ead6] tracking-wide leading-none">
          INESH AGARWAL
        </h1>
        <p className="font-grotesk text-xs sm:text-sm text-[#e8a84a] tracking-[0.35em] mt-1.5 uppercase font-medium">
          DESIGNER
        </p>
      </div>

      {/* 2:00 AM Atmospheric Time Stamp */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-12 z-20 font-mono text-right pointer-events-none text-[10px] sm:text-xs tracking-widest">
        <span className="block text-stone-400">01 / THE ROOM</span>
        <span className="text-[#e8a84a]">02:00 AM</span>
      </div>

      {/* Scroll Down Prompt */}
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{ opacity: Math.max(0, 1 - corruptionProgress * 3) }}
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-stone-400">SCROLL</span>
        <span className="w-[1px] h-8 bg-gradient-to-b from-[#e8a84a] to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default RoomScene;
