import { useMemo } from 'react';

export const ChapterMarker = ({ progress }: { progress: number }) => {
  const { text, color, rgbGlitch, opacity, letterSpacing } = useMemo(() => {
    // Stage 1: CALM
    if (progress < 0.1) return { text: 'CALM', color: '#e8a84a', rgbGlitch: false, opacity: 0.5, letterSpacing: '0.4em' };
    
    // Stage 2: C A L M
    if (progress < 0.25) return { text: 'C A L M', color: '#e8a84a', rgbGlitch: false, opacity: 0.5, letterSpacing: '0.6em' };
    
    // Stage 3: C ? L M (distorting)
    if (progress < 0.4) return { text: 'C ? L M', color: '#e8a84a', rgbGlitch: true, opacity: 0.6, letterSpacing: '0.7em' };
    
    // Stage 4: C ?A ?L ?M
    if (progress < 0.55) return { text: 'C ?A ?L ?M', color: '#ff6b00', rgbGlitch: true, opacity: 0.7, letterSpacing: '0.8em' };
    
    // Stage 5: CORRUPTION
    if (progress < 0.75) return { text: 'CORRUPTION', color: '#ff003c', rgbGlitch: true, opacity: 0.9, letterSpacing: '0.5em' };
    
    // Stage 6: CHAOS (settling)
    if (progress < 0.9) return { text: 'CHAOS', color: '#00ffe1', rgbGlitch: true, opacity: 0.7, letterSpacing: '0.6em' };
    
    // Stage 7: CHAOS (stable)
    return { text: 'CHAOS', color: '#00ffe1', rgbGlitch: false, opacity: 0.4, letterSpacing: '0.5em' };
  }, [progress]);

  // Fast jitter effect triggered by scroll changes when rgbGlitch is active
  const jitter = rgbGlitch ? Math.sin(progress * 2000) * 3 : 0;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 'clamp(20px, 4vh, 40px)',
      left: 'clamp(20px, 4vw, 40px)',
      zIndex: 100,
      pointerEvents: 'none',
      fontFamily: 'monospace',
      fontSize: 'clamp(8px, 1vw, 11px)',
      fontWeight: 600,
      opacity: opacity,
      transition: 'opacity 0.3s ease, letter-spacing 0.5s ease',
      letterSpacing: letterSpacing,
      textShadow: rgbGlitch ? `${jitter}px 0 #ff003c, ${-jitter}px 0 #00ffe1` : 'none'
    }}>
      <span style={{ color, transition: 'color 0.5s ease' }}>{text}</span>
    </div>
  );
};
