import React, { useEffect, useRef, useState } from 'react';
import { audioManager } from '../../audio/AudioManager';
import { Play, Pause, SkipForward, Radio, Disc } from 'lucide-react';

interface ChaoticDigitalPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const ChaoticDigitalPlayer: React.FC<ChaoticDigitalPlayerProps> = ({
  isPlaying,
  onTogglePlay,
}) => {
  const [currentTrack, setCurrentTrack] = useState(audioManager.getCurrentTrack());
  const [currentTime, setCurrentTime] = useState('00:47');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync track name with scroll progress dynamically
  useEffect(() => {
    const handleProgress = () => {
      setCurrentTrack(audioManager.getCurrentTrack());
    };
    window.addEventListener('audiomanager:progress', handleProgress);
    return () => window.removeEventListener('audiomanager:progress', handleProgress);
  }, []);

  // Cycle tracks
  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.nextTrack();
    setCurrentTrack(audioManager.getCurrentTrack());
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  // Audio-reactive, architectural waveform passing through the player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = (canvas.width = canvas.clientWidth);
      const height = (canvas.height = canvas.clientHeight);

      ctx.clearRect(0, 0, width, height);

      // Fetch live frequency & time domain FFT data from AudioManager
      const freqData = audioManager.getAudioFrequencyData();
      const timeData = audioManager.getAudioTimeData();

      // Energy calculation
      let totalEnergy = 0;
      for (let i = 0; i < freqData.length; i++) {
        totalEnergy += freqData[i];
      }
      const avgEnergy = isPlaying ? totalEnergy / (freqData.length * 255) : 0.06;
      phase += 0.03 + avgEnergy * 0.07;

      // 1. Slit-Scan Architectural Waveform Bars (Passing horizontally across the unit)
      const barCount = 42;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        const bin = Math.floor((i / barCount) * (freqData.length - 1));
        const amp = isPlaying ? (freqData[bin] / 255) * (height * 0.85) : Math.sin(phase + i * 0.3) * (height * 0.2);
        const x = i * barWidth;
        const barH = Math.max(4, amp);
        const y = (height - barH) / 2;

        // Gradient coloring
        if (i % 6 === 0) {
          ctx.fillStyle = 'rgba(180, 0, 255, 0.85)';
        } else if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(0, 255, 225, 0.9)';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        }

        ctx.fillRect(x + 1, y, Math.max(1.5, barWidth - 3), barH);
      }

      // 2. Cyan Continuous Waveform Ribbon (Overlay)
      ctx.beginPath();
      ctx.strokeStyle = '#00ffe1';
      ctx.lineWidth = 2;

      for (let i = 0; i < barCount; i++) {
        const bin = Math.floor((i / barCount) * (freqData.length - 1));
        const timeVal = isPlaying ? ((timeData[bin] - 128) / 128) * (height * 0.35) : 0;
        const x = i * barWidth + barWidth / 2;
        const y = height / 2 + Math.sin(phase * 1.6 + i * 0.35) * (height * 0.25) + timeVal;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Corrupted time ticker
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      const sec = Math.floor(Date.now() / 1000) % 60;
      setCurrentTime(`00:${sec < 10 ? '0' + sec : sec}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div
      className="chaotic-player-rig relative w-full max-w-[540px] select-none cursor-pointer group"
      onClick={onTogglePlay}
      data-testid="chaotic-music-player"
      title="Digital Music Machine — Click to toggle signal"
    >
      {/* Background Distressed Material Texture */}
      <div
        className="absolute -inset-4 opacity-30 pointer-events-none rounded-lg mix-blend-screen"
        style={{
          backgroundImage: 'url("/assets/distressed_texture.jpg")',
          backgroundSize: 'cover',
          filter: 'contrast(1.4)',
        }}
      />

      {/* Upper Status Bar */}
      <div className="relative mb-2 flex items-center justify-between font-mono text-[9px] text-[#00ffe1] tracking-widest bg-[#0b0b16]/90 border border-[#00ffe1]/30 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2">
          <Radio size={12} className={isPlaying ? 'animate-pulse text-[#00ffe1]' : 'text-stone-500'} />
          <span>CYBERNETIC_AUDIO_RIG // MUTATED_VINYL</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[8px]">
          <span className="text-[#e8a84a]">44.1kHz</span>
          <span className="text-stone-600">|</span>
          <span className={isPlaying ? 'text-[#00ffe1]' : 'text-stone-500'}>
            {isPlaying ? 'SIGNAL_ACTIVE' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Main Deconstructed Device Housing */}
      <div className="relative bg-[#0d0d1a]/95 border border-[#2b2b48] p-4 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 items-center">
          
          {/* ============================================================
              LEFT: THE MUTATED VINYL DISC & SEGMENTED ROTATING RINGS
              ============================================================ */}
          <div className="col-span-5 relative flex items-center justify-center py-2">
            {/* Outer Segmented Orbital Ring */}
            <svg
              className={`absolute w-[140px] h-[140px] pointer-events-none ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
              viewBox="0 0 140 140"
            >
              <circle
                cx="70"
                cy="70"
                r="64"
                fill="none"
                stroke="#00ffe1"
                strokeWidth="1.5"
                strokeDasharray="16 12 32 8"
                strokeOpacity="0.6"
              />
              <circle
                cx="70"
                cy="70"
                r="56"
                fill="none"
                stroke="#b400ff"
                strokeWidth="1"
                strokeDasharray="4 6 12 10"
                strokeOpacity="0.5"
              />
            </svg>

            {/* The Record Platter (Same object from the cozy room, evolved) */}
            <div
              className={`relative w-[105px] h-[105px] rounded-full bg-[#11111d] border border-[#2a2a40] shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden ${
                isPlaying ? 'animate-spin-record' : ''
              }`}
            >
              {/* Vinyl Grooves */}
              <div
                className="absolute inset-1 rounded-full border border-stone-700/40"
                style={{
                  background:
                    'repeating-radial-gradient(circle, #0e0e18 0px, #0e0e18 2px, #1a1a2c 3px, #0e0e18 4px)',
                }}
              />

              {/* Cyan / Amber Center Label */}
              <div className="relative w-8 h-8 rounded-full bg-[#080811] border border-[#00ffe1] flex items-center justify-center shadow-[0_0_12px_#00ffe1]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e8a84a]" />
              </div>
            </div>

            {/* Industrial Spindle Clamp / Tonearm Sensor */}
            <div className="absolute -top-1 left-2 bg-[#181828] border border-[#00ffe1]/50 px-2 py-0.5 rounded text-[7px] font-mono text-[#00ffe1] shadow-md">
              SENSOR_LOCK
            </div>
          </div>

          {/* ============================================================
              RIGHT: ATTACHED SCREEN PANEL & CONTROLS
              ============================================================ */}
          <div className="col-span-7 flex flex-col justify-between h-full pl-1">
            {/* Header & Controls */}
            <div className="flex items-start justify-between border-b border-white/10 pb-2">
              <div>
                <span className="block font-mono text-[8px] text-[#b400ff] tracking-wider">
                  {currentTrack.code}
                </span>
                <h4 className="font-grotesk font-bold text-sm text-white tracking-wide mt-0.5">
                  {currentTrack.name}
                </h4>
              </div>

              {/* Transport Buttons */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="p-2 rounded bg-black/80 border border-[#00ffe1]/40 text-[#00ffe1] hover:bg-[#00ffe1]/20 hover:border-[#00ffe1] transition-all shadow-md"
                  title={isPlaying ? 'Pause Signal' : 'Resume Signal'}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>

                <button
                  type="button"
                  onClick={handleNextTrack}
                  className="p-2 rounded bg-black/80 border border-[#e8a84a]/40 text-[#e8a84a] hover:bg-[#e8a84a]/20 hover:border-[#e8a84a] transition-all shadow-md"
                  title="Next Signal Stream"
                >
                  <SkipForward size={13} />
                </button>
              </div>
            </div>

            {/* Slit-Scan Architectural Waveform Screen */}
            <div className="my-2.5 h-[52px] w-full rounded bg-[#04040a] border border-[#00ffe1]/30 overflow-hidden relative shadow-inner">
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute top-1 right-1.5 font-mono text-[7px] text-[#00ffe1]/70 bg-black/60 px-1">
                FFT_STREAM
              </div>
            </div>

            {/* Corrupted Progress Coordinate */}
            <div className="flex items-center justify-between font-mono text-[8px] text-stone-400">
              <span className="text-[#00ffe1]">{currentTime}</span>
              <div className="flex-1 mx-2.5 h-[2px] bg-white/10 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00ffe1] via-[#b400ff] to-[#e8a84a] shadow-[0_0_8px_#00ffe1]"
                  style={{ width: isPlaying ? '72%' : '40%' }}
                />
                <span className="absolute top-[-3px] left-[72%] w-1.5 h-2 bg-[#e8a84a]" />
              </div>
              <span className="text-stone-500">02:31</span>
            </div>
          </div>
        </div>

        {/* Industrial Cable Anchor */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[7.5px] text-stone-500">
          <div className="flex items-center gap-2">
            <Disc size={10} className="text-[#e8a84a]" />
            <span>ORIGIN: 2AM_RECORD // DECONSTRUCTED_UNIT</span>
          </div>
          <span className="text-[#00ffe1]/70">IO_PORT: 8080</span>
        </div>
      </div>
    </div>
  );
};

export default ChaoticDigitalPlayer;
