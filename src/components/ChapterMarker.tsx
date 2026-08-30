import { useMemo } from 'react';

export const ChapterMarker = ({ progress }: { progress: number }) => {
  const { text, color, rgbGlitch, opacity, letterSpacing } = useMemo(() => {
    if (progress < 0.1) return { text: 'CALM', color: '#e8a84a', rgbGlitch: false, opacity: 0.9, letterSpacing: '4px' };
    if (progress < 0.25) return { text: 'C A L M', color: '#e8a84a', rgbGlitch: false, opacity: 0.9, letterSpacing: '6px' };
    if (progress < 0.4) return { text: 'C Λ L M', color: '#e8a84a', rgbGlitch: true, opacity: 0.9, letterSpacing: '7px' };
    if (progress < 0.55) return { text: 'C ̸A ̸L ̸M', color: '#ff6b00', rgbGlitch: true, opacity: 1.0, letterSpacing: '8px' };
    if (progress < 0.75) return { text: 'CORRUPTION', color: '#ff003c', rgbGlitch: true, opacity: 1.0, letterSpacing: '5px' };
    if (progress < 0.9) return { text: 'CHAOS', color: '#00ffe1', rgbGlitch: true, opacity: 0.9, letterSpacing: '6px' };
    return { text: 'CHAOS', color: '#00ffe1', rgbGlitch: false, opacity: 0.8, letterSpacing: '5px' };
  }, [progress]);

  const jitter = rgbGlitch ? Math.sin(progress * 2000) * 3 : 0;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      left: '40px',
      zIndex: 2147483647,
      pointerEvents: 'none',
      fontFamily: 'monospace',
      fontSize: '16px',
      fontWeight: 'bold',
      opacity: opacity,
      letterSpacing: letterSpacing,
      textShadow: rgbGlitch ? `${jitter}px 0 #ff003c, ${-jitter}px 0 #00ffe1` : 'none',
      transform: 'translateZ(0)',
      mixBlendMode: 'normal'
    }}>
      <span style={{ color }}>{text}</span>
    </div>
  );
};
