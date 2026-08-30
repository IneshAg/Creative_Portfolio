import React from 'react';

interface WorldTransitionProps {
  progress: number; // 0 to 1
}

export const WorldTransition: React.FC<WorldTransitionProps> = ({ progress }) => {
  // Status text calculation matching Narrative Sync
  let phaseStatus = '01 / ROOM — STABLE';
  if (progress > 0.25 && progress <= 0.5) {
    phaseStatus = '01 / ROOM — CONTAMINATED';
  } else if (progress > 0.5 && progress <= 0.75) {
    phaseStatus = '02 / CORRUPTING — WAVEFORM INSTABILITY';
  } else if (progress > 0.75 && progress <= 0.97) {
    phaseStatus = '02 / RUPTURE — CRITICAL INSTABILITY';
  } else if (progress > 0.97 && progress < 1.0) {
    phaseStatus = '00 / NULL — SILENCE';
  } else if (progress >= 1.0) {
    phaseStatus = '03 / DIGITAL ABYSS — ACTIVE';
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* Bottom Phase Status Monitor */}
      <div
        data-testid="phase-status"
        className="font-mono-sys"
        style={{
          position: 'absolute',
          bottom: '1.4rem',
          right: 'clamp(1.25rem, 4vw, 3rem)',
          fontSize: '0.58rem',
          letterSpacing: '0.3em',
          color: 'rgba(245, 232, 216, 0.5)',
          zIndex: 55,
        }}
      >
        {phaseStatus}
      </div>
    </div>
  );
};

export default WorldTransition;
