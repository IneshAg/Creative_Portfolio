import React, { useEffect, useRef } from 'react';
import { audioManager } from './AudioManager';

interface AudioWaveformProps {
  isPlaying: boolean;
  corruptionProgress?: number;
  className?: string;
  isHovered?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  corruptionProgress = 0,
  className = '',
  isHovered = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const idlePhaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    let height = (canvas.height = 40);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 40;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      idlePhaseRef.current += isHovered ? 0.08 : 0.03;
      const phase = idlePhaseRef.current;

      ctx.clearRect(0, 0, width, height);

      // Get live audio data
      const timeData = isPlaying ? audioManager.getAudioTimeData() : new Uint8Array(64).fill(128);
      const freqData = isPlaying ? audioManager.getAudioFrequencyData() : new Uint8Array(64).fill(0);

      const midY = height / 2;
      const points = 48;
      const step = width / (points - 1);

      // Transition color shifts
      let primaryColor = 'rgba(232, 168, 74, 0.85)';
      let secondaryColor = 'rgba(196, 98, 26, 0.4)';

      if (corruptionProgress > 0.15 && corruptionProgress <= 0.5) {
        primaryColor = 'rgba(0, 255, 225, 0.85)';
        secondaryColor = 'rgba(232, 168, 74, 0.5)';
      } else if (corruptionProgress > 0.5) {
        primaryColor = 'rgba(0, 255, 225, 0.95)';
        secondaryColor = 'rgba(180, 0, 255, 0.8)';
      }

      // Draw baseline glow
      ctx.beginPath();
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Main waveform path
      ctx.beginPath();
      ctx.lineWidth = isHovered ? 2.5 : 1.75;
      ctx.strokeStyle = primaryColor;

      for (let i = 0; i < points; i++) {
        const x = i * step;
        const dataIndex = Math.floor((i / points) * (timeData.length - 1));
        const audioVal = isPlaying ? (timeData[dataIndex] - 128) / 128 : 0;
        const freqVal = isPlaying ? freqData[dataIndex] / 255 : 0;

        // Base wave calculation
        let amplitude = (audioVal * 16 + freqVal * 8);
        if (!isPlaying) {
          amplitude = Math.sin(phase + i * 0.2) * (isHovered ? 5 : 2.5);
        }

        // Corruption distortions
        if (corruptionProgress > 0.1) {
          const glitchAmount = Math.min(1, corruptionProgress * 1.5);
          const noise = (Math.random() - 0.5) * 12 * glitchAmount;
          const jitter = Math.sin(phase * 4 + i * 1.2) * 8 * glitchAmount;
          amplitude += noise + jitter;
        }

        if (corruptionProgress > 0.6) {
          amplitude = Math.round(amplitude / 4) * 4 + (Math.random() > 0.8 ? (Math.random() - 0.5) * 20 : 0);
        }

        const y = Math.max(2, Math.min(height - 2, midY + amplitude));

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Secondary ghost wave for chromatic aberration during corruption
      if (corruptionProgress > 0.2) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(180, 0, 255, 0.7)';
        const offset = corruptionProgress * 6;
        for (let i = 0; i < points; i++) {
          const x = i * step + offset;
          const dataIndex = Math.floor((i / points) * (timeData.length - 1));
          const audioVal = isPlaying ? (timeData[dataIndex] - 128) / 128 : 0;
          const y = midY - (audioVal * 14) + Math.sin(phase * 2 + i * 0.4) * 3;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, corruptionProgress, isHovered]);

  return (
    <div className={`relative flex flex-col items-center w-full max-w-[280px] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-[40px] pointer-events-none filter drop-shadow-[0_0_8px_rgba(232,168,74,0.3)]"
      />
      <div className="flex justify-between w-full text-[10px] tracking-widest text-[#e8a84a]/60 uppercase font-mono mt-1">
        <span>{isPlaying ? 'LIVE STREAM' : 'STANDBY'}</span>
        <span>{corruptionProgress > 0.3 ? 'SIGNAL: ERR' : '44.1 KHZ'}</span>
      </div>
    </div>
  );
};
