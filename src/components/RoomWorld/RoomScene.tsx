import React from 'react';
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
        className="group absolute cursor-pointer z-30 pointer-events-auto"
        style={{
          left: '9%',
          top: '34%',
          width: '17.5%',
          height: '25%',
        }}
        title={isPlaying ? 'Click to pause vinyl' : 'Click to spin vinyl & play audio'}
      >
        {/* Subtle Status Cue above the Turntable */}
        <div
          className="absolute -top-7 left-0 flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest text-[#e8a84a] px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-[#e8a84a]/30 transition-all duration-300 group-hover:border-[#e8a84a] group-hover:bg-black/70 shadow-lg"
          style={{ opacity: isPlaying ? 1 : 0.85 }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-[#e8a84a]'}`} />
          <span>{isPlaying ? 'NOW PLAYING' : 'PLAY VINYL'}</span>
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
