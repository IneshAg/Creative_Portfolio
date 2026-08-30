import React, { useState } from 'react';
import { AudioWaveform } from '../../audio/AudioWaveform';

const TRACKS = ['2AM TAPE', 'TREEFINGERS', 'WAVE TO EARTH', 'OK COMPUTER'];

interface VinylPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const VinylPlayer: React.FC<VinylPlayerProps> = ({ isPlaying, onTogglePlay }) => {
  const [trackIndex, setTrackIndex] = useState(0);

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (trackIndex + 1) % TRACKS.length;
    setTrackIndex(nextIdx);
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  return (
    <div
      className={`vinyl-wrap ${!isPlaying ? 'vinyl-paused' : ''}`}
      data-testid="vinyl-player-toggle"
      role="button"
      tabIndex={0}
      aria-label="Play ambient music"
      aria-pressed={isPlaying}
      onClick={onTogglePlay}
    >
      {/* NOW PLAYING Header */}
      <div
        className="now-playing font-mono-sys"
        data-testid="now-playing-label"
        style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <span>NOW PLAYING</span>
        <span style={{ width: '26px', height: '1px', background: 'rgba(232, 168, 74, 0.5)' }} />
      </div>

      {/* Disc & Tonearm */}
      <div style={{ display: 'block', position: 'relative' }}>
        <div
          className="vinyl-disc"
          data-testid="vinyl-disc"
          style={{ width: '100%', paddingTop: '100%' }}
        >
          <div className="vinyl-sheen" />
          <div className="vinyl-label" />
        </div>

        <svg
          className="vinyl-arm"
          viewBox="0 0 120 18"
          aria-hidden="true"
        >
          <rect x="8" y="7" width="92" height="4" rx="2" fill="#c9c2b8" />
          <circle cx="104" cy="9" r="8" fill="#8f887c" />
          <circle cx="104" cy="9" r="4" fill="#3a352e" />
          <rect x="0" y="4" width="12" height="10" rx="2" fill="#e8a84a" />
        </svg>
      </div>

      {/* Track Name & Next Button */}
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          className="font-mono-sys"
          data-testid="track-name"
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            color: 'rgba(245, 232, 216, 0.75)',
          }}
        >
          {TRACKS[trackIndex]}
        </span>

        <button
          type="button"
          data-testid="track-next-btn"
          aria-label="Next ambient track"
          onClick={handleNextTrack}
          style={{
            background: 'none',
            border: '1px solid rgba(232, 168, 74, 0.35)',
            color: 'var(--cozy-amber)',
            padding: '3px 7px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 5 L16 12 L9 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Audio Waveform Connected to Web Audio */}
      <div style={{ marginTop: '8px' }}>
        <AudioWaveform isPlaying={isPlaying} />
      </div>

      {/* Tap hint */}
      <div
        data-testid="vinyl-audio-hint"
        className="font-mono-sys"
        style={{
          marginTop: '8px',
          fontSize: '0.56rem',
          letterSpacing: '0.26em',
          color: 'rgba(245, 232, 216, 0.4)',
        }}
      >
        {isPlaying ? 'TAP RECORD TO PAUSE' : 'TAP THE RECORD FOR SOUND'}
      </div>
    </div>
  );
};

export default VinylPlayer;
